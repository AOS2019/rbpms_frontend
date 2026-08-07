// src/lib/excel/dailyReportImporter.ts

import * as XLSX from "xlsx";

import { DailyReportState, CrewRow } from "@/components/daily-report/types";

import { findAnchors } from "./findAnchors";

import { parseGeneralInfo } from "./parseGeneralInfo";
import { parseAttendance } from "./parseAttendance";
import { parseEquipment } from "./parseEquipment";
import { parseCrewDeployment } from "./parseCrewDeployment";
import { parseTaskSummary } from "./parseTaskSummary";

import { resolveCrewMembers } from "./resolveCrewMembers";
import { resolveEquipment } from "./resolveEquipment";
import { resolveTasks } from "./resolveTasks";

/* ==========================================================
   Parse Daily Report Excel
========================================================== */

export async function parseDailyReportExcel(
  file: File
): Promise<DailyReportState> {

  /* ==========================================================
     Read Workbook
  ========================================================== */

  const workbook = XLSX.read(
    await file.arrayBuffer()
  );

  const sheet =
    workbook.Sheets[workbook.SheetNames[0]];

  /* ==========================================================
     Locate Sections
  ========================================================== */

  const anchors = findAnchors(sheet);

  /* ==========================================================
     Parse Workbook
  ========================================================== */

  const importedGeneralInfo =
    parseGeneralInfo(sheet, anchors);

  const importedAttendance =
    parseAttendance(sheet, anchors);

  const importedEquipment =
    parseEquipment(sheet, anchors);

  const importedCrewDeployment =
    parseCrewDeployment(sheet, anchors);

  const importedTasks =
    parseTaskSummary(sheet, anchors);

  /* ==========================================================
     Build Initial Crews
  ========================================================== */

  const crewMap = new Map<string, CrewRow>();

  importedCrewDeployment.forEach((row) => {

    if (!crewMap.has(row.crewCode)) {

      crewMap.set(row.crewCode, {

        id: 0,

        crewCode: row.crewCode,

        teamId: undefined,

        active: true,

        remarks: "",

        members: [],

        tasks: [],

        equipment: [],

      });

    }

  });

  let crews = Array.from(
    crewMap.values()
  );

  /* ==========================================================
     Resolve Crew Members
  ========================================================== */

  crews = resolveCrewMembers(

    crews,

    importedAttendance,

    importedCrewDeployment

  );

  /* ==========================================================
     Resolve Equipment
  ========================================================== */

  crews = resolveEquipment(

    crews,

    importedEquipment

  );

  /* ==========================================================
     Resolve Tasks
  ========================================================== */

  crews = resolveTasks(

    crews,

    importedTasks

  );

  /* ==========================================================
     Return Daily Report
  ========================================================== */

  return {

    generalInfo:
      importedGeneralInfo.generalInfo,

    /*
      Bridge will be resolved
      after merging with the
      application's master data.
    */

    bridgeId: 0,

    attendance:

      importedAttendance.map(

        (row) => row.attendance

      ),

    crews,

  };

}