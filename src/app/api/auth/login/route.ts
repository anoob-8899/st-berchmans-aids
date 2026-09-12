import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { LoginSchema } from '@/lib/validations';
import { comparePassword, signToken, setAuthCookie, UserPayload } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = LoginSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid inputs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { username, password } = result.data;

    const user = await prisma.user.findUnique({
      where: { username },
      include: { studentProfile: true, facultyProfile: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const passwordValid = await comparePassword(password, user.passwordHash);

    if (!passwordValid) {
      return NextResponse.json(
        { error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    if (user.role === 'STUDENT' && user.status === 'PENDING') {
      return NextResponse.json(
        { error: 'Your student registration is pending approval by department administration.' },
        { status: 403 }
      );
    }

    if (user.status === 'REJECTED') {
      return NextResponse.json(
        { error: 'Your account access request has been rejected.' },
        { status: 403 }
      );
    }

    const payload: UserPayload = {
      id: user.id,
      username: user.username,
      role: user.role as any,
      status: user.status as any,
      fullName: user.studentProfile?.fullName || user.facultyProfile?.name || user.username,
    };

    const token = await signToken(payload);
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      user: payload,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
