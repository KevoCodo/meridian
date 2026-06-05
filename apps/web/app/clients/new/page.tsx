import { AppShell } from "@/components/app-shell";
import { ClientForm } from "@/features/clients/client-form";
import { getWorkspaces } from "@/services/api";

export default async function NewClientPage() {
  const workspaces = await getWorkspaces();

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          New client
        </p>
        <h1 className="mt-2 text-3xl font-bold">Create client</h1>
      </div>
      <ClientForm workspaces={workspaces} />
    </AppShell>
  );
}
