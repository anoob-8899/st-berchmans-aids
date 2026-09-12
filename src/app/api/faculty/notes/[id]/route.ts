import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { AcademicService } from '@/lib/services';
import { AcademicNoteSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(['FACULTY', 'ADMIN']);
    const noteId = params.id;

    const body = await req.json();
    const partialSchema = AcademicNoteSchema.partial();
    const result = partialSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid update inputs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const isAdmin = user.role === 'ADMIN';
    const updatedNote = await AcademicService.updateNote(noteId, user.id, isAdmin, result.data);

    return NextResponse.json({
      success: true,
      message: 'Academic note updated successfully',
      note: updatedNote,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied to edit this note.' }, { status: 403 });
    }
    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }
    console.error('Faculty note PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update note' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireRole(['FACULTY', 'ADMIN']);
    const noteId = params.id;
    const isAdmin = user.role === 'ADMIN';

    await AcademicService.deleteNote(noteId, user.id, isAdmin);

    return NextResponse.json({
      success: true,
      message: 'Academic note deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied to delete this note.' }, { status: 403 });
    }
    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Note not found.' }, { status: 404 });
    }
    console.error('Faculty note DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete note' }, { status: 500 });
  }
}
