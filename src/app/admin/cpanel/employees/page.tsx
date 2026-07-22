"use client";

import { useEffect, useState } from "react";

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<any[]>([]);

  const [form, setForm] = useState({
    staffId: "",
    firstName: "",
    lastName: "",
    trade: "",
    designation: "",
    phone: "",
  });

  const loadEmployees = async () => {
    const res = await fetch("/api/employees");
    const data = await res.json();

    setEmployees(Array.isArray(data.data) ? data.data : []);

  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const saveEmployee = async () => {
    await fetch("/api/employees", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    setForm({
      staffId: "",
      firstName: "",
      lastName: "",
      trade: "",
      designation: "",
      phone: "",
    });

    loadEmployees();
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-6">
        Employee Management
      </h1>

      <div className="bg-white rounded shadow p-4 mb-8">

        <h2 className="font-semibold mb-4">
          Add Employee
        </h2>

        <div className="grid md:grid-cols-3 gap-3">

          <input
            placeholder="Staff ID"
            value={form.staffId}
            onChange={(e) =>
              setForm({
                ...form,
                staffId: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) =>
              setForm({
                ...form,
                firstName: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) =>
              setForm({
                ...form,
                lastName: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Trade"
            value={form.trade}
            onChange={(e) =>
              setForm({
                ...form,
                trade: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Designation"
            value={form.designation}
            onChange={(e) =>
              setForm({
                ...form,
                designation: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) =>
              setForm({
                ...form,
                phone: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

        </div>

        <button
          onClick={saveEmployee}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Save Employee
        </button>

      </div>

      <div className="bg-white rounded shadow p-4">

        <h2 className="font-semibold mb-4">
          Employees
        </h2>

        <table className="w-full">

          <thead>
            <tr className="border-b bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="text-left p-2">Staff ID</th>
              <th className="text-left p-2">Name</th>
              <th className="text-left p-2">Trade</th>
              <th className="text-left p-2">Designation</th>
              <th className="text-left p-2">Phone</th>
            </tr>
          </thead>

          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id} className="border-b hover:bg-gray-100 transition duration-300 ease-in-out cursor-pointer">

                <td className="p-2 font-medium text-gray-900 whitespace-nowrap">
                  {employee.staffId}
                </td>

                <td className="p-2 font-medium text-gray-900 whitespace-nowrap">
                  {employee.firstName} {employee.lastName}
                </td>

                <td className="p-2 font-medium text-gray-900 whitespace-nowrap">
                  {employee.trade}
                </td>

                <td className="p-2 font-medium text-gray-900 whitespace-nowrap">
                  {employee.designation}
                </td>

                <td className="p-2 font-medium text-gray-900 whitespace-nowrap">
                  {employee.phone}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}