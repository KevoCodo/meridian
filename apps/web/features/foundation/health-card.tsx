import { Activity, Database, Server } from "lucide-react";
import type { ReactElement } from "react";

import { getBackendHealth } from "@/services/api";

export async function HealthCard() {
  let health = null;
  let errorMessage = "";

  try {
    health = await getBackendHealth();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "Health check failed";
  }

  return (
    <section className="rounded-md border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <Server className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Backend Health Status</h2>
      </div>

      {health ? (
        <dl className="grid gap-3 sm:grid-cols-3">
          <StatusItem icon={<Activity />} label="Status" value={health.status} />
          <StatusItem icon={<Database />} label="Database" value={health.database} />
          <StatusItem icon={<Server />} label="Version" value={health.version} />
        </dl>
      ) : (
        <p className="text-sm text-muted-foreground">{errorMessage}</p>
      )}
    </section>
  );
}

function StatusItem({
  icon,
  label,
  value,
}: {
  icon: ReactElement;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-md bg-muted p-4">
      <div className="mb-2 flex items-center gap-2 text-sm text-muted-foreground">
        <span className="h-4 w-4 text-primary">{icon}</span>
        {label}
      </div>
      <div className="text-base font-semibold capitalize">{value}</div>
    </div>
  );
}
