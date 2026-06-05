import { Plus } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
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
      <PageHeader
        actions={<Button asChild>
          <Link href="/notes/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New note
          </Link>
        </Button>}
        description="Keep readable context attached to clients, projects, tasks, or the workspace."
        eyebrow="Business context"
        title="Notes"
      />
      <NoteList clients={clients} notes={notes} projects={projects} tasks={tasks} />
    </AppShell>
  );
}
