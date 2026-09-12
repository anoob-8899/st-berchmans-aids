import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

function getJwtSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.trim() === '') {
    throw new Error(
      'SECURITY ERROR: JWT_SECRET environment variable is missing or empty. Please set JWT_SECRET in your server environment variables.'
    );
  }
  return new TextEncoder().encode(secret);
}

const COOKIE_NAME = 'sbc_auth_token';

export interface UserPayload {
  id: string;
  username: string;
  email?: string;
  role: 'STUDENT' | 'FACULTY' | 'ADMIN';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  fullName?: string;
  facultyProfileId?: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function signToken(payload: UserPayload): Promise<string> {
  const secretKey = getJwtSecretKey();
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secretKey);
}

export async function verifyToken(token: string): Promise<UserPayload | null> {
  try {
    const secretKey = getJwtSecretKey();
    const verified = await jwtVerify(token, secretKey);
    return verified.payload as unknown as UserPayload;
  } catch (err) {
    if (err instanceof Error && err.message.startsWith('SECURITY ERROR:')) {
      console.error(err.message);
    }
    return null;
  }
}

export async function getCurrentUser(): Promise<UserPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    const payload = await verifyToken(token);
    if (!payload || !payload.id) return null;

    const dbUser = await prisma.user.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        status: true,
        studentProfile: { select: { fullName: true } },
        facultyProfile: { select: { id: true, name: true } },
      },
    });

    if (!dbUser) return null;

    return {
      id: dbUser.id,
      username: dbUser.username,
      email: dbUser.email || undefined,
      role: dbUser.role as any,
      status: dbUser.status as any,
      fullName: dbUser.studentProfile?.fullName || dbUser.facultyProfile?.name || dbUser.username,
      facultyProfileId: dbUser.facultyProfile?.id,
    };
  } catch (err) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 7 * 24 * 60 * 60, // 7 days
  });
}

export async function removeAuthCookie() {
  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/',
  });
}

export async function requireRole(allowedRoles: Array<'STUDENT' | 'FACULTY' | 'ADMIN'>): Promise<UserPayload> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('UNAUTHORIZED');
  }
  if (!allowedRoles.includes(user.role)) {
    throw new Error('FORBIDDEN');
  }
  if (user.status !== 'APPROVED') {
    throw new Error('ACCOUNT_PENDING_APPROVAL');
  }
  return user;
}
