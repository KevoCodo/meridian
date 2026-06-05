export type AutomationTriggerType =
  | "task_completed"
  | "project_created"
  | "client_created";

export type AutomationActionType =
  | "create_follow_up_task"
  | "add_activity_log"
  | "create_note_stub";

export type AutomationRule = {
  id: string;
  workspaceId: string;
  name: string;
  description: string | null;
  triggerType: AutomationTriggerType;
  actionType: AutomationActionType;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type AutomationRulePayload = {
  workspaceId: string;
  name: string;
  description?: string | null;
  triggerType: AutomationTriggerType;
  actionType: AutomationActionType;
  isActive: boolean;
};
