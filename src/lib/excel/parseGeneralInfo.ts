// src/lib/excel/parseGeneralInfo.ts

import * as XLSX from "xlsx";

import { GeneralInfo } from "@/components/daily-report/types";

import { LABELS } from "./excelConstants";

import {
  getMergedValue,
  findLabel,
} from "./excelHelpers";

import { ExcelAnchors } from "./findAnchors";

export interface ParsedGeneralInfo {
  bridgeCode: string;
  generalInfo: GeneralInfo;
}

export function parseGeneralInfo(
  sheet: XLSX.WorkSheet,
  anchors: ExcelAnchors
): ParsedGeneralInfo {

  function valueAfter(label: string): string {

    const position = findLabel(sheet, label);

    if (
      !position ||
      position.row < anchors.generalInfo.row
    ) {
      return "";
    }

    return getMergedValue(
      sheet,
      position.row,
      position.col + 1
    );
  }

  return {

    bridgeCode: valueAfter(
      LABELS.TEAM
    ),

    generalInfo: {

      date: valueAfter(
        LABELS.DATE
      ),

      weather: valueAfter(
        LABELS.WEATHER
      ),

      siteEngineer: valueAfter(
        LABELS.SITE_ENGINEER
      ),

      foreman: valueAfter(
        LABELS.FOREMAN
      ),

      projectManager: valueAfter(
        LABELS.PROJECT_MANAGER
      ),

    },

  };
}