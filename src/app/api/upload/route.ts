import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { inspectFileBuffer, uploadToCloudStorage, MAX_IMAGE_SIZE, MAX_DOC_SIZE } from '@/lib/storage';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
    }

    if (user.role === 'STUDENT' && user.status !== 'APPROVED') {
      return NextResponse.json({ error: 'ACCOUNT_PENDING_APPROVAL' }, { status: 403 });
    }

    const formData = await req.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 1. Inspect file header signature (magic numbers) on the server
    const inspection = inspectFileBuffer(buffer, file.name || '');

    if (!inspection.isValid) {
      return NextResponse.json(
        { error: inspection.error || 'Invalid file type' },
        { status: 400 }
      );
    }

    // 2. Validate size limits
    const maxSize = inspection.isImage ? MAX_IMAGE_SIZE : MAX_DOC_SIZE;
    if (buffer.length > maxSize) {
      const maxMb = inspection.isImage ? '5MB' : '10MB';
      return NextResponse.json(
        { error: `File size exceeds maximum allowed limit of ${maxMb}` },
        { status: 400 }
      );
    }

    // 3. Upload to persistent cloud storage (Cloudinary)
    const fileUrl = await uploadToCloudStorage(buffer, file.name || 'upload', inspection);
    const formattedSize = (buffer.length / (1024 * 1024)).toFixed(2) + ' MB';

    return NextResponse.json({
      success: true,
      fileUrl,
      fileName: file.name,
      fileSize: formattedSize,
      fileType: inspection.isImage ? 'IMAGE' : 'PDF',
    });
  } catch (error: any) {
    console.error('File upload error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to process file upload to persistent storage' },
      { status: 500 }
    );
  }
}
