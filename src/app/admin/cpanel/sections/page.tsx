'use client';

import { useEffect, useState } from 'react';

export default function SectionsPage() {
  const [sections, setSections] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);

  const fetchSections = async () => {
    const res = await fetch('/api/sections');
    const data = await res.json();
    setSections(data.data || []);
  };

  useEffect(() => {
    fetchSections();
  }, []);

  const handleSave = async () => {
    if (!name) return;

    if (editingId) {
      await fetch(`/api/sections/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
    } else {
      await fetch('/api/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });
    }

    setName('');
    setEditingId(null);
    fetchSections();
  };

  const handleEdit = (section: any) => {
    setName(section.name);
    setEditingId(section.id);
  };

  const handleDelete = async (id: number) => {
    await fetch(`/api/sections/${id}`, {
      method: 'DELETE'
    });

    fetchSections();
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Sections</h1>

      {/* FORM */}
      <div className="flex gap-2 mb-6">
        <input
          className="border p-2 rounded w-64"
          placeholder="Section name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {editingId ? 'Update' : 'Add'}
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">ID</th>
            <th className="p-2 text-left">Name</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>

        <tbody>
          {sections.map((s) => (
            <tr key={s.id} className="border-t">
              <td className="p-2">{s.id}</td>
              <td className="p-2">{s.name}</td>
              <td className="p-2 flex gap-2 justify-center">
                <button
                  onClick={() => handleEdit(s)}
                  className="px-3 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(s.id)}
                  className="px-3 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}