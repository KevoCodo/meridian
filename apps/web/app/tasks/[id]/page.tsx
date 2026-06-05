import { CalendarDays, Edit, UserRound } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { RelatedActivity } from "@/features/activities/related-activity";
import { AutomationResults } from "@/features/automations/automation-results";
import { TaskPriorityBadge, TaskStatusBadge } from "@/features/tasks/task-badges";
import { RelatedNotes } from "@/features/notes/related-notes";
import {
  getActivities,
  getAutomationExecutions,
  getNotes,
  getProjects,
  getTask,
} from "@/services/api";

export default async function TaskDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [task, projects, notes, activities, executions] = await Promise.all([
    getTask(id).catch(() => null),
    getProjects(),
    getNotes({ taskId: id }),
    getActivities({ entityType: "task", entityId: id }),
    getAutomationExecutions({ triggerEntityId: id }),
  ]);

  if (!task) {
    notFound();
  }

  const project = projects.find((item) => item.id === task.projectId);
  const followUpTasks = await Promise.all(
    executions
      .filter((execution) => execution.resultEntityId)
      .map((execution) => getTask(execution.resultEntityId!)),
  );

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Task details
          </p>
          <h1 className="mt-2 text-3xl font-bold">{task.title}</h1>
        </div>
        <Button asChild>
          <Link href={`/tasks/${task.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
            Edit task
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-md border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Task summary</h2>
          <dl className="mt-4 grid gap-4 text-sm">
            <Info label="Project" value={project ? project.name : "Unknown project"} />
            <Info label="Status" value={<TaskStatusBadge status={task.status} />} />
            <Info
              label="Priority"
              value={<TaskPriorityBadge priority={task.priority} />}
            />
            <Info label="Workspace ID" value={task.workspaceId} mono />
          </dl>
        </section>

        <section className="rounded-md border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Delivery</h2>
          </div>
          <dl className="grid gap-4 text-sm">
            <Info label="Due date" value={formatDate(task.dueDate)} />
            <Info
              label="Assigned to"
              value={
                <span className="inline-flex items-center gap-2">
                  <UserRound className="h-4 w-4 text-primary" aria-hidden="true" />
                  {task.assignedUser?.name || "Unassigned"}
                </span>
              }
            />
            <Info label="Created" value={formatDateTime(task.createdAt)} />
            <Info label="Updated" value={formatDateTime(task.updatedAt)} />
          </dl>
        </section>

        <section className="rounded-md border border-border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
            {task.description || "No description captured for this task yet."}
          </p>
        </section>
      </div>
      <div className="mt-5">
        <RelatedNotes createHref={`/notes/new?taskId=${task.id}`} notes={notes} />
      </div>
      <div className="mt-5">
        <RelatedActivity activities={activities} />
      </div>
      <div className="mt-5">
        <AutomationResults executions={executions} tasks={followUpTasks} />
      </div>
    </AppShell>
  );
}

function Info({
  label,
  mono,
  value,
}: {
  label: string;
  mono?: boolean;
  value: ReactNode;
}) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "break-all font-mono text-xs" : "mt-1 font-medium"}>
        {value}
      </dd>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
