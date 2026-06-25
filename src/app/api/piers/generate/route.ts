import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const { bridgeId, bridgeType, pierCount, shape, height } = await req.json();

    const existing = await prisma.pier.findFirst({
      where: {
        bridgeId: Number(bridgeId),
      },
    });

    if (existing) {
      return NextResponse.json(
        {
          message: "This bridge already has piers configured",
        },
        {
          status: 400,
        },
      );
    }

    const structures: any[] = [];

    if (bridgeType === "OVERBRIDGE") {
      structures.push({
        pierNumber: "P1",
        type: "PIER",
        bridgeId: Number(bridgeId),
        columnCount: 3,
        shape,
        height: height ? Number(height) : null,
      });

      structures.push({
        pierNumber: "P2",
        type: "PIER",
        bridgeId: Number(bridgeId),
        columnCount: 3,
        shape,
        height: height ? Number(height) : null,
      });
    } else {
      for (let i = 1; i <= pierCount; i++) {
        structures.push({
          pierNumber: `P${i}`,
          type: "PIER",
          bridgeId: Number(bridgeId),
          columnCount: 2,
          shape,
          height: height ? Number(height) : null,
        });
      }
    }

    structures.push({
      pierNumber: "A1",
      type: "ABUTMENT",
      bridgeId: Number(bridgeId),
      columnCount: 0,
      shape,
      height: height ? Number(height) : null,
    });

    structures.push({
      pierNumber: "A2",
      type: "ABUTMENT",
      bridgeId: Number(bridgeId),
      columnCount: 0,
      shape,
      height: height ? Number(height) : null,
    });

    await prisma.pier.createMany({
      data: structures,
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      },
    );
  }
}
