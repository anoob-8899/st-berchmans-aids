import { NextRequest, NextResponse } from 'next/server';
import { AcademicService } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get('semester');
    const subjectId = searchParams.get('subjectId');

    const notes = await AcademicService.getNotes({
      semester: semester ? Number(semester) : undefined,
      subjectId: subjectId || undefined,
    });

    return NextResponse.json({ notes });
  } catch (error) {
    console.error('Academic notes GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch academic notes' }, { status: 500 });
  }
}
