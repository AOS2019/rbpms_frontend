import { prisma } from "@/lib/prisma";

import { NextResponse, NextRequest } from "next/server";

import { exportDailyReportExcel } from "@/lib/excel/dailyReportExporter";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  }
) {
  const { id } = await params;

  const report = await prisma.dailyReport.findUnique({
    where: {
      id: Number(id),
    },

    include: {
      bridge: true,

      activities: {
        include: {
          team: true,
          element: true,
        },
      },

      tasks: {
        include: {
          team: true,
          bridge: true,

          manpower: {
            include: {
              employee: true,
            },
          },

          equipmentUsages: {
            include: {
              equipment: true,

              operator: true,
            },
          },
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

  const workbook = await exportDailyReportExcel({
  ...report,

  manpower: report.tasks.flatMap((task) =>
    task.manpower.map((m) => ({
      staffId: m.employee.staffId,

      employeeName: `${m.employee.firstName} ${m.employee.lastName}`,

      teamName: task.team.name,

      activity: task.activity,

      locationCode: task.locationCode,

      hoursWorked: m.hoursWorked,

      remarks: m.remarks,
    }))
  ),

  equipment: report.tasks.flatMap((task) =>
    task.equipmentUsages.map((e) => ({
      task: task.activity,

      locationCode: task.locationCode,

      teamName: task.team.name,

      equipmentCode: e.equipment.equipmentCode,

      equipmentName: e.equipment.name,

      operator: e.operator
        ? `${e.operator.firstName} ${e.operator.lastName}`
        : "",

      startReading: e.startReading,

      endReading: e.endReading,

      totalReading: e.totalReading,

      standbyHours: e.standbyHours,

      breakdownHours: e.breakdownHours,

      fuelUsed: e.fuelUsed,

      remarks: e.remarks,
    }))
  ),

  activities: report.activities.map((a) => ({
    teamName: a.team.name,

    activity: a.activity,

    pierNumber: a.pierNumber,

    quantityDone: a.quantityDone,

    unit: a.unit,

    concreteGrade: a.concreteGrade,

    elementName: a.element?.name,
  })),
});

  const buffer = await workbook.xlsx.writeBuffer();

  return new Response(buffer, {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

      "Content-Disposition": `attachment; filename=DailyReport-${report.id}.xlsx`,
    },
  });
}
