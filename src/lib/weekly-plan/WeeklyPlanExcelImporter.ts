import * as XLSX from "xlsx";
import { WeeklyPlanRow } from "./types";

export async function parseWeeklyPlanExcel(
  file: File
): Promise<WeeklyPlanRow[]> {

  const workbook = XLSX.read(
    await file.arrayBuffer(),
    {
      cellDates: true,
    }
  );

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  // Returns 2D array preserving blank cells
  const rows =
    XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    }) as any[][];

  // ----------------------------------------------------
  // Locate header row
  // ----------------------------------------------------

  const headerRowIndex =
    rows.findIndex(r =>
      r.includes("Bridge")
    );

  if (headerRowIndex === -1)
    throw new Error(
      "Unable to locate Weekly Plan header."
    );

  const header1 =
    rows[headerRowIndex];

  const header2 =
    rows[headerRowIndex + 1];

  // ----------------------------------------------------
  // Fixed Columns
  // ----------------------------------------------------

  const bridgeCol =
    header1.indexOf("Bridge");

  const locationCol =
    header1.indexOf("Location");

  const elementCol =
    header1.indexOf("Element");

  const activityCol =
    header1.indexOf("Activity");

  const unitCol =
    header1.indexOf("Unit");

  const weekPlanCol =
    header1.indexOf("Week Plan");

  const weekRealCol =
    header1.indexOf("Week Real");

  const statusCol =
    header1.indexOf("Status");

  const varianceCol =
    header1.indexOf("Variance");

  // ----------------------------------------------------
  // Detect Daily Columns
  // ----------------------------------------------------

  const dayColumns: {
    plan: number;
    real: number;
  }[] = [];

  for (
    let i = unitCol + 1;
    i < weekPlanCol;
    i += 2
  ) {
    dayColumns.push({
      plan: i,
      real: i + 1,
    });
  }

  // ----------------------------------------------------
  // Data starts after second header row
  // ----------------------------------------------------

  const dataRows =
    rows.slice(headerRowIndex + 2);

  return dataRows
    .filter(r => r.some(c => c !== ""))
    .map(r => {

      const dailyEntries = dayColumns.map((day) => {

        const headerValue =
          String(header1[day.plan] || "");

        return {
          date: headerValue,

          plannedQty:
            Number(r[day.plan]) || 0,

          actualQty:
            Number(r[day.real]) || 0,
        };
      });

      const plannedQty =
        dailyEntries.reduce(
          (sum, d) =>
            sum + d.plannedQty,
          0
        );

      const actualQty =
        dailyEntries.reduce(
          (sum, d) =>
            sum + d.actualQty,
          0
        );

      return {

        bridgeId: 0,

        pkCode:
          r[bridgeCol] || "",

        locationCode:
          r[locationCol] || "",

        element:
          r[elementCol] || "",

        activity:
          r[activityCol] || "",

        unit:
          r[unitCol] || "",

        plannedQty,

        actualQty,

        plannedStart: new Date(),

        plannedFinish: new Date(),

        dailyEntries,

        varianceReason:
          r[varianceCol] || "",

        completed:
          (r[statusCol] || "")
            .toString()
            .toUpperCase() ===
          "COMPLETE",
      };
    });
}