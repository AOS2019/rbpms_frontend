import ExcelJS from "exceljs";

export async function exportDailyReportExcel(
  report: any
) {
  const workbook =
    new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet(
      "Daily Report"
    );

  sheet.columns = [
    { width: 10 },
    { width: 20 },
    { width: 30 },
    { width: 20 },
    { width: 15 },
    { width: 15 },
  ];

  sheet.mergeCells("A1:F1");

  sheet.getCell("A1").value =
    "DAILY REPORT";

  sheet.getCell("A3").value =
    "Date";

  sheet.getCell("B3").value =
    report.date;

  sheet.getCell("D3").value =
    "Weather";

  sheet.getCell("E3").value =
    report.weather;

  sheet.getCell("A5").value =
    "Site Engineer";

  sheet.getCell("B5").value =
    report.siteEngineer;

  sheet.getCell("D5").value =
    "Foreman";

  sheet.getCell("E5").value =
    report.foreman;

  sheet.getCell("A7").value =
    "MANPOWER";

  sheet.addRow([]);

  sheet.addRow([
    "Staff ID",
    "Employee Name",
    "Team",
    "Hours",
    "Remarks",
  ]);

  (report.manpower ?? []).forEach(
    (row: any) => {
      sheet.addRow([
        row.staffId,
        row.employeeName,
        row.teamId,
        row.hoursWorked,
        row.remarks,
      ]);
    }
  );

  sheet.addRow([]);
  sheet.addRow([]);

  sheet.addRow([
    "Team",
    "Activity",
    "Pier",
    "Element",
    "Qty",
    "Unit",
    "Grade",
  ]);

  (report.activities ?? []).forEach(
    (activity: any) => {
      sheet.addRow([
        activity.teamId,
        activity.activity,
        activity.pier,
        activity.elementId,
        activity.quantity,
        activity.unit,
        activity.grade,
      ]);
    }
  );

  return workbook;
}