import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';
import { GalleryService } from '@/lib/services';

export async function GET(req: NextRequest) {
  try {
    const user = await requireRole(['STUDENT']);
    const items = await GalleryService.getStudentUploads(user.id);
    return NextResponse.json({ items });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN' || error.message === 'ACCOUNT_PENDING_APPROVAL') {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    console.error('Student uploads GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch uploads' }, { status: 500 });
  }
}
