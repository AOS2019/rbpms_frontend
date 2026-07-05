import ExcelJS from "exceljs";
import { WeeklyPlanRow } from "./types";

export async function exportWeeklyPlanExcel(
  rows: WeeklyPlanRow[],
  weekStart?: string,
  weekEnd?: string
) {
  const workbook = new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet(
      "Weekly Plan"
    );

  sheet.columns = [
    { width: 15 }, // PK Code
    { width: 20 }, // Location
    { width: 35 }, // Activity
    { width: 20 }, // Element
    { width: 12 }, // Unit
    { width: 12 }, // Planned Qty
    { width: 12 }, // Actual Qty
    { width: 15 }, // Planned Start
    { width: 15 }, // Planned Finish
    { width: 15 }, // Status
    { width: 30 }, // Variance
  ];

  sheet.mergeCells("A1:K1");

  sheet.getCell("A1").value =
    "RBPMS WEEKLY PLAN";

  sheet.getCell("A1").font = {
    bold: true,
    size: 16,
  };

  sheet.getCell("A3").value =
    "Week Start";

  sheet.getCell("B3").value =
    weekStart || "";

  sheet.getCell("D3").value =
    "Week End";

  sheet.getCell("E3").value =
    weekEnd || "";

  sheet.addRow([]);

  const headerRow = sheet.addRow([
    "PK Code",
    "Location",
    "Activity",
    "Element",
    "Unit",
    "Planned Qty",
    "Actual Qty",
    "Planned Start",
    "Planned Finish",
    "Status",
    "Variance Reason",
  ]);

  headerRow.font = {
    bold: true,
  };

  rows.forEach((row) => {
    const excelRow =
      sheet.addRow([
        row.pkCode,
        row.locationCode,
        row.activity,
        row.element || "",
        row.unit,
        row.plannedQty,
        row.actualQty,
        row.plannedStart
          ? new Date(
              row.plannedStart
            )
          : "",
        row.plannedFinish
          ? new Date(
              row.plannedFinish
            )
          : "",
        row.actualQty >=
        row.plannedQty
          ? "COMPLETE"
          : "BEHIND",
        row.varianceReason ||
          "",
      ]);

    const statusCell =
      excelRow.getCell(10);

    if (
      row.actualQty >=
      row.plannedQty
    ) {
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "92D050",
        },
      };
    } else {
      statusCell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: {
          argb: "FF0000",
        },
      };
    }
  });

  return workbook;
}