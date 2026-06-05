import { Building2, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { getClients, getCurrentWorkspaceMembers, getWorkspaces } from "@/services/api";

export default async function WorkspacesPage() {
  const [workspaces, clients, members] = await Promise.all([
    getWorkspaces(),
    getClients(),
    getCurrentWorkspaceMembers(),
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
                <span>{clients.length} clients in this workspace</span>
              </div>
            </dl>
          </section>
        ))}
      </div>

      <section className="mt-5 rounded-md border border-border bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Users className="h-5 w-5 text-primary" aria-hidden="true" />
          <h2 className="text-lg font-semibold">Workspace members</h2>
        </div>
        <div className="divide-y divide-border">
          {members.map((membership) => (
            <div
              className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0"
              key={membership.id}
            >
              <div>
                <p className="text-sm font-medium">{membership.user.name}</p>
                <p className="text-xs text-muted-foreground">{membership.user.email}</p>
              </div>
              <span className="rounded-md bg-muted px-2 py-1 text-xs font-medium capitalize">
                {membership.role}
              </span>
            </div>
          ))}
        </div>
      </section>
    </AppShell>
  );
}
