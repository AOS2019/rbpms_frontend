// src\app\api\daily-reports\route.ts

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { DailyReportPayload } from "@/components/daily-report/types";

/**
 * GET - fetch all daily reports (for dashboard)
 */
export async function GET() {
  try {
    const reports = await prisma.dailyReport.findMany({
      include: {
        bridge: true,

        employeeAttendance: true,

        usages: true,

        tasks: true,
      },

      orderBy: {
        date: "desc",
      },
    });

    return NextResponse.json({
      success: true,
      data: reports,
    });
  } catch (error) {
    console.error("GET /api/daily-reports error:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch reports",
      },
      { status: 500 },
    );
  }
}

/**
 * POST - create new daily report (your existing logic)
 */
export async function POST(req: Request) {
  try {
    const payload: DailyReportPayload = await req.json();

    const report = await prisma.$transaction(async (tx) => {
      return await tx.dailyReport.create({
        data: {
          date: new Date(payload.generalInfo.date),
          siteEngineer: payload.generalInfo.siteEngineer,
          foreman: payload.generalInfo.foreman,
          projectManager: payload.generalInfo.projectManager,
          weather: payload.generalInfo.weather,
          bridgeId: payload.bridgeId,
        },
      });

      // Attendance
      for (const employee of payload.attendance) {
        await tx.employeeAttendance.create({
          data: {
            dailyReportId: report.id,

            employeeId: employee.employeeId,

            attendanceStatus: employee.attendanceStatus,

            remarks: employee.remarks,
          },
        });
      }

      // Crews

      // Tasks

      // Equipment
    });

    return NextResponse.json({ success: true, data: report }, { status: 201 });
  } catch (error: any) {
    console.error(error);

    // Database unavailable
    if (
      error?.code === "P1001" ||
      error?.name === "PrismaClientInitializationError"
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Database connection is temporarily unavailable. Please try again in a few moments.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to create report",
      },
      { status: 500 },
    );
  }
}
