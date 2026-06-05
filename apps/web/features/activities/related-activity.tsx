import { Activity as ActivityIcon } from "lucide-react";

import { ActivityTimeline } from "@/features/activities/activity-timeline";
import type { Activity } from "@/types/activity";

export function RelatedActivity({ activities }: { activities: Activity[] }) {
  return (
    <section className="rounded-md border border-border bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2">
        <ActivityIcon className="h-5 w-5 text-primary" aria-hidden="true" />
        <h2 className="text-lg font-semibold">Related activity</h2>
      </div>
      <ActivityTimeline
        activities={activities}
        emptyMessage="No activity has been recorded for this item yet."
      />
    </section>
  );
}
