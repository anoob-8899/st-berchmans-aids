import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { StudentService } from '@/lib/services';
import { z } from 'zod';

export const dynamic = 'force-dynamic';

const ProjectModerationSchema = z.object({
  approved: z.boolean().optional(),
  isFeatured: z.boolean().optional(),
});

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN']);
    const projectId = params.id;

    const body = await req.json();
    const result = ProjectModerationSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid moderation payload', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updatedProject = await StudentService.moderateProject(projectId, result.data);

    return NextResponse.json({
      success: true,
      message: 'Student project status updated',
      project: updatedProject,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Admin project PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN']);
    const projectId = params.id;

    await StudentService.deleteProjectByAdmin(projectId);

    return NextResponse.json({
      success: true,
      message: 'Student project removed by administrator',
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Admin project DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete project' }, { status: 500 });
  }
}
