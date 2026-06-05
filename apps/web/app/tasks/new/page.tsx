import { AppShell } from "@/components/app-shell";
import { TaskForm } from "@/features/tasks/task-form";
import { getProjects, getWorkspaces } from "@/services/api";

export default async function NewTaskPage() {
  const [projects, workspaces] = await Promise.all([getProjects(), getWorkspaces()]);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          New task
        </p>
        <h1 className="mt-2 text-3xl font-bold">Create task</h1>
      </div>
      <TaskForm projects={projects} workspaces={workspaces} />
    </AppShell>
  );
}
