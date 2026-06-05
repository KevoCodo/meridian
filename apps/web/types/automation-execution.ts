import type {
  AutomationActionType,
  AutomationTriggerType,
} from "@/types/automation-rule";

export type AutomationExecution = {
  id: string;
  workspaceId: string;
  automationRuleId: string;
  triggerType: AutomationTriggerType;
  triggerEntityId: string;
  actionType: AutomationActionType;
  resultEntityId: string | null;
  createdAt: string;
};

export type AutomationExecutionFilters = {
  workspaceId?: string;
  automationRuleId?: string;
  triggerEntityId?: string;
};
