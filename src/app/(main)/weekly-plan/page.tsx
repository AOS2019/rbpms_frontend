"use client";

import { useState, useEffect, Fragment } from "react";

import { WeeklyPlanRow } from "@/lib/weekly-plan/types";

import { generateOverbridgePlan } from "@/lib/weekly-plan/generateOverbridgePlan";

import { exportWeeklyPlanExcel } from "@/lib/weekly-plan/WeeklyPlanExcelExporter";

import { parseWeeklyPlanExcel } from "@/lib/weekly-plan/WeeklyPlanExcelImporter";

import { generateWeekDates } from "@/lib/weekly-plan/calendar";

export default function WeeklyPlanPage() {
  // Initial State
  const [weekStart, setWeekStart] = useState("");
  // const [weekEnd, setWeekEnd] = useState("");

  const [selectedBridgeId, setSelectedBridgeId] = useState<number>(0);

  const [rows, setRows] = useState<WeeklyPlanRow[]>([]);
  const [bridges, setBridges] = useState<any[]>([]);

  const [showImportModal, setShowImportModal] = useState(false);

  //Load Bridges
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/bridges");

      const data = await res.json();

      setBridges(data.data || []);
    }
    load();
  }, []);

 // Returns the Thursday for whichever week the date belongs to
  const getWeekStartThursday = (date: Date) => {
    const d = new Date(date);

    // Sunday = 0, Monday = 1, Tuesday = 2, Wednesday = 3...
    const day = d.getDay();

    // Number of days to move backwards to Wednesday
    const diff = day <= 4
      ? day - 4
      : day + 3;

    d.setDate(d.getDate() - diff);

    d.setHours(0, 0, 0, 0);

    return d;
  };

  const startDate = getWeekStartThursday( weekStart
    ? new Date(weekStart): new Date());

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 6);

  const weekDates = generateWeekDates(startDate);

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
        dailyEntries: [],
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

  const saveWeeklyPlan =
    async () => {
      try {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 6);
        const response =
          await fetch(
            "/api/weekly-plans",
            {
              method: "POST",
              headers: {
                "Content-Type":
                  "application/json",
              },
              body: JSON.stringify({
                weekStart: startDate,
                weekEnd: endDate,
                rows,
              }),
            }
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error
          );
        }

        alert(
          "Weekly Plan Saved"
        );
      } catch (error) {
        console.error(error);
      }
    };

    const handleExportExcel =
      async () => {

        const workbook =
          await exportWeeklyPlanExcel(
            rows,
            weekDates,
            "157",
            "Kano-Maradi",
            "SECTION 01"
          );

        const buffer =
          await workbook.xlsx.writeBuffer();

        const blob =
          new Blob([buffer]);

        const url =
          window.URL.createObjectURL(
            blob
          );

        const link =
          document.createElement("a");

        link.href = url;

        link.download =
          "WeeklyPlan.xlsx";

        link.click();
      };

      const handleImportExcel = async (
        e: React.ChangeEvent<HTMLInputElement>
      ) => {
        try {
          const file = e.target.files?.[0];

          if (!file) return;

          console.log(
            "UPLOAD STARTED:",
            file.name
          );

          const importedRows =
            await parseWeeklyPlanExcel(
              file
            );

          console.log(
            "PARSED DATA:",
            importedRows
          );

          setRows(importedRows);

          alert(
            `${importedRows.length} rows imported successfully`
          );

        } catch (error) {
          console.error(
            "Import failed:",
            error
          );

          alert(
            "Failed to import Weekly Plan"
          );
        }
      };

      // const handleDrop = async (
      //   e: React.DragEvent<HTMLDivElement>
      // ) => {
      //   e.preventDefault();

      //   const file =
      //     e.dataTransfer.files?.[0];

      //   if (!file) return;

      //   await handleImportExcel({
      //     target: {
      //       files: [file],
      //     },
      //   } as any);

      //   setShowImportModal(false);
      // };

      // const handleDragOver = (
      //   e: React.DragEvent<HTMLDivElement>
      // ) => {
      //   e.preventDefault();
      // };

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

  const updateDailyPlan = (
    rowIndex: number,
    dayIndex: number,
    value: number
  ) => {
    const updated = [...rows];

    updated[rowIndex].dailyEntries[
      dayIndex
    ].plannedQty = value;

    updated[rowIndex].plannedQty =
      updated[rowIndex].dailyEntries.reduce(
        (sum, day) =>
          sum + day.plannedQty,
        0
      );

    setRows(updated);
  };

  const updateDailyReal = (
    rowIndex: number,
    dayIndex: number,
    value: number
  ) => {
    const updated = [...rows];

    updated[rowIndex].dailyEntries[
      dayIndex
    ].actualQty = value;

    updated[rowIndex].actualQty =
      updated[rowIndex].dailyEntries.reduce(
        (sum, day) =>
          sum + day.actualQty,
        0
      );

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

          <>
            <input
              id="weekly-plan-upload"
              type="file"
              accept=".xlsx"
              hidden
              onChange={
                handleImportExcel
              }
            />

            <button
              onClick={() =>
                document
                  .getElementById(
                    "weekly-plan-upload"
                  )
                  ?.click()
              }
              className="bg-green-600 text-white px-4 py-2 rounded"
            >
              Import Excel
            </button>
          </>
          {/* <button
            onClick={() =>
              setShowImportModal(true)
            }
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Import Excel
          </button> */}

          <button
            onClick={handleExportExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
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
          <button
            onClick={saveWeeklyPlan}
            className="bg-indigo-600 text-white px-4 py-2 rounded"
          >
            Save Plan
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
          <tr className="border-b-3 border-gray-400 text-sm text-gray-700 font-semibold">
            <th rowSpan={2} className="border px-4 py-1 text-left font-semibold">Bridge</th>
            <th rowSpan={2} className="border px-4 py-1 text-left font-semibold">Location</th>
            <th rowSpan={2} className="border px-4 py-1 text-left font-semibold">Element</th>
            <th rowSpan={2} className="border px-4 py-1 text-left font-semibold">Activity</th>
            <th rowSpan={2} className="border px-4 py-1 text-left font-semibold">Unit</th>
            
            {weekDates.map((date) => (
              <th
                className="border px-4 py-1 justify-content font-semibold"
                key={date.toISOString()}
                colSpan={2}
              >
                {date.toLocaleDateString(
                  "en-GB",
                  {
                    weekday: "long",
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                )}
              </th>
            ))}

            <th rowSpan={2} className="border px-4 py-1 text-left font-semibold">Week Plan</th>
            <th rowSpan={2} className="border px-4 py-1 text-left font-semibold">Week Real</th>

            <th rowSpan={2} className="border px-4 py-2 text-left font-semibold">Status</th>
            <th rowSpan={2} className="border px-4 py-2 text-left font-semibold">Variance</th>
          </tr>


          <tr className="bg-gray-200 border-b-2 border-gray-400">
            {weekDates.map((date) => (
              <Fragment key={`sub-${date}`}>
                <th className="border px-4 py-2 text-left font-semibold">Plan</th>
                <th className="border px-4 py-2 text-left font-semibold">Real</th>
              </Fragment>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-200">
          {rows.map((row, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="px-4 py-2 border text-sm text-gray-700 font-medium">
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

              <td className="px-4 py-2 border text-sm text-gray-700 font-medium">
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

              <td className="px-4 py-2 border text-sm text-gray-700 font-medium">
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

              <td className="px-4 py-2 border text-sm text-gray-700 font-medium">
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

              <td className="px-4 py-2 border text-sm text-gray-700 font-medium">
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

              {weekDates.map(
                (_, dayIndex) => {
                  const entry =
                    row.dailyEntries?.[
                      dayIndex
                    ] || {
                      plannedQty: 0,
                      actualQty: 0,
                    };

                  return (
                    <Fragment
                      key={dayIndex}
                    >
                      <td className="px-4 py-2 border text-sm text-gray-700 font-medium">
                        <input
                          type="number"
                          value={
                            entry.plannedQty
                          }
                          onChange={(e) =>
                            updateDailyPlan(
                              index,
                              dayIndex,
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="w-10 text-center"
                        />
                      </td>

                      <td className="px-4 py-2 border text-sm text-gray-700 font-medium">
                        <input
                          type="number"
                          value={
                            entry.actualQty
                          }
                          onChange={(e) =>
                            updateDailyReal(
                              index,
                              dayIndex,
                              Number(
                                e.target.value
                              )
                            )
                          }
                          className="w-10 text-center"
                        />
                      </td>
                    </Fragment>
                  );
                }
              )}

              <td className="px-4 py-2 border text-sm text-gray-700 font-medium">
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
                  className="w-20 p-2 border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td className="px-4 py-2 border text-sm text-gray-700 font-medium text-center">
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
                  className="w-20 p-2 border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>

              <td className="border p-2 text-sm text-center">
                  {row.plannedQty > 0 && row.actualQty >= row.plannedQty ? "🟢" : "🔴"} 
              </td>

              <td className="border p-2 text-sm text-center">
                <input
                  value={row.varianceReason || ""}
                  onChange={(e) =>
                    updateRow(
                      index,
                      "varianceReason",
                      e.target.value
                    )
                  }
                  className="mx-1 w-50 p-2 border-gray-300 rounded text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
