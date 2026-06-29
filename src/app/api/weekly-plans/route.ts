import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {

  const plans =
    await prisma.weeklyPlan.findMany({
      include: {
        items: {
          include: {
            bridge: true,
          },
        },
      },
      orderBy: {
        weekStart: "desc",
      },
    });

  return NextResponse.json({
    success: true,
    data: plans,
  });
}

export async function POST(
  request: Request
) {
  try {

    const body = await request.json();

    const weeklyPlan = await prisma.weeklyPlan.create({
        data: body,
      });

    return NextResponse.json({
      success: true,
      data: weeklyPlan,
    });

  } catch (error: any) {

    return NextResponse.json(
      {
        success: false,
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}