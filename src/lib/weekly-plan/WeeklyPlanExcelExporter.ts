import ExcelJS from "exceljs";
import { WeeklyPlanRow } from "./types";

export async function exportWeeklyPlanExcel(
  rows: WeeklyPlanRow[],
  weekDates: Date[],
  weekNumber = "",
  project = "Kano-Maradi",
  section = "SECTION 01"
) {
  const workbook = new ExcelJS.Workbook();

  const sheet =
    workbook.addWorksheet(
      "Weekly Plan",
      {
        views: [
          {
            state: "frozen",
            ySplit: 6,
            xSplit: 5,
          },
        ],
      }
    );

    //---------------------------------------------------
    // Column widths
    //---------------------------------------------------

    sheet.columns = [
      { width: 8 },   // PK
      { width: 18 },  // Location
      { width: 18 },  // Element
      { width: 35 },  // Activity
      { width: 10 },  // Unit

      ...weekDates.flatMap(() => [
        { width: 8 },
        { width: 8 },
      ]),

      { width: 10 }, // Week Plan
      { width: 10 }, // Week Real
      { width: 12 }, // Status
      { width: 30 }, // Variance
    ];

    //---------------------------------------------------
    // HEADER
    //---------------------------------------------------

    sheet.mergeCells("A1:V1");

    sheet.getCell("A1").value =
      "Kano–Maradi | Single Track Standard Gauge Railway Line";

    sheet.getCell("A1").font = {
      bold: true,
      size: 16,
    };

    sheet.getCell("A1").alignment = {
      horizontal: "center",
    };

    sheet.getCell("A2").value = "Project";

    sheet.getCell("B2").value = project;

    sheet.getCell("D2").value = "Week";

    sheet.getCell("E2").value = weekNumber;

    sheet.getCell("G2").value = "Section";

    sheet.getCell("H2").value = section;

    //---------------------------------------------------
    // HEADER ROW
    //---------------------------------------------------

    let col = 6;

    sheet.mergeCells(4,1,5,1);
    sheet.mergeCells(4,2,5,2);
    sheet.mergeCells(4,3,5,3);
    sheet.mergeCells(4,4,5,4);
    sheet.mergeCells(4,5,5,5);

    sheet.getCell("A4").value="Bridge";
    sheet.getCell("B4").value="Location";
    sheet.getCell("C4").value="Element";
    sheet.getCell("D4").value="Activity";
    sheet.getCell("E4").value="Unit";

    weekDates.forEach(date=>{

        sheet.mergeCells(
            4,
            col,
            4,
            col+1
        );

        sheet.getCell(4,col).value =
            date.toLocaleDateString(
                "en-GB",
                {
                    weekday:"long",
                    day:"2-digit",
                    month:"2-digit"
                }
            );

        sheet.getCell(5,col).value="Plan";
        sheet.getCell(5,col+1).value="Real";

        col+=2;

    });

    sheet.mergeCells(
        4,
        col,
        5,
        col
    );

    sheet.getCell(4,col).value="Week Plan";

    col++;

    sheet.mergeCells(
        4,
        col,
        5,
        col
    );

    sheet.getCell(4,col).value="Week Real";

    col++;

    sheet.mergeCells(
        4,
        col,
        5,
        col
    );

    sheet.getCell(4,col).value="Week Completed";

    col++;

    sheet.mergeCells(
        4,
        col,
        5,
        col
    );

    sheet.getCell(4,col).value="Root Cause of Variance";

    //---------------------------------------------------
    // HEADER STYLE
    //---------------------------------------------------

    [4,5].forEach(r=>{

        sheet.getRow(r).eachCell(cell=>{

            cell.font={
                bold:true
            };

            cell.alignment={
                horizontal:"center",
                vertical:"middle",
                wrapText:true
            };

            cell.fill={
                type:"pattern",
                pattern:"solid",
                fgColor:{
                    argb:"D9E2F3"
                }
            };

            cell.border={
                top:{style:"thin"},
                left:{style:"thin"},
                bottom:{style:"thin"},
                right:{style:"thin"},
            };

        });

    });

    //---------------------------------------------------
    // DATA
    //---------------------------------------------------

    let rowNo=6;

    rows.forEach(r=>{

        const excelRow=
            sheet.getRow(rowNo);

        excelRow.getCell(1).value=r.pkCode;
        excelRow.getCell(2).value=r.locationCode;
        excelRow.getCell(3).value=r.element;
        excelRow.getCell(4).value=r.activity;
        excelRow.getCell(5).value=r.unit;

        let c=6;

        r.dailyEntries.forEach(day=>{

            excelRow.getCell(c).value=
                day.plannedQty;

            excelRow.getCell(c+1).value=
                day.actualQty;

            c+=2;

        });

        excelRow.getCell(c).value=r.plannedQty;

        excelRow.getCell(c+1).value=r.actualQty;

        const completed=
            r.plannedQty>0 &&
            r.actualQty>=r.plannedQty;

        excelRow.getCell(c+2).value=
            completed
                ? "YES"
                : "NO";

        excelRow.getCell(c+3).value=
            r.varianceReason || "";

        excelRow.getCell(c+2).fill={
            type:"pattern",
            pattern:"solid",
            fgColor:{
                argb:completed
                    ?"92D050"
                    :"FF0000"
            }
        };

        excelRow.eachCell(cell=>{

            cell.border={
                top:{style:"thin"},
                left:{style:"thin"},
                right:{style:"thin"},
                bottom:{style:"thin"},
            };

            cell.alignment={
                horizontal:"center",
                vertical:"middle",
            };

        });

        rowNo++;

    });

    return workbook;
}