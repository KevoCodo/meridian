export type ProjectStatus =
  | "planning"
  | "active"
  | "paused"
  | "completed"
  | "archived";

export type ProjectPriority = "low" | "medium" | "high";

export type Project = {
  id: string;
  workspaceId: string;
  clientId: string;
  name: string;
  description: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectPayload = {
  workspaceId: string;
  clientId: string;
  name: string;
  description?: string | null;
  status: ProjectStatus;
  priority: ProjectPriority;
  startDate?: string | null;
  dueDate?: string | null;
};

export type ProjectFilters = {
  workspaceId?: string;
  clientId?: string;
  status?: ProjectStatus;
};
