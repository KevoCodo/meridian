import { Plus } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { TaskFilters } from "@/features/tasks/task-filters";
import { TaskList } from "@/features/tasks/task-list";
import { getProjects, getTasks } from "@/services/api";
import type { TaskPriority, TaskStatus } from "@/types/task";

const statuses = new Set(["todo", "in_progress", "blocked", "completed", "archived"]);
const priorities = new Set(["low", "medium", "high", "urgent"]);

export default async function TasksPage({
  searchParams,
}: {
  searchParams: Promise<{ priority?: string; projectId?: string; status?: string }>;
}) {
  const params = await searchParams;
  const selectedStatus = statuses.has(params.status ?? "")
    ? (params.status as TaskStatus)
    : undefined;
  const selectedPriority = priorities.has(params.priority ?? "")
    ? (params.priority as TaskPriority)
    : undefined;
  const [projects, tasks] = await Promise.all([
    getProjects(),
    getTasks({
      projectId: params.projectId || undefined,
      status: selectedStatus,
      priority: selectedPriority,
    }),
  ]);

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Actionable work
          </p>
          <h1 className="mt-2 text-3xl font-bold">Tasks</h1>
          <p className="mt-2 text-muted-foreground">
            Track project work by status, priority, due date, and assignment.
          </p>
        </div>
        <Button asChild>
          <Link href="/tasks/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New task
          </Link>
        </Button>
      </div>
      <TaskFilters
        projects={projects}
        selectedPriority={selectedPriority}
        selectedProjectId={params.projectId}
        selectedStatus={selectedStatus}
      />
      <TaskList projects={projects} tasks={tasks} />
    </AppShell>
  );
}
