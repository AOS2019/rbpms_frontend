export default function WeeklyPlan() {
  const rows = [
    { bridge: "PK17+430", pier: "Pier02", activity: "Concrete", planned: 20, actual: 14 },
    // add more rows
  ];

  return (
    <div className="p-4 md:p-6">
      <h1 className="text-xl md:text-2xl font-bold mb-4">Weekly Plan</h1>

      <div className="overflow-x-auto bg-white shadow rounded-md mb-6">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gray-200 text-left font-semibold text-gray-700 uppercase tracking-wider">
              <th className="px-3 py-2 text-xs md:text-sm">Bridge</th>
              <th className="px-3 py-2 text-xs md:text-sm">Pier</th>
              <th className="px-3 py-2 text-xs md:text-sm">Activity</th>
              <th className="px-3 py-2 text-xs md:text-sm">Planned</th>
              <th className="px-3 py-2 text-xs md:text-sm">Actual</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, idx) => (
              <tr
                key={idx}
                className="text-gray-600 border-t hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
              >
                <td className="px-3 py-2 text-xs md:text-sm whitespace-nowrap">{row.bridge}</td>
                <td className="px-3 py-2 text-xs md:text-sm whitespace-nowrap">{row.pier}</td>
                <td className="px-3 py-2 text-xs md:text-sm">{row.activity}</td>
                <td className="px-3 py-2 text-xs md:text-sm">{row.planned}</td>
                <td className="px-3 py-2 text-xs md:text-sm">{row.actual}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="block md:hidden">
        {rows.map((row, idx) => (
          <div
            key={`card-${idx}`}
            className="border border-gray-200 rounded-lg p-3 mb-3 bg-white shadow-sm"
          >
            <div className="text-sm font-semibold">{row.activity}</div>
            <div className="text-xs text-gray-600">Bridge: {row.bridge}</div>
            <div className="text-xs text-gray-600">Pier: {row.pier}</div>
            <div className="text-xs text-gray-600">
              Planned: {row.planned} • Actual: {row.actual}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}