import { OVERBRIDGE_TEMPLATES } from "./overbridgeTemplates";

export function generateWeeklyPlan(
  bridgeId: number,
  pkCode: string
) {
  return OVERBRIDGE_TEMPLATES.map(
    (template) => ({
      bridgeId,
      activity: template.activity,
      unit: template.unit,

      plannedQty: 0,

      weekPlan: 0,
      weekReal: 0,

      varianceReason: "",

      weekCompleted: false,

      pkCode,
    })
  );
}