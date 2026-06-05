import { CalendarClock } from "lucide-react";
import Link from "next/link";

import { TaskPriorityBadge, TaskStatusBadge } from "@/features/tasks/task-badges";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

export function UpcomingTasks({
  projects,
  tasks,
}: {
  projects: Project[];
  tasks: Task[];
}) {
  const projectsById = new Map(projects.map((project) => [project.id, project]));
  const upcoming = tasks
    .filter(
      (task) =>
        task.dueDate && task.status !== "completed" && task.status !== "archived",
    )
    .sort((a, b) => a.dueDate!.localeCompare(b.dueDate!))
    .slice(0, 5);

  if (upcoming.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No open tasks currently have due dates.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border">
      {upcoming.map((task) => (
        <div
          className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0"
          key={task.id}
        >
          <div className="min-w-0">
            <Link
              className="font-medium hover:text-primary"
              href={`/tasks/${task.id}`}
            >
              {task.title}
            </Link>
            <p className="mt-1 text-xs text-muted-foreground">
              {projectsById.get(task.projectId)?.name ?? "Unknown project"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <TaskStatusBadge status={task.status} />
            <TaskPriorityBadge priority={task.priority} />
            <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarClock className="h-3.5 w-3.5" aria-hidden="true" />
              {formatDate(task.dueDate!)}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(
    new Date(`${value}T00:00:00`),
  );
}
