import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const elements = await prisma.element.findMany({
      orderBy: {
        id: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: elements,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch elements",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const element = await prisma.element.create({
      data: {
        name: body.name,
        type: body.type || null,
        bridgeType: body.bridgeType,
        status: body.status || "Active",
      },
    });

    return NextResponse.json({
      success: true,
      data: element,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create element",
      },
      { status: 500 }
    );
  }
}