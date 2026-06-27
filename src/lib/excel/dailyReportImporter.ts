import * as XLSX from "xlsx";

export async function parseDailyReportExcel(
  file: File
) {
  const workbook = XLSX.read(
    await file.arrayBuffer()
  );

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows: any[][] =
    XLSX.utils.sheet_to_json(sheet, {
      header: 1,
      defval: "",
    });

  const generalInfo = {
    date: rows[2]?.[1] || "",
    weather: rows[2]?.[4] || "",
    siteEngineer: rows[4]?.[1] || "",
    foreman: rows[4]?.[4] || "",
    projectManager: "",
  };

  const manpower = [];

  let manpowerStart = 9;

  while (
    manpowerStart < rows.length &&
    rows[manpowerStart]?.[0] !== ""
  ) {
    manpower.push({
      staffId:
        rows[manpowerStart][0] || "",

      employeeName:
        rows[manpowerStart][1] || "",

      teamId:
        String(
          rows[manpowerStart][2] || ""
        ),

      hoursWorked:
        Number(
          rows[manpowerStart][3] || 0
        ),

      remarks:
        rows[manpowerStart][4] || "",

      employeeId: null,

      manualEmployee: true,

      equipmentId: "",
    });

    manpowerStart++;
  }

  const activities = [];

  let activityStart = 16;

  while (
    activityStart < rows.length
  ) {
    const row =
      rows[activityStart];

    if (
      !row ||
      row.every(
        (cell) =>
          cell === ""
      )
    ) {
      activityStart++;
      continue;
    }

    activities.push({
      teamId:
        String(row[0] || ""),

      activity:
        row[1] || "",

      pier:
        row[2] || "",

      elementId:
        Number(row[3] || 0),

      quantity:
        Number(row[4] || 0),

      unit:
        row[5] || "",

      grade:
        row[6] || "",

      bridge: "",
    });

    activityStart++;
  }

  return {
    generalInfo,
    manpower,
    activities,
  };
}