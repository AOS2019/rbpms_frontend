"use client";

import { useState, useEffect } from "react";

import { WeeklyPlanRow } from "@/components/weekly-plan/types";

export default function WeeklyPlanPage() {
  // Initial State
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");
  const [rows, setRows] = useState<WeeklyPlanRow[]>([]);
  const [bridges, setBridges] = useState<any[]>([]);

  //Load Bridges
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/bridges");

      const data = await res.json();

      setBridges(data.data || []);
    }
    load();
  }, []);

  //Add Row
  const addRow = () => {
    setRows([
      ...rows,
      {
        bridgeId: 0,
        pkCode: "",

        locationCode: "",
        activity: "",
        unit: "",
        plannedQty: 0,
        actualQty: 0,
        plannedStart: "",
        plannedFinish: "",
        completed: false,
      },
    ]);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Weekly Plan</h1>

        <div className="flex gap-2">
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Import Excel
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Export Excel
          </button>
        </div>
      </div>

      <table className="w-full border">
        <thead>
          <tr>
            <th>Bridge</th>
            <th>Location</th>
            <th>Activity</th>
            <th>Unit</th>
            <th>Plan Qty</th>
            <th>Actual Qty</th>
            <th>Start</th>
            <th>Finish</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <select>
                  {bridges.map((bridge) => (
                    <option key={bridge.id} value={bridge.id}>
                      {bridge.pk_code}
                    </option>
                  ))}
                </select>
              </td>

              <td>
                <input />
              </td>

              <td>
                <input />
              </td>

              <td>
                <input />
              </td>

              <td>
                <input type="number" />
              </td>

              <td>
                <input type="number" />
              </td>

              <td>
                <input type="date" />
              </td>

              <td>
                <input type="date" />
              </td>

              <td>{row.actualQty >= row.plannedQty ? "🟢" : "🔴"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
