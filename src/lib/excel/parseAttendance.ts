import * as XLSX from "xlsx";

import {
  EmployeeAttendanceRow,
  AttendanceStatus,
} from "@/components/daily-report/types";

import {
  ImportedAttendanceRow,
} from "./importTypes";

import { ExcelAnchors } from "./findAnchors";

import {
  ATTENDANCE_COLUMNS,
} from "./excelConstants";

import {
  getMergedValue,
  columnLetterToIndex,
} from "./excelHelpers";

/* ==========================================================
   Attendance Parser
========================================================== */

export function parseAttendance(
  sheet: XLSX.WorkSheet,
  anchors: ExcelAnchors
): ImportedAttendanceRow[] {

  const attendance: ImportedAttendanceRow[] = [];

  /*
      First employee row.

      We intentionally skip the section title
      and the table header.
  */

  const startRow = anchors.attendance.row + 2;

  /*
      Attendance ends where the Task Summary
      section begins.
  */

  const endRow = anchors.task.row - 1;

  const staffIdCol =
    columnLetterToIndex(
      ATTENDANCE_COLUMNS.STAFF_ID
    );

  const employeeCol =
    columnLetterToIndex(
      ATTENDANCE_COLUMNS.EMPLOYEE_NAME
    );

  const tradeCol =
    columnLetterToIndex(
      ATTENDANCE_COLUMNS.TRADE
    );

  const statusCol =
    columnLetterToIndex(
      ATTENDANCE_COLUMNS.ATTENDANCE_STATUS
    );

  for (
    let row = startRow;
    row <= endRow;
    row++
  ) {

    const employeeName =
      getMergedValue(
        sheet,
        row,
        employeeCol
      );

    const staffId = getMergedValue(
  sheet,
  row,
  staffIdCol
).trim();

const trade = getMergedValue(
  sheet,
  row,
  tradeCol
).trim();

const attendanceStatusText = getMergedValue(
  sheet,
  row,
  statusCol
)
  .trim()
  .toUpperCase();

const attendanceStatus: AttendanceStatus =
  attendanceStatusText === "PRESENT"
    ? "PRESENT"
    : attendanceStatusText === "LEAVE"
    ? "LEAVE"
    : attendanceStatusText === "MISSION"
    ? "MISSION"
    : attendanceStatusText === "SICK"
    ? "SICK"
    : attendanceStatusText === "JUSTIFIED_ABSENCE"
    ? "JUSTIFIED_ABSENCE"
    : "ABSENT";

    /*
        Blank row.

        Skip it.

        Do NOT stop because there can
        be spacing inside the report.
    */

    if (!employeeName.trim()) {
      continue;
    }

    attendance.push({

    excelRow: row,

    attendance: {

        employeeId: 0,

        staffId,

        employeeName,

        trade,

        attendanceStatus,

        borrowed: false,

    }

});

  }

  return attendance;

}