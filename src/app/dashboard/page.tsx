export default function Dashboard() {
  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of bridges and their current status
          </p>
        </div>

        <div className="mt-4 sm:mt-0 flex items-center space-x-2">
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Add Bridge
          </button>

          <button
            type="button"
            className="inline-flex items-center px-3 py-2 bg-white border border-gray-200 text-sm text-gray-700 rounded-md hover:bg-gray-50"
          >
            Export
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
          <div className="flex-shrink-0 bg-indigo-50 text-indigo-600 rounded-full p-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-500">Total Bridges</p>
            <h2 className="mt-1 text-2xl font-extrabold text-gray-900">24</h2>

            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center text-xs font-medium bg-indigo-50 text-indigo-700 px-2.5 py-0.5 rounded-full">
                Updated today
              </span>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600"
                  style={{ width: "100%" }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
          <div className="flex-shrink-0 bg-green-50 text-green-600 rounded-full p-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-500">On Track</p>
            <h2 className="mt-1 text-2xl font-extrabold text-green-600">18</h2>

            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center text-xs font-medium bg-green-50 text-green-700 px-2.5 py-0.5 rounded-full">
                +8% since last week
              </span>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-600" style={{ width: "75%" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex items-start space-x-4">
          <div className="flex-shrink-0 bg-red-50 text-red-600 rounded-full p-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <div className="flex-1">
            <p className="text-sm text-gray-500">Delayed</p>
            <h2 className="mt-1 text-2xl font-extrabold text-red-600">6</h2>

            <div className="mt-3 flex items-center justify-between">
              <span className="inline-flex items-center text-xs font-medium bg-red-50 text-red-700 px-2.5 py-0.5 rounded-full">
                +2% since last week
              </span>
              <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-600" style={{ width: "25%" }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
