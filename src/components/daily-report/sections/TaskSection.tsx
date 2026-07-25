import { DailyReportHook } from "../types/report";
import SectionCard from "../shared/SectionCard";

interface Props {
  report: DailyReportHook;
}

export default function TaskSection({

  report,

}: Props) {

  const {

    elements,

    piers,

    addTask,

    updateTask,

    removeTask,

  } = report;

  return (

    <SectionCard

      title="Task Description"

      actions={

        <button type="button" onClick={() => addTask({} as any)}>

          Add Task

        </button>

      }

    >

      {/* task table */}
        <p>Coming soon...</p>

    </SectionCard>

  );

}