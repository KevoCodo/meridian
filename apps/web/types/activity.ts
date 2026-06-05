export type ActivityEntityType =
  | "client"
  | "project"
  | "task"
  | "note"
  | "workspace";

export type ActivityAction =
  | "created"
  | "updated"
  | "completed"
  | "archived"
  | "note_added";

export type Activity = {
  id: string;
  workspaceId: string;
  entityType: ActivityEntityType;
  entityId: string;
  action: ActivityAction;
  message: string;
  metadata: Record<string, unknown>;
  createdAt: string;
};

export type ActivityFilters = {
  workspaceId?: string;
  entityType?: ActivityEntityType;
  entityId?: string;
};
