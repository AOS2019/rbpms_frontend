// src/lib/excel/mergeImportedReport.ts

import {
  DailyReportState,
  Bridge,
  Employee,
  Equipment,
  CrewOption,
  Element,
  Pier,
} from "@/components/daily-report/types";

interface MergeImportedReportOptions {
  importedReport: DailyReportState;

  bridges: Bridge[];

  employees: Employee[];

  equipment: Equipment[];

  availableCrews: CrewOption[];

  elements: Element[];

  piers: Pier[];
}

/* ==========================================================
   Merge Imported Report
========================================================== */

export function mergeImportedReport({
  importedReport,
  bridges,
  employees,
  equipment,
  availableCrews,
  elements,
  piers,
}: MergeImportedReportOptions): DailyReportState {
  const report: DailyReportState = structuredClone(importedReport);

  /* ==========================================================
     Resolve Employees
  ========================================================== */

  report.attendance = report.attendance.map((attendance) => {
    const employee = employees.find(
      (e) =>
        e.staffId.trim().toLowerCase() ===
          attendance.staffId.trim().toLowerCase() &&
        `${e.firstName} ${e.lastName}`.trim().toLowerCase() ===
          attendance.employeeName.trim().toLowerCase(),
    );

    return {
      ...attendance,

      employeeId: employee?.id ?? 0,
    };
  });

  /* ==========================================================
     Resolve Crews
  ========================================================== */

  report.crews = report.crews.map((crew) => {
    const matchedCrew = availableCrews.find(
      (c) =>
        c.crewCode.trim().toLowerCase() === crew.crewCode.trim().toLowerCase(),
    );

    const resolvedCrewId = matchedCrew?.id ?? 0;

    return {
      ...crew,

      id: resolvedCrewId,

      teamId: matchedCrew?.teamId,

      members: crew.members.map((member) => {
        const attendance = report.attendance.find(
          (a) =>
            a.staffId.trim().toLowerCase() ===
              member.staffId.trim().toLowerCase() &&
            a.employeeName.trim().toLowerCase() ===
              member.employeeName.trim().toLowerCase(),
        );

        return {
          ...member,

          employeeId: attendance?.employeeId ?? 0,

          crewMemberId: attendance?.employeeId ?? 0,
        };
      }),
    };
  });

  /* ==========================================================
     Resolve Equipment
  ========================================================== */

  report.crews = report.crews.map((crew) => ({
    ...crew,

    equipment: crew.equipment.map((usage) => {
      const matchedEquipment = equipment.find(
        (e) =>
          String(e.name).trim().toLowerCase() ===
          String(usage.equipmentId).trim().toLowerCase(),
      );

      const operatorAttendance = report.attendance.find(
        (employee) => employee.employeeId === usage.operatorId,
      );

      return {
        ...usage,

        equipmentId: matchedEquipment?.id ?? "",

        operatorId: operatorAttendance?.employeeId ?? "",

        crewMemberId: operatorAttendance?.employeeId ?? "",
      };
    }),
  }));

  /* ==========================================================
     Resolve Attendance Crew Assignment
  ========================================================== */

  report.attendance = report.attendance.map((attendance) => {
    const crew = report.crews.find((crew) =>
      crew.members.some(
        (member) => member.employeeId === attendance.employeeId,
      ),
    );

    return {
      ...attendance,

      assignedCrewId: crew?.id,

      assignedCrewCode: crew?.crewCode,
    };
  });

  /* ==========================================================
     Resolve Tasks
  ========================================================== */

  report.crews = report.crews.map((crew) => ({
    ...crew,

    tasks: crew.tasks.map((task) => ({
      ...task,

      crewId: crew.id,
    })),
  }));

  /*
      Bridge resolution intentionally deferred.

      The imported workbook contains a PK Code.

      Bridge.id should be resolved after the user
      selects (or confirms) the bridge inside the UI.
  */

  return report;
}
