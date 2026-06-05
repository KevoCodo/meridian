import { Building2, Users } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { getClients, getWorkspaces } from "@/services/api";

export default async function WorkspacesPage() {
  const [workspaces, clients] = await Promise.all([
    getWorkspaces(),
    getClients(),
  ]);

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Workspace overview
        </p>
        <h1 className="mt-2 text-3xl font-bold">Workspace foundation</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Workspaces are the top-level ownership boundary for Meridian business data.
        </p>
      </div>

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
