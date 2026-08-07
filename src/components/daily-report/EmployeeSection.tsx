"use client";

import { EmployeeAttendanceRow, AttendanceStatus } from "./types";

interface EmployeeSectionProps {
  attendance: EmployeeAttendanceRow[];
  setAttendance: React.Dispatch<
    React.SetStateAction<EmployeeAttendanceRow[]>
  >;
}

const attendanceOptions: AttendanceStatus[] = [
  "PRESENT",
  "ABSENT",
  "LEAVE",
  "MISSION",
  "SICK",
  "JUSTIFIED_ABSENCE",
];

export default function EmployeeSection({
  attendance,
  setAttendance,
}: EmployeeSectionProps) {
  function updateAttendance<
    K extends keyof EmployeeAttendanceRow
  >(
    index: number,
    field: K,
    value: EmployeeAttendanceRow[K]
  ) {
    setAttendance((prev) => {
      const rows = [...prev];

      rows[index] = {
        ...rows[index],
        [field]: value,
      };

      return rows;
    });
  }

  function attendanceColor(status: AttendanceStatus) {
    switch (status) {
      case "PRESENT":
        return "bg-green-100 text-green-700";

      case "MISSION":
        return "bg-blue-100 text-blue-700";

      case "LEAVE":
        return "bg-yellow-100 text-yellow-700";

      case "SICK":
        return "bg-orange-100 text-orange-700";

      case "ABSENT":
        return "bg-red-100 text-red-700";

      default:
        return "bg-gray-100 text-gray-700";
    }
  }

  return (
    <section className="bg-white rounded-lg shadow-sm p-5">

      <div className="flex items-center justify-between mb-5">

        <div>

          <h2 className="text-lg font-semibold">
            Employee Register
          </h2>

          <p className="text-sm text-gray-500">
            Attendance register for all employees assigned to this bridge.
          </p>

        </div>

        <span className="text-sm font-medium">
          {attendance.length} Employees
        </span>

      </div>

      {/* Desktop */}

      <div className="hidden lg:block overflow-x-auto">

        <table className="min-w-full border border-gray-200">

          <thead className="bg-gray-100">

            <tr>

              <th className="px-3 py-2 text-left">Staff ID</th>

              <th className="px-3 py-2 text-left">Employee</th>

              <th className="px-3 py-2 text-left">Trade</th>

              <th className="px-3 py-2 text-left"> Attendance </th>

              <th className="px-3 py-2 text-left"> Permanent Crew </th>

            </tr>

          </thead>

          <tbody>

            {attendance.map((employee, index) => (

              <tr
                key={employee.employeeId}
                className="border-t"
              >

                <td className="px-3 py-2">
                  {employee.staffId}
                </td>

                <td className="px-3 py-2">
                  {employee.employeeName}
                </td>

                <td className="px-3 py-2">
                  {employee.trade}
                </td>

                <td className="px-3 py-2">

                  <select
                    value={employee.attendanceStatus}
                    onChange={(e) =>
                      updateAttendance(
                        index,
                        "attendanceStatus",
                        e.target
                          .value as AttendanceStatus
                      )
                    }
                    className={`rounded px-2 py-1 ${attendanceColor(
                      employee.attendanceStatus
                    )}`}
                  >

                    {attendanceOptions.map((status) => (

                      <option
                        key={status}
                        value={status}
                      >
                        {status}
                      </option>

                    ))}

                  </select>

                </td>

                <td className="px-3 py-2">
                  {employee.permanentCrewCode ?? "-"}
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

      {/* Mobile */}

      <div className="lg:hidden space-y-4">

        {attendance.map((employee, index) => (

          <div
            key={employee.employeeId}
            className="border rounded-lg p-4 space-y-3"
          >

            <div>

              <p className="text-sm text-gray-500">
                {employee.staffId}
              </p>

              <p className="font-semibold">
                {employee.employeeName}
              </p>

            </div>

            <div className="grid grid-cols-2 gap-3">

              <div>

                <label className="text-xs text-gray-500">
                  Trade
                </label>

                <p>{employee.trade}</p>

              </div>

              <div>

                <label className="text-xs text-gray-500">
                  Permanent Crew
                </label>

                <p>
                  {employee.permanentCrewCode ?? "-"}
                </p>

              </div>

            </div>

            <select
              value={employee.attendanceStatus}
              onChange={(e) =>
                updateAttendance(
                  index,
                  "attendanceStatus",
                  e.target.value as AttendanceStatus
                )
              }
              className={`w-full rounded p-2 ${attendanceColor(
                employee.attendanceStatus
              )}`}
            >
              {attendanceOptions.map((status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status}
                </option>
              ))}
            </select>

          </div>

        ))}

      </div>

    </section>
  );
}