import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { AdmissionEnquirySchema } from '@/lib/validations';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const result = AdmissionEnquirySchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: 'Validation failed', errors: result.error.format() },
        { status: 400 }
      );
    }

    const enquiry = await prisma.admissionEnquiry.create({
      data: result.data,
    });

    return NextResponse.json(
      { success: true, message: 'Enquiry submitted successfully', enquiry },
      { status: 201 }
    );
  } catch (error) {
    console.error('Enquiry creation error:', error);
    return NextResponse.json(
      { error: 'Failed to record admission enquiry' },
      { status: 500 }
    );
  }
}
