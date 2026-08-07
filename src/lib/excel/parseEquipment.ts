import * as XLSX from "xlsx";

import { EquipmentUsageRow } from "@/components/daily-report/types";
import { ImportedEquipmentRow } from "./importTypes";

import { ExcelAnchors } from "./findAnchors";

import { EQUIPMENT_COLUMNS } from "./excelConstants";

import {
  columnLetterToIndex,
  getMergedValue,
} from "./excelHelpers";

/* ==========================================================
   Equipment Parser
========================================================== */

export function parseEquipment(
  sheet: XLSX.WorkSheet,
  anchors: ExcelAnchors
): ImportedEquipmentRow[] {

  const equipment: ImportedEquipmentRow[] = [];

  /*
      Skip the section title and table header.
  */
  const startRow = anchors.equipment.row + 2;

  /*
      Equipment section ends where the
      Crew section begins.
  */
  const endRow = anchors.crew.row - 1;

  const equipmentCol = columnLetterToIndex(
    EQUIPMENT_COLUMNS.EQUIPMENT_NAME
  );

  const operatorCol = columnLetterToIndex(
    EQUIPMENT_COLUMNS.OPERATOR
  );

  const startReadingCol = columnLetterToIndex(
    EQUIPMENT_COLUMNS.START_READING
  );

  const endReadingCol = columnLetterToIndex(
    EQUIPMENT_COLUMNS.END_READING
  );

  const totalReadingCol = columnLetterToIndex(
    EQUIPMENT_COLUMNS.TOTAL_READING
  );

  const standbyCol = columnLetterToIndex(
    EQUIPMENT_COLUMNS.STANDBY_HOURS
  );

  const breakdownCol = columnLetterToIndex(
    EQUIPMENT_COLUMNS.BREAKDOWN_HOURS
  );

  for (let row = startRow; row <= endRow; row++) {

    const equipmentName = getMergedValue(
      sheet,
      row,
      equipmentCol
    );

    const operatorValue = getMergedValue(
  sheet,
  row,
  operatorCol
).trim();

const startReading = Number(
  getMergedValue(
    sheet,
    row,
    startReadingCol
  ) || 0
);

const endReading = Number(
  getMergedValue(
    sheet,
    row,
    endReadingCol
  ) || 0
);

const totalReading = Number(
  getMergedValue(
    sheet,
    row,
    totalReadingCol
  ) || (endReading - startReading)
);

const standbyHours = Number(
  getMergedValue(
    sheet,
    row,
    standbyCol
  ) || 0
);

const breakdownHours = Number(
  getMergedValue(
    sheet,
    row,
    breakdownCol
  ) || 0
);

/*
  Fuel Used is optional because not every
  Excel template contains it.
*/
const fuelUsed = 0;

    /*
        Ignore blank rows.
    */
    if (!equipmentName.trim()) {
      continue;
    }

    equipment.push({

    excelRow: row,

    equipmentName,

    operatorValue,

    equipment: {

        id: crypto.randomUUID(),

        equipmentId: "",

        operatorId: "",

        employeeAttendanceId: undefined,

        crewId: 0,

        crewMemberId: "",

        startReading,

        endReading,

        totalReading,

        standbyHours,

        breakdownHours,

        fuelUsed,

        remarks: "",

    },

});

  }

  return equipment;

}