import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { ChatAnalyticsService } from '@/lib/services';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await requireRole(['ADMIN']);

    const summary = await ChatAnalyticsService.getAnalyticsSummary();

    return NextResponse.json(summary);
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    console.error('Chat analytics GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch chatbot analytics' }, { status: 500 });
  }
}
