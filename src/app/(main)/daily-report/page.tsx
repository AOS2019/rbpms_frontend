"use client";

import { parseDailyReportExcel } from "@/lib/excel/dailyReportImporter";

import { exportDailyReportExcel } from "@/lib/excel/dailyReportExporter";

import { useState, useEffect, useRef } from "react";

import DailyReportHeader from "@/components/daily-report/DailyReportHeader";

import DailyReportGeneralInfo from "@/components/daily-report/DailyReportGeneralInfo";

import ManpowerDeploymentSection from "@/components/daily-report/ManpowerDeploymentSection";

import { ActivityRow, ManpowerRow } from "@/components/daily-report/types";

import { NextResponse } from "next/server";

export default function DailyReportPage() {
  // State variables for managing form data and selections
  const [selectedBridgeId, setSelectedBridgeId] = useState<string>("");
  const [rowPiers, setRowPiers] = useState<Record<number, any[]>>({});
  const [piers, setPiers] = useState<any[]>([]);
  const [elements, setElements] = useState<any[]>([]);
  const [rows, setRows] = useState<ActivityRow[]>([]);

  const [activityRows, setActivityRows] = useState<ActivityRow[]>([]);

  const [manpowerRows, setManpowerRows] = useState<ManpowerRow[]>([]);

  const [employees, setEmployees] = useState<any[]>([]);

  const [teams, setTeams] = useState<any[]>([]);

  const [teamMembers, setTeamMembers] = useState<Record<number, any[]>>({});

  const [bridges, setBridges] = useState<any[]>([]);

  const [equipment, setEquipment] = useState<any[]>([]);

  const [generalInfo, setGeneralInfo] = useState({
    date: "",
    siteEngineer: "",
    foreman: "",
    projectManager: "",
    weather: "",
  });

  // Filter elements based on the selected bridge
  const filteredElements = elements.filter(
    (e) => e.bridgeId === Number(selectedBridgeId),
  );

  // Function to validate rows before submission
  const validateRows = () => {
    let isValid = true;
    const validatedRows = rows.map((row) => {
      let errors: any = {};
      if (!row.teamId) errors.team = "Required";
      // if (row.activity === "Concrete casting" || row.activity === "Reinforcement assembly" || row.activity === "Formwork assembly") {
      //   errors.pier = "Pier required"
      //   errors.elementId = "Element required"
      //   errors.quantity = "Quantity required"
      //   errors.unit = "Concrete grade required"
      // };
      // if (!row.pier) errors.pier = "Required";
      if (!row.activity) errors.activity = "Required";
      // if (!row.quantity || row.quantity <= 0)
      //   errors.quantity = "Must be greater than 0";
      if (row.activity === "Concrete" && !row.grade)
        errors.grade = "Concrete grade required";
      // if (!row.unit) errors.unit = "Required";
      if (Object.keys(errors).length > 0) isValid = false;
      return { ...row, errors };
    });
    setRows(validatedRows);
    return isValid;
  };

  // Function to load team members for a given team ID
  const loadTeamMembers = async (
    teamId:number
) =>{

    const res =
        await fetch(
            `/api/teams/${teamId}/members`
        );

    const data =
        await res.json();

    return data.data || [];

};

  // Effect to fetch piers based on the selected bridge
  useEffect(() => {
    const fetchPiers = async () => {
      if (!selectedBridgeId) {
        setPiers([]);
        return;
      }

      try {
        const res = await fetch(`/api/piers?bridge=${selectedBridgeId}`);

        const data = await res.json();

        if (data.success) {
          setPiers(data.data);
        } else {
          setPiers([]);
        }
      } catch (error) {
        console.error(error);
        setPiers([]);
      }
    };

    fetchPiers();
  }, [selectedBridgeId]);

  // Effect to fetch initial data for teams, bridges, employees, and elements
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamsRes = await fetch("/api/teams");
        const teamsData = await teamsRes.json();

        const bridgesRes = await fetch("/api/bridges");
        const bridgesData = await bridgesRes.json();

        const employeesRes = await fetch("/api/employees");
        const employeesData = await employeesRes.json();

        const elementsRes = await fetch("/api/elements");
        const elementsData = await elementsRes.json();

        setTeams(teamsData.data || []);
        setBridges(bridgesData.data || []);
        setEmployees(employeesData.data || []);
        setElements(elementsData.data || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    if (rows.length === 0) {
      setRows([
        {
          teamId: "",
          bridge: "",
          pier: "",
          elementId: 0,
          activity: "",
          quantity: 0,
          unit: "",
          grade: "",
        },
      ]);
    }
  }, []);
  const activityUnitMap: any = {
    Concrete: "m³",
    Reinforcement: "tons",
    Formwork: "m²",
  };

  // Handler for activity changes to update unit based on selected activity
  const handleActivityChange = (index: number, value: string) => {
    const unit = activityUnitMap[value] || "";
    const newRows = [...rows];
    newRows[index].activity = value;
    newRows[index].unit = unit;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([
      ...rows,
      {
        teamId: "",
        bridge: "",
        pier: "",
        elementId: 0,
        activity: "",
        quantity: 0,
        unit: "",
        grade: "",
      },
    ]);
  };

  // Function to remove a row from the activity table
  const removeRow = (index: number) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // Handler for team selection changes to update the team ID and load members
  const handleTeamChange = async (rowIndex: number, teamId: number) => {
    // Update the activity row
    updateRow(rowIndex, "teamId", teamId);

    // Load members
    const members = await loadTeamMembers(teamId);

    // Populate manpower table
    setManpowerRows((prev) => {
      const existing = prev.filter((p) => Number(p.teamId) !== teamId);

      const newMembers = members.map((m: any) => ({
        employeeId: m.employee.id,

        staffId: m.employee.staffId,

        employeeName: `${m.employee.firstName} ${m.employee.lastName}`,

        manualEmployee: false,

        teamId: String(teamId),

        hoursWorked: 0,

        equipmentId: "",

        remarks: "",
      }));

      return [...existing, ...newMembers];
    });
  };

  // Function to update a specific field in a row
  const updateRow = <K extends keyof ActivityRow>(
    index: number,
    field: K,
    value: ActivityRow[K],
  ) => {
    setRows((prev) => {
      const copy = [...prev];

      copy[index] = {
        ...copy[index],
        [field]: value,
      };

      return copy;
    });
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    const isValid = validateRows();
    if (!isValid) {
      alert("Please fix validation errors");
      return;
    }

    try {
      if (
        !generalInfo.date ||
        !generalInfo.siteEngineer ||
        !generalInfo.projectManager ||
        !generalInfo.weather ||
        !generalInfo.foreman ||
        !selectedBridgeId
      ) {
        alert("Please complete the General Info section");
        return;
      }
      const response = await fetch("/api/daily-reports", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          date: generalInfo.date,
          siteEngineer: generalInfo.siteEngineer,
          projectManager: generalInfo.projectManager,
          weather: generalInfo.weather,
          foreman: generalInfo.foreman,
          bridgeId: Number(selectedBridgeId),

          activities: rows,
          dailyTeamTasks: manpowerRows,
        }),
      });

      const data = await response.json();

      // console.log("API Response:", data);

      if (!response.ok) {
        alert(data.error || "Failed to submit report");
        return;
        // throw new Error(
        //   "Failed to submit report"
        // );
      }

      alert("Report submitted successfully!");
      window.location.reload();
    } catch (error: any) {
      // console.error("POST /api/daily-reports error:", error);

      alert("An error occurred while submitting report");

      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 },
      );
    }

    // await fetch("http://localhost:5000/api/daily-report/manual", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({ rows }),
    // });

    // alert("Report submitted successfully!");
  };

  // Class for standard input styling
  const standardInputClass =
    "w-full p-2 border rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

  // Ref for file input to trigger file selection dialog
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handler for Excel file upload to parse and populate form data
  const handleExcelUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const result = await parseDailyReportExcel(file);

    // console.log(result);

    setGeneralInfo(result.generalInfo);

    setManpowerRows(result.manpower);

    setRows(result.activities);

    alert("Excel imported successfully");
  };

  const handleExportExcel = async () => {
    try {
      alert("Export started");

      const workbook = await exportDailyReportExcel({
        ...generalInfo,
        manpower: manpowerRows,
        activities: rows,
      });

      alert("Workbook created");

      const buffer = await workbook.xlsx.writeBuffer();

      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");

      link.href = url;

      link.download = `Daily_Report_${Date.now()}.xlsx`;

      document.body.appendChild(link);

      link.click();

      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);

      alert("Download complete");
    } catch (error) {
      console.error("Export error:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <DailyReportHeader />
        <div className="flex justify-end gap-3 mb-4">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Upload Excel
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx"
            onChange={handleExcelUpload}
            className="hidden"
          />
          <button
            onClick={handleExportExcel}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Export Excel
          </button>
        </div>

        <DailyReportGeneralInfo
          selectedBridgeId={selectedBridgeId}
          setSelectedBridgeId={setSelectedBridgeId}
          generalInfo={generalInfo}
          setGeneralInfo={setGeneralInfo}
        />

        <ManpowerDeploymentSection
          index={0}
          rows={manpowerRows}
          setRows={setManpowerRows}
          employees={employees}
          teams={teams}
          equipment={equipment}
        />

        {/* Existing Activity Table */}
        {/* Paste your current activity table component here */}

        <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
          <div className="md:hidden space-y-4">
            <div className="flex justify-between mb-4 items-center gap-4 flex-wrap">
              <h2 className="text-lg font-semibold">
                {/* (Mobile View) */}
                Team Tasks
              </h2>
              <button
                onClick={addRow}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Row
              </button>
            </div>
            {rows.map((row, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
              >
                <div className="grid grid-cols-1 gap-2">
                  <div>
                    <label className="text-xs text-gray-700">Team</label>
                    <select
                      value={row.teamId}
                      onChange={(e) =>
                        handleTeamChange(index, Number(e.target.value))
                      }
                      className={`${standardInputClass} ${row.errors?.team ? "border-red-400 ring-1 ring-red-200" : ""}`}
                    >
                      <option value="" disabled>
                        Select team
                      </option>
                      {Array.isArray(teams) &&
                        teams.map((team: any) => (
                          <option key={team.id} value={team.id}>
                            {team.name}
                          </option>
                        ))}
                    </select>
                    {row.errors?.team && (
                      <p className="text-red-600 text-xs mt-1">
                        {row.errors.team}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-700">Pier</label>
                    <select
                      value={row.pier}
                      onChange={(e) => updateRow(index, "pier", e.target.value)}
                      className={`${standardInputClass} ${row.errors?.pier ? "border-red-400 ring-1 ring-red-200" : ""}`}
                    >
                      <option value="" disabled>
                        Select pier
                      </option>
                      {piers.map((p: any) => (
                        <option
                          key={p.id}
                          value={p.pierNumber ?? `Pier ${p.id}`}
                        >
                          {p.pierNumber ?? `Pier ${p.id}`}
                        </option>
                      ))}
                    </select>
                    {row.errors?.pier && (
                      <p className="text-red-600 text-xs mt-1">
                        {row.errors.pier}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs text-gray-700">Element</label>
                    <select
                      value={row.elementId || ""}
                      onChange={(e) =>
                        updateRow(index, "elementId", Number(e.target.value))
                      }
                      className={`${standardInputClass} ${row.errors?.elementId ? "border-red-400 ring-1 ring-red-200" : ""}`}
                    >
                      <option value="">Select Element</option>

                      {elements.map((element: any) => (
                        <option key={element.id} value={element.id}>
                          {element.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-700">Activity</label>
                    <input
                      value={row.activity}
                      onChange={(e) =>
                        handleActivityChange(index, e.target.value)
                      }
                      className={`${standardInputClass} ${row.errors?.activity ? "border-red-400 ring-1 ring-red-200" : ""}`}
                      placeholder="Activity"
                    />
                    {row.errors?.activity && (
                      <p className="text-red-600 text-xs mt-1">
                        {row.errors.activity}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs text-gray-700">Qty</label>
                      <input
                        type="number"
                        min={0}
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(index, "quantity", Number(e.target.value))
                        }
                        className={`${standardInputClass} ${row.errors?.quantity ? "border-red-400 ring-1 ring-red-200" : ""}`}
                      />
                      {row.errors?.quantity && (
                        <p className="text-red-600 text-xs mt-1">
                          {row.errors.quantity}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="text-xs text-gray-700">Unit</label>
                      <input
                        value={row.unit}
                        onChange={(e) =>
                          updateRow(index, "unit", e.target.value)
                        }
                        className={`${standardInputClass} ${row.errors?.unit ? "border-red-400 ring-1 ring-red-200" : ""}`}
                      />
                      {row.errors?.unit && (
                        <p className="text-red-600 text-xs mt-1">
                          {row.errors.unit}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-gray-700">Grade</label>
                    <input
                      value={row.grade}
                      onChange={(e) =>
                        updateRow(index, "grade", e.target.value)
                      }
                      className={`${standardInputClass} ${row.activity === "Concrete" ? "bg-white" : "bg-gray-50"}`}
                      placeholder={
                        row.activity === "Concrete"
                          ? "Grade (e.g. M20)"
                          : "Optional"
                      }
                    />
                    {row.errors?.grade && (
                      <p className="text-red-600 text-xs mt-1">
                        {row.errors.grade}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => removeRow(index)}
                    className="py-2 px-3 text-xs text-white bg-red-600 rounded-md hover:bg-red-700 mt-1"
                    aria-label={`Remove row ${index + 1}`}
                  >
                    Remove row
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto">
            {/* Desktop Table View */}

            <div className="flex justify-between mb-4 items-center gap-4 flex-wrap">
              <h2 className="text-lg font-semibold">Team Tasks</h2>
              <button
                onClick={addRow}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-7 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Add Row
              </button>
            </div>
            <table className="w-full min-w-[900px] border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider">
                  <th className="p-3 sticky top-0 bg-gray-100 z-20">Team</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-20">Pier</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-20">Element</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-20">
                    Activity
                  </th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-20">Qty</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-20">Unit</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-20">Grade</th>
                  <th className="p-3 sticky top-0 bg-gray-100 z-20 w-12" />
                </tr>
              </thead>

              <tbody className="text-gray-700">
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={`border-b last:border-b-0 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-2 align-top">
                      <select
                        value={row.teamId}
                        onChange={(e) =>
                          handleTeamChange(index, Number(e.target.value))
                        }
                        className={`w-44 p-2 border rounded bg-white text-sm focus:outline-none ${
                          row.errors?.team
                            ? "border-red-400 ring-1 ring-red-200"
                            : "focus:ring-2 focus:ring-blue-200"
                        }`}
                        aria-label={`Team ${index + 1}`}
                      >
                        <option value="" disabled>
                          Select team
                        </option>
                        {Array.isArray(teams) &&
                          teams.map((team: any) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                      </select>
                      {row.errors?.team && (
                        <p className="text-red-600 text-xs mt-1">
                          {row.errors.team}
                        </p>
                      )}
                    </td>

                    <td className="p-2 align-top">
                      <select
                        value={row.pier}
                        onChange={(e) =>
                          updateRow(index, "pier", e.target.value)
                        }
                        className={`w-36 p-2 border rounded bg-white text-sm focus:outline-none ${
                          row.errors?.pier
                            ? "border-red-400 ring-1 ring-red-200"
                            : "focus:ring-2 focus:ring-blue-200"
                        }`}
                        aria-label={`Pier ${index + 1}`}
                      >
                        <option value="" disabled>
                          Select pier
                        </option>
                        {piers.map((p: any) => (
                          <option key={p.id} value={p.pierNumber ?? p.id}>
                            {p.pierNumber ?? `Pier ${p.id}`}
                          </option>
                        ))}
                      </select>
                      {row.errors?.pier && (
                        <p className="text-red-600 text-xs mt-1">
                          {row.errors.pier}
                        </p>
                      )}
                    </td>
                    <td className="p-2 align-top">
                      <select
                        value={row.elementId || ""}
                        onChange={(e) =>
                          updateRow(index, "elementId", Number(e.target.value))
                        }
                        className={`w-full p-2 border rounded bg-white text-sm focus:outline-none ${
                          row.errors?.pier
                            ? "border-red-400 ring-1 ring-red-200"
                            : "focus:ring-2 focus:ring-blue-200"
                        }`}
                        aria-label={`Pier ${index + 1}`}
                      >
                        {filteredElements.map((element) => (
                          <option key={element.id} value={element.id}>
                            {element.name}
                          </option>
                        ))}

                        {elements.map((element) => (
                          <option key={element.id} value={element.id}>
                            {element.name}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 align-top">
                      <input
                        value={row.activity}
                        onChange={(e) =>
                          handleActivityChange(index, e.target.value)
                        }
                        className={`w-48 p-2 border rounded text-sm focus:outline-none ${
                          row.errors?.activity
                            ? "border-red-400 ring-1 ring-red-200"
                            : "focus:ring-2 focus:ring-blue-200"
                        }`}
                        placeholder="Activity"
                        aria-label={`Activity ${index + 1}`}
                      />
                      {row.errors?.activity && (
                        <p className="text-red-600 text-xs mt-1">
                          {row.errors.activity}
                        </p>
                      )}
                    </td>
                    <td className="p-2 align-top">
                      <input
                        type="number"
                        min={0}
                        value={row.quantity}
                        onChange={(e) =>
                          updateRow(index, "quantity", Number(e.target.value))
                        }
                        className={`w-24 p-2 border rounded text-sm focus:outline-none ${
                          row.errors?.quantity
                            ? "border-red-400 ring-1 ring-red-200"
                            : "focus:ring-2 focus:ring-blue-200"
                        }`}
                        aria-label={`Quantity ${index + 1}`}
                      />
                      {row.errors?.quantity && (
                        <p className="text-red-600 text-xs mt-1">
                          {row.errors.quantity}
                        </p>
                      )}
                    </td>
                    <td className="p-2 align-top">
                      <input
                        value={row.unit}
                        onChange={(e) =>
                          updateRow(index, "unit", e.target.value)
                        }
                        className={`w-24 p-2 border rounded text-sm focus:outline-none ${
                          row.errors?.unit
                            ? "border-red-400 ring-1 ring-red-200"
                            : "focus:ring-2 focus:ring-blue-200"
                        }`}
                        placeholder="Unit"
                        aria-label={`Unit ${index + 1}`}
                      />
                      {row.errors?.unit && (
                        <p className="text-red-600 text-xs mt-1">
                          {row.errors.unit}
                        </p>
                      )}
                    </td>
                    <td className="p-2 align-top">
                      <input
                        value={row.grade}
                        onChange={(e) =>
                          updateRow(index, "grade", e.target.value)
                        }
                        className={`w-28 p-2 border rounded text-sm focus:outline-none ${
                          row.activity === "Concrete"
                            ? "bg-white"
                            : "bg-gray-50"
                        }`}
                        placeholder={
                          row.activity === "Concrete"
                            ? "Grade (e.g. M20)"
                            : "Optional"
                        }
                        aria-label={`Grade ${index + 1}`}
                      />
                      {row.errors?.grade && (
                        <p className="text-red-600 text-xs mt-1">
                          {row.errors.grade}
                        </p>
                      )}
                    </td>

                    <td className="p-2 align-top text-center">
                      <button
                        onClick={() => removeRow(index)}
                        className="inline-flex items-center justify-center w-9 h-9 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                        title="Remove row"
                        aria-label={`Remove row ${index + 1}`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden
                        >
                          <path
                            fillRule="evenodd"
                            d="M6.292 6.292a1 1 0 011.414 0L10 8.586l2.294-2.294a1 1 0 011.414 1.414L11.414 10l2.294 2.294a1 1 0 01-1.414 1.414L10 11.414l-2.294 2.294a1 1 0 01-1.414-1.414L8.586 10 6.292 7.706a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-3 justify-end">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden
              >
                <path d="M2.003 5.884L10 9.882l7.997-3.998A1 1 0 0017.997 4H2.003a1 1 0 00-.0 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              Submit Report
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
