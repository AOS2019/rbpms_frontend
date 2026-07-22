import { ManpowerRow as Row } from "./types";

interface Props {
  row: Row;
  index: number;

  employees: any[];
  teams: any[];
  equipment: any[];

  mobile?: boolean;

  onChange: (
    index: number,
    field: keyof Row,
    value: any
  ) => void;

  onRemove: (index: number) => void;
}

const standardInputClass =
    "w-full p-2 border rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

export default function ManpowerRow({
  row,
  index,
  employees,
  teams,
  equipment,
  mobile = false,
  onChange,
  onRemove,
}: Props) {
  if (mobile) {
    return (
      <div className="space-y-3 border-b last:border-b-0 p-3 bg-white rounded shadow-sm flex flex-col justify-between gap-4">
        <div className="flex items-center gap-4 flex-wrap justify-start">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Non Employee
          </label>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={row.manualEmployee}
              onChange={(e) =>
                onChange(
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
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Staff ID
          </label>

          <input
            value={row.staffId}
            disabled={!row.manualEmployee}
            onChange={(e) =>
              onChange(index, "staffId", e.target.value)
            }
            className="w-full border rounded p-2"
            placeholder="Staff ID"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Staff/Employee Name
          </label>

          <input
            value={row.employeeName}
            disabled={!row.manualEmployee}
            onChange={(e) =>
              onChange(
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
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Employee ID
          </label>

          <select
            value={row.employeeId ?? ""}
            onChange={(e) => {
              const selectedId = e.target.value
                ? Number(e.target.value)
                : null;

              const employee = employees.find(
                (emp) => emp.id === selectedId
              );

              onChange(index, "employeeId", selectedId);

              onChange(
                index,
                "staffId",
                employee?.staffId ?? ""
              );

              onChange(
                index,
                "employeeName",
                employee
                  ? `${employee.firstName} ${employee.lastName}`
                  : ""
              );

              onChange(index, "manualEmployee", false);
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
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Team
          </label>

          <select
            value={row.teamId}
            onChange={(e) =>
              onChange(index, "teamId", e.target.value)
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
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Hours Worked
          </label>

          <input
            type="number"
            value={row.hoursWorked}
            onChange={(e) =>
              onChange(
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
          onClick={() => onRemove(index)}
          className="w-full bg-red-500 text-white py-2 rounded"
        >
          Remove Employee
        </button>
      </div>
    );
  }
  return (
    <tr
      key={index}
      className={`border-b last:border-b-0 justify-content text-center ${
        index % 2 === 0 ? "bg-white" : "bg-gray-50"
      }`}
    >
      {/* Manual Employee Checkbox */}
      <td className="p-2 align-top items-center justify-center gap-2 flex-wrap sm:justify-center sm:flex-nowrap">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={row.manualEmployee}
            onChange={(e) =>
              onChange(
                index,
                "manualEmployee",
                e.target.checked
              )
            }
          />
          Non-Employee
        </label>
      </td>
      <td className="p-2 align-top items-center justify-center gap-2 flex-wrap sm:justify-center sm:flex-nowrap">
        <input
          value={row.staffId}
          disabled={!row.manualEmployee}
          onChange={(e) =>
            onChange(
              index,
              "staffId",
              e.target.value
            )
          }
          className="border rounded p-2 w-full"
          placeholder="Staff ID"
        />
      </td>
      <td className="p-2 align-top items-center justify-center gap-2 flex-wrap sm:justify-center sm:flex-nowrap">
        <input
          value={row.employeeName}
          disabled={!row.manualEmployee}
          onChange={(e) =>
            onChange(
              index,
              "employeeName",
              e.target.value
            )
          }
          className="border rounded p-2 w-full"
          placeholder="Employee Name"
        />
      </td>

      {/* Employee Selection */}
      <td className="p-2 align-top items-center justify-center gap-2 flex-wrap sm:justify-center sm:flex-nowrap">
        <select
          value={row.employeeId ?? ""}
          onChange={(e) => {
            const selectedId = e.target.value
              ? Number(e.target.value)
              : null;

            const employee = employees.find(
              (emp) => emp.id === selectedId
            );

            onChange(
              index, 
              "employeeId",selectedId
            );

            onChange(
              index,
              "staffId",
              employee?.staffId ?? ""
            );

            onChange(
              index,
              "employeeName",
              employee
                ? `${employee.firstName} ${employee.lastName}`
                : ""
            );

            onChange(index, "manualEmployee", false);
          }}
          className="border rounded p-2 w-full"
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
      </td>

      <td className="p-2 align-top items-center justify-center gap-2 flex-wrap sm:justify-center sm:flex-nowrap">
        <select
          value={row.teamId}
          onChange={(e) =>
            onChange(
              index,
              "teamId",
              e.target.value
            )
          }
          className={`w-44 p-2 border rounded bg-white text-sm focus:outline-none`}
            aria-label={`Team ${index + 1}`}
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
      </td>

      <td className="p-2 align-top items-center justify-center gap-2 flex-wrap sm:justify-center sm:flex-nowrap">
        <input
          type="number"
          value={row.hoursWorked}
          className={`${standardInputClass}`}
                      placeholder="Hours Worked"
          onChange={(e) =>
            onChange(
              index,
              "hoursWorked",
              Number(e.target.value)
            )
          }
        />
      </td>

      <td className="p-2 align-top items-center justify-center gap-2 flex-wrap sm:justify-center sm:flex-nowrap">
        <button
          onClick={() => onRemove(index)}
          className="w-full sm:w-auto bg-red-500 text-white px-3 py-1 rounded"
        >
          Remove
        </button>
      </td>

    </tr>
  );
}