export interface DailyReportExcelData {
  id: number;

  date: string;

  siteEngineer: string;
  foreman: string;
  projectManager: string;
  weather: string;

  bridge: {
    id: number;
    pk_code: string;
    location?: string;
  };

  manpower: {
    staffId: string;
    employeeName: string;
    trade?: string;
    teamName: string;
    hoursWorked: number;
    remarks?: string;
  }[];

  activities: {
    teamName: string;
    activity: string;
    pierNumber?: string;
    quantityDone?: number;
    unit?: string;
    concreteGrade?: string;
    elementName?: string;
  }[];
}