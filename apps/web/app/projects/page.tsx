import { Plus } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ProjectFilters } from "@/features/projects/project-filters";
import { ProjectList } from "@/features/projects/project-list";
import { getClients, getProjects } from "@/services/api";
import type { ProjectStatus } from "@/types/project";

const statuses = new Set(["planning", "active", "paused", "completed", "archived"]);

export default async function ProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ clientId?: string; status?: string }>;
}) {
  const params = await searchParams;
  const selectedStatus = statuses.has(params.status ?? "")
    ? (params.status as ProjectStatus)
    : undefined;
  const [clients, projects] = await Promise.all([
    getClients(),
    getProjects({
      clientId: params.clientId || undefined,
      status: selectedStatus,
    }),
  ]);

  return (
    <AppShell>
      <PageHeader
        actions={<Button asChild>
          <Link href="/projects/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New project
          </Link>
        </Button>}
        description="Track client-facing work by status, priority, ownership boundary, and due date."
        eyebrow="Client work"
        title="Projects"
      />
      <ProjectFilters
        clients={clients}
        selectedClientId={params.clientId}
        selectedStatus={selectedStatus}
      />
      <ProjectList clients={clients} projects={projects} />
    </AppShell>
  );
}
