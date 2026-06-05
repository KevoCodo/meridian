import { Filter } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import type { Client } from "@/types/client";
import type { ProjectStatus } from "@/types/project";

const statuses: ProjectStatus[] = [
  "planning",
  "active",
  "paused",
  "completed",
  "archived",
];

export function ProjectFilters({
  clients,
  selectedClientId,
  selectedStatus,
}: {
  clients: Client[];
  selectedClientId?: string;
  selectedStatus?: string;
}) {
  return (
    <form className="mb-5 flex flex-wrap items-end gap-3 rounded-md border border-border bg-white p-4 shadow-sm">
      <label className="grid min-w-56 gap-2 text-sm font-medium">
        Client
        <Select name="clientId" defaultValue={selectedClientId ?? ""}>
          <option value="">All clients</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="grid min-w-48 gap-2 text-sm font-medium">
        Status
        <Select name="status" defaultValue={selectedStatus ?? ""}>
          <option value="">All statuses</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status[0].toUpperCase()}
              {status.slice(1)}
            </option>
          ))}
        </Select>
      </label>
      <Button type="submit" variant="secondary">
        <Filter className="mr-2 h-4 w-4" aria-hidden="true" />
        Apply filters
      </Button>
    </form>
  );
}
