import { DailyReportHook } from "../types/report";
import SectionCard from "../shared/SectionCard";

interface Props {
  report: DailyReportHook;
}

export default function GeneralInfoSection({ report }: Props) {
  const {
    bridges,

    report: dailyReport,

    setBridge,

    updateGeneralInfo,

} = report;

  return (
    <SectionCard title="General Information">
      {/* Bridge */}

      {/* Date */}

      {/* Site Engineer */}

      {/* Foreman */}

      {/* Project Manager */}

      {/* Weather */}
       <p>Coming soon...</p>
    </SectionCard>
  );
}