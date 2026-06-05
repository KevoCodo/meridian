import { AppShell } from "@/components/app-shell";
import { NoteForm } from "@/features/notes/note-form";
import { getClients, getProjects, getTasks, getWorkspaces } from "@/services/api";

export default async function NewNotePage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; projectId?: string; taskId?: string }>;
}) {
  const [params, clients, projects, tasks, workspaces] = await Promise.all([
    searchParams,
    getClients(),
    getProjects(),
    getTasks(),
    getWorkspaces(),
  ]);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">New note</p>
        <h1 className="mt-2 text-3xl font-bold">Create note</h1>
      </div>
      <NoteForm clients={clients} defaults={params} projects={projects} tasks={tasks} workspaces={workspaces} />
    </AppShell>
  );
}
