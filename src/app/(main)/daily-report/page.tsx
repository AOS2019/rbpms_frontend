"use client";
import { useState, useEffect } from "react";

interface ActivityRow {
    team: string;
    bridge: number | string;
    pier: string;
    element: string;
    activity: string;
    quantity: number;
    unit: string;
    grade: string;
    errors?: any;
}

export default function DailyReport() {
    const [rows, setRows] = useState<ActivityRow[]>([]);
    const [teams, setTeams] = useState<string[]>([]);
    const [bridges, setBridges] = useState<any[]>([]);
    // const [sections, setSections] = useState([]);
    const [piers, setPiers] = useState<any[]>([]);
    // const [form, setForm] = useState({
    //     pk_code: '',
    //     location: '',
    //     bridgeId: null as number | null
    // });
    

    const validateRows = () => {
        let isValid = true;
        const validatedRows = rows.map((row) => {
            let errors: any = {};
            if (!row.team) errors.team = "Required";
            if (!row.bridge) errors.bridge = "Required";
            if (!row.pier) errors.pier = "Required";
            if (!row.activity) errors.activity = "Required";
            if (!row.quantity || row.quantity <= 0)
                errors.quantity = "Must be greater than 0";
            if (row.activity === "Concrete" && !row.grade)
                errors.grade = "Concrete grade required";
            if (!row.unit) errors.unit = "Required";
            if (Object.keys(errors).length > 0) isValid = false;
            return { ...row, errors };
        });
        setRows(validatedRows);
        return isValid;
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamsRes = await fetch("/api/teams");
                const teamsData = await teamsRes.json();

                // const sectionsRes = await fetch("/api/sections");
                // const sectionsData = await sectionsRes.json();

                const bridgesRes = await fetch("/api/bridges");
                const bridgesData = await bridgesRes.json();

                // setTeams(teamsData.data || []);
                setTeams(Array.isArray(teamsData.data) ? teamsData.data : []);
                // setBridges(bridgesData.data || []);
                // setBridges(Array.isArray(bridgesData.data) ? bridgesData.data : []);

                setBridges(
                    Array.isArray(bridgesData.data)
                        ? bridgesData.data
                        : []
                );


                // setSections(sectionsData.data || []);
                // setSections(Array.isArray(sectionsData.data) ? sectionsData.data : []);
            } catch (error) {
                console.error("Fetch error:", error);

                setTeams([]);
                setBridges([]);
            }
        };

        fetchData();

        if (rows.length === 0) {
            setRows([
                {
                    team: "",
                    bridge: "",
                    pier: "",
                    element: "",
                    activity: "",
                    quantity: 0,
                    unit: "",
                    grade: "",
                },
            ]);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const activityUnitMap: any = {
        Concrete: "m³",
        Reinforcement: "tons",
        Formwork: "m²",
    };

    const handleActivityChange = (index: number, value: string) => {
        const unit = activityUnitMap[value] || "";
        const newRows = [...rows];
        newRows[index].activity = value;
        newRows[index].unit = unit;
        setRows(newRows);
    };

    const addRow = () => {
        setRows([
            ...rows,
            {
                team: "",
                bridge: "",
                pier: "",
                element: "",
                activity: "",
                quantity: 0,
                unit: "",
                grade: "",
            },
        ]);
    };

    const removeRow = (index: number) => {
        setRows(rows.filter((_, i) => i !== index));
    };

    const updateRow = <K extends keyof ActivityRow>(
        index: number,
        field: K,
        value: ActivityRow[K]
    ) => {
        const newRows = [...rows];
        newRows[index] = { ...newRows[index], [field]: value };
        setRows(newRows);
    };

    const loadPiers = async (
        bridgeId: string,
        index: number
    ) => {
        try {
            const res = await fetch(
                `/api/piers?bridge=${bridgeId}`
            );

            if (!res.ok) {
                console.error(
                    "Failed to load piers:",
                    await res.text()
                );
                return;
            }

            const data = await res.json();

            if (data.success) {
                setPiers(data.data || []);
            } else {
                setPiers([]);
            }
            updateRow(index, "bridge", bridgeId);
        } catch (error) {
            console.error(error);
            setPiers([]);
        }
    };

    const handleSubmit = async () => {
        const isValid = validateRows();
        if (!isValid) {
            alert("Please fix validation errors");
            return;
        }

        await fetch("http://localhost:5000/api/daily-report/manual", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ rows }),
        });

        alert("Report submitted successfully!");
    };

    const standardInputClass =
        "w-full p-2 border rounded bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-200";

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-3 sm:px-6">
            <div className="max-w-5xl mx-auto">
                <header className="mb-6">
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
                        Daily Report
                    </h1>
                    <p className="text-xs sm:text-sm text-gray-500 mt-1">
                        Record daily activities quickly. Fields with errors are highlighted.
                    </p>
                </header>

                <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm mb-6">
                    <h2 className="text-md sm:text-lg font-medium text-gray-700 mb-4">
                        General Info
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <label className="flex flex-col text-sm">
                            <span className="mb-2 text-gray-600">Date</span>
                            <input
                                type="date"
                                className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                            />
                        </label>

                        <label className="flex flex-col text-sm">
                            <span className="mb-2 text-gray-600">Site Engineer</span>
                            <select className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                                <option>Select Site Engineer</option>
                            </select>
                        </label>

                        <label className="flex flex-col text-sm">
                            <span className="mb-2 text-gray-600">Foreman</span>
                            <select className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                                <option>Select Foreman</option>
                            </select>
                        </label>

                        <label className="flex flex-col text-sm sm:col-span-2">
                            <span className="mb-2 text-gray-600">Weather</span>
                            <select className="p-2 border rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-300">
                                <option>Weather</option>
                                <option>Sunny</option>
                                <option>Rainy</option>
                            </select>
                        </label>

                        <div className="flex items-end justify-end">
                            <div className="text-sm text-gray-500">Entries: {rows.length}</div>
                        </div>
                    </div>
                </section>

                <section className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
                    <div className="md:hidden space-y-4">
                        {rows.map((row, index) => (
                            <div
                                key={index}
                                className="border border-gray-200 rounded-lg p-3 bg-gray-50"
                            >
                                <div className="grid grid-cols-1 gap-2">
                                    <div>
                                        <label className="text-xs text-gray-700">Team</label>
                                        <select
                                            value={row.team}
                                            onChange={(e) => updateRow(index, "team", e.target.value)}
                                            className={`${standardInputClass} ${row.errors?.team ? "border-red-400 ring-1 ring-red-200" : ""}`}
                                        >
                                            <option value="" disabled>Select team</option>
                                            {teams.map((t, i) => (
                                                <option key={i} value={t}>
                                                    {t}
                                                </option>
                                            ))}
                                        </select>
                                        {row.errors?.team && (
                                            <p className="text-red-600 text-xs mt-1">{row.errors.team}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700">Bridge</label>

                                        <select
                                            value={row.bridge}
                                            onChange={(e) => loadPiers(e.target.value, index)}
                                            className={`${standardInputClass} ${
                                                row.errors?.bridge
                                                    ? "border-red-400 ring-1 ring-red-200"
                                                    : ""
                                            }`}
                                        >
                                            <option value="">Select Bridge</option>

                                            {Array.isArray(bridges) &&
                                                bridges.map((bridge: any) => (
                                                    <option
                                                        key={bridge.id}
                                                        value={bridge.id}
                                                    >
                                                        {bridge.pk_code}
                                                    </option>
                                                ))}
                                        </select>
                                        {row.errors?.bridge && (
                                            <p className="text-red-600 text-xs mt-1">{row.errors.bridge}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700">Pier</label>
                                        <select
                                            value={row.pier}
                                            onChange={(e) => updateRow(index, "pier", e.target.value)}
                                            className={`${standardInputClass} ${row.errors?.pier ? "border-red-400 ring-1 ring-red-200" : ""}`}
                                        >
                                            <option value="" disabled>Select pier</option>
                                            {piers.map((p: any) => (
                                                <option key={p.id} value={p.pier_number ?? p.id}>
                                                    {p.pier_number ?? `Pier ${p.id}`}
                                                </option>
                                            ))}
                                        </select>
                                        {row.errors?.pier && (
                                            <p className="text-red-600 text-xs mt-1">{row.errors.pier}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700">Element</label>
                                        <input
                                            value={row.element}
                                            onChange={(e) => updateRow(index, "element", e.target.value)}
                                            className={standardInputClass}
                                            placeholder="e.g. Beam / Deck"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700">Activity</label>
                                        <input
                                            value={row.activity}
                                            onChange={(e) => handleActivityChange(index, e.target.value)}
                                            className={`${standardInputClass} ${row.errors?.activity ? "border-red-400 ring-1 ring-red-200" : ""}`}
                                            placeholder="Activity"
                                        />
                                        {row.errors?.activity && (
                                            <p className="text-red-600 text-xs mt-1">{row.errors.activity}</p>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-2">
                                        <div>
                                            <label className="text-xs text-gray-700">Qty</label>
                                            <input
                                                type="number"
                                                min={0}
                                                value={row.quantity}
                                                onChange={(e) =>
                                                    updateRow(index, "quantity", Number(e.target.value))
                                                }
                                                className={`${standardInputClass} ${row.errors?.quantity ? "border-red-400 ring-1 ring-red-200" : ""}`}
                                            />
                                            {row.errors?.quantity && (
                                                <p className="text-red-600 text-xs mt-1">{row.errors.quantity}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="text-xs text-gray-700">Unit</label>
                                            <input
                                                value={row.unit}
                                                onChange={(e) => updateRow(index, "unit", e.target.value)}
                                                className={`${standardInputClass} ${row.errors?.unit ? "border-red-400 ring-1 ring-red-200" : ""}`}
                                            />
                                            {row.errors?.unit && (
                                                <p className="text-red-600 text-xs mt-1">{row.errors.unit}</p>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-xs text-gray-700">Grade</label>
                                        <input
                                            value={row.grade}
                                            onChange={(e) => updateRow(index, "grade", e.target.value)}
                                            className={`${standardInputClass} ${row.activity === "Concrete" ? "bg-white" : "bg-gray-50"}`}
                                            placeholder={row.activity === "Concrete" ? "Grade (e.g. M20)" : "Optional"}
                                        />
                                        {row.errors?.grade && (
                                            <p className="text-red-600 text-xs mt-1">{row.errors.grade}</p>
                                        )}
                                    </div>

                                    <button
                                        onClick={() => removeRow(index)}
                                        className="py-2 px-3 text-xs text-white bg-red-600 rounded-md hover:bg-red-700 mt-1"
                                        aria-label={`Remove row ${index + 1}`}
                                    >
                                        Remove row
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block overflow-x-auto">
                        <table className="w-full min-w-[900px] border-collapse">
                            <thead>
                                <tr className="bg-gray-100 text-left text-xs text-gray-700 uppercase tracking-wider">
                                    <th className="p-3 sticky top-0 bg-gray-100 z-20">Team</th>
                                    <th className="p-3 sticky top-0 bg-gray-100 z-20">Bridge</th>
                                    <th className="p-3 sticky top-0 bg-gray-100 z-20">Pier</th>
                                    <th className="p-3 sticky top-0 bg-gray-100 z-20">Element</th>
                                    <th className="p-3 sticky top-0 bg-gray-100 z-20">Activity</th>
                                    <th className="p-3 sticky top-0 bg-gray-100 z-20">Qty</th>
                                    <th className="p-3 sticky top-0 bg-gray-100 z-20">Unit</th>
                                    <th className="p-3 sticky top-0 bg-gray-100 z-20">Grade</th>
                                    <th className="p-3 sticky top-0 bg-gray-100 z-20 w-12" />
                                </tr>
                            </thead>

                            <tbody className="text-gray-700">
                                {rows.map((row, index) => (
                                    <tr
                                        key={index}
                                        className={`border-b last:border-b-0 ${
                                            index % 2 === 0 ? "bg-white" : "bg-gray-50"
                                        }`}
                                    >
                                        <td className="p-2 align-top">
                                            <select
                                                value={row.team}
                                                onChange={(e) => updateRow(index, "team", e.target.value)}
                                                className={`w-44 p-2 border rounded bg-white text-sm focus:outline-none ${
                                                    row.errors?.team
                                                        ? "border-red-400 ring-1 ring-red-200"
                                                        : "focus:ring-2 focus:ring-blue-200"
                                                }`}
                                                aria-label={`Team ${index + 1}`}
                                            >
                                                <option value="" disabled>
                                                    Select team
                                                </option>
                                                {teams.map((t, i) => (
                                                    <option key={i} value={t}>
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                            {row.errors?.team && (
                                                <p className="text-red-600 text-xs mt-1">{row.errors.team}</p>
                                            )}
                                        </td>
                                        <td className="p-2 align-top">
                                            <select
                                                value={row.bridge}
                                                onChange={(e) => loadPiers(e.target.value, index)}
                                                className={`w-44 p-2 border rounded bg-white text-sm focus:outline-none ${
                                                    row.errors?.bridge
                                                        ? "border-red-400 ring-1 ring-red-200"
                                                        : "focus:ring-2 focus:ring-blue-200"
                                                }`}
                                                aria-label={`Bridge ${index + 1}`}
                                            >
                                                <option value="" disabled>
                                                    Select bridge
                                                </option>
                                                {Array.isArray(bridges) &&
                                                    bridges.map((bridge: any) => (
                                                        <option
                                                            key={bridge.id}
                                                            value={bridge.id}
                                                        >
                                                            {bridge.pk_code}
                                                        </option>
                                                ))}
                                            </select>
                                            {row.errors?.bridge && (
                                                <p className="text-red-600 text-xs mt-1">{row.errors.bridge}</p>
                                            )}
                                        </td>
                                        <td className="p-2 align-top">
                                            <select
                                                value={row.pier}
                                                onChange={(e) => updateRow(index, "pier", e.target.value)}
                                                className={`w-36 p-2 border rounded bg-white text-sm focus:outline-none ${
                                                    row.errors?.pier
                                                        ? "border-red-400 ring-1 ring-red-200"
                                                        : "focus:ring-2 focus:ring-blue-200"
                                                }`}
                                                aria-label={`Pier ${index + 1}`}
                                            >
                                                <option value="" disabled>
                                                    Select pier
                                                </option>
                                                {piers.map((p: any) => (
                                                    <option key={p.id} value={p.pier_number ?? p.id}>
                                                        {p.pier_number ?? `Pier ${p.id}`}
                                                    </option>
                                                ))}
                                            </select>
                                            {row.errors?.pier && (
                                                <p className="text-red-600 text-xs mt-1">{row.errors.pier}</p>
                                            )}
                                        </td>
                                        <td className="p-2 align-top">
                                            <input
                                                value={row.element}
                                                onChange={(e) => updateRow(index, "element", e.target.value)}
                                                className="w-48 p-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                                                placeholder="e.g. Beam / Deck"
                                                aria-label={`Element ${index + 1}`}
                                            />
                                        </td>
                                        <td className="p-2 align-top">
                                            <input
                                                value={row.activity}
                                                onChange={(e) => handleActivityChange(index, e.target.value)}
                                                className={`w-48 p-2 border rounded text-sm focus:outline-none ${
                                                    row.errors?.activity
                                                        ? "border-red-400 ring-1 ring-red-200"
                                                        : "focus:ring-2 focus:ring-blue-200"
                                                }`}
                                                placeholder="Activity"
                                                aria-label={`Activity ${index + 1}`}
                                            />
                                            {row.errors?.activity && (
                                                <p className="text-red-600 text-xs mt-1">{row.errors.activity}</p>
                                            )}
                                        </td>
                                        <td className="p-2 align-top">
                                            <input
                                                type="number"
                                                min={0}
                                                value={row.quantity}
                                                onChange={(e) =>
                                                    updateRow(index, "quantity", Number(e.target.value))
                                                }
                                                className={`w-24 p-2 border rounded text-sm focus:outline-none ${
                                                    row.errors?.quantity
                                                        ? "border-red-400 ring-1 ring-red-200"
                                                        : "focus:ring-2 focus:ring-blue-200"
                                                }`}
                                                aria-label={`Quantity ${index + 1}`}
                                            />
                                            {row.errors?.quantity && (
                                                <p className="text-red-600 text-xs mt-1">{row.errors.quantity}</p>
                                            )}
                                        </td>
                                        <td className="p-2 align-top">
                                            <input
                                                value={row.unit}
                                                onChange={(e) => updateRow(index, "unit", e.target.value)}
                                                className={`w-24 p-2 border rounded text-sm focus:outline-none ${
                                                    row.errors?.unit
                                                        ? "border-red-400 ring-1 ring-red-200"
                                                        : "focus:ring-2 focus:ring-blue-200"
                                                }`}
                                                placeholder="Unit"
                                                aria-label={`Unit ${index + 1}`}
                                            />
                                            {row.errors?.unit && (
                                                <p className="text-red-600 text-xs mt-1">{row.errors.unit}</p>
                                            )}
                                        </td>
                                        <td className="p-2 align-top">
                                            <input
                                                value={row.grade}
                                                onChange={(e) => updateRow(index, "grade", e.target.value)}
                                                className={`w-28 p-2 border rounded text-sm focus:outline-none ${
                                                    row.activity === "Concrete"
                                                        ? "bg-white"
                                                        : "bg-gray-50"
                                                }`}
                                                placeholder={row.activity === "Concrete" ? "Grade (e.g. M20)" : "Optional"}
                                                aria-label={`Grade ${index + 1}`}
                                            />
                                            {row.errors?.grade && (
                                                <p className="text-red-600 text-xs mt-1">{row.errors.grade}</p>
                                            )}
                                        </td>
                                        <td className="p-2 align-top text-center">
                                            <button
                                                onClick={() => removeRow(index)}
                                                className="inline-flex items-center justify-center w-9 h-9 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
                                                title="Remove row"
                                                aria-label={`Remove row ${index + 1}`}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                                    <path fillRule="evenodd" d="M6.292 6.292a1 1 0 011.414 0L10 8.586l2.294-2.294a1 1 0 011.414 1.414L11.414 10l2.294 2.294a1 1 0 01-1.414 1.414L10 11.414l-2.294 2.294a1 1 0 01-1.414-1.414L8.586 10 6.292 7.706a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-3 justify-end">
                        <button
                            onClick={addRow}
                            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                            Add Row
                        </button>

                        <button
                            onClick={handleSubmit}
                            className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-300"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
                                <path d="M2.003 5.884L10 9.882l7.997-3.998A1 1 0 0017.997 4H2.003a1 1 0 00-.0 1.884z" />
                                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                            </svg>
                            Submit Report
                        </button>
                    </div>
                </section>
            </div>
        </div>
    );
}
