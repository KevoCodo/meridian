import { Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { getNote } from "@/services/api";

export default async function NotePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const note = await getNote(id).catch(() => null);
  if (!note) notFound();

  return (
    <AppShell>
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">Note</p>
          <h1 className="mt-2 text-3xl font-bold">{note.title}</h1>
        </div>
        <Button asChild>
          <Link href={`/notes/${note.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
            Edit note
          </Link>
        </Button>
      </div>
      <article className="rounded-md border border-border bg-white p-6 shadow-sm">
        <p className="whitespace-pre-wrap leading-7 text-foreground">{note.content}</p>
      </article>
    </AppShell>
  );
}
