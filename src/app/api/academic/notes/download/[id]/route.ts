import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Require approved authenticated account
    await requireRole(['STUDENT', 'FACULTY', 'ADMIN']);

    const noteId = params.id;
    const note = await prisma.academicNote.findUnique({
      where: { id: noteId },
    });

    if (!note || !note.approved) {
      return NextResponse.json({ error: 'Academic note resource not found or unavailable' }, { status: 404 });
    }

    if (req.nextUrl.searchParams.get('stream') === 'true' && (note.fileUrl.startsWith('/uploads/') || note.fileUrl.startsWith('uploads/'))) {
      const fs = await import('fs/promises');
      const path = await import('path');
      const relativePath = note.fileUrl.startsWith('/') ? note.fileUrl.slice(1) : note.fileUrl;
      const fullPath = path.join(process.cwd(), 'public', relativePath);
      try {
        const fileBuffer = await fs.readFile(fullPath);
        const ext = path.extname(fullPath).toLowerCase() || '.pdf';
        let contentType = 'application/pdf';
        if (ext === '.doc' || ext === '.docx') contentType = 'application/msword';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.txt') contentType = 'text/plain';

        const safeTitle = note.title.replace(/[^a-zA-Z0-9_\- ]/g, '_');
        return new NextResponse(fileBuffer, {
          headers: {
            'Content-Type': contentType,
            'Content-Disposition': `attachment; filename="${safeTitle}${ext}"`,
          },
        });
      } catch (e) {
        // Fall back to returning downloadUrl if file read fails
      }
    }

    return NextResponse.json({
      success: true,
      downloadUrl: note.fileUrl,
      title: note.title,
      fileType: note.fileType,
    });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED') {
      return NextResponse.json(
        { error: 'Please sign in to your approved student/faculty account to access lecture downloads.' },
        { status: 401 }
      );
    }
    if (error.message === 'ACCOUNT_PENDING_APPROVAL') {
      return NextResponse.json(
        { error: 'Your student account is pending administrator approval. Protected downloads are locked until approved.' },
        { status: 403 }
      );
    }
    console.error('Note download error:', error);
    return NextResponse.json({ error: 'Failed to access note download' }, { status: 500 });
  }
}
