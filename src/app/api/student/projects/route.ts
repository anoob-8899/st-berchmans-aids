import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { StudentService } from '@/lib/services';
import { StudentProjectSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(['STUDENT']);
    const body = await req.json();
    const result = StudentProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid project inputs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const profile = await StudentService.getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const project = await StudentService.addProject(profile.id, result.data);

    return NextResponse.json({
      success: true,
      message: 'Project submitted successfully',
      project,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN' || error.message === 'ACCOUNT_PENDING_APPROVAL') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Student project POST error:', error);
    return NextResponse.json({ error: 'Failed to submit student project' }, { status: 500 });
  }
}
