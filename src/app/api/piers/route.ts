import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

  const bridgeId = searchParams.get("bridge");
    const piers = await prisma.pier.findMany({
      where: bridgeId
      ? {
          bridgeId: Number(bridgeId),
        }
      : undefined,
      orderBy: [
        {
          bridge: {
            pk_code: "asc",
          },
        },
        {
          pierNumber: "asc",
        },
      ],
    });

    return NextResponse.json({
    success: true,
    data: piers,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch piers" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const pier = await prisma.pier.create({
      data: {
        pierNumber: body.pierNumber,
        bridgeId: Number(body.bridgeId),
        height: body.height
          ? Number(body.height)
          : null,
        columnCount: Number(body.columnCount || 2),
        shape: body.shape,
      },
      include: {
        bridge: true,
      },
    });

    return NextResponse.json(pier);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create pier" },
      { status: 500 }
    );
  }
}