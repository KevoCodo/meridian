import { Workflow } from "lucide-react";
import Link from "next/link";

import type { AutomationExecution } from "@/types/automation-execution";
import type { Task } from "@/types/task";

export function AutomationResults({
  executions,
  tasks,
}: {
  executions: AutomationExecution[];
  tasks: Task[];
}) {
  if (executions.length === 0) {
    return null;
  }

  const tasksById = new Map(tasks.map((task) => [task.id, task]));

  return (
    <section className="rounded-md border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Workflow className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Automation-created follow-up</h2>
      </div>
      <div className="divide-y divide-border">
        {executions.map((execution) => {
          const task = execution.resultEntityId
            ? tasksById.get(execution.resultEntityId)
            : undefined;
          return (
            <div className="py-3 first:pt-0 last:pb-0" key={execution.id}>
              {task ? (
                <Link
                  className="font-medium text-primary hover:underline"
                  href={`/tasks/${task.id}`}
                >
                  {task.title}
                </Link>
              ) : (
                <p className="font-medium">Follow-up task unavailable</p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">
                Created {formatDateTime(execution.createdAt)}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
