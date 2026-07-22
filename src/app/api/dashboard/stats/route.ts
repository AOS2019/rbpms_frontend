import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [
      totalBridges,
      totalReports,
      totalActivities,
      totalManpower,
      bridges,
    ] = await Promise.all([
      prisma.bridge.count(),
      prisma.dailyReport.count(),
      prisma.dailyActivity.count(),
      prisma.dailyTask.count(),

      prisma.bridge.findMany({
        select: {
          totalCompleted: true,
          totalPlanned: true,
        },
      }),
    ]);

    const onTrack = bridges.filter((b) => {
      if (!b.totalPlanned) return false;

      return (
        (b.totalCompleted / b.totalPlanned) * 100 >= 80
      );
    }).length;

    const delayed = bridges.filter((b) => {
      if (!b.totalPlanned) return false;

      return (
        (b.totalCompleted / b.totalPlanned) * 100 < 80
      );
    }).length;

    return NextResponse.json({
      success: true,
      data: {
        totalBridges,
        onTrack,
        delayed,
        totalReports,
        totalActivities,
        totalManpower,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to load dashboard statistics",
      },
      {
        status: 500,
      }
    );
  }
}