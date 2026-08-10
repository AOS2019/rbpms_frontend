"use client";

import { useEffect, useState } from "react";

export default function Dashboard() {
  //
  const [currentUser, setCurrentUser] = useState<any>(null);
  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(console.error);
  }, []);

  const [stats, setStats] = useState({
    totalBridges: 0,
    onTrack: 0,
    delayed: 0,
  });

  const [reports, setReports] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    pk_code: "",
    location: "",
    sectionId: null as number | null,
  });
  const [sections, setSections] = useState([]);
  useEffect(() => {
    fetch("/api/sections")
      .then((res) => res.json())
      .then((data) => setSections(data.data || []));
  }, []);

  useEffect(() => {
    fetch("/api/daily-reports")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReports(data.data);
        }
      });
  }, []);

  useEffect(() => {
    fetch("/api/dashboard/stats")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.data);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
          <div className="flex-1 min-w-0 sm:justify-between">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of bridges and their current status
            </p>
          </div>
          <div>
            <p className="text-lg sm:mt-0 sm:ml-4 sm:flex sm:items-center sm:justify-end sm:space-x-2 sm:space-x-reverse">
              Welcome{" "}
              <span className="ml-2 font-bold">
                {currentUser?.name || "User"}
              </span>
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-end">
            {/* <button
              type="button"
              className="inline-flex w-full justify-center sm:w-auto items-center px-3 py-2 bg-white border border-gray-200 text-sm text-gray-700 rounded-md hover:bg-gray-50"
            >
              Export
            </button> */}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: "Total Bridges",
              value: stats.totalBridges,
              icon: (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3 7h18M3 12h18M3 17h18"
                />
              ),
              accent: "indigo",
              state: "Updated today",
              pct: 100,
            },
            {
              label: "On Track",
              value: stats.onTrack,
              icon: (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              ),
              accent: "green",
              state: "+8% since last week",
              pct: 75,
            },
            {
              label: "Delayed",
              value: stats.delayed,
              icon: (
                <path
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              ),
              accent: "red",
              state: "+2% since last week",
              pct: 25,
            },
          ].map((item) => (
            <div
              key={item.label}
              className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4"
            >
              <div
                className={`flex-shrink-0 bg-${item.accent}-50 text-${item.accent}-600 rounded-full p-3`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
              </div>

              <div className="flex-1">
                <p className="text-sm text-gray-500">{item.label}</p>
                <h2
                  className={`mt-1 text-2xl font-extrabold text-${item.accent}-600`}
                >
                  {item.value}
                </h2>

                <div className="mt-3 flex items-center justify-between">
                  <span
                    className={`inline-flex items-center text-xs font-medium bg-${item.accent}-50 text-${item.accent}-700 px-2.5 py-0.5 rounded-full`}
                  >
                    {item.state}
                  </span>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${item.accent}-600`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="p-6">
          <h1 className="text-xl font-bold mb-4">Daily Reports</h1>

          <div className="overflow-x-auto bg-white rounded-lg border border-gray-100 p-4">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="text-left text-sm text-gray-600">
                  <th className="py-2 px-3">Date</th>
                  <th className="py-2 px-3">Engineer</th>
                  <th className="py-2 px-3">Weather</th>
                  <th className="py-2 px-3">Foreman</th>
                  <th className="py-2 px-3">Bridge</th>
                  <th className="py-2 px-3">Activities</th>
                  <th className="py-2 px-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {reports.map((report) => (
                  <tr key={report.id} className="text-sm text-gray-700">
                    <td className="py-3 px-3 align-top">
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-3 align-top">
                      {report.siteEngineer}
                    </td>
                    <td className="py-3 px-3 align-top">{report.weather}</td>
                    <td className="py-3 px-3 align-top">{report.foreman}</td>
                    <td className="py-3 px-3 align-top">
                      {report.bridge?.pk_code}
                    </td>
                    <td className="py-3 px-3 align-top">
                      <ul className="list-disc list-inside">
                        {(report.tasks ?? []).map((task: any) => (
                          <li key={task.id}>
                            {task.activity}

                            {task.locationCode && ` (${task.locationCode})`}

                            {task.quantityDone != null &&
                              ` - ${task.quantityDone} ${task.unit ?? ""}`}

                            {task.concreteGrade &&
                              ` (Grade: ${task.concreteGrade})`}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td>
                      <button
                        onClick={() =>
                          window.open(`/api/daily-reports/${report.id}/excel`)
                        }
                        className="bg-blue-300 text-white px-3 py-2 rounded hover:bg-blue-600"
                      >
                        Download Excel
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
