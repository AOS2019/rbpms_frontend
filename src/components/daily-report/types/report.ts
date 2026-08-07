// src\components\daily-report\types\report.ts

export type DailyReportHook = ReturnType<
  typeof import("../hooks/useDailyReport").useDailyReport
>;