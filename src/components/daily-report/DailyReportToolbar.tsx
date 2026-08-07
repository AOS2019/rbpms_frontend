// src\components\daily-report\DailyReportToolbar.tsx

import { useRef } from "react";

import { Upload, Download, CalendarSync, Eye, Printer } from "lucide-react";

import { DailyReportHook } from "./types/report";

import { parseDailyReportExcel } from "@/lib/excel/dailyReportImporter";
import { mergeImportedReport } from "@/lib/excel/mergeImportedReport";

interface Props {
  report: DailyReportHook;
}

export default function DailyReportToolbar({ report }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
  //   const file = event.target.files?.[0];

  //   if (!file) return;

  //   try {
  //     /*
  //     Parse workbook
  //   */

  //     const importedReport = await parseDailyReportExcel(file);

  //     /*
  //     Merge imported data with
  //     application's master data.
  //   */

  //     const mergedReport = mergeImportedReport({
  //       importedReport,

  //       bridges: report.bridges,

  //       employees: report.employees,

  //       equipment: report.equipment,

  //       availableCrews: report.availableCrews,
  //     });

  //     /*
  //     Update report state
  //   */

  //     report.setReport(mergedReport);

  //     alert("Daily Report imported successfully.");
  //   } catch (error) {
  //     console.error(error);

  //     alert("Failed to import Daily Report.");
  //   } finally {
  //     event.target.value = "";
  //   }
  // }

  return (
    <div className="flex flex-wrap justify-end gap-3 mb-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls"
        hidden
        onChange={async (e) => {
          const file = e.target.files?.[0];

          if (!file) return;

          await report.importDailyReport(file);

          e.target.value = "";
        }}
      />
      {/* Upload Daily Report */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
      >
        <Upload size={18} />
        Upload Excel
      </button>

      {/* Export Daily Report */}
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
      >
        <Download size={18} />
        Export Excel
      </button>

      {/* Weekly Plan */}
      <button
        type="button"
        onClick={() => {
          const weekStart = prompt("Week Start (YYYY-MM-DD)");

          if (weekStart) {
            report.importWeeklyPlan(weekStart);
          }
        }}
        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
      >
        <CalendarSync size={18} />
        Import Weekly Plan
      </button>

      {/* Preview */}
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
      >
        <Eye size={18} />
        Preview
      </button>

      {/* Print */}
      <button
        type="button"
        className="flex items-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm hover:bg-gray-100"
      >
        <Printer size={18} />
        Print
      </button>
    </div>
  );
}
