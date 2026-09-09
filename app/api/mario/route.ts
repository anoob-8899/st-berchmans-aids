import { NextResponse } from 'next/server';
import { queryMarioKnowledge } from '@/lib/marioKnowledge';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { query, language = 'en' } = body;

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 });
    }

    const response = queryMarioKnowledge(query, language);
    return NextResponse.json(response);
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
