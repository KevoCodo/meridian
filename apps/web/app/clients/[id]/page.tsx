import { Edit } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/features/clients/status-badge";
import { getClient } from "@/services/api";

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const client = await getClient(id).catch(() => null);

  if (!client) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Client profile
          </p>
          <h1 className="mt-2 text-3xl font-bold">{client.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/clients/${client.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
            Edit client
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <section className="rounded-md border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Profile summary</h2>
          <dl className="mt-4 grid gap-4 text-sm">
            <Info label="Status" value={<StatusBadge status={client.status} />} />
            <Info label="Workspace ID" value={client.workspaceId} mono />
            <Info label="Created" value={formatDate(client.createdAt)} />
            <Info label="Updated" value={formatDate(client.updatedAt)} />
          </dl>
        </section>

        <section className="rounded-md border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Contact details</h2>
          <dl className="mt-4 grid gap-4 text-sm">
            <Info label="Contact name" value={client.contactName || "Not set"} />
            <Info label="Contact email" value={client.contactEmail || "Not set"} />
            <Info
              label="Company website"
              value={
                client.companyWebsite ? (
                  <a
                    className="text-primary hover:underline"
                    href={client.companyWebsite}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {client.companyWebsite}
                  </a>
                ) : (
                  "Not set"
                )
              }
            />
          </dl>
        </section>

        <section className="rounded-md border border-border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold">Notes</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
            {client.notes || "No notes captured for this client yet."}
          </p>
        </section>
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

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
