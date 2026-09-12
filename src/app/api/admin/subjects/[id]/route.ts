import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { AcademicService } from '@/lib/services';
import { SubjectSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN']);
    const subjectId = params.id;

    const body = await req.json();
    const partialSchema = SubjectSchema.partial();
    const result = partialSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid update inputs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updatedSubject = await AcademicService.updateSubject(subjectId, result.data);

    return NextResponse.json({
      success: true,
      message: 'Course subject updated successfully',
      subject: updatedSubject,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Subject PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update subject' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN']);
    const subjectId = params.id;

    await AcademicService.deleteSubject(subjectId);

    return NextResponse.json({
      success: true,
      message: 'Course subject deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Subject DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete subject' }, { status: 500 });
  }
}
