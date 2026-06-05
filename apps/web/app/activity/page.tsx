import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { ActivityTimeline } from "@/features/activities/activity-timeline";
import { getActivities } from "@/services/api";

export default async function ActivityPage() {
  const activities = await getActivities();

  return (
    <AppShell>
      <PageHeader
        description="Follow important changes across clients, projects, tasks, notes, and automations."
        eyebrow="Operational visibility"
        title="Activity"
      />
      <section className="rounded-md border border-border bg-white p-5 shadow-sm">
        <ActivityTimeline activities={activities} />
      </section>
    </AppShell>
  );
}
