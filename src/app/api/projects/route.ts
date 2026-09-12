import { NextRequest, NextResponse } from 'next/server';
import { StudentService } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const projects = await StudentService.getPublicProjects();
    return NextResponse.json({ projects });
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch student projects' }, { status: 500 });
  }
}
