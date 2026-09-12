import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { AcademicService } from '@/lib/services';
import { SubjectSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const semester = searchParams.get('semester');

    const subjects = await AcademicService.getSubjects(semester ? Number(semester) : undefined);
    return NextResponse.json({ subjects });
  } catch (error) {
    console.error('Subjects GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch subjects' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    const body = await req.json();
    const result = SubjectSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid subject payload', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const subject = await AcademicService.createSubject(result.data);

    return NextResponse.json({
      success: true,
      message: 'Course subject created successfully',
      subject,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Subject POST error:', error);
    return NextResponse.json({ error: 'Failed to create subject' }, { status: 500 });
  }
}
