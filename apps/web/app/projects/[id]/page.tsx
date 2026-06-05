import { CalendarDays, Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { RelatedActivity } from "@/features/activities/related-activity";
import {
  ProjectPriorityBadge,
  ProjectStatusBadge,
} from "@/features/projects/project-badges";
import { RelatedNotes } from "@/features/notes/related-notes";
import { getActivities, getClients, getNotes, getProject } from "@/services/api";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [project, clients, notes, activities] = await Promise.all([
    getProject(id).catch(() => null),
    getClients(),
    getNotes({ projectId: id }),
    getActivities({ entityType: "project", entityId: id }),
  ]);

  if (!project) {
    notFound();
  }

  const client = clients.find((item) => item.id === project.clientId);

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Project profile
          </p>
          <h1 className="mt-2 text-3xl font-bold">{project.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/projects/${project.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
            Edit project
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-md border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Project summary</h2>
          <dl className="mt-4 grid gap-4 text-sm">
            <Info label="Linked client" value={client ? client.name : "Unknown client"} />
            <Info label="Status" value={<ProjectStatusBadge status={project.status} />} />
            <Info
              label="Priority"
              value={<ProjectPriorityBadge priority={project.priority} />}
            />
            <Info label="Workspace ID" value={project.workspaceId} mono />
          </dl>
        </section>

        <section className="rounded-md border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Dates</h2>
          </div>
          <dl className="grid gap-4 text-sm">
            <Info label="Start date" value={formatDate(project.startDate)} />
            <Info label="Due date" value={formatDate(project.dueDate)} />
            <Info label="Created" value={formatDateTime(project.createdAt)} />
            <Info label="Updated" value={formatDateTime(project.updatedAt)} />
          </dl>
        </section>

        <section className="rounded-md border border-border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
            {project.description || "No description captured for this project yet."}
          </p>
        </section>
      </div>
      <div className="mt-5">
        <RelatedNotes createHref={`/notes/new?projectId=${project.id}`} notes={notes} />
      </div>
      <div className="mt-5">
        <RelatedActivity activities={activities} />
      </div>
    </AppShell>
  );
}

function Info({
  label,
  mono,
  value,
}: {
  label: string;
  mono?: boolean;
  value: ReactNode;
}) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className={mono ? "break-all font-mono text-xs" : "mt-1 font-medium"}>
        {value}
      </dd>
    </div>
  );
}

function formatDate(value: string | null) {
  if (!value) return "Not set";
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(`${value}T00:00:00`));
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
