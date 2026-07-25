import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// ========================================
// GET All Equipment
// ========================================

export async function GET() {
  try {
    const equipment = await prisma.equipment.findMany({
      orderBy: {
        equipmentCode: "asc",
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
        message: "Failed to fetch equipment.",
      },
      {
        status: 500,
      }
    );
  }
}

// ========================================
// CREATE Equipment
// ========================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const equipment = await prisma.equipment.create({
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
        message: "Unable to create equipment.",
      },
      {
        status: 500,
      }
    );
  }
}