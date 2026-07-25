import { DailyReportHook } from "./types/report";
import SectionCard from "./shared/SectionCard";

interface Props {
  report: DailyReportHook;
}

export default function DailyReportToolbar({

  report,

}: Props) {

  return (

    <div className="flex justify-end gap-3 mb-6">

      {/* Upload */}

      {/* Export */}

      {/* Import */}

      {/* Print */}

    </div>

  );

}