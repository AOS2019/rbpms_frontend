// src/lib/excel/parseTaskSummary.ts

import * as XLSX from "xlsx";

import { ActivityRow } from "@/components/daily-report/types";

import { ExcelAnchors } from "./findAnchors";

import { getMergedValue } from "./excelHelpers";

import { ImportedTask } from "./importTypes";

/* ==========================================================
   Task Summary Parser
========================================================== */

export function parseTaskSummary(
  sheet: XLSX.WorkSheet,
  anchors: ExcelAnchors
): ImportedTask[] {

  const tasks: ImportedTask[] = [];

  /*
      Task Summary

      Row +0  Section title
      Row +1  Column headings
      Row +2  First data row
  */

  const headerRow = anchors.task.row + 1;

  const dataStartRow = anchors.task.row + 2;

  /*
      Columns

      B  Task
      C  Input (Team)
      H  Activity Description
      R  Location
      T  Quantity
      U  Unit
      Z-AQ Observations
  */

  const taskCol = 1;

  const crewCol = 2;

  const activityCol = 7;

  const quantityCol = 19;

  const unitCol = 20;

  //const remarksCol = 25;

  const observationsCol = 25; // Column Z

  let row = dataStartRow;

  while (true) {

    const activityDescription = getMergedValue(
      sheet,
      row,
      activityCol
    ).trim();

    /*
        Empty description means
        end of Task Summary.
    */

    if (!activityDescription) {
      break;
    }

    const crewCode = getMergedValue(
      sheet,
      row,
      crewCol
    ).trim();

    const quantity = Number(
      getMergedValue(
        sheet,
        row,
        quantityCol
      ) || 0
    );

    const task: ActivityRow = {

      id: crypto.randomUUID(),

      crewId: 0,

      bridgeId: undefined,

      locationCode: "",

      activityCode: getMergedValue(
        sheet,
        row,
        taskCol
      ).trim(),

      activity: activityDescription,

      elementId: undefined,

      pierNumber: undefined,

      quantityDone: quantity,

      unit: getMergedValue(
        sheet,
        row,
        unitCol
      ).trim(),

      concreteGrade: undefined,

      status: "",

      remarks: getMergedValue(
        sheet,
        row,
        observationsCol
      ).trim(),

      errors: {},
    };

    tasks.push({

      crewCode,

      task,

    });

    row++;

  }

  return tasks;

}