import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { UserService } from '@/lib/services';
import { UserAccountUpdateSchema } from '@/lib/validations';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    const { searchParams } = new URL(req.url);
    const statusParam = searchParams.get('status');

    const users = await UserService.getAllUsers(statusParam || undefined);

    return NextResponse.json({ users });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Admin users GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch user directory' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    const body = await req.json();
    const result = UserAccountUpdateSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid update inputs', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updatedUser = await UserService.updateAccount(
      result.data.userId,
      {
        status: result.data.status,
        role: result.data.role,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Account details updated successfully',
      user: updatedUser,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Admin users PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update account details' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const currentAdmin = await requireRole(['ADMIN']);

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'Target user ID is required' }, { status: 400 });
    }

    await UserService.deleteAccount(userId, currentAdmin.id);

    return NextResponse.json({
      success: true,
      message: 'User account removed successfully',
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    if (error.message === 'CANNOT_DELETE_SELF') {
      return NextResponse.json({ error: 'You cannot remove your own active administrator account' }, { status: 400 });
    }
    console.error('Admin users DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
