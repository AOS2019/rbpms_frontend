import { DailyReportHook } from "../types/report";
import SectionCard from "../shared/SectionCard";

interface Props {
  report: DailyReportHook;
}

export default function EquipmentSection({

  report,

}: Props) {

  const {

    equipment,
    
    availableOperators,

    addEquipment,

    updateEquipment,

    removeEquipment,

  } = report;

  return (

    <SectionCard

      title="Equipment"

      actions={

        <button type="button" onClick={() => addEquipment(0)}>

          Add Equipment

        </button>

      }

    >

      {/* equipment table */}
      <p>Coming soon...</p>

    </SectionCard>

  );

}