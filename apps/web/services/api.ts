import type { HealthStatus } from "@/types/health";
import type { Client, ClientPayload } from "@/types/client";
import type { Project, ProjectFilters, ProjectPayload } from "@/types/project";
import type { Workspace } from "@/types/workspace";

import { backendFetch } from "@/services/backend";

export async function getBackendHealth(): Promise<HealthStatus> {
  return backendFetch<HealthStatus>("/health");
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
