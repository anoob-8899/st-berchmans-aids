import { NextRequest, NextResponse } from 'next/server';
import { GalleryService } from '@/lib/services';
import { GalleryItemSchema } from '@/lib/validations';
import { getCurrentUser } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const items = await GalleryService.getItems(category || undefined);
    return NextResponse.json({ items });
  } catch (error) {
    console.error('Gallery GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch gallery items' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const body = await req.json();
    const result = GalleryItemSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid gallery item payload', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const item = await GalleryService.createItem(user.id, result.data);

    return NextResponse.json({
      success: true,
      message: 'Gallery item uploaded',
      item,
    }, { status: 201 });
  } catch (error) {
    console.error('Gallery POST error:', error);
    return NextResponse.json({ error: 'Failed to upload gallery item' }, { status: 500 });
  }
}
