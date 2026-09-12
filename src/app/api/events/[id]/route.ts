import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { EventService } from '@/lib/services';
import { EventSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN']);
    const eventId = params.id;

    const body = await req.json();
    const result = EventSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid event payload', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const updatedEvent = await EventService.updateEvent(eventId, result.data);

    return NextResponse.json({
      success: true,
      message: 'Event updated successfully',
      event: updatedEvent,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Event PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await requireRole(['ADMIN']);
    const eventId = params.id;

    await EventService.deleteEvent(eventId);

    return NextResponse.json({
      success: true,
      message: 'Event deleted successfully',
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Event DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}
