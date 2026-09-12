import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { UserService } from '@/lib/services';
import { StudentProfileUpdateSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN']);
    const userId = params.id;

    const body = await req.json();
    const result = StudentProfileUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid profile inputs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updatedProfile = await UserService.updateStudentProfileByAdmin(userId, result.data);

    return NextResponse.json({
      success: true,
      message: 'Student profile updated successfully by admin',
      profile: updatedProfile,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Admin student profile PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update student profile' }, { status: 500 });
  }
}
