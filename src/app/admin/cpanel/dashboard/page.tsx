import { prisma } from "@/lib/prisma";

export default async function AdminDashboard() {
  const [bridges, sections, reports] = await Promise.all([
    prisma.bridge.count(),
    prisma.section.count(),
    prisma.dailyReport.count(),
  ]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card title="Bridges" value={bridges} />
        <Card title="Sections" value={sections} />
        <Card title="Reports" value={reports} />
      </div>
    </div>
  );
}

function Card({ title, value }: any) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}