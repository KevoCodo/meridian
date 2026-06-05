import { AppShell } from "@/components/app-shell";
import { ProjectForm } from "@/features/projects/project-form";
import { getClients, getWorkspaces } from "@/services/api";

export default async function NewProjectPage() {
  const [clients, workspaces] = await Promise.all([getClients(), getWorkspaces()]);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          New project
        </p>
        <h1 className="mt-2 text-3xl font-bold">Create project</h1>
      </div>
      <ProjectForm clients={clients} workspaces={workspaces} />
    </AppShell>
  );
}
