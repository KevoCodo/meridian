import {
  Activity as ActivityIcon,
  BriefcaseBusiness,
  Building2,
  CheckCircle2,
  FileText,
  ListTodo,
  type LucideIcon,
} from "lucide-react";

import { EmptyState } from "@/components/ui/empty-state";
import type { Activity, ActivityEntityType } from "@/types/activity";

const entityIcons: Record<ActivityEntityType, LucideIcon> = {
  client: Building2,
  project: BriefcaseBusiness,
  task: ListTodo,
  note: FileText,
  workspace: Building2,
};

export function ActivityTimeline({
  activities,
  emptyMessage = "No activity has been recorded yet.",
}: {
  activities: Activity[];
  emptyMessage?: string;
}) {
  if (activities.length === 0) {
    return (
      <EmptyState
        description={emptyMessage}
        icon={ActivityIcon}
        title="No activity yet"
      />
    );
  }

  return (
    <ol className="divide-y divide-border">
      {activities.map((activity) => {
        const Icon =
          activity.action === "completed"
            ? CheckCircle2
            : entityIcons[activity.entityType];

        return (
          <li className="flex gap-3 py-4 first:pt-0 last:pb-0" key={activity.id}>
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-primary">
              <Icon className="h-4 w-4" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{activity.message}</p>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <span className="capitalize">{activity.entityType}</span>
                <span aria-hidden="true">/</span>
                <time dateTime={activity.createdAt}>
                  {formatDateTime(activity.createdAt)}
                </time>
              </div>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
