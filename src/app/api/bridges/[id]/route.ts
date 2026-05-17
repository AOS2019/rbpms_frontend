import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();

    const updatedBridge = await prisma.bridge.update({
      where: {
        id: Number(id),
      },
      data: {
        pk_code: body.pk_code,
        location: body.location,
        sectionId: Number(body.sectionId),
        totalPlanned: Number(body.totalPlanned || 0),
        totalCompleted: Number(body.totalCompleted || 0),
      },
    });

    return NextResponse.json({
      success: true,
      data: updatedBridge,
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
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    await prisma.bridge.delete({
      where: {
        id: Number(id),
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