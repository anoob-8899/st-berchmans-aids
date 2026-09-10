import { NextRequest, NextResponse } from 'next/server';
import { readStudents, writeStudents, saveOrUpdateStudent, getStudentById } from '@/lib/studentStore';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const student = getStudentById(id);
      if (student) {
        return NextResponse.json({ success: true, student });
      }
      return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
    }

    const students = readStudents();
    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Case 1: Bulk update
    if (body.students && Array.isArray(body.students)) {
      writeStudents(body.students);
      const updated = readStudents();
      return NextResponse.json({ success: true, students: updated });
    }

    // Case 2: Single student save/update
    if (body.student) {
      const updated = saveOrUpdateStudent(body.student);
      return NextResponse.json({ success: true, students: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
