import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const bridges = await prisma.bridge.findMany({
      orderBy: {
        pk_code: 'desc',
      },
    });

    return NextResponse.json({
      success: true,
      data: bridges,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bridges',
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.pk_code || !body.bridgeType || !body.location || !body.sectionId) {
      return NextResponse.json(
        {
          success: false,
          error: 'All fields are required',
        },
        { status: 400 }
      );
    }

    const existing = await prisma.bridge.findUnique({
      where: {
        pk_code: body.pk_code,
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'Bridge PK code already exists',
        },
        { status: 400 }
      );
    }

    const bridge = await prisma.bridge.create({
      data: {
        pk_code: body.pk_code,
        bridgeType: body.bridgeType,
        location: body.location,
        sectionId: body.sectionId,
        totalPlanned: Number(body.totalPlanned || 0),
        totalCompleted: Number(body.totalCompleted || 0),
      },
    });

    return NextResponse.json({
      success: true,
      data: bridge,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create bridge',
      },
      { status: 500 }
    );
  }
}