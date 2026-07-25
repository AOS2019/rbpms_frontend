import { DailyReportHook } from "../types/report";
import SectionCard from "../shared/SectionCard";

interface Props {
  report: DailyReportHook;
}

export default function AttendanceSection({
  report,
}: Props) {

  const {

    updateAttendance,

  } = report;

  return (

    <SectionCard title="Attendance">

      {/* attendance table */}
        <p>Coming soon...</p>

    </SectionCard>

  );

}