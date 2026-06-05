import type {
  AutomationRule,
  AutomationActionType,
  AutomationTriggerType,
} from "@/types/automation-rule";

const triggerLabels: Record<AutomationTriggerType, string> = {
  task_completed: "Task completed",
  project_created: "Project created",
  client_created: "Client created",
};

const actionLabels: Record<AutomationActionType, string> = {
  create_follow_up_task: "Create follow-up task",
  add_activity_log: "Add activity log",
  create_note_stub: "Create note stub",
};

export function triggerLabel(value: AutomationTriggerType) {
  return triggerLabels[value];
}

export function executionExplanation(rule: AutomationRule) {
  if (
    rule.triggerType === "task_completed" &&
    rule.actionType === "create_follow_up_task"
  ) {
    return "When a task is completed, Meridian creates one follow-up task in the same project. The same rule will not run twice for that completed task.";
  }
  return "This trigger and action are defined for future automation support but are not executed in Phase 4B.";
}

export function actionLabel(value: AutomationActionType) {
  return actionLabels[value];
}

export function ActiveBadge({ active }: { active: boolean }) {
  return (
    <span
      className={
        active
          ? "rounded-md bg-emerald-100 px-2 py-1 text-xs font-medium text-emerald-800"
          : "rounded-md bg-muted px-2 py-1 text-xs font-medium text-muted-foreground"
      }
    >
      {active ? "Active" : "Inactive"}
    </span>
  );
}
