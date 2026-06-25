"use client";

import { useState, useEffect } from "react";

interface Props {

  generalInfo: {
    date: string;
    siteEngineer: string;
    foreman: string;
    projectManager: string;
    weather: string;
  };

  setGeneralInfo: React.Dispatch<
    React.SetStateAction<{
      date: string;
      siteEngineer: string;
      foreman: string;
      projectManager: string;
      weather: string;
    }>
  >;
}

export default function DailyReportGeneralInfo({
  selectedBridgeId,
  setSelectedBridgeId,
  generalInfo,
  setGeneralInfo,
}: Props & {
  selectedBridgeId: string;
  setSelectedBridgeId: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [bridges, setBridges] = useState<any[]>([]);
  const [rowPiers, setRowPiers] = useState<Record<string, any[]>>({});

    useEffect(() => {
        fetch("/api/bridges")
        .then((res) => res.json())
        .then((data) => {
        setBridges(Array.isArray(data) ? data : data.data ?? []);
        });
    }, []);

  return (
    <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
      <h2 className="text-md sm:text-lg font-medium text-gray-700 mb-4">
        General Info
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 mb-2">
        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">Date</span>
          <input
            type="date"
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
            value={generalInfo.date}
            onChange={(e) => setGeneralInfo((prev) => ({
              ...prev,
              date: e.target.value,
            }))}
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">Start Time</span>
          <input
            type="time"
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">Break start Time</span>
          <input
            type="time"
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">Break end Time</span>
          <input
            type="time"
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">End Time</span>
          <input
            type="time"
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">Site Engineer</span>
          <select 
            value={generalInfo.siteEngineer}
            onChange={(e) => setGeneralInfo((prev) => ({
              ...prev,
              siteEngineer: e.target.value,
            }))}
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option>Select Site Engineer</option>
            <option>Engr. Abba Sani</option>
            <option>Engr. Abdulrrahman Ibrahim</option>
            <option>Engr. Geoffrey Hassan</option>
            <option>Engr. Idogbe Daniel</option>
            <option>Engr. Jameel Yahaya</option>
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">Foreman</span>
          <select
            value={generalInfo.foreman}
            onChange={(e) => setGeneralInfo((prev) => ({
              ...prev,
              foreman: e.target.value,
            }))}
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option>Select Foreman</option>
            <option>Engr. Carlos</option>
            <option>Engr. Nigero</option>
            <option>Engr. Rainato</option>
            <option>Engr. Germano</option>
            <option>Engr. Jose</option>
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">Project Manager</span>
          <select
            value={generalInfo.projectManager}
            onChange={(e) => setGeneralInfo((prev) => ({
              ...prev,
              projectManager: e.target.value,
            }))}
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option>Select Project Manager</option>
            <option>Engr. Luis Suzano</option>
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">Select Bridge</span>
          <select
            value={selectedBridgeId}
            onChange={(e) => setSelectedBridgeId(e.target.value)}
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Select Bridge</option>
            {Array.isArray(bridges) &&
              bridges.map((bridge: any) => (
                <option key={bridge.id} value={bridge.id}>
                  {bridge.pk_code}
                </option>
              ))}
          </select>
        </label>

        <label className="flex flex-col text-sm">
          <span className="mb-2 text-gray-600">Weather</span>
          <select
            value={generalInfo.weather}
            onChange={(e) => setGeneralInfo((prev) => ({
              ...prev,
              weather: e.target.value,
            }))}
            className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option>Weather</option>
            <option>Sunny</option>
            <option>Rainy</option>
          </select>
        </label>
      </div>
    </section>
  );
}
