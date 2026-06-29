import { OVERBRIDGE_TEMPLATES } from "./overbridgeTemplates";

export function getNextActivities(
  completedActivities: string[]
) {
  return OVERBRIDGE_TEMPLATES.filter(
    (activity) =>
      activity.predecessors.every(
        (pred) =>
          completedActivities.includes(pred)
      )
  );
}