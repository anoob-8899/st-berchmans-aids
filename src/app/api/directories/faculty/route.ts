import { NextRequest, NextResponse } from 'next/server';
import { FacultyService } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const faculty = await FacultyService.getAllFaculty();
    return NextResponse.json({ faculty });
  } catch (error) {
    console.error('Faculty directory GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch faculty directory' }, { status: 500 });
  }
}
