"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  DailyReportState,
  DailyReportPayload,
  GeneralInfo,
  Bridge,
  Team,
  Employee,
  Equipment,
  Element,
  Pier,
  CrewOption,
  EmployeeAttendanceRow,
} from "../types";

import {
  getBridges,
  getTeams,
  getEmployees,
  getEquipment,
  getElements,
  getBridgePiers,
  getBridgeCrews,
  createDailyReport,
} from "../services/dailyReportApi";

import {
  CrewRow,
  CrewMemberRow,
  ActivityRow,
  EquipmentUsageRow,
} from "../types";

import { getCrewMembers } from "../services/dailyReportApi";

/* ==========================================================
   Initial General Information
========================================================== */

const initialGeneralInfo: GeneralInfo = {
  date: "",
  siteEngineer: "",
  foreman: "",
  projectManager: "",
  weather: "",
};

/* ==========================================================
   Initial Report State
========================================================== */

const initialReportState: DailyReportState = {
  generalInfo: initialGeneralInfo,
  bridgeId: 0,
  attendance: [],
  crews: [],
};

export function useDailyReport() {
  /* ==========================================================
      Master Data
  ========================================================== */

  const [bridges, setBridges] = useState<Bridge[]>([]);
  const [teams, setTeams] = useState<Team[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [elements, setElements] = useState<Element[]>([]);
  const [piers, setPiers] = useState<Pier[]>([]);

  // Permanent crews assigned to selected bridge
  const [availableCrews, setAvailableCrews] = useState<CrewOption[]>([]);

  /* ==========================================================
      Daily Report State
  ========================================================== */

  const [report, setReport] = useState<DailyReportState>(initialReportState);

  /* ==========================================================
      UI State
  ========================================================== */

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  /* ==========================================================
      Load Master Data
  ========================================================== */

  const loadMasterData = useCallback(async () => {
    setLoading(true);

    try {
      const [bridges, teams, employees, equipment, elements] =
        await Promise.all([
          getBridges(),
          getTeams(),
          getEmployees(),
          getEquipment(),
          getElements(),
        ]);

      setBridges(bridges);
      setTeams(teams);
      setEmployees(employees);
      setEquipment(equipment);
      setElements(elements);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMasterData();
  }, [loadMasterData]);

  /* ==========================================================
      General Information
  ========================================================== */

  function updateGeneralInfo<K extends keyof GeneralInfo>(
    field: K,
    value: GeneralInfo[K],
  ) {
    setReport((prev) => ({
      ...prev,
      generalInfo: {
        ...prev.generalInfo,
        [field]: value,
      },
    }));
  }

  /* ==========================================================
      Bridge Selection
  ========================================================== */

  function setBridge(bridgeId: number) {
    setReport((prev) => ({
      ...prev,
      bridgeId,
      crews: [],
    }));
  }

  /* ==========================================================
      Bridge Changed
  ========================================================== */

  useEffect(() => {
    if (!report.bridgeId) {
      setPiers([]);
      setAvailableCrews([]);
      return;
    }

    async function loadBridgeData() {
      try {
        const [bridgePiers, bridgeCrews] = await Promise.all([
          getBridgePiers(report.bridgeId),
          getBridgeCrews(report.bridgeId),
        ]);

        setPiers(bridgePiers);
        setAvailableCrews(
          bridgeCrews.map((crew) => ({
            id: Number(crew.id) || 0,
            crewCode: crew.crewCode,
            teamId: crew.teamId ?? 0,
            description: crew.remarks,
            active: crew.active,
          })),
        );
      } catch (error) {
        console.error(error);
      }
    }

    loadBridgeData();
  }, [report.bridgeId]);

  /* ==========================================================
        Add Crew
  ========================================================== */
  function addCrew(crew: CrewOption) {
    setReport((prev) => {
      if (prev.crews.some((c) => c.id === crew.id)) {
        return prev;
      }

      const newCrew: CrewRow = {
        id: crew.id,
        crewCode: crew.crewCode,
        teamId: crew.teamId,
        active: crew.active,
        remarks: "",

        members: [],
        tasks: [],
        equipment: [],
      };

      return {
        ...prev,
        crews: [...prev.crews, newCrew],
      };
    });
  }
  /* ==========================================================
        Remove Crew
  ========================================================== */

  function removeCrew(crewId: number) {
    setReport((prev) => ({
      ...prev,
      crews: prev.crews.filter((c) => Number(c.id) !== crewId),
    }));
  }

  /* ==========================================================
      Populate Crew Members
  ========================================================== */

  async function populateCrewMembers(crewId: number) {
    const members = (await getCrewMembers(crewId)) as Employee[];

    setReport((prev) => {
      const crews = [...prev.crews];

      const crew = crews.find((c) => Number(c.id) === crewId);

      if (!crew) return prev;

      crew.members = members.map(
        (employee): CrewMemberRow => ({
          id: Number(`${crewId}-${employee.id}`),

          crewMemberId: employee.id,

          employeeId: employee.id,

          staffId: employee.staffId,

          employeeName: `${employee.firstName} ${employee.lastName}`,

          trade: employee.trade,

          hoursWorked: 10,

          remarks: "",

          equipment: [],
        }),
      );

      return {
        ...prev,
        crews,
      };
    });

    updateAttendanceForCrew(members);
  }

  /* ==========================================================
        Remove Crew Member
  ========================================================== */

  function removeCrewMember(
    crewId: number | string,
    memberId: number | string,
  ) {
    setReport((prev) => {
      const crews = [...prev.crews];

      const crew = crews.find((c) => c.id === crewId);

      if (!crew) return prev;

      crew.members = crew.members.filter((m) => m.id !== memberId);

      return {
        ...prev,

        crews,
      };
    });
  }

  /* ==========================================================
        Add Borrowed Crew Member
  ========================================================== */

  function addBorrowedCrewMember(crewId: number, member: CrewMemberRow) {
    setReport((prev) => {
      const crews = [...prev.crews];

      const crew = crews.find((c) => c.id === crewId);

      if (!crew) return prev;

      crew.members.push(member);

      const attendance = [...prev.attendance];

      const attendanceRow = attendance.find(
        (a) => a.employeeId === member.employeeId,
      );

      if (attendanceRow) {
        attendanceRow.attendanceStatus = "PRESENT";
      }

      return {
        ...prev,

        crews,

        attendance,
      };
    });
  }

  /* ==========================================================
        Update Crew Member
  ========================================================== */

  function updateCrewMember<K extends keyof CrewMemberRow>(
    crewId: number | string,
    memberId: number | string,
    field: K,
    value: CrewMemberRow[K],
  ) {
    setReport((prev) => {
      const crews = [...prev.crews];

      const crew = crews.find((c) => c.id === crewId);

      if (!crew) return prev;

      const member = crew.members.find((m) => m.id === memberId);

      if (!member) return prev;

      member[field] = value;

      return {
        ...prev,

        crews,
      };
    });
  }

  /* ==========================================================
      Attendance Initialization
  ========================================================== */

  const initializeAttendance = useCallback(() => {
    const attendance: EmployeeAttendanceRow[] = employees.map((employee) => ({
      employeeId: employee.id,
      staffId: employee.staffId,
      employeeName: `${employee.firstName} ${employee.lastName}`,
      trade: employee.trade,
      designation: employee.designation,
      attendanceStatus: "ABSENT",
      remarks: "",
    }));

    setReport((prev) => ({
      ...prev,
      attendance,
    }));
  }, [employees]);

  useEffect(() => {
    if (employees.length > 0) {
      initializeAttendance();
    }
  }, [employees, initializeAttendance]);

  /* ==========================================================
      Attendance
  ========================================================== */

  function updateAttendance(
    index: number,
    field: keyof EmployeeAttendanceRow,
    value: EmployeeAttendanceRow[keyof EmployeeAttendanceRow],
  ) {
    setReport((prev) => {
      const attendance = [...prev.attendance];

      attendance[index] = {
        ...attendance[index],
        [field]: value,
      };

      return {
        ...prev,
        attendance,
      };
    });
  }

  /* ==========================================================
        Update Attendance for Crew Members
  ========================================================== */

  function updateAttendanceForCrew(members: Employee[]) {
    setReport((prev) => {
      const attendance = [...prev.attendance];

      members.forEach((member) => {
        const row = attendance.find((a) => a.employeeId === member.id);

        if (row) {
          row.attendanceStatus = "PRESENT";
        }
      });

      return {
        ...prev,

        attendance,
      };
    });
  }

  /* ==========================================================
      Filtered Elements
  ========================================================== */

  const filteredElements = useMemo(() => {
    if (!report.bridgeId) return [];

    return elements.filter(
      (element: any) => element.bridgeId === report.bridgeId,
    );
  }, [elements, report.bridgeId]);

  /* ==========================================================
      Helpers for Updating Report and Crew Equipment State
  ========================================================== */

  function updateReport(
    updater: (draft: DailyReportState) => DailyReportState,
  ) {
    setReport((prev) => updater(prev));
  }

  function updateCrew(crewId: number, updater: (crew: CrewRow) => void) {
    updateReport((prev) => {
      const crews = [...prev.crews];

      const index = crews.findIndex((c) => Number(c.id) === crewId);

      if (index === -1) return prev;

      const crew = {
        ...crews[index],
      };

      updater(crew);

      crews[index] = crew;

      return {
        ...prev,
        crews,
      };
    });
  }

  function updateCrewArray<K extends "members" | "tasks" | "equipment">(
    crewId: number,
    key: K,
    updater: (items: CrewRow[K]) => CrewRow[K],
  ) {
    updateCrew(crewId, (crew) => {
      crew[key] = updater([...crew[key]] as CrewRow[K]);
    });
  }

  /* ==========================================================
      Add Task
  ========================================================== */

  function addTask(crewId: number) {
    updateCrewArray(crewId, "tasks", (tasks) => [
      ...tasks,

      {
        id: crypto.randomUUID(),

        crewId,

        locationCode: "",

        activity: "",

        status: "",
      },
    ]);
  }

  /* ==========================================================
        Update Task
  ========================================================== */

  function updateTask<K extends keyof ActivityRow>(
    crewId: number,
    taskId: string,
    field: K,
    value: ActivityRow[K],
  ) {
    updateCrewArray(crewId, "tasks", (tasks) =>
      tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              [field]: value,
            }
          : task,
      ),
    );
  }

  /* ==========================================================
      Remove Task
  ========================================================== */

  function removeTask(crewId: number, taskId: string) {
    updateCrewArray(crewId, "tasks", (tasks) =>
      tasks.filter((task) => task.id !== taskId),
    );
  }

  /* ==========================================================
      Add Equipment
  ========================================================== */
  function addEquipment(crewId: number) {
    updateCrewArray(crewId, "equipment", (equipment) => [
      ...equipment,

      {
        id: crypto.randomUUID(),

        crewId,

        equipmentId: "",

        operatorId: "",

        crewMemberId: 0,

        startReading: 0,

        endReading: 0,

        totalReading: 0,

        standbyHours: 0,

        breakdownHours: 0,
      },
    ]);
  }

  /* ==========================================================
    Remove Equipment
  ========================================================== */
  function removeEquipment(crewId: number, equipmentId: string) {
    updateCrewArray(crewId, "equipment", (equipment) =>
      equipment.filter((item) => item.id !== equipmentId),
    );
  }

  /* ==========================================================
      Update Equipment
  ========================================================== */

  function updateEquipment<K extends keyof EquipmentUsageRow>(
    crewId: number,
    equipmentId: string,
    field: K,
    value: EquipmentUsageRow[K],
  ) {
    updateCrewArray(crewId, "equipment", (equipment) =>
      equipment.map((item) => {
        if (item.id !== equipmentId) return item;

        const updated = {
          ...item,
          [field]: value,
        };

        updated.totalReading =
          Number(updated.endReading) - Number(updated.startReading);

        return updated;
      }),
    );
  }

  /* ==========================================================
      Validation
  ========================================================== */
  function validateReport(): string[] {
    const errors: string[] = [];

    /* ==========================
      GENERAL INFORMATION
  ========================== */

    if (!report.bridgeId) errors.push("Bridge is required.");

    if (!report.generalInfo.date) errors.push("Date is required.");

    if (!report.generalInfo.siteEngineer)
      errors.push("Site Engineer is required.");

    if (!report.generalInfo.foreman) errors.push("Foreman is required.");

    if (!report.generalInfo.projectManager)
      errors.push("Project Manager is required.");

    if (!report.generalInfo.weather) errors.push("Weather is required.");

    /* ==========================
      ATTENDANCE
  ========================== */

    report.attendance.forEach((row) => {
      if (!row.attendanceStatus) {
        errors.push(`${row.employeeName} has no attendance status.`);
      }
    });

    /* ==========================
      CREWS
  ========================== */

    report.crews.forEach((crew) => {
      if (crew.members.length === 0) {
        errors.push(`${crew.crewCode} has no members.`);
      }

      /* ---------- Tasks ---------- */

      crew.tasks.forEach((task) => {
        if (!task.activity)
          errors.push(`${crew.crewCode}: Activity is required.`);

        if (!task.locationCode)
          errors.push(`${crew.crewCode}: Location Code is required.`);

        if (!task.status) errors.push(`${crew.crewCode}: Status is required.`);

        if (task.activity === "Concrete" && !task.concreteGrade) {
          errors.push(`${crew.crewCode}: Concrete Grade is required.`);
        }
      });

      /* ---------- Equipment ---------- */

      crew.equipment.forEach((equipment) => {
        if (!equipment.equipmentId)
          errors.push(`${crew.crewCode}: Equipment not selected.`);

        if (!equipment.operatorId)
          errors.push(`${crew.crewCode}: Equipment operator not selected.`);

        if (equipment.endReading < equipment.startReading) {
          errors.push(`${crew.crewCode}: Equipment meter reading is invalid.`);
        }
      });
    });

    return errors;
  }

  /* ==========================================================
      Build Payload
  ========================================================== */
  function buildPayload(): DailyReportPayload {
    return {
      bridgeId: report.bridgeId,

      generalInfo: report.generalInfo,

      attendance: report.attendance,

      crews: report.crews,
    };
  }

  /* ==========================================================
      Submit
  ========================================================== */
  async function submitReport(payload: DailyReportPayload) {
    return createDailyReport(payload);
  }

  /* ==========================================================
      Save
  ========================================================== */
  async function save() {
    const errors = validateReport();

    if (errors.length) {
      alert(errors.join("\n"));

      return;
    }

    setSaving(true);

    try {
      const payload = buildPayload();

      await submitReport(payload);

      alert("Daily Report saved successfully.");
    } catch (error) {
      console.error(error);

      alert("Failed to save Daily Report.");
    } finally {
      setSaving(false);
    }
  }

  /* ==========================================================
      Exposed API
  ========================================================== */

  return {
    /* Loading */

    loading,
    saving,

    /* Master Data */

    bridges,
    teams,
    employees,
    equipment,
    elements,
    piers,
    availableCrews,
    filteredElements,

    /* Report */

    report,

    /* General */
    setReport,
    setBridge,
    updateGeneralInfo,
    updateAttendance,

    /* Crew Management */
    addCrew,
    removeCrew,
    populateCrewMembers,
    addBorrowedCrewMember,
    removeCrewMember,
    updateCrewMember,

    /* Task Management */
    addTask,
    updateTask,
    removeTask,

    /* Equipment Management */
    addEquipment,
    removeEquipment,
    updateEquipment,

    /* Validation & Save */
    validateReport,
    buildPayload,
    submitReport,
    save,
  };
}
