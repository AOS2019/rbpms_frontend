export interface WeeklyPlanRow {
  id?: number;

  bridgeId: number;

  pkCode: string;

  locationCode: string;

  activity: string;

  unit: string;

  plannedQty: number;

  actualQty: number;

  plannedStart: string;

  plannedFinish: string;

  varianceReason?: string;

  completed: boolean;
}