export interface ActivityTemplate {
  code: string;

  activity: string;

  element: string;

  location: string;

  unit: string;

  duration: number;

  predecessors: string[];
}

export interface DailyQuantity {
  date: string;

  plannedQty: number;

  actualQty: number;
}

export interface WeeklyPlanRow {
  id?: number;

  bridgeId: number;

  pkCode: string;

  activityCode?: string;

  activity: string;

  element?: string;

  locationCode: string;

  unit: string;

  plannedQty: number;

  actualQty: number;

  plannedStart: Date;

  plannedFinish: Date;
  
  dailyEntries: DailyQuantity[];

  predecessors?: string[];

  varianceReason?: string;

  completed: boolean;
}
export interface ScheduleNode {
  activity: ActivityTemplate;

  earliestStart: Date;

  earliestFinish: Date;
}


export interface EquipmentUsageRow {

    equipmentId: number;

    operatorId?: number;

    equipmentCode?: string;

    equipmentName?: string;

    operatorName?: string;

    startReading: number;

    endReading: number;

    totalReading: number;

    standbyHours: number;

    breakdownHours: number;

}