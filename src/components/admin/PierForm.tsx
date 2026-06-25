"use client";

import { useEffect, useState } from "react";

export default function PierForm() {
  const [bridges, setBridges] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBridge, setSelectedBridge] = useState("");
  const [piers, setPiers] = useState<any[]>([]);
  const [loadingPiers, setLoadingPiers] = useState(false);

  const [formData, setFormData] = useState({
    bridgeId: "",
    bridgeType: "BRIDGE",
    pierCount: 2,
    shape: "",
    height: "",
  });

  useEffect(() => {
    fetch("/api/bridges")
      .then((res) => res.json())
      .then((data) => {
        setBridges(Array.isArray(data) ? data : (data.data ?? []));
      });
  }, []);

  useEffect(() => {
    if (!selectedBridge) {
      setPiers([]);
      return;
    }

    const fetchPiers = async () => {
      setLoadingPiers(true);

      try {
        const res = await fetch(`/api/piers?bridge=${selectedBridge}`);

        const data = await res.json();

        setPiers(data.data || []);
      } catch (error) {
        console.error(error);
        setPiers([]);
      }

      setLoadingPiers(false);
    };

    fetchPiers();
  }, [selectedBridge]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/piers/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed");

      alert("Bridge structure generated successfully");

      setSelectedBridge(formData.bridgeId);

      setFormData({
        bridgeId: "",
        bridgeType: "BRIDGE",
        pierCount: 2,
        shape: "",
        height: "",
      });
    } catch (error) {
      console.error(error);

      alert("Failed to generate bridge structure");
    }
    setLoading(false);
  };

  const deletePier = async (id: number) => {
    if (!confirm("Delete this pier?")) return;

    try {
      const res = await fetch(`/api/piers/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed");

      setPiers((prev) => prev.filter((p) => p.id !== id));

      alert("Deleted successfully");
    } catch (error) {
      console.error(error);

      alert("Failed to delete");
    }
  };

  return (
    <div className="space-y-6">
      {/* FORM SECTION */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow space-y-4"
      >
        {" "}
        <h2 className="text-xl font-semibold">Configure Bridge Structure </h2>
        <select
          value={formData.bridgeId}
          onChange={(e) =>
            setFormData({
              ...formData,
              bridgeId: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Bridge</option>

          {bridges.map((bridge: any) => (
            <option key={bridge.id} value={bridge.id}>
              {bridge.pk_code}
            </option>
          ))}
        </select>
        <select
          value={formData.bridgeType}
          onChange={(e) =>
            setFormData({
              ...formData,
              bridgeType: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        >
          <option value="BRIDGE">Bridge</option>

          <option value="OVERBRIDGE">Overbridge</option>
        </select>
        {formData.bridgeType === "BRIDGE" && (
          <input
            type="number"
            min={2}
            placeholder="Number of Piers"
            value={formData.pierCount}
            onChange={(e) =>
              setFormData({
                ...formData,
                pierCount: Number(e.target.value),
              })
            }
            className="w-full border p-2 rounded"
            required
          />
        )}
        <input
          type="number"
          step="0.01"
          placeholder="Default Height"
          value={formData.height}
          onChange={(e) =>
            setFormData({
              ...formData,
              height: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        />
        <select
          value={formData.shape}
          onChange={(e) =>
            setFormData({
              ...formData,
              shape: e.target.value,
            })
          }
          className="w-full border p-2 rounded"
        >
          <option value="">Select Shape</option>

          <option value="CIRCULAR">Circular</option>

          <option value="OCTAGONAL">Octagonal</option>
        </select>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Generate Structure
        </button>
      </form>

      {/* TABLE SECTION (NOW INSIDE SAME PARENT) */}
      <div className="mt-10 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">
          Existing Bridge Structures
        </h2>

        <div className="mb-4">
          <select
            value={selectedBridge}
            onChange={(e) => setSelectedBridge(e.target.value)}
            className="w-full border p-2 rounded"
          >
            <option value="">Search / Select Bridge</option>

            {bridges.map((bridge: any) => (
              <option key={bridge.id} value={bridge.id}>
                {bridge.pk_code}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-2">Pier No.</th>
                <th className="border p-2">Type</th>
                <th className="border p-2">Height</th>
                <th className="border p-2">Shape</th>
                <th className="border p-2">Columns</th>
                <th className="border p-2">Actions</th>
              </tr>
            </thead>

            <tbody>
              {piers.map((pier: any) => (
                <tr key={pier.id}>
                  <td className="border p-2">{pier.pierNumber}</td>
                  <td className="border p-2">{pier.type}</td>
                  <td className="border p-2">{pier.height ?? "-"}</td>
                  <td className="border p-2">{pier.shape ?? "-"}</td>
                  <td className="border p-2">{pier.columnCount}</td>
                  <td className="border p-2">
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded"
                      onClick={() => alert(`Edit ${pier.pierNumber}`)}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
