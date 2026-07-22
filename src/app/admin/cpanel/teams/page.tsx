"use client";

import { useEffect, useState } from "react";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);

  const [selectedTeam, setSelectedTeam] = useState<any>(null);

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");

  // Load employees and teams from the API
  const loadEmployees = async () => {
    const res = await fetch("/api/employees");

    const data = await res.json();

    console.log(data);

    setEmployees(data.data ?? []);
  };

  // Load teams from the API
  const loadTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();

    setTeams(Array.isArray(data.data) ? data.data : []);
  };

  // Load employees and teams when the component mounts
  useEffect(() => {
    loadEmployees();
    loadTeams();
  }, []);

  // Open the modal to show team members
  const openMembers = (team: any) => {
    setSelectedTeam(team);

    setSelectedIds(team.members.map((m: any) => m.employeeId));

    setShowModal(true);
  };

  // Toggle the selection of an employee by their ID
  const toggleEmployee = (id: number) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Save the selected members for the selected team by sending a POST request to the API
  const saveMembers = async () => {

    if (!selectedTeam) return;
    
    const res = await fetch(
      `/api/teams/${selectedTeam.id}/members`,

      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          employeeIds: selectedIds,
        }),
      },
    );

    const data = await res.json();

    //console.log(data);

    // Reload team list
    await loadTeams();
  
    setShowModal(false);
    setSelectedTeam(null);
  };

  // Create a new team by sending a POST request to the API
  const createTeam = async () => {
    await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
      }),
    });

    setName("");
    loadTeams();
  };

  // Filter employees based on the search input
  const filteredEmployees = employees.filter((e: any) => {
    const text = `${e.staffId}
      ${e.firstName}
      ${e.lastName}
      ${e.trade}
      ${e.designation}`.toLowerCase();

    return text.includes(search.toLowerCase());
  });

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Team Management</h1>
      <div className="mb-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        {/* Input for creating a new team */}
        <div className="flex gap-2 mb-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Team A"
            className="border p-2"
          />

          <button onClick={createTeam} className="bg-blue-600 text-white px-4">
            Add Team
          </button>
        </div>

        {/* Search input for filtering employees */}
        {/* <div className="mb-4 flex gap-2 items-center">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee..."
            className="w-full rounded-lg border px-3 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div> */}
      </div>

      {/* Display the list of employees with checkboxes for selection */}
      {/* <div className="mb-4 max-h-96 overflow-y-auto rounded-lg border">
        {filteredEmployees.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No employee found.
          </div>
        ) : (
          filteredEmployees.map((employee: any) => (
            <label
              key={employee.id}
              className="flex cursor-pointer items-center gap-3 border-b p-3 hover:bg-gray-50"
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(employee.id)}
                onChange={() => toggleEmployee(employee.id)}
                className="h-4 w-4"
              />

              <div className="flex-1">
                <div className="font-medium">
                  {employee.firstName} {employee.lastName}
                </div>

                <div className="text-sm text-gray-500">
                  Staff ID: {employee.staffId}
                </div>

                <div className="text-xs text-gray-400">
                  {employee.trade || "No Trade"}

                  {" • "}

                  {employee.designation || "No Designation"}
                </div>
              </div>
            </label>
          ))
        )} */}

      {/* Modal for managing team members */}
      {/* <div className="mt-5 flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="rounded-lg border px-5 py-2"
          >
            Cancel
          </button>

          <button
            onClick={saveMembers}
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Save
          </button>
        </div> */}
      {/* </div> */}

      {showModal && selectedTeam && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
            {/* Header */}

            <div className="flex items-center justify-between border-b px-6 py-4">
              <div>
                <h2 className="text-xl font-bold">Assign Members</h2>

                <p className="text-sm text-gray-500">{selectedTeam.name}</p>
              </div>

              <button
                onClick={() => setShowModal(false)}
                className="text-2xl text-gray-500 hover:text-red-600"
              >
                ×
              </button>
            </div>

            {/* Search */}

            <div className="border-b p-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search employee..."
                className="w-full rounded border p-2"
              />
            </div>

            {/* Employee List */}

            <div className="max-h-[420px] overflow-y-auto p-4">
              {filteredEmployees.length === 0 && (
                <div className="py-6 text-center text-gray-500">
                  No employees found
                </div>
              )}

              {filteredEmployees.map((employee: any) => (
                <label
                  key={employee.id}
                  className="mb-2 flex cursor-pointer items-center justify-between rounded border p-3 hover:bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(employee.id)}
                      onChange={() => toggleEmployee(employee.id)}
                      className="h-5 w-5"
                    />

                    <div>
                      <div className="font-medium">
                        {employee.firstName} {employee.lastName}
                      </div>

                      <div className="text-sm text-gray-500">
                        {employee.staffId}

                        {" • "}

                        {employee.trade || employee.designation || "-"}
                      </div>
                    </div>
                  </div>

                  {selectedIds.includes(employee.id) && (
                    <span className="font-bold text-green-600">✓</span>
                  )}
                </label>
              ))}
            </div>

            {/* Footer */}

            <div className="flex justify-end gap-3 border-t px-6 py-4">
              <button
                onClick={() => setShowModal(false)}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>

              <button
                onClick={saveMembers}
                className="rounded bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Display the list of teams */}
      {Array.isArray(teams) &&
        teams.map((team: any) => (
          <div
            key={team.id}
            className="border p-2 mb-2 rounded-lg hover:bg-gray-50 transition duration-200 ease-in-out cursor-pointer hover:shadow-md hover:scale-[1.01] transform transition-all duration-300 ease-in-out"
          >
            <h2 className="text-lg font-bold">{team.name}</h2>
            <p className="text-sm text-gray-500">
              {team.members.length} Members
            </p>
            <div className="mt-3 space-y-1">
              {team.members.slice(0, 4).map((m: any) => (
                <div key={m.id}>
                  {m.employee.firstName} {m.employee.lastName}
                </div>
              ))}

              {team.members.length > 4 && (
                <div className="text-gray-500">
                  +{team.members.length - 4} more
                </div>
              )}
            </div>
            <button
              onClick={() => openMembers(team)}
              className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
            >
              Manage Members
            </button>
          </div>
        ))}
    </div>
  );
}
