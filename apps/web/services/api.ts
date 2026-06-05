import type { HealthStatus } from "@/types/health";
import type { Activity, ActivityFilters } from "@/types/activity";
import type {
  AutomationExecution,
  AutomationExecutionFilters,
} from "@/types/automation-execution";
import type {
  AutomationRule,
  AutomationRulePayload,
} from "@/types/automation-rule";
import type { Client, ClientPayload } from "@/types/client";
import type { DashboardOverview } from "@/types/dashboard";
import type { Note, NoteFilters, NotePayload } from "@/types/note";
import type { Project, ProjectFilters, ProjectPayload } from "@/types/project";
import type { Task, TaskFilters, TaskPayload } from "@/types/task";
import type { Workspace } from "@/types/workspace";

import { backendFetch } from "@/services/backend";

export async function getBackendHealth(): Promise<HealthStatus> {
  return backendFetch<HealthStatus>("/health");
}

export async function getDashboardOverview(
  workspaceId?: string,
): Promise<DashboardOverview> {
  const query = workspaceId ? `?workspaceId=${workspaceId}` : "";
  return backendFetch<DashboardOverview>(`/dashboard/overview${query}`);
}

export async function getActivities(
  filters: ActivityFilters = {},
): Promise<Activity[]> {
  const params = new URLSearchParams();
  if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
  if (filters.entityType) params.set("entityType", filters.entityType);
  if (filters.entityId) params.set("entityId", filters.entityId);

  const query = params.toString();
  return backendFetch<Activity[]>(`/activities${query ? `?${query}` : ""}`);
}

export async function getAutomationRules(workspaceId?: string): Promise<AutomationRule[]> {
  const query = workspaceId ? `?workspaceId=${workspaceId}` : "";
  return backendFetch<AutomationRule[]>(`/automation-rules${query}`);
}

export async function getAutomationExecutions(
  filters: AutomationExecutionFilters = {},
): Promise<AutomationExecution[]> {
  const params = new URLSearchParams();
  if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
  if (filters.automationRuleId) {
    params.set("automationRuleId", filters.automationRuleId);
  }
  if (filters.triggerEntityId) {
    params.set("triggerEntityId", filters.triggerEntityId);
  }
  const query = params.toString();
  return backendFetch<AutomationExecution[]>(
    `/automation-executions${query ? `?${query}` : ""}`,
  );
}

export async function getAutomationRule(id: string): Promise<AutomationRule> {
  return backendFetch<AutomationRule>(`/automation-rules/${id}`);
}

export async function createAutomationRule(
  payload: AutomationRulePayload,
): Promise<AutomationRule> {
  return backendFetch<AutomationRule>("/automation-rules", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateAutomationRule(
  id: string,
  payload: Partial<AutomationRulePayload>,
): Promise<AutomationRule> {
  return backendFetch<AutomationRule>(`/automation-rules/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getWorkspaces(): Promise<Workspace[]> {
  return backendFetch<Workspace[]>("/workspaces");
}

export async function getWorkspace(id: string): Promise<Workspace> {
  return backendFetch<Workspace>(`/workspaces/${id}`);
}

export async function getClients(): Promise<Client[]> {
  return backendFetch<Client[]>("/clients");
}

export async function getClient(id: string): Promise<Client> {
  return backendFetch<Client>(`/clients/${id}`);
}

export async function createClient(payload: ClientPayload): Promise<Client> {
  return backendFetch<Client>("/clients", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateClient(
  id: string,
  payload: Partial<ClientPayload>,
): Promise<Client> {
  return backendFetch<Client>(`/clients/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getProjects(
  filters: ProjectFilters = {},
): Promise<Project[]> {
  const params = new URLSearchParams();
  if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
  if (filters.clientId) params.set("clientId", filters.clientId);
  if (filters.status) params.set("status", filters.status);

  const query = params.toString();
  return backendFetch<Project[]>(`/projects${query ? `?${query}` : ""}`);
}

export async function getProject(id: string): Promise<Project> {
  return backendFetch<Project>(`/projects/${id}`);
}

export async function createProject(payload: ProjectPayload): Promise<Project> {
  return backendFetch<Project>("/projects", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateProject(
  id: string,
  payload: Partial<ProjectPayload>,
): Promise<Project> {
  return backendFetch<Project>(`/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getTasks(filters: TaskFilters = {}): Promise<Task[]> {
  const params = new URLSearchParams();
  if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
  if (filters.projectId) params.set("projectId", filters.projectId);
  if (filters.status) params.set("status", filters.status);
  if (filters.priority) params.set("priority", filters.priority);

  const query = params.toString();
  return backendFetch<Task[]>(`/tasks${query ? `?${query}` : ""}`);
}

export async function getTask(id: string): Promise<Task> {
  return backendFetch<Task>(`/tasks/${id}`);
}

export async function createTask(payload: TaskPayload): Promise<Task> {
  return backendFetch<Task>("/tasks", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateTask(
  id: string,
  payload: Partial<TaskPayload>,
): Promise<Task> {
  return backendFetch<Task>(`/tasks/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function getNotes(filters: NoteFilters = {}): Promise<Note[]> {
  const params = new URLSearchParams();
  if (filters.workspaceId) params.set("workspaceId", filters.workspaceId);
  if (filters.clientId) params.set("clientId", filters.clientId);
  if (filters.projectId) params.set("projectId", filters.projectId);
  if (filters.taskId) params.set("taskId", filters.taskId);

  const query = params.toString();
  return backendFetch<Note[]>(`/notes${query ? `?${query}` : ""}`);
}

export async function getNote(id: string): Promise<Note> {
  return backendFetch<Note>(`/notes/${id}`);
}

export async function createNote(payload: NotePayload): Promise<Note> {
  return backendFetch<Note>("/notes", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function updateNote(
  id: string,
  payload: Partial<NotePayload>,
): Promise<Note> {
  return backendFetch<Note>(`/notes/${id}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
