import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { TaskForm } from "@/features/tasks/task-form";
import { getCurrentWorkspaceMembers, getProjects, getTask, getWorkspaces } from "@/services/api";

export default async function EditTaskPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [task, members, projects, workspaces] = await Promise.all([
    getTask(id).catch(() => null),
    getCurrentWorkspaceMembers(),
    getProjects(),
    getWorkspaces(),
  ]);

  if (!task) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Edit task
        </p>
        <h1 className="mt-2 text-3xl font-bold">{task.title}</h1>
      </div>
      <TaskForm members={members} projects={projects} task={task} workspaces={workspaces} />
    </AppShell>
  );
}
