import { prisma } from "@/lib/prisma";

import { NextResponse, NextRequest } from "next/server";

import { exportDailyReportExcel }
from "@/lib/excel/dailyReportExporter";

export async function GET(
  request: NextRequest,
  { params }: {
    params: Promise<{ id: string }>
  }
) {
  const { id } = await params;

  const report =
    await prisma.dailyReport.findUnique({
      where: {
        id: Number(id),
      },

      include: {
        bridge: true,

        dailyTeamTasks: {
          include: {
            employee: true,
            team: true,
          },
        },

        activities: {
          include: {
            team: true,
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
      }
    );
  }

  const workbook =
    await exportDailyReportExcel({
      ...report,

      manpower:
        report.dailyTeamTasks.map(
          (m) => ({
            staffId:
              m.employee.staffId,

            employeeName:
              `${m.employee.firstName} ${m.employee.lastName}`,

            teamName:
              m.team.name,

            hoursWorked:
              m.hoursWorked,

            remarks:
              m.remarks,
          })
        ),

      activities:
        report.activities.map(
          (a) => ({
            teamName:
              a.team.name,

            activity:
              a.activity,

            pierNumber:
              a.pierNumber,

            quantityDone:
              a.quantityDone,

            unit:
              a.unit,

            concreteGrade:
              a.concreteGrade,

            elementName:
              a.element?.name,
          })
        ),
    });

  const buffer =
    await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition":
        `attachment; filename=DailyReport-${report.id}.xlsx`,
    },
  });
}