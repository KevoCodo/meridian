import type { User } from "@/types/user";

export type TaskStatus =
  | "todo"
  | "in_progress"
  | "blocked"
  | "completed"
  | "archived";

export type TaskPriority = "low" | "medium" | "high" | "urgent";

export type Task = {
  id: string;
  workspaceId: string;
  projectId: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignedUserId: string | null;
  assignedUser: User | null;
  createdAt: string;
  updatedAt: string;
};

export type TaskPayload = {
  workspaceId: string;
  projectId: string;
  title: string;
  description?: string | null;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate?: string | null;
  assignedUserId?: string | null;
};

export type TaskFilters = {
  workspaceId?: string;
  projectId?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
};
