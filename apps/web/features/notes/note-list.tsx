import Link from "next/link";

import type { Client } from "@/types/client";
import type { Note } from "@/types/note";
import type { Project } from "@/types/project";
import type { Task } from "@/types/task";

export function NoteList({
  clients,
  notes,
  projects,
  tasks,
}: {
  clients: Client[];
  notes: Note[];
  projects: Project[];
  tasks: Task[];
}) {
  if (notes.length === 0) {
    return (
      <div className="rounded-md border border-border bg-white p-6 text-sm text-muted-foreground">
        No notes yet.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {notes.map((note) => (
        <Link
          className="rounded-md border border-border bg-white p-5 shadow-sm transition-colors hover:border-primary"
          href={`/notes/${note.id}`}
          key={note.id}
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="font-semibold">{note.title}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                {note.content}
              </p>
            </div>
            <span className="rounded-md bg-muted px-2 py-1 text-xs text-muted-foreground">
              {relationshipLabel(note, clients, projects, tasks)}
            </span>
          </div>
        </Link>
      ))}
    </div>
  );
}

function relationshipLabel(
  note: Note,
  clients: Client[],
  projects: Project[],
  tasks: Task[],
) {
  if (note.taskId) return tasks.find((item) => item.id === note.taskId)?.title ?? "Task";
  if (note.projectId) {
    return projects.find((item) => item.id === note.projectId)?.name ?? "Project";
  }
  if (note.clientId) return clients.find((item) => item.id === note.clientId)?.name ?? "Client";
  return "Workspace note";
}
