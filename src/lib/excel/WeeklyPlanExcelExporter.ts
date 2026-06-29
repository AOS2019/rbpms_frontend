import ExcelJS from "exceljs";

export async function
exportWeeklyPlanExcel(
 rows:any[]
){
 const workbook =
  new ExcelJS.Workbook();

 const sheet =
  workbook.addWorksheet(
   "Weekly Plan"
  );

 sheet.addRow([
   "PK Code",
   "Activity",
   "Unit",
   "Week Plan",
   "Week Real",
   "Variance"
 ]);

 rows.forEach(row=>{
   sheet.addRow([
     row.pkCode,
     row.activity,
     row.unit,
     row.weekPlan,
     row.weekReal,
     row.rootCauseVariance
   ]);
 });

 return workbook;
}