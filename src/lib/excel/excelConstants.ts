// src/lib/excel/excelConstants.ts

/* ==========================================================
   Excel Labels
========================================================== */

export const LABELS = {
  /* ---------- General Information ---------- */

  GENERALINFO: "Daily Report Summary",

  DATE: "Date",

  WEATHER: "Weather",

  SITE_ENGINEER: "Writer",

  TEAM: "Bridges",

  FOREMAN: "Foreman",

  PROJECT_MANAGER: "Project Manager",

  MANAGER: "Manager",

  /* ---------- Sections ---------- */

  ATTENDANCE: "Employee",

  EQUIPMENT: "Equipment Usage",

  CREW: "INPUT (budget code / activity)",

  TASK: "Task Summary",
} as const;

/* ==========================================================
   Fixed Section Ranges
========================================================== */

export const GENERAL_INFO = {
  START_ROW: 1,
  END_ROW: 9,
} as const;

/* ==========================================================
   Worksheet Defaults
========================================================== */

export const EXCEL = {
  HEADER_ROW: 1,
  FIRST_SHEET: 0,
} as const;

/* ==========================================================
   Attendance Columns
========================================================== */

export const ATTENDANCE_COLUMNS = {
  STAFF_ID: "A",

  EMPLOYEE_NAME: "B",

  TRADE: "C",

  ATTENDANCE_STATUS: "D",
} as const;

/* ==========================================================
   Equipment Columns
========================================================== */

export const EQUIPMENT_COLUMNS = {
  EQUIPMENT_NAME: "Q",

  OPERATOR: "R",

  START_READING: "S",

  END_READING: "T",

  TOTAL_READING: "U",

  STANDBY_HOURS: "V",

  BREAKDOWN_HOURS: "W",
} as const;

