import { AppShell } from "@/components/app-shell";
import { TaskForm } from "@/features/tasks/task-form";
import { getCurrentWorkspaceMembers, getProjects, getWorkspaces } from "@/services/api";

export default async function NewTaskPage() {
  const [members, projects, workspaces] = await Promise.all([
    getCurrentWorkspaceMembers(),
    getProjects(),
    getWorkspaces(),
  ]);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          New task
        </p>
        <h1 className="mt-2 text-3xl font-bold">Create task</h1>
      </div>
      <TaskForm members={members} projects={projects} workspaces={workspaces} />
    </AppShell>
  );
}
