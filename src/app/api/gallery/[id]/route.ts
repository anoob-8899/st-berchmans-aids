import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { GalleryService } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const itemId = params.id;
    const isAdmin = user.role === 'ADMIN';

    await GalleryService.deleteItemWithRoleCheck(itemId, user.id, isAdmin);

    return NextResponse.json({
      success: true,
      message: 'Gallery item deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied to delete this photo' }, { status: 403 });
    }
    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Gallery item not found' }, { status: 404 });
    }
    console.error('Gallery DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete gallery item' }, { status: 500 });
  }
}
