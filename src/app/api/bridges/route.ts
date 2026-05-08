import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bridges = await prisma.bridge.findMany({
      include: {
        elements: true,
        dailyReports: true,
        section: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: bridges,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: 'Failed to fetch bridges' },
      { status: 500 }
    );
  }
}


export async function POST(req: Request) {
  try {
    const body = await req.json();

    const bridge = await prisma.bridge.create({
      data: {
        pk_code: body.pk_code,
        location: body.location,
        sectionId: body.sectionId,
        totalPlanned: 0,
        totalCompleted: 0,
      },
    });

    return NextResponse.json({
      success: true,
      data: bridge,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { success: false, error: 'Failed to create bridge' },
      { status: 500 }
    );
  }
}