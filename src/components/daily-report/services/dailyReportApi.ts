import {
  ActivityRow,
  DailyReportPayload,
  Employee,
  Team,
  Bridge,
  Element,
  Pier,
  Equipment,
  CrewRow,
  CrewOption,
} from "../types";

const JSON_HEADERS = {
  "Content-Type": "application/json",
};

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, options);

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

/* ---------------------------------------------------- */
/* Master Data                                           */
/* ---------------------------------------------------- */

export const getTeams = () => request<Team[]>("/api/teams");

export const getBridges = () => request<Bridge[]>("/api/bridges");

export const getEmployees = () => request<Employee[]>("/api/employees");

export const getElements = () => request<Element[]>("/api/elements");

export const getEquipment = () => request<Equipment[]>("/api/equipment");

/* ---------------------------------------------------- */
/* Bridge Dependent                                      */
/* ---------------------------------------------------- */

export const getBridgePiers = (bridgeId: number) =>
  request<Pier[]>(`/api/piers?bridge=${bridgeId}`);

export const getCrews = (teamId?: number) =>
  request<CrewOption[]>(teamId ? `/api/crews?teamId=${teamId}` : "/api/crews");

export const getCrewMembers = (crewId: number) =>
  request(`/api/crews/${crewId}/members`);

/* ---------------------------------------------------- */
/* Helper Methods                                        */
/* ---------------------------------------------------- */
// Load crews assigned to a bridge
export const getBridgeCrews = (bridgeId: number) =>
  request<CrewRow[]>(`/api/bridges/${bridgeId}/crews`);

// Employees available for reassignment
export const getAvailableEmployees = (bridgeId: number) =>
  request<Employee[]>(`/api/employees/available?bridgeId=${bridgeId}`);

// Employees currently on mission
export const getEmployeesOnMission = (bridgeId: number) =>
  request<Employee[]>(`/api/employees/mission?bridgeId=${bridgeId}`);

// export const getTeamMembers = (
//   teamId: number
// ) =>
//   request<Employee[]>(
//     `/api/teams/${teamId}/members`
//   );

/* ---------------------------------------------------- */
/* Daily Reports                                         */
/* ---------------------------------------------------- */

export const createDailyReport = (body: DailyReportPayload) =>
  request("/api/daily-reports", {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });

export const updateDailyReport = (id: number, body: DailyReportPayload) =>
  request(`/api/daily-reports/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(body),
  });

export const getDailyReport = (id: number) =>
  request(`/api/daily-reports/${id}`);

export const deleteDailyReport = (id: number) =>
  request(`/api/daily-reports/${id}`, {
    method: "DELETE",
  });

/* ---------------------------------------------------- */
/* Weekly Plan Integration                               */
/* ---------------------------------------------------- */

export const getWeeklyPlan = (bridgeId: number, weekStart: string) =>
  request(`/api/weekly-plans?bridgeId=${bridgeId}&weekStart=${weekStart}`);

export const importWeeklyPlanTasks = (bridgeId: number, weekStart: string) =>
  request<ActivityRow[]>(
    `/api/weekly-plans/import?bridgeId=${bridgeId}&weekStart=${weekStart}`,
  );
