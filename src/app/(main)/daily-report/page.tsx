"use client";

import DailyReportHeader from "@/components/daily-report/DailyReportHeader";
import DailyReportToolbar from "@/components/daily-report/DailyReportToolbar";

import GeneralInfoSection from "@/components/daily-report/sections/GeneralInfoSection";
import AttendanceSection from "@/components/daily-report/sections/AttendanceSection";
import CrewDeploymentSection from "@/components/daily-report/sections/CrewDeploymentSection";
import EquipmentSection from "@/components/daily-report/sections/EquipmentSection";
import TaskSection from "@/components/daily-report/sections/TaskSection";

import { useDailyReport } from "@/components/daily-report/hooks/useDailyReport";

export default function DailyReportPage() {
  const report = useDailyReport();

  if (report.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">

        <DailyReportHeader />

        <DailyReportToolbar report={report} />

        <GeneralInfoSection report={report} />

        <AttendanceSection report={report} />

        <CrewDeploymentSection report={report} />

        <EquipmentSection report={report} />

        <TaskSection report={report} />

        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={report.saveReport}
            disabled={report.saving}
            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg"
          >
            {report.saving ? "Saving..." : "Save Daily Report"}
          </button>
        </div>

      </div>
    </div>
  );
}