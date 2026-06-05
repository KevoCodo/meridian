import { Building2, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { getClients, getWorkspaces } from "@/services/api";

export default async function WorkspacesPage() {
  const [workspaces, clients] = await Promise.all([
    getWorkspaces(),
    getClients(),
  ]);

  return (
    <AppShell>
      <PageHeader
        description="Workspaces are the top-level ownership boundary for Meridian business data."
        eyebrow="Workspace overview"
        title="Workspaces"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {workspaces.map((workspace) => (
          <section
            key={workspace.id}
            className="rounded-md border border-border bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" aria-hidden="true" />
              <h2 className="text-lg font-semibold">{workspace.name}</h2>
            </div>
            <dl className="grid gap-3 text-sm">
              <div>
                <dt className="text-muted-foreground">Slug</dt>
                <dd className="font-medium">{workspace.slug}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Workspace ID</dt>
                <dd className="break-all font-mono text-xs">{workspace.id}</dd>
              </div>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{clients.length} clients in this foundation workspace</span>
              </div>
            </dl>
          </section>
        ))}
      </div>
    </AppShell>
  );
}
