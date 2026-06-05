import { Building2 } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import { StatusBadge } from "@/features/clients/status-badge";
import type { Client } from "@/types/client";

export function ClientList({ clients }: { clients: Client[] }) {
  if (clients.length === 0) {
    return (
      <EmptyState
        actionHref="/clients/new"
        actionLabel="Create client"
        description="Add the first client to begin organizing projects, tasks, and business context."
        icon={Building2}
        title="No clients yet"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Client</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Contact</th>
            <th className="px-4 py-3 font-medium">Email</th>
            <th className="px-4 py-3 font-medium">Created</th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr key={client.id} className="border-t border-border">
              <td className="px-4 py-3 font-medium">
                <Link className="text-primary hover:underline" href={`/clients/${client.id}`}>
                  {client.name}
                </Link>
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={client.status} />
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {client.contactName || "Not set"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {client.contactEmail || "Not set"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(client.createdAt)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
  }).format(new Date(value));
}
