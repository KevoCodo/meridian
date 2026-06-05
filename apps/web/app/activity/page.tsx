import { Activity as ActivityIcon } from "lucide-react";

import { AppShell } from "@/components/app-shell";
import { ActivityTimeline } from "@/features/activities/activity-timeline";
import { getActivities } from "@/services/api";

export default async function ActivityPage() {
  const activities = await getActivities();

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Operational visibility
        </p>
        <div className="mt-2 flex items-center gap-3">
          <ActivityIcon className="h-7 w-7 text-primary" aria-hidden="true" />
          <h1 className="text-3xl font-bold">Activity</h1>
        </div>
        <p className="mt-2 text-muted-foreground">
          Follow important changes across clients, projects, tasks, and notes.
        </p>
      </div>
      <section className="rounded-md border border-border bg-white p-5 shadow-sm">
        <ActivityTimeline activities={activities} />
      </section>
    </AppShell>
  );
}
