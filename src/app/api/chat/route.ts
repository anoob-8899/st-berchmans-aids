import { NextRequest, NextResponse } from 'next/server';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { streamText } from 'ai';
import { z } from 'zod';
import { checkRateLimit } from '@/lib/rate-limit';
import { getGroundedDepartmentContext } from '@/lib/chatbot-context';
import { ChatAnalyticsService } from '@/lib/services';
import { getCurrentUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Configurable model name via environment variable
const DEFAULT_GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

// Zod validation schema for input payload
const MessageSchema = z.object({
  role: z.enum(['system', 'user', 'assistant', 'data']),
  content: z.string(),
});

const ChatPayloadSchema = z.object({
  messages: z.array(MessageSchema).optional(),
  message: z.string().optional(),
  sessionId: z.string().optional(),
}).refine((data) => (data.messages && data.messages.length > 0) || (data.message && data.message.trim().length > 0), {
  message: 'Either messages array or message string must be provided',
});

function checkPrivateInformationRequest(query: string): boolean {
  const lower = query.toLowerCase();
  const sensitiveKeywords = [
    'password',
    'passwordhash',
    'password_hash',
    'jwt_secret',
    'admin password',
    'user hash',
    'database credentials',
    'secret key',
    'private key',
  ];
  return sensitiveKeywords.some((kw) => lower.includes(kw));
}

async function generateLocalGroundedFallback(query: string): Promise<string> {
  const q = query.toLowerCase().trim();

  if (checkPrivateInformationRequest(q)) {
    return 'I cannot disclose private account or internal administrative information.';
  }

  // Query database dynamically for matches
  if (q.includes('hod') || q.includes('faculty') || q.includes('teacher') || q.includes('professor') || q.includes('staff')) {
    const faculty = await prisma.facultyProfile.findMany({ orderBy: { displayOrder: 'asc' } });
    if (faculty.length > 0) {
      const list = faculty.map((f) => `${f.name} (${f.designation} - ${f.specialization})`).join('; ');
      return `Our department faculty members include: ${list}. Official email contact: aids@sbcollege.ac.in.`;
    }
    return 'Faculty directory information is currently being updated. Please contact aids@sbcollege.ac.in.';
  }

  if (q.includes('course') || q.includes('subject') || q.includes('curriculum') || q.includes('syllabus') || q.includes('b.sc') || q.includes('program')) {
    const subjects = await prisma.subject.findMany({ orderBy: [{ semester: 'asc' }, { code: 'asc' }] });
    if (subjects.length > 0) {
      const list = subjects.slice(0, 6).map((s) => `${s.code}: ${s.name} (Sem ${s.semester})`).join('; ');
      return `The department offers B.Sc (Hons.) Artificial Intelligence & Data Science (4-Year FYUGP, Batch 2026-2030). Course modules include: ${list}... Contact aids@sbcollege.ac.in for full syllabus.`;
    }
    return 'The department offers B.Sc (Hons.) Artificial Intelligence & Data Science (4-Year FYUGP 2026-2030). Official syllabus details are available at https://sbcollege.ac.in.';
  }

  if (q.includes('contact') || q.includes('admission') || q.includes('enquiry') || q.includes('phone') || q.includes('email') || q.includes('location') || q.includes('address')) {
    return 'Department of AI & Data Science, St. Berchmans College (Autonomous), Changanassery, Kottayam, Kerala 686101. Phone: +91 9961231314 | Email: aids@sbcollege.ac.in | Website: https://sbcollege.ac.in.';
  }

  if (q.includes('project') || q.includes('synapse') || q.includes('innovation')) {
    const projects = await prisma.studentProject.findMany({ where: { approved: true }, take: 4 });
    if (projects.length > 0) {
      const list = projects.map((p) => `"${p.title}" (${p.domain}): ${p.summary}`).join('; ');
      return `Approved student projects include: ${list}.`;
    }
    return 'Approved student projects under the SYNAPSE Innovation Lab are published following department review. Students can submit projects via the portal.';
  }

  if (q.includes('club') || q.includes('wing') || q.includes('co-curricular') || q.includes('society')) {
    const wings = await prisma.coCurricularWing.findMany();
    if (wings.length > 0) {
      const list = wings.map((w) => `${w.name}: ${w.description}`).join('; ');
      return `Department co-curricular wings include: ${list}.`;
    }
    return 'Department co-curricular wings foster hackathons, robotics, and data science forums.';
  }

  if (q.includes('event') || q.includes('workshop') || q.includes('seminar') || q.includes('hackathon')) {
    const events = await prisma.event.findMany({ orderBy: { eventDate: 'asc' }, take: 3 });
    if (events.length > 0) {
      const list = events.map((e) => `${e.title} (${new Date(e.eventDate).toLocaleDateString()} at ${e.venue})`).join('; ');
      return `Scheduled department events include: ${list}.`;
    }
    return 'No upcoming department events are scheduled at this time. Announcements are updated regularly.';
  }

  return 'I do not have official department information regarding that topic. Please contact the department office directly at aids@sbcollege.ac.in or +91 9961231314.';
}

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Check (10 requests per minute per IP)
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || '127.0.0.1';
    const rateLimit = checkRateLimit(`chat_${ip}`, 10, 60000);

    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: 'RATE_LIMIT_EXCEEDED',
          message: `Too many chat requests. Please wait ${rateLimit.resetSeconds} seconds before asking another question.`,
          resetSeconds: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            'Retry-After': String(rateLimit.resetSeconds),
            'X-RateLimit-Limit': String(rateLimit.limit),
            'X-RateLimit-Remaining': String(rateLimit.remaining),
          },
        }
      );
    }

    // 2. Validate payload with Zod
    const json = await req.json().catch(() => null);
    if (!json) {
      return NextResponse.json({ error: 'INVALID_JSON', message: 'Invalid JSON request body' }, { status: 400 });
    }

    const parseResult = ChatPayloadSchema.safeParse(json);
    if (!parseResult.success) {
      return NextResponse.json(
        {
          error: 'VALIDATION_ERROR',
          message: 'Invalid chat request structure',
          details: parseResult.error.flatten(),
        },
        { status: 400 }
      );
    }

    const payload = parseResult.data;
    const sessionId = payload.sessionId || `session_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const user = await getCurrentUser();

    // Format messages for AI SDK
    let chatMessages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];
    if (payload.messages && payload.messages.length > 0) {
      chatMessages = payload.messages
        .filter((m) => m.role === 'user' || m.role === 'assistant' || m.role === 'system')
        .map((m) => ({
          role: m.role as 'user' | 'assistant' | 'system',
          content: m.content,
        }));
    } else if (payload.message) {
      chatMessages = [{ role: 'user', content: payload.message.trim() }];
    }

    const latestUserMessage = chatMessages.filter((m) => m.role === 'user').pop()?.content || '';

    // 3. Record session & user message to database
    const session = await ChatAnalyticsService.getOrCreateSession(sessionId, user?.id);
    if (latestUserMessage) {
      await ChatAnalyticsService.recordMessage(session.id, 'user', latestUserMessage);
    }

    // 4. Early check for unauthorized private information requests
    if (checkPrivateInformationRequest(latestUserMessage)) {
      const refusal = 'I cannot disclose private account or internal administrative information.';
      await ChatAnalyticsService.recordMessage(session.id, 'assistant', refusal, 'System Security Policy');
      return new NextResponse(refusal, {
        status: 200,
        headers: {
          'Content-Type': 'text/plain; charset=utf-8',
          'x-session-id': sessionId,
          'x-sources': 'System Security Policy',
        },
      });
    }

    // 5. Retrieve Live Grounded Context from Database
    const { systemPrompt, sources } = await getGroundedDepartmentContext();

    // 6. Configurable Gemini model & secure key handling
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY || '';
    const modelName = process.env.GEMINI_MODEL || DEFAULT_GEMINI_MODEL;

    if (apiKey) {
      try {
        const googleProvider = createGoogleGenerativeAI({ apiKey });
        const model = googleProvider(modelName);

        const result = streamText({
          model,
          system: systemPrompt,
          messages: chatMessages,
          onFinish: async (completion) => {
            try {
              await ChatAnalyticsService.recordMessage(
                session.id,
                'assistant',
                completion.text,
                sources
              );
            } catch (err) {
              console.error('Failed to persist assistant message:', err);
            }
          },
        });

        return result.toTextStreamResponse({
          headers: {
            'x-session-id': sessionId,
            'x-sources': sources,
          },
        });
      } catch (geminiError) {
        console.error('Gemini Provider Error, falling back to database matcher:', geminiError);
      }
    }

    // 7. Dynamic local grounded fallback when API key is unconfigured or provider fails
    const fallbackAnswer = await generateLocalGroundedFallback(latestUserMessage);
    await ChatAnalyticsService.recordMessage(session.id, 'assistant', fallbackAnswer, sources);

    return new NextResponse(fallbackAnswer, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'x-session-id': sessionId,
        'x-sources': sources,
      },
    });
  } catch (error: any) {
    console.error('Chat API unexpected server error:', error);
    return NextResponse.json(
      { error: 'SERVER_ERROR', message: 'An internal error occurred while processing your request.' },
      { status: 500 }
    );
  }
}
