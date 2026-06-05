export type Note = {
  id: string;
  workspaceId: string;
  clientId: string | null;
  projectId: string | null;
  taskId: string | null;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
};

export type NotePayload = {
  workspaceId: string;
  clientId?: string | null;
  projectId?: string | null;
  taskId?: string | null;
  title: string;
  content: string;
};

export type NoteFilters = {
  workspaceId?: string;
  clientId?: string;
  projectId?: string;
  taskId?: string;
};
