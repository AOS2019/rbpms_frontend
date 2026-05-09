import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();

    const bridge = await prisma.bridge.update({
      where: {
        id: Number(params.id),
      },
      data: {
        pk_code: body.pk_code,
        location: body.location,
        sectionId: body.sectionId,
        totalPlanned: Number(body.totalPlanned),
        totalCompleted: Number(body.totalCompleted),
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
        error: 'Failed to update bridge',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.bridge.delete({
      where: {
        id: Number(params.id),
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete bridge',
      },
      { status: 500 }
    );
  }
}