// src/lib/excel/findAnchors.ts

import * as XLSX from "xlsx";

import { LABELS } from "./excelConstants";

import {
  CellPosition,
  findLabel,
} from "./excelHelpers";

/* ==========================================================
   Types
========================================================== */

export interface ExcelAnchors {
  generalInfo: CellPosition;

  attendance: CellPosition;

  equipment: CellPosition;

  crew: CellPosition;

  task: CellPosition;
}

/* ==========================================================
   Find Worksheet Anchors
========================================================== */

export function findAnchors(
  sheet: XLSX.WorkSheet
): ExcelAnchors {

  function required(label: string): CellPosition {

    const anchor = findLabel(sheet, label);

    if (!anchor) {
      throw new Error(
        `Unable to locate worksheet section "${label}".`
      );
    }

    return anchor;
  }

  return {

    generalInfo: required(
      LABELS.GENERALINFO
    ),

    attendance: required(
      LABELS.ATTENDANCE
    ),

    equipment: required(
      LABELS.EQUIPMENT
    ),

    crew: required(
      LABELS.CREW
    ),

    task: required(
      LABELS.TASK
    ),

  };
}