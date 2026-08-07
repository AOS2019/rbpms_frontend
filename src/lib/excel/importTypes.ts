import {
  GeneralInfo,
  EmployeeAttendanceRow,
  EquipmentUsageRow,
  ActivityRow,
} from "@/components/daily-report/types";

/* ==========================================================
   Imported General Information
========================================================== */

export interface ImportedGeneralInfo {
  generalInfo: GeneralInfo;

  /**
   * Bridge PK Code exactly as written in Excel.
   * Will later be resolved to bridgeId.
   */
  bridgePkCode: string;
}

/* ==========================================================
   Imported Attendance
========================================================== */

export interface ImportedAttendanceRow {
  /**
   * Original worksheet row.
   * Used to relate every section together.
   */
  excelRow: number;

  attendance: EmployeeAttendanceRow;
}

/* ==========================================================
   Imported Equipment
========================================================== */

export interface ImportedEquipmentRow {
  /**
   * Original worksheet row.
   */
  excelRow: number;

  equipment: EquipmentUsageRow;

  /**
   * Equipment name/code from Excel.
   * Later resolved to equipmentId.
   */
  equipmentName: string;

  /**
   * Operator value exactly as written in Excel.
   * Later matched against Attendance.
   */
  operatorValue: string;
}

/* ==========================================================
   Imported Crew Member
========================================================== */

export interface ImportedCrewDeploymentRow {
  /**
   * Original worksheet row.
   */
  excelRow: number;

  /**
   * Team 01
   * Team 02
   * Team 03
   */
  crewCode: string;

  /**
   * Hours under "man."
   */
  manpowerHours: number;

  /**
   * Hours under "equi."
   */
  equipmentHours: number;
}

/* ==========================================================
   Imported Task
========================================================== */

export interface ImportedTask {
  task: ActivityRow;

  /**
   * Crew code exactly as written in Excel.
   * Used to attach task to CrewRow.
   */
  crewCode: string;
}

/* ==========================================================
   Entire Parsed Workbook
========================================================== */

export interface ImportedDailyReport {
  generalInfo: ImportedGeneralInfo;

  attendance: ImportedAttendanceRow[];

  equipment: ImportedEquipmentRow[];

  crewDeployment: ImportedCrewDeploymentRow[];

  tasks: ImportedTask[];
}