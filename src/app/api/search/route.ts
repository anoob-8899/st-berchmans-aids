import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SearchQuerySchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const parseResult = SearchQuerySchema.safeParse({
    q: searchParams.get('q')?.trim() || '',
  });

  if (!parseResult.success) {
    return NextResponse.json(
      { error: 'Invalid search query', details: parseResult.error.flatten() },
      { status: 400 }
    );
  }

  const q = parseResult.data.q;

  if (!q) {
    return NextResponse.json({
      faculty: [],
      notes: [],
      students: [],
      projects: [],
      events: [],
      tickers: [],
    });
  }

  try {
    const faculty = await prisma.facultyProfile.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { specialization: { contains: q } },
          { designation: { contains: q } },
        ],
      },
      select: {
        id: true,
        name: true,
        designation: true,
        degrees: true,
        experience: true,
        specialization: true,
        publications: true,
        avatarUrl: true,
        initials: true,
        displayOrder: true,
      },
      orderBy: { displayOrder: 'asc' },
    });

    const notes = await prisma.academicNote.findMany({
      where: {
        approved: true,
        OR: [
          { title: { contains: q } },
          { subjectName: { contains: q } },
        ],
      },
      select: {
        id: true,
        title: true,
        subjectName: true,
        semester: true,
        fileType: true,
        fileSize: true,
        uploadedByName: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const students = await prisma.studentProfile.findMany({
      where: {
        user: { status: 'APPROVED' },
        OR: [
          { fullName: { contains: q } },
          { bio: { contains: q } },
        ],
      },
      select: {
        id: true,
        fullName: true,
        batch: true,
        semester: true,
        bio: true,
        avatarUrl: true,
        githubUrl: true,
        linkedinUrl: true,
      },
    });

    const projects = await prisma.studentProject.findMany({
      where: {
        approved: true,
        OR: [
          { title: { contains: q } },
          { domain: { contains: q } },
          { summary: { contains: q } },
        ],
      },
      orderBy: { createdAt: 'desc' },
    });

    const events = await prisma.event.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { description: { contains: q } },
          { venue: { contains: q } },
        ],
      },
      orderBy: { eventDate: 'asc' },
    });

    const tickers = await prisma.tickerItem.findMany({
      where: {
        active: true,
        text: { contains: q },
      },
    });

    return NextResponse.json({
      faculty,
      notes,
      students,
      projects,
      events,
      tickers,
    });
  } catch (error) {
    console.error('Search query error:', error);
    return NextResponse.json({
      faculty: [],
      notes: [],
      students: [],
      projects: [],
      events: [],
      tickers: [],
    });
  }
}
