import { NextRequest, NextResponse } from 'next/server';
import { readUsers, writeUsers, saveOrUpdateUser, deleteUser, ManagedUser } from '@/lib/userStore';

export async function GET() {
  try {
    const users = readUsers();
    return NextResponse.json({ success: true, users });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // Case 1: Bulk replace/sync (e.g. from Admin console)
    if (body.users && Array.isArray(body.users)) {
      writeUsers(body.users);
      const updated = readUsers();
      return NextResponse.json({ success: true, users: updated });
    }

    // Case 2: Single user save/update (e.g. from sign up or status edit)
    if (body.user) {
      const updated = saveOrUpdateUser(body.user);
      return NextResponse.json({ success: true, users: updated });
    }

    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'User ID is required' }, { status: 400 });
    }

    const updated = deleteUser(id);
    return NextResponse.json({ success: true, users: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
