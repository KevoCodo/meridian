import { Plus } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { NoteList } from "@/features/notes/note-list";
import { getClients, getNotes, getProjects, getTasks } from "@/services/api";

export default async function NotesPage() {
  const [clients, notes, projects, tasks] = await Promise.all([
    getClients(),
    getNotes(),
    getProjects(),
    getTasks(),
  ]);

  return (
    <AppShell>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Business context
          </p>
          <h1 className="mt-2 text-3xl font-bold">Notes</h1>
          <p className="mt-2 text-muted-foreground">
            Keep readable context attached to clients, projects, tasks, or the workspace.
          </p>
        </div>
        <Button asChild>
          <Link href="/notes/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New note
          </Link>
        </Button>
      </div>
      <NoteList clients={clients} notes={notes} projects={projects} tasks={tasks} />
    </AppShell>
  );
}
