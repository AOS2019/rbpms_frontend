import { DailyReportHook } from "../types/report";
import SectionCard from "../shared/SectionCard";

interface Props {
  report: DailyReportHook;
}

export default function CrewDeploymentSection({

  report,

}: Props) {

  const {

    availableCrews,

    addCrew,

    removeCrew,

    populateCrewMembers,

    addBorrowedCrewMember,

    updateCrewMember,

    removeCrewMember,

  } = report;

  return (

    <SectionCard

      title="Crew Deployment"

      actions={

        <button type="button" onClick={() => addCrew({} as any)}>

          Add Crew

        </button>

      }

    >

      {/* crew cards */}
      <p>Coming soon...</p>

    </SectionCard>

  );

}