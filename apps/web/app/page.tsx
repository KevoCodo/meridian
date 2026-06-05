import {
  Activity,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  ListTodo,
} from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ActivityTimeline } from "@/features/activities/activity-timeline";
import { MetricCard } from "@/features/dashboard/metric-card";
import { UpcomingTasks } from "@/features/dashboard/upcoming-tasks";
import {
  getActivities,
  getDashboardOverview,
  getProjects,
  getTasks,
} from "@/services/api";

export default async function DashboardPage() {
  const [overview, activities, projects, tasks] = await Promise.all([
    getDashboardOverview(),
    getActivities(),
    getProjects(),
    getTasks(),
  ]);

  const metrics = [
    {
      href: "/clients",
      icon: Building2,
      label: "Active Clients",
      supportingText: "Currently engaged",
      value: overview.activeClients,
    },
    {
      href: "/projects",
      icon: BriefcaseBusiness,
      label: "Active Projects",
      supportingText: "Work in motion",
      value: overview.activeProjects,
    },
    {
      href: "/tasks",
      icon: ListTodo,
      label: "Open Tasks",
      supportingText: "Needs attention",
      value: overview.openTasks,
    },
    {
      href: "/tasks",
      icon: CheckCircle2,
      label: "Completed Tasks",
      supportingText: "Finished work",
      value: overview.completedTasks,
    },
    {
      href: "/notes",
      icon: FileText,
      label: "Recent Notes",
      supportingText: "Created in the last 7 days",
      value: overview.recentNotesCount,
    },
    {
      href: "/activity",
      icon: Activity,
      label: "Recent Activity",
      supportingText: "Events in the last 7 days",
      value: overview.recentActivityCount,
    },
  ];

  return (
    <AppShell>
      <PageHeader
        actions={<Button asChild>
          <Link href="/tasks/new">Create task</Link>
        </Button>}
        description="A current view of work, attention, and recent changes."
        eyebrow="Operational overview"
        title="Dashboard"
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {metrics.map((metric) => (
          <MetricCard key={metric.label} {...metric} />
        ))}
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>Upcoming tasks</CardTitle>
            <Link className="text-sm font-medium text-primary hover:underline" href="/tasks">
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <UpcomingTasks projects={projects} tasks={tasks} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle>Recent activity</CardTitle>
            <Link
              className="text-sm font-medium text-primary hover:underline"
              href="/activity"
            >
              View all
            </Link>
          </CardHeader>
          <CardContent>
            <ActivityTimeline activities={activities.slice(0, 6)} />
          </CardContent>
        </Card>
      </section>
    </AppShell>
  );
}
