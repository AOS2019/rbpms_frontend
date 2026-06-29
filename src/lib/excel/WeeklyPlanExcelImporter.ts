import * as XLSX from "xlsx";

export async function
parseWeeklyPlanExcel(
 file: File
){

 const workbook =
  XLSX.read(
   await file.arrayBuffer()
 );

 const sheet =
  workbook.Sheets[
   workbook.SheetNames[0]
 ];

 return XLSX.utils.sheet_to_json(
  sheet
 );
}