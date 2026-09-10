import { NextRequest, NextResponse } from 'next/server';
import { readProjects, writeProjects, saveOrUpdateProject, addProjectComment, getProjectById } from '@/lib/projectStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const project = getProjectById(id);
      if (project) {
        return NextResponse.json({ success: true, project });
      }
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    const projects = readProjects();
    return NextResponse.json({ success: true, projects });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Case 1: Add a comment to a project
    if (body.projectId && body.comment) {
      const updated = addProjectComment(body.projectId, body.comment);
      return NextResponse.json({ success: true, projects: updated });
    }
    
    // Case 2: Bulk update
    if (body.projects && Array.isArray(body.projects)) {
      writeProjects(body.projects);
      const updated = readProjects();
      return NextResponse.json({ success: true, projects: updated });
    }

    // Case 3: Single project save/update
    if (body.project) {
      const updated = saveOrUpdateProject(body.project);
      return NextResponse.json({ success: true, projects: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
