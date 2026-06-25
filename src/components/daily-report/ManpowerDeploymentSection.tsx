"use client";

import { useEffect } from "react";
import ManpowerRow from "./ManpowerRow";
import { ManpowerRow as Row } from "./types";

interface Props {
  index: number;
  rows: Row[];
  setRows: React.Dispatch<
    React.SetStateAction<Row[]>
  >;

  employees: any[];
  teams: any[];
  equipment: any[];
  mobile?: boolean;
}

export default function ManpowerDeploymentSection({
  index,
  rows,
  setRows,
  employees,
  teams,
  equipment,
  mobile = false
}: Props) {

  useEffect(() => {
    if (rows.length === 0) {
      setRows([
        {
          employeeId: null,
          staffId: "",
          employeeName: "",
          manualEmployee: false,
          teamId: "",
          hoursWorked: 0,
          equipmentId: "",
          remarks: "",
        },
      ]);
    }
  }, [rows, setRows]);

  const addRow = () => {
    setRows([
      ...rows,
      {
        employeeId: null,
        staffId: "",
        employeeName: "",
        manualEmployee: false,
        teamId: "",
        hoursWorked: 0,
        equipmentId: "",
        remarks: "",
      },
    ]);
  };

  const removeRow = (index: number) => {
    setRows(
      rows.filter((_, i) => i !== index)
    );
  };

  const updateRow = (
    index: number,
    field: keyof Row,
    value: any
  ) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index
          ? {
              ...row,
              [field]: value,
            }
          : row
      )
    );
  };

  if (mobile) {
    return (
      <div className="space-y-3 border-b last:border-b-0 p-3 bg-white rounded shadow-sm flex flex-col justify-between gap-4 mb-6 border border-gray-200">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 mb-4 items-center justify-start flex-wrap">
          <label className="block text-xs font-medium text-gray-600 mb-1 sm:col-span-2 flex items-center gap-2 justify-start">
            Non Employee
          </label>

          <label className="flex items-center gap-2 justify-start sm:col-span-1">
            <input
              type="checkbox"
              checked={rows[index]?.manualEmployee}
              onChange={(e) =>
                  updateRow(
                    index,
                    "manualEmployee",
                    e.target.checked
                  )
                }
            />
            Non-Employee
          </label>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1 sm:col-span-2 flex items-center gap-2 justify-start">
            Staff ID
          </label>

          <input
            value={rows[index]?.staffId}
            disabled={!rows[index]?.manualEmployee}
            onChange={(e) =>
              updateRow(index, "staffId", e.target.value)
            }
            className="w-full border rounded p-2"
            placeholder="Staff ID"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1 sm:col-span-2 flex items-center gap-2 justify-start">
            Staff/Employee Name
          </label>

          <input
            value={rows[index]?.employeeName}
            disabled={!rows[index]?.manualEmployee}
            onChange={(e) =>
              updateRow(
                index,
                "employeeName",
                e.target.value
              )
            }
            className="w-full border rounded p-2"
            placeholder="Staff/Employee Name"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1 sm:col-span-2 flex items-center gap-2 justify-start">
            Employee ID
          </label>

          <select
            value={rows[index]?.employeeId ?? ""}
            onChange={(e) => {
              const selectedId = e.target.value
                ? Number(e.target.value)
                : null;

              const employee = employees.find(
                (emp) => emp.id === selectedId
              );

              updateRow(index, "employeeId", selectedId);

              updateRow(
                index,
                "staffId",
                employee?.staffId ?? ""
              );

              updateRow(
                index,
                "employeeName",
                employee
                  ? `${employee.firstName} ${employee.lastName}`
                  : ""
              );

              updateRow(index, "manualEmployee", false);
            }}
            className="w-full border rounded p-2"
          >
            <option value="">
              Select Employee
            </option>

            {employees.map((employee) => (
              <option
                key={employee.id}
                value={employee.id}
              >
                {employee.staffId}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1 sm:col-span-2 flex items-center gap-2 justify-start">
            Team
          </label>

          <select
            value={rows[index]?.teamId}
            onChange={(e) =>
              updateRow(index, "teamId", e.target.value)
            }
            className="w-full border rounded p-2"
          >
            <option value="">
              Select Team
            </option>

            {teams.map((team) => (
              <option
                key={team.id}
                value={team.id}
              >
                {team.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1 sm:col-span-2 flex items-center gap-2 justify-start">
            Hours Worked
          </label>

          <input
            type="number"
            value={rows[index]?.hoursWorked}
            onChange={(e) =>
              updateRow(
                index,
                "hoursWorked",
                Number(e.target.value)
              )
            }
            className="w-full border rounded p-2"
            placeholder="Hours Worked"
          />
        </div>

        <button
          onClick={() => removeRow(index)}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Remove Employee
        </button>
      </div>
    );
  }

  return (
    <section className="bg-white p-4 md:p-6 rounded-lg shadow-sm mt-6 mb-6 border border-gray-200">
      {/* DESKTOP VIEW */}
      <div className="hidden md:flex overflow-x-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 px-1 sm:px-0">

        <h2 className="text-lg font-semibold text-gray-700 mb-2 sm:mb-0 flex items-center gap-2 justify-start sm:justify-start w-full sm:w-auto">
          Manpower Deployment
        </h2>

        <button
          onClick={addRow}
          className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2"
        >
          Add Employee
        </button>

      </div>

      <table  className="w-full min-w-[900px] border-collapse text-center text-sm text-gray-700 mb-4 overflow-x-auto">

        <thead>
          <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider border-gray-200 border-b text-center">
            <th className="p-3 sticky top-0 bg-gray-100 z-20">Staff Check</th>
            <th className="p-3 sticky top-0 bg-gray-100 z-20">Staff ID</th>
            <th className="p-3 sticky top-0 bg-gray-100 z-20">Name</th>
            <th className="p-3 sticky top-0 bg-gray-100 z-20">Employee ID</th>
            <th className="p-3 sticky top-0 bg-gray-100 z-20">Team</th>
            <th className="p-3 sticky top-0 bg-gray-100 z-20">Hours</th>
            <th></th>
          </tr>
        </thead>

        <tbody className="text-gray-700 text-sm divide-y divide-gray-200 border-gray-200 border-b last:border-b-0">

          {rows.map((row, index) => (
            <ManpowerRow
              key={index}
              row={row}
              index={index}
              employees={employees}
              teams={teams}
              equipment={equipment}
              onChange={updateRow}
              onRemove={removeRow}
            />
          ))}

        </tbody>

      </table>

    </section>
  );
}