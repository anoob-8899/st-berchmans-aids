import { NextRequest, NextResponse } from 'next/server';
import { SignupSchema } from '@/lib/validations';
import { UserService } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = SignupSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid registration inputs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const user = await UserService.registerStudent(result.data);

    return NextResponse.json(
      {
        success: true,
        message: 'Registration successful! Your student account is pending administrator approval before login.',
        userId: user.id,
        status: user.status,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to complete registration' },
      { status: 400 }
    );
  }
}
