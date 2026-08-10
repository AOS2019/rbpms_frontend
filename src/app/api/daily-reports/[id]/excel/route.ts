// src/app/api/daily-reports/[id]/excel/route.ts

import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { exportDailyReportExcel } from "@/lib/excel/dailyReportExporter";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
) {
  const { id } = await params;

  const report = await prisma.dailyReport.findUnique({
    where: {
      id: Number(id),
    },

    include: {
      bridge: true,

      employeeAttendance: {
        include: {
          employee: true,
          assignedCrew: true,
        },
      },

      usages: {
        include: {
          equipment: true,

          employeeAttendance: {
            include: {
              employee: true,
            },
          },
        },
      },

      tasks: {
        include: {
          crew: true,
          bridge: true,
          element: true,
        },
      },
    },
  });

  if (!report) {
    return NextResponse.json(
      {
        error: "Report not found",
      },
      {
        status: 404,
      },
    );
  }

  const workbook = await exportDailyReportExcel(report);

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition": `attachment; filename=DailyReport-${report.id}.xlsx`,
    },
  });
}
