import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========================================
// GET One Equipment
// ========================================

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  try {
    const equipment = await prisma.equipment.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!equipment) {
      return NextResponse.json(
        {
          success: false,
          message: "Equipment not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to fetch equipment.",
      },
      {
        status: 500,
      }
    );
  }
}

// ========================================
// UPDATE Equipment
// ========================================

export async function PUT(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  try {
    const body = await request.json();

    const equipment = await prisma.equipment.update({
      where: {
        id: Number(id),
      },

      data: {
        equipmentCode: body.equipmentCode,
        name: body.name,
        type: body.type,
        status: body.status,
      },
    });

    return NextResponse.json({
      success: true,
      data: equipment,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to update equipment.",
      },
      {
        status: 500,
      }
    );
  }
}

// ========================================
// DELETE Equipment
// ========================================

export async function DELETE(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  try {
    await prisma.equipment.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Equipment deleted successfully.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to delete equipment.",
      },
      {
        status: 500,
      }
    );
  }
}