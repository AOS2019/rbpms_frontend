'use client';

import { useEffect, useState } from 'react';

export default function BridgesPage() {
  const [bridges, setBridges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
   const [sections, setSections] = useState([]);
  const [form, setForm] = useState({
    pk_code: '',
    location: '',
    sectionId: 0,
    totalPlanned: 0,
    totalCompleted: 0,
  });

  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchBridges = async () => {
    const res = await fetch('/api/bridges');
    const data = await res.json();

    const Sectionres = await fetch('/api/sections');
    const sectionData = await Sectionres.json();

    if (data.success) {
      setBridges(data.data);
      setSections(sectionData.data || []);
    }
  };

  useEffect(() => {
    fetchBridges();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);

    const method = editingId ? 'PUT' : 'POST';

    const url = editingId
      ? `/api/bridges/${editingId}`
      : '/api/bridges';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (data.success) {
      alert(
        editingId
          ? 'Bridge updated successfully'
          : 'Bridge created successfully'
      );

      setForm({
        pk_code: '',
        location: '',
        sectionId: 0,
        totalPlanned: 0,
        totalCompleted: 0,
      });

      setEditingId(null);

      fetchBridges();
    } else {
      alert(data.error);
    }

    setLoading(false);
  };

  const handleEdit = (bridge: any) => {
    setEditingId(bridge.id);

    setForm({
      pk_code: bridge.pk_code,
      location: bridge.location,
      sectionId: bridge.sectionId,
      totalPlanned: bridge.totalPlanned,
      totalCompleted: bridge.totalCompleted,
    });
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this bridge?')) return;

    const res = await fetch(`/api/bridges/${id}`, {
      method: 'DELETE',
    });

    const data = await res.json();

    if (data.success) {
      fetchBridges();
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-2xl font-bold mb-4">
          Bridges Management
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            placeholder="PK Code"
            value={form.pk_code}
            onChange={(e) =>
              setForm({
                ...form,
                pk_code: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            className="border p-3 rounded-lg"
          />

          <select
            value={form.sectionId}
            className="border p-3 rounded-lg"
            onChange={(e) =>
                setForm({
                ...form,
                sectionId: Number(e.target.value),
                })
            }
            >
            <option value="">Select Section</option>
            {sections.map((section: any) => (
                <option key={section.id} value={section.id}>
                {section.name}
                </option>
            ))}
            </select>

          <input
            type="number"
            placeholder="Total Planned"
            value={form.totalPlanned}
            onChange={(e) =>
              setForm({
                ...form,
                totalPlanned: Number(e.target.value),
              })
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Total Completed"
            value={form.totalCompleted}
            onChange={(e) =>
              setForm({
                ...form,
                totalCompleted: Number(e.target.value),
              })
            }
            className="border p-3 rounded-lg"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="mt-4 bg-blue-600 text-white px-5 py-3 rounded-lg"
        >
          {editingId ? 'Update Bridge' : 'Add Bridge'}
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">PK Code</th>
              <th className="p-4 text-left">Location</th>
              <th className="p-4 text-left">Section</th>
              <th className="p-4 text-left">Completion</th>
              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {bridges.map((bridge) => {
              const completion =
                bridge.totalPlanned > 0
                  ? (
                      (bridge.totalCompleted /
                        bridge.totalPlanned) *
                      100
                    ).toFixed(1)
                  : 0;

              return (
                <tr
                  key={bridge.id}
                  className="border-t"
                >
                  <td className="p-4">
                    {bridge.pk_code}
                  </td>

                  <td className="p-4">
                    {bridge.location}
                  </td>

                  <td className="p-4">
                    {bridge.sectionId}
                  </td>

                  <td className="p-4">
                    {completion}%
                  </td>

                  <td className="p-4 space-x-2">
                    <button
                      onClick={() =>
                        handleEdit(bridge)
                      }
                      className="bg-yellow-500 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() =>
                        handleDelete(bridge.id)
                      }
                      className="bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}