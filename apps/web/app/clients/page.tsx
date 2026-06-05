import { Plus } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { ClientList } from "@/features/clients/client-list";
import { getClients } from "@/services/api";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Workspace clients
          </p>
          <h1 className="mt-2 text-3xl font-bold">Clients</h1>
          <p className="mt-2 text-muted-foreground">
            Create and manage client records inside the Meridian workspace boundary.
          </p>
        </div>
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New client
          </Link>
        </Button>
      </div>
      <ClientList clients={clients} />
    </AppShell>
  );
}
