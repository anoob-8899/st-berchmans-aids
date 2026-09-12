import { NextRequest, NextResponse } from 'next/server';
import { requireRole } from '@/lib/auth';
import { FacultyService } from '@/lib/services';
import { FacultyProvisionSchema } from '@/lib/validations';

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    await requireRole(['ADMIN']);

    const body = await req.json();
    const result = FacultyProvisionSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid faculty account payload', details: result.error.flatten() },
        { status: 400 }
      );
    }

    const createdUser = await FacultyService.provisionFacultyAccount(result.data);

    return NextResponse.json({
      success: true,
      message: 'Faculty account provisioned successfully',
      user: createdUser,
    }, { status: 201 });
  } catch (error: any) {
    if (error.message === 'UNAUTHORIZED' || error.message === 'FORBIDDEN') {
      return NextResponse.json({ error: 'Access denied. Admin rights required.' }, { status: 403 });
    }
    if (error.message.includes('already registered')) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error('Admin faculty provision POST error:', error);
    return NextResponse.json({ error: 'Failed to provision faculty account' }, { status: 500 });
  }
}
