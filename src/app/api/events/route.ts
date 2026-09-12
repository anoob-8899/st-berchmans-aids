import { NextRequest, NextResponse } from 'next/server';
import { EventService } from '@/lib/services';
import { EventSchema } from '@/lib/validations';
import { requireRole } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category');

    const events = await EventService.getEvents(category || undefined);
    return NextResponse.json({ events });
  } catch (error) {
    console.error('Events GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const adminUser = await requireRole(['ADMIN']);

    const body = await req.json();
    const result = EventSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid event payload', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const event = await EventService.createEvent(adminUser.id, result.data);

    return NextResponse.json({
      success: true,
      message: 'Event created successfully',
      event,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Event POST error:', error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}
