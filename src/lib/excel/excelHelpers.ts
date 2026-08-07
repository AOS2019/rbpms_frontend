// src/lib/excel/excelHelpers.ts

import * as XLSX from "xlsx";

/* ==========================================================
   Types
========================================================== */

export interface CellPosition {
  row: number;
  col: number;
}

export interface ExcelSection {
  headerRow: number;
  dataStartRow: number;
  dataEndRow: number;
}
/* Anchor Types */
export interface ExcelAnchor {
  row: number;
  col: number;
}

export interface ExcelAnchors {
  generalInfo: ExcelAnchor;
  attendance: ExcelAnchor;
  equipment: ExcelAnchor;
  crew: ExcelAnchor;
  task: ExcelAnchor;
}

/* ==========================================================
   Text Helpers
========================================================== */

/**
 * Normalize worksheet text for comparisons.
 */
export function normalizeText(value: unknown): string {
  return String(value ?? "")
    .replace(/\r/g, "")
    .replace(/\n/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/* ==========================================================
   Cell Helpers
========================================================== */

/**
 * Safely read a worksheet cell.
 */
export function getCellValue(
  sheet: XLSX.WorkSheet,
  row: number,
  col: number
): string {
  const address = XLSX.utils.encode_cell({
    r: row,
    c: col,
  });

  const cell = sheet[address];

  return cell?.v?.toString().trim() ?? "";
}

/**
 * Read merged cells correctly.
 */
export function getMergedValue(
  sheet: XLSX.WorkSheet,
  row: number,
  col: number
): string {

  const merges = sheet["!merges"] ?? [];

  for (const merge of merges) {

    if (
      row >= merge.s.r &&
      row <= merge.e.r &&
      col >= merge.s.c &&
      col <= merge.e.c
    ) {

      return getCellValue(
        sheet,
        merge.s.r,
        merge.s.c
      );
    }
  }

  return getCellValue(sheet, row, col);
}

/* ==========================================================
   Search Helpers
========================================================== */

/**
 * Find a label anywhere in the worksheet.
 */
export function findLabel(
  sheet: XLSX.WorkSheet,
  label: string
): CellPosition | null {

  const range = XLSX.utils.decode_range(
    sheet["!ref"] ?? "A1"
  );

  const search = normalizeText(label);

  for (let row = range.s.r; row <= range.e.r; row++) {

    for (let col = range.s.c; col <= range.e.c; col++) {

      const value = normalizeText(
        getMergedValue(sheet, row, col)
      );

      if (value === search) {
        return {
          row,
          col,
        };
      }
    }
  }

  return null;
}

/**
 * Find the next occurrence of another label.
 */
export function findNextLabel(
  sheet: XLSX.WorkSheet,
  labels: string[],
  startRow: number
): CellPosition | null {

  const range = XLSX.utils.decode_range(
    sheet["!ref"] ?? "A1"
  );

  const normalized = labels.map(normalizeText);

  for (let row = startRow; row <= range.e.r; row++) {

    for (let col = range.s.c; col <= range.e.c; col++) {

      const value = normalizeText(
        getMergedValue(sheet, row, col)
      );

      if (normalized.includes(value)) {

        return {
          row,
          col,
        };
      }
    }
  }

  return null;
}

/* ==========================================================
   Row Helpers
========================================================== */

/**
 * Determine whether every cell in a row is empty.
 */
export function isEmptyRow(
  sheet: XLSX.WorkSheet,
  row: number
): boolean {

  const range = XLSX.utils.decode_range(
    sheet["!ref"] ?? "A1"
  );

  for (let col = range.s.c; col <= range.e.c; col++) {

    if (
      getMergedValue(sheet, row, col).trim() !== ""
    ) {
      return false;
    }
  }

  return true;
}

/**
 * Find the first empty row after a section.
 */
export function findNextEmptyRow(
  sheet: XLSX.WorkSheet,
  startRow: number
): number {

  const range = XLSX.utils.decode_range(
    sheet["!ref"] ?? "A1"
  );

  for (let row = startRow; row <= range.e.r; row++) {

    if (isEmptyRow(sheet, row)) {
      return row;
    }
  }

  return range.e.r;
}

/* ==========================================================
   Column Helpers
========================================================== */

/**
 * Convert Excel column letter to index.
 *
 * A -> 0
 * B -> 1
 * AA -> 26
 */
export function columnLetterToIndex(
  letter: string
): number {

  let result = 0;

  for (const char of letter.toUpperCase()) {

    result =
      result * 26 +
      (char.charCodeAt(0) - 64);
  }

  return result - 1;
}

/**
 * Convert column index to Excel letter.
 *
 * 0 -> A
 * 26 -> AA
 */
export function columnIndexToLetter(
  index: number
): string {

  let dividend = index + 1;

  let column = "";

  while (dividend > 0) {

    const modulo = (dividend - 1) % 26;

    column =
      String.fromCharCode(65 + modulo) +
      column;

    dividend = Math.floor(
      (dividend - modulo) / 26
    );
  }

  return column;
}
