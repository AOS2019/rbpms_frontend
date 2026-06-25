"use client";

import { useEffect, useState } from "react";

export default function TeamsPage() {
  const [teams, setTeams] = useState<any[]>([]);
  const [name, setName] = useState("");

  const loadTeams = async () => {
    const res = await fetch("/api/teams");
    const data = await res.json();

    setTeams(Array.isArray(data.data) ? data.data : []);
  };

  useEffect(() => {
    loadTeams();
  }, []);

  const createTeam = async () => {
    await fetch("/api/teams", {
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body: JSON.stringify({
        name
      })
    });

    setName("");
    loadTeams();
  };

  return (
    <div className="p-6">

      <h1 className="text-2xl font-bold mb-4">
        Teams
      </h1>

      <div className="flex gap-2 mb-4">

        <input
          value={name}
          onChange={(e)=>setName(e.target.value)}
          placeholder="Team A"
          className="border p-2"
        />

        <button
          onClick={createTeam}
          className="bg-blue-600 text-white px-4"
        >
          Add Team
        </button>

      </div>

      {Array.isArray(teams) && teams.map((team:any)=>(
        <div
          key={team.id}
          className="border p-2 mb-2"
        >
          {team.name}
        </div>
      ))}

    </div>
  );
}