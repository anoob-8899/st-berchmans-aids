import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { FacultyService } from '@/lib/services';
import { FacultyProfileSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(['FACULTY', 'ADMIN']);

    const profile = await FacultyService.getFacultyByUserId(user.id, user.email);

    return NextResponse.json({ profile });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Faculty or Admin access required.' }, { status: 403 });
    }
    console.error('Faculty profile GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch faculty profile' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireRole(['FACULTY', 'ADMIN']);

    const body = await req.json();
    const result = FacultyProfileSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid faculty profile payload', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updatedProfile = await FacultyService.updateOwnFacultyProfile(
      user.id,
      user.email,
      result.data
    );

    return NextResponse.json({
      success: true,
      message: 'Faculty profile updated successfully',
      profile: updatedProfile,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied.' }, { status: 403 });
    }
    console.error('Faculty profile PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update faculty profile' }, { status: 500 });
  }
}
