import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { AcademicService } from '@/lib/services';
import { AcademicNoteSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(['FACULTY', 'ADMIN']);

    const notes = user.role === 'ADMIN'
      ? await AcademicService.getAllNotesAdmin()
      : await AcademicService.getNotesByUploader(user.id);

    return NextResponse.json({ notes });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    console.error('Faculty notes GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireRole(['FACULTY', 'ADMIN']);
    const body = await req.json();
    const result = AcademicNoteSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid note payload', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const note = await AcademicService.createNote(
      user.id,
      user.fullName || user.username,
      result.data
    );

    return NextResponse.json({
      success: true,
      message: 'Academic note published',
      note,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }
    console.error('Faculty note POST error:', error);
    return NextResponse.json({ error: 'Failed to publish note' }, { status: 500 });
  }
}
