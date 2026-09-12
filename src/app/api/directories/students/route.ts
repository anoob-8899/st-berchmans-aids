import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { StudentService } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['FACULTY', 'ADMIN']);

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const semester = searchParams.get('semester');
    const batch = searchParams.get('batch');

    const students = await StudentService.getAllStudents(
      search || undefined,
      semester ? Number(semester) : undefined,
      batch || undefined
    );

    return NextResponse.json({ students });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Faculty or Admin access required.' }, { status: 403 });
    }
    console.error('Student directory GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch student directory' }, { status: 500 });
  }
}
