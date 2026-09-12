import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { StudentService } from '@/lib/services';
import { StudentProfileUpdateSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireRole(['STUDENT']);
    const body = await req.json();
    const result = StudentProfileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid profile inputs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updatedProfile = await StudentService.updateProfile(user.id, result.data);

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN' || error.message === 'ACCOUNT_PENDING_APPROVAL') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Student profile PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update student profile' }, { status: 500 });
  }
}
