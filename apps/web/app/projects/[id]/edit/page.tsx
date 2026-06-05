import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ProjectForm } from "@/features/projects/project-form";
import { getClients, getProject, getWorkspaces } from "@/services/api";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, clients, workspaces] = await Promise.all([
    getProject(id).catch(() => null),
    getClients(),
    getWorkspaces(),
  ]);

  if (!project) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Edit project
        </p>
        <h1 className="mt-2 text-3xl font-bold">{project.name}</h1>
      </div>
      <ProjectForm clients={clients} project={project} workspaces={workspaces} />
    </AppShell>
  );
}
