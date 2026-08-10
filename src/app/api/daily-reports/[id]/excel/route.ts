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

      usage: true,

      tasks: true,

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
      },
    );
  }

  const reportActivities = Array.isArray(report.activities)
    ? (report.activities as Array<any>)
    : [];

  // Generate Excel file
  const workbook = await exportDailyReportExcel({
  ...report,

  task: report.tasks.flatMap((task) => {
    const crewAssignments = Array.isArray(task.crewId) ? task.crewId : [];

    return crewAssignments.map((m) => ({
      staffId: m.employee.staffId,

      employeeName: `${m.employee.firstName} ${m.employee.lastName}`,

      crewName: task.crewId,

      activity: task.activity,

      locationCode: task.locationCode,

      hoursWorked: m.hoursWorked,

      remarks: m.remarks,
    }));
  }),

  equipment: report.tasks.flatMap((task: any) => {
    const equipmentUsages = Array.isArray((task as any).equipmentUsages)
      ? (task as any).equipmentUsages
      : [];

    return equipmentUsages.map((e: any) => ({
      task: task.activity,

      locationCode: task.locationCode,

      crewName: task.crewId,

      equipmentCode: e.equipment?.equipmentCode ?? "",

      equipmentName: e.equipment?.name ?? "",

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
    }));
  }),

  activities: reportActivities.map((a) => ({
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
