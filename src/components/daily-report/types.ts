export interface ActivityRow {
  teamId: number | string;
  bridge: string;
  pier: string;

  elementId?: number;

  activity: string;
  quantity: number;
  unit: string;
  grade: string;
  
  errors?: Record<string, string>;
}

export interface ManpowerRow {
  employeeId?: number | null;

  staffId: string;
  employeeName: string;

  manualEmployee: boolean;

  teamId: string;

  hoursWorked: number;

  equipmentId: string;

  remarks: string;
}