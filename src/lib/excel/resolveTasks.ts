// src/lib/excel/resolveTasks.ts

import {

  CrewRow,

} from "@/components/daily-report/types";

import {

  ImportedTask,

} from "./importTypes";

/* ==========================================================
   Resolve Tasks
========================================================== */

export function resolveTasks(

  crews: CrewRow[],

  tasks: ImportedTask[]

): CrewRow[] {

  return crews.map((crew) => ({

    ...crew,

    tasks: tasks

      .filter(

        (task) => task.crewCode === crew.crewCode

      )

      .map((task) => ({

        ...task.task,

        crewId: crew.id,

      })),

  }));

}