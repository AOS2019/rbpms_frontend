"use client";

import { useState, useEffect } from "react";

import { WeeklyPlanRow } from "@/lib/weekly-plan/types";

import { generateOverbridgePlan } from "@/lib/weekly-plan/generateOverbridgePlan";

export default function WeeklyPlanPage() {
  // Initial State
  const [weekStart, setWeekStart] = useState("");
  const [weekEnd, setWeekEnd] = useState("");

  const [selectedBridgeId, setSelectedBridgeId] = useState<number>(0);

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
        plannedStart: new Date(),
        plannedFinish: new Date(),
        completed: false,
      },
    ]);
  };

  const formatDate = (date: Date) => date.toISOString().split("T")[0];

  const handleGenerateWeeklyPlan = () => {
    if (!selectedBridgeId) {
      alert(
        "Please select a bridge first"
      );
      return;
    }

    const selectedBridge =
      bridges.find(
        (b) =>
          b.id === selectedBridgeId
      );

    if (!selectedBridge) {
      alert("Bridge not found");
      return;
    }

    const generatedRows =
      generateOverbridgePlan(
        selectedBridge.id,
        selectedBridge.pk_code,
        new Date()
      );

    setRows(generatedRows);
  };

  const updateRow = (
    index: number,
    field: keyof WeeklyPlanRow,
    value: any
  ) => {
    const updated = [...rows];

    updated[index] = {
      ...updated[index],
      [field]: value,
    };

    setRows(updated);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Weekly Plan</h1>

        <div className="flex gap-2 items-center">
          <select
            value={selectedBridgeId}
            onChange={(e) =>
              setSelectedBridgeId(
                Number(e.target.value)
              )
            }
            className="border px-3 py-2 rounded"
          >
            <option value="">
              Select Overbridge
            </option>

            {bridges
              .filter(
                (b) =>
                  b.bridgeType ===
                  "OVERBRIDGE"
              )
              .map((bridge) => (
                <option
                  key={bridge.id}
                  value={bridge.id}
                >
                  {bridge.pk_code}
                </option>
              ))}
          </select>
          <button className="bg-green-600 text-white px-4 py-2 rounded">
            Import Excel
          </button>

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Export Excel
          </button>
          <button
            onClick={
              handleGenerateWeeklyPlan
            }
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Generate Weekly Plan
          </button>
        </div>
      </div>

      <div className="flex justify-end m-4">
        <button
          onClick={addRow}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Add Row +
        </button>
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 border-b-2 border-gray-400">
            <th className="border px-4 py-2 text-left font-semibold">Bridge</th>
            <th className="border px-4 py-2 text-left font-semibold">Location</th>
            <th className="border px-4 py-2 text-left font-semibold">Element</th>
            <th className="border px-4 py-2 text-left font-semibold">Activity</th>
            <th className="border px-4 py-2 text-left font-semibold">Unit</th>
            <th className="border px-4 py-2 text-left font-semibold">Plan Qty</th>
            <th className="border px-4 py-2 text-left font-semibold">Actual Qty</th>
            <th className="border px-4 py-2 text-left font-semibold">Start</th>
            <th className="border px-4 py-2 text-left font-semibold">Finish</th>
            <th className="border px-4 py-2 text-left font-semibold">Status</th>
            <th className="border px-4 py-2 text-left font-semibold">Variance</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2">
                <select
                  value={row.bridgeId}
                  onChange={(e) => {
                    const bridge = bridges.find(
                      (b) => b.id === Number(e.target.value)
                    );

                    updateRow(
                      index,
                      "bridgeId",
                      Number(e.target.value)
                    );

                    updateRow(
                      index,
                      "pkCode",
                      bridge?.pk_code || ""
                    );
                  }}
                  className="w-30 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {bridges.map((bridge) => (
                    <option
                      key={bridge.id}
                      value={bridge.id}
                    >
                      {bridge.pk_code}
                    </option>
                  ))}
                </select>
              </td>

              <td className="px-4 py-2">
                <input
                  value={row.locationCode}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "locationCode",
                      e.target.value
                    )
                  }
                  className="w-full p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td className="px-4 py-2">
                <input
                  value={row.element || ""}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "element",
                      e.target.value
                    )
                  }
                  className="w-24 p-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td>
                <input
                  value={row.activity}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "activity",
                      e.target.value
                    )
                  }
                  className="w-60 p-2 border-gray-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td>
                <input
                  value={row.unit}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "unit",
                      e.target.value
                    )
                  }
                  className="w-12 p-2 border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td>
                <input
                  type="number"
                  value={row.plannedQty}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "plannedQty",
                      Number(e.target.value)
                    )
                  }
                  className="w-30 p-2 border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td className="">
                <input
                  type="number"
                  value={row.actualQty}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "actualQty",
                      Number(e.target.value)
                    )
                  }
                  className="w-30 p-2 border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td>
                <input
                  type="date"
                  value={
                    row.plannedStart
                      ? new Date(row.plannedStart).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    updateRow(
                      index,
                      "plannedStart",
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                  className="w-30 p-2 border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td>
                <input
                  type="date"
                  value={
                    row.plannedFinish
                      ? new Date(row.plannedFinish).toISOString().slice(0, 10)
                      : ""
                  }
                  onChange={(e) =>
                    updateRow(
                      index,
                      "plannedFinish",
                      e.target.value ? new Date(e.target.value) : null
                    )
                  }
                  className="w-30 p-2 border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td
                  className="p-2 text-sm text-center">{row.plannedQty > 0 && row.actualQty >= row.plannedQty ? "🟢" : "🔴"} </td>

              <td>
                <input
                  value={row.varianceReason || ""}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "varianceReason",
                      e.target.value
                    )
                  }
                  className="w-50 p-2 border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
