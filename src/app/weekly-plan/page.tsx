export default function WeeklyPlan() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Weekly Plan</h1>

      <table className="w-full bg-white shadow rounded overflow-hidden mb-6">
        <thead>
          <tr className="bg-gray-200 text-left font-semibold text-gray-700 uppercase tracking-wider">
            <th>Bridge</th>
            <th>Pier</th>
            <th>Activity</th>
            <th>Planned</th>
            <th>Actual</th>
          </tr>
        </thead>

        <tbody>
          <tr className="text-gray-600 border-t hover:bg-gray-50 transition-colors duration-200 cursor-pointer">
            <td>PK17+430</td>
            <td>Pier02</td>
            <td>Concrete</td>
            <td>20</td>
            <td>14</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}