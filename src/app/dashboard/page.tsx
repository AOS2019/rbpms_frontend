'use client';

import { useEffect, useState } from 'react';

export default function Dashboard() {

  const [reports, setReports] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/daily-reports')
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setReports(data.data);
        }
      });
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
              Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Overview of bridges and their current status
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              type="button"
              className="inline-flex w-full justify-center sm:w-auto items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Add Bridge
            </button>

            <button
              type="button"
              className="inline-flex w-full justify-center sm:w-auto items-center px-3 py-2 bg-white border border-gray-200 text-sm text-gray-700 rounded-md hover:bg-gray-50"
            >
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: "Total Bridges",
              value: "24",
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
              value: "18",
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
              value: "6",
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

          {reports.map((report) => (
            <div key={report.id} className="border p-4 mb-3 rounded">
              <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
              <p><strong>Engineer:</strong> {report.siteEngineer}</p>
              <p><strong>Weather:</strong> {report.weather}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
