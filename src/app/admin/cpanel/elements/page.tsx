"use client";

import { useEffect, useState } from "react";

export default function ElementsPage() {
  const [elements, setElements] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    type: "",
    bridgeType: "",
    status: "Active",
  });

  const fetchData = async () => {
    try {

      const elementsRes = await fetch("/api/elements");
      const elementsData = await elementsRes.json();

      setElements(elementsData.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await fetch("/api/elements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          ...form,
        }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.message);
      }

      alert("Element created successfully");

      setForm({
        name: "",
        type: "",
        bridgeType: "",
        status: "Active",
      });

      fetchData();
    } catch (error) {
      console.error(error);

      alert("Failed to create element");
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-xl font-semibold mb-4">
          Create Element
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          <select
            value={form.bridgeType}
            onChange={(e) =>
              setForm({
                ...form,
                bridgeType: e.target.value,
              })
            }
            className="border p-2 rounded"
          >
            <option value="">Select Bridge Type</option>

            <option value="BRIDGE">Bridge</option>

            <option value="OVERBRIDGE">Overbridge</option>
          </select>

          <input
            placeholder="Element Name"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="border p-2 rounded"
          />

          <select
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value,
              })
            }
            className="border p-2 rounded"
          >
            <option value="">
              Select Type
            </option>

            <option value="Substructure">
              Substructure
            </option>

            <option value="Superstructure">
              Superstructure
            </option>

            <option value="Ancillary">
              Ancillary
            </option>
          </select>

          <select
            value={form.status}
            onChange={(e) =>
              setForm({
                ...form,
                status: e.target.value,
              })
            }
            className="border p-2 rounded"
          >
            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>
          </select>
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Element
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-left">Bridge Type</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>

          <tbody>
            {elements.map((element) => (
              <tr
                key={element.id}
                className="border-t"
              >
                <td className="p-3">
                  {element.name}
                </td>

                <td className="p-3">
                  {element.type}
                </td>

                <td className="p-3">
                  {element.bridgeType}
                </td>

                <td className="p-3">
                  {element.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}