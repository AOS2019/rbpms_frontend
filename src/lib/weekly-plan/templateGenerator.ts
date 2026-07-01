// CPM Scheduler

import {
  ActivityTemplate,
  WeeklyPlanRow,
} from "./types";


// ...Date Helper
function addDays(
  date: Date,
  days: number
) {
  const result =
    new Date(date);

  result.setDate(
    result.getDate() + days
  );

  return result;
}

// ...Main Scheduler
export function generateSchedule(
  bridgeId: number,
  
  pkCode: string,

  template: ActivityTemplate[],

  projectStartDate: Date
): WeeklyPlanRow[] {

  const activityMap =
    new Map(
      template.map((a) => [
        a.code,
        a,
      ])
    );

  const scheduled =
    new Map<
      string,
      WeeklyPlanRow
    >();

  function scheduleActivity(
    code: string
  ) {

    if (
      scheduled.has(code)
    ) {
      return scheduled.get(
        code
      )!;
    }

    const activity =
      activityMap.get(code);

    if (!activity) {
      throw new Error(
        `Missing activity ${code}`
      );
    }

    let startDate =
      new Date(
        projectStartDate
      );

    if (
      activity.predecessors.length
    ) {

      let latestFinish =
        new Date(
          projectStartDate
        );

      for (
        const predecessor of
        activity.predecessors
      ) {

        const pred =
          scheduleActivity(
            predecessor
          );

        if (
          pred.plannedFinish >
          latestFinish
        ) {
          latestFinish =
            pred.plannedFinish;
        }
      }

      startDate =
        addDays(
          latestFinish,
          1
        );
    }

    const finishDate =
      addDays(
        startDate,
        activity.duration - 1
      );

    const row: WeeklyPlanRow =
      {
        bridgeId,
        
        pkCode,

        activityCode:
          activity.code,

        activity:
          activity.activity,

        element:
          activity.element,

        locationCode:
          activity.location,

        unit:
          activity.unit,

        plannedQty: 0,

        actualQty: 0,

        plannedStart:
          startDate,

        plannedFinish:
          finishDate,

        predecessors:
          activity.predecessors,

        completed: false,
      };

    scheduled.set(
      code,
      row
    );

    return row;
  }

  template.forEach(
    (activity) =>
      scheduleActivity(
        activity.code
      )
  );

  return Array.from(
    scheduled.values()
  );
}