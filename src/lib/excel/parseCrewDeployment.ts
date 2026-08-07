// src/lib/excel/parseCrewDeployment.ts

import * as XLSX from "xlsx";

import { ExcelAnchors } from "./findAnchors";

import {
  ImportedCrewDeploymentRow,
} from "./importTypes";

import {
  getMergedValue,
} from "./excelHelpers";

/* ==========================================================
   Crew Deployment Parser
========================================================== */

export function parseCrewDeployment(
  sheet: XLSX.WorkSheet,
  anchors: ExcelAnchors
): ImportedCrewDeploymentRow[] {

  const deployment: ImportedCrewDeploymentRow[] = [];

  /*
      INPUT (budget code / activity)

      Row +0  Section title

      Row +1  Team names

      Row +2  man. equi.

      Row +3  First employee
  */

  const crewHeaderRow = anchors.crew.row + 1;

  const dataStartRow = anchors.crew.row + 3;

  const dataEndRow = anchors.task.row - 1;

  /*
      Crew section begins at Z.
  */

  let column = anchors.crew.col;

  while (true) {

    const crewCode = getMergedValue(
      sheet,
      crewHeaderRow,
      column
    ).trim();

    /*
        No more crew columns.
    */

    if (!crewCode) {
      break;
    }

    const manpowerColumn = column;

    const equipmentColumn = column + 1;

    for (
      let row = dataStartRow;
      row <= dataEndRow;
      row++
    ) {

      const manpowerHours = Number(
        getMergedValue(
          sheet,
          row,
          manpowerColumn
        ) || 0
      );

      const equipmentHours = Number(
        getMergedValue(
          sheet,
          row,
          equipmentColumn
        ) || 0
      );

      /*
          Ignore completely empty cells.
      */

      if (
        manpowerHours <= 0 &&
        equipmentHours <= 0
      ) {
        continue;
      }

      deployment.push({

        excelRow: row,

        crewCode,

        manpowerHours,

        equipmentHours,

      });

    }

    /*
        Each crew occupies two columns:

        man. | equi.
    */

    column += 2;

  }

  return deployment;

}