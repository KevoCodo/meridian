import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { NoteForm } from "@/features/notes/note-form";
import { getClients, getNote, getProjects, getTasks, getWorkspaces } from "@/services/api";

export default async function EditNotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [note, clients, projects, tasks, workspaces] = await Promise.all([
    getNote(id).catch(() => null),
    getClients(),
    getProjects(),
    getTasks(),
    getWorkspaces(),
  ]);
  if (!note) notFound();

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">Edit note</p>
        <h1 className="mt-2 text-3xl font-bold">{note.title}</h1>
      </div>
      <NoteForm clients={clients} note={note} projects={projects} tasks={tasks} workspaces={workspaces} />
    </AppShell>
  );
}
