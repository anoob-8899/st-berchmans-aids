import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { StudentService } from '@/lib/services';
import { CoCurricularSelectionSchema } from '@/lib/validations';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(['STUDENT']);
    const profile = await StudentService.getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const wings = await StudentService.getAllWings();
    const currentWingIds = profile.coCurricularMemberships.map((m) => m.wingId);

    return NextResponse.json({
      wings,
      currentWingIds,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN' || error.message === 'ACCOUNT_PENDING_APPROVAL') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Student wings GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch co-curricular wings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(['STUDENT']);
    const profile = await StudentService.getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const body = await req.json();
    const result = CoCurricularSelectionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid wing selection', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updatedMemberships = await StudentService.updateWings(profile.id, result.data.wingIds);

    return NextResponse.json({
      success: true,
      message: 'Co-curricular wings updated successfully',
      memberships: updatedMemberships,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN' || error.message === 'ACCOUNT_PENDING_APPROVAL') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Student wings POST error:', error);
    return NextResponse.json({ error: 'Failed to update co-curricular wings' }, { status: 500 });
  }
}
