// src/lib/excel/resolveEquipment.ts

import {

  CrewRow,

} from "@/components/daily-report/types";

import {

  ImportedEquipmentRow,

} from "./importTypes";

/* ==========================================================
   Resolve Equipment
========================================================== */

export function resolveEquipment(

  crews: CrewRow[],

  importedEquipment: ImportedEquipmentRow[]

): CrewRow[] {

  return crews.map((crew) => ({

    ...crew,

    equipment: importedEquipment

      .filter(

        (item) =>

          crew.members.some(

            (member) =>

              member.staffId === item.operatorValue ||

              member.employeeName === item.operatorValue

          )

      )

      .map((item) => item.equipment),

  }));

}