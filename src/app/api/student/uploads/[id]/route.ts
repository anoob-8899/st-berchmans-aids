import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { GalleryService } from '@/lib/services';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireRole(['STUDENT']);
    const itemId = params.id;
    await GalleryService.deleteItem(itemId, user.id);

    return NextResponse.json({
      success: true,
      message: 'Upload deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Forbidden: You do not own this upload' }, { status: 403 });
    }
    if (error.message === 'NOT_FOUND') {
      return NextResponse.json({ error: 'Upload item not found' }, { status: 404 });
    }
    if (error.message === 'UNAUTHORIZED' || error.message === 'ACCOUNT_PENDING_APPROVAL') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Student upload DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete upload' }, { status: 500 });
  }
}
