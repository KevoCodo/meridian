import { Plus } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ClientList } from "@/features/clients/client-list";
import { getClients } from "@/services/api";

export default async function ClientsPage() {
  const clients = await getClients();

  return (
    <AppShell>
      <PageHeader
        actions={<Button asChild>
          <Link href="/clients/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New client
          </Link>
        </Button>}
        description="Create and manage client records inside the Meridian workspace boundary."
        eyebrow="Workspace clients"
        title="Clients"
      />
      <ClientList clients={clients} />
    </AppShell>
  );
}
