import { FileText, Plus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import type { Note } from "@/types/note";

export function RelatedNotes({
  createHref,
  notes,
}: {
  createHref: string;
  notes: Note[];
}) {
  return (
    <section className="rounded-md border border-border bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Related notes</h2>
        </div>
        <Button asChild variant="secondary">
          <Link href={createHref}>
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            Add note
          </Link>
        </Button>
      </div>
      {notes.length === 0 ? (
        <p className="mt-4 text-sm text-muted-foreground">
          No notes are attached yet.
        </p>
      ) : (
        <div className="mt-4 divide-y divide-border">
          {notes.map((note) => (
            <Link
              className="block py-3 first:pt-0 last:pb-0 hover:text-primary"
              href={`/notes/${note.id}`}
              key={note.id}
            >
              <div className="font-medium">{note.title}</div>
              <div className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {note.content}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
