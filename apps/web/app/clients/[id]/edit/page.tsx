import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { ClientForm } from "@/features/clients/client-form";
import { getClient, getWorkspaces } from "@/services/api";

export default async function EditClientPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [client, workspaces] = await Promise.all([
    getClient(id).catch(() => null),
    getWorkspaces(),
  ]);

  if (!client) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Edit client
        </p>
        <h1 className="mt-2 text-3xl font-bold">{client.name}</h1>
      </div>
      <ClientForm client={client} workspaces={workspaces} />
    </AppShell>
  );
}
