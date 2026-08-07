// src/lib/excel/resolveCrewMembers.ts

import {
  CrewRow,
  CrewMemberRow,
} from "@/components/daily-report/types";

import {
  ImportedAttendanceRow,
  ImportedCrewDeploymentRow,
} from "./importTypes";

/* ==========================================================
   Resolve Crew Members
========================================================== */

export function resolveCrewMembers(

  crews: CrewRow[],

  attendance: ImportedAttendanceRow[],

  deployment: ImportedCrewDeploymentRow []

): CrewRow[] {

  return crews.map((crew) => {

    const members: CrewMemberRow[] = deployment

      .filter((row) => row.crewCode === crew.crewCode)

      .map((row) => {

        const employee = attendance.find(

          (a) => a.excelRow === row.excelRow

        );

        if (!employee) {

          return null;

        }

        return {

          id: employee.attendance.employeeId,

          crewMemberId: employee.attendance.employeeId,

          employeeId: employee.attendance.employeeId,

          staffId: employee.attendance.staffId,

          employeeName: employee.attendance.employeeName,

          trade: employee.attendance.trade,

          hoursWorked: row.manpowerHours,

          assignedFromCrewId: undefined,

          assignedFromBridgeId: undefined,

          remarks: "",

          equipment: [],

        };

      })

      .filter(Boolean) as CrewMemberRow[];

    return {

      ...crew,

      members,

    };

  });

}