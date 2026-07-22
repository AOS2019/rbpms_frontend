import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const plans = await prisma.weeklyPlan.findMany({
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

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const weeklyPlan = await prisma.weeklyPlan.create({
      data: {
        weekStart: new Date(body.weekStart),

        weekEnd: new Date(body.weekEnd),

        remarks: body.remarks,

        items: {
          create: body.rows.map((row: any) => ({
            bridgeId: row.bridgeId,

            elementType: row.element,

            locationCode: row.locationCode,

            activity: row.activity,

            activityCode: row.activityCode,

            predecessors: row.predecessors,

            unit: row.unit,

            dailyEntries: row.dailyEntries,

            plannedQty: row.plannedQty,

            actualQty: row.actualQty,

            plannedStart: new Date(row.plannedStart),

            plannedFinish: new Date(row.plannedFinish),

            varianceReason: row.varianceReason,

            completed: row.completed,
          })),
        },
      },
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
      },
    );
  }
}
