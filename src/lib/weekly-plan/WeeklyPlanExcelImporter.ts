import * as XLSX from "xlsx";

import { WeeklyPlanRow } from "./types";

export async function parseWeeklyPlanExcel(
  file: File
): Promise<WeeklyPlanRow[]> {

  const workbook =
    XLSX.read(
      await file.arrayBuffer()
    );

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const data =
    XLSX.utils.sheet_to_json(
      sheet
    ) as any[];

  return data.map(
    (row) => ({
      bridgeId:
        Number(
          row["Bridge ID"]
        ) || 0,

      pkCode:
        row["PK Code"] || "",

      locationCode:
        row["Location"] || "",

      activity:
        row["Activity"] || "",

      unit:
        row["Unit"] || "",

      plannedQty:
        Number(
          row["Planned Qty"]
        ) || 0,

      actualQty:
        Number(
          row["Actual Qty"]
        ) || 0,

      plannedStart:
        row["Planned Start"]
          ? new Date(
              row["Planned Start"]
            )
          : new Date(),

      plannedFinish:
        row["Planned Finish"]
          ? new Date(
              row["Planned Finish"]
            )
          : new Date(),

      dailyEntries: [],

      completed:
        row["Completed"] === true ||
        row["Completed"] === "Yes",
    })
  );
}