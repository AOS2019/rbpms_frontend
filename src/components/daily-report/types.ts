/* ============================================================
   General Information
============================================================ */

export interface GeneralInfo {
  date: string;

  siteEngineer: string;

  foreman: string;

  projectManager: string;

  weather: string;
}

/* ============================================================
   Task Description (Section C)
============================================================ */

export interface ActivityRow {
  id: string;

  crewId: number;

  bridgeId?: number;

  locationCode: string;

  activityCode?: string;

  activity: string;

  elementId?: number;

  pierNumber?: string;

  quantityDone?: number;

  unit?: string;

  concreteGrade?: string;

  status: string;

  remarks?: string;

  errors?: Record<string, string>;
}

/* ============================================================
   Employees (Section B)
============================================================ */

export type AttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "LEAVE"
  | "MISSION"
  | "SICK"
  | "JUSTIFIED_ABSENCE";
  
export interface EmployeeAttendanceRow {
  employeeId: number;

  staffId: string;

  employeeName: string;

  trade?: string;

  permanentCrewId?: number;

  permanentCrewCode?: string;

  attendanceStatus: AttendanceStatus;

  assignedCrewId?: number;

  assignedCrewCode?: string;

  assignedBridgeId?: number;

  // hoursWorked: number;

  borrowed: boolean;

  remarks?: string;
}

/* ============================================================
   Crew Deployment (Section B)
============================================================ */

export interface CrewMemberRow {
  id: number;

  crewMemberId?: number;

  employeeId: number;

  staffId: string;

  employeeName: string;

  trade?: string;

  hoursWorked: number;

  assignedFromCrewId?: number;

  assignedFromBridgeId?: number;

  remarks?: string;

  equipment: EquipmentUsageRow[];
}

export interface CrewRow {
  id: number;

  crewCode: string;

  teamId?: number;

  active?: boolean;

  remarks?: string;

  members: CrewMemberRow[];

  tasks: ActivityRow[];

  equipment:EquipmentUsageRow[]
}

/* ============================================================
   Equipment (Section B)
============================================================ */

export interface EquipmentUsageRow {
  id: string;

  equipmentId: number | "";

  operatorId: number | "";

  employeeAttendanceId?: number;

  crewId: number;

  crewMemberId: number | "";

  startReading: number;

  endReading: number;

  totalReading: number;

  standbyHours: number;

  breakdownHours: number;

  fuelUsed?: number;

  remarks?: string;
}

/* ============================================================
   API Lookups
============================================================ */

export interface TeamOption {
  id: number;

  name: string;
}

export interface EmployeeOption {
  id: number;

  staffId: string;

  firstName: string;

  lastName: string;

  trade?: string;

  designation?: string;
}

export interface CrewOption {
  id: number;
  crewCode: string;
  teamId: number;
  description?: string;
  active?: boolean;
}

export interface EquipmentOption {
  id: number;

  equipmentCode: string;

  name: string;

  type?: string;

  status?: string;
}

export interface ElementOption {
  id: number;

  name: string;

  type?: string;
}

export interface BridgeOption {
  id: number;

  pk_code: string;
}

/* ============================================================
   Payload sent to API
============================================================ */

export interface DailyReportPayload {
  generalInfo: GeneralInfo;

  bridgeId: number;

  attendance: EmployeeAttendanceRow[];

  crews: CrewRow[];
}

/* ============================================================
   Additionally
============================================================ */

export interface Team {
  id: number;
  name: string;
}

export interface Employee {
  id: number;

  staffId: string;

  firstName: string;

  lastName: string;

  trade?: string;

  designation?: string;
}

export interface Bridge {
  id: number;

  pk_code: string;
}

export interface Pier {
  id: number;

  pierNumber: string;
}

export interface Equipment {
  id: number;

  equipmentCode: string;

  name: string;

  type?: string;
}

export interface Element {
  id: number;

  name: string;

  type?: string;
}

export interface DailyReportState {
  generalInfo: GeneralInfo;

  bridgeId: number;

  attendance: EmployeeAttendanceRow[];

  crews: CrewRow[];
}