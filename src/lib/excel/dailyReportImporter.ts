import * as XLSX from "xlsx";

export async function parseDailyReportExcel(
  file: File
) {
  const workbook =
    XLSX.read(
      await file.arrayBuffer()
    );

  const sheet =
    workbook.Sheets[
      workbook.SheetNames[0]
    ];

  const rows =
    XLSX.utils.sheet_to_json(sheet, {
      header: 1,
    });

  return rows;
}