import {
  overbridgeTemplate,
} from "./templates/overbridgeTemplate";

import {
  generateSchedule,
} from "./templateGenerator";
import { WeeklyPlanRow } from "./types";

export function generateOverbridgePlan( bridgeId: number, pkCode: string, startDate: Date): WeeklyPlanRow[] {

  return generateSchedule( bridgeId, pkCode, overbridgeTemplate, startDate);
}
