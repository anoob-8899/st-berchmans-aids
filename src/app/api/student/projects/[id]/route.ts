import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { StudentService } from '@/lib/services';
import { StudentProjectSchema } from '@/lib/validations';

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(['STUDENT']);
    const profile = await StudentService.getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const projectId = params.id;
    const body = await req.json();
    const result = StudentProjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid project inputs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updatedProject = await StudentService.updateProject(projectId, profile.id, result.data);

    return NextResponse.json({
      success: true,
      message: 'Project updated successfully',
      project: updatedProject,
    });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden: You do not own this project' }, { status: 403 });
    }
    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (error.message === 'UNAUTHORIZED' || error.message === 'ACCOUNT_PENDING_APPROVAL') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Student project PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(['STUDENT']);
    const profile = await StudentService.getProfileByUserId(user.id);
    if (!profile) {
      return NextResponse.json({ error: 'Student profile not found' }, { status: 404 });
    }

    const projectId = params.id;
    await StudentService.deleteProject(projectId, profile.id);

    return NextResponse.json({
      success: true,
      message: 'Project deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden: You do not own this project' }, { status: 403 });
    }
    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    if (error.message === 'UNAUTHORIZED' || error.message === 'ACCOUNT_PENDING_APPROVAL') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Student project DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
