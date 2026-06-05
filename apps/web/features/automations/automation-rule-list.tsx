import { Workflow } from "lucide-react";
import Link from "next/link";

import { EmptyState } from "@/components/ui/empty-state";
import {
  actionLabel,
  ActiveBadge,
  triggerLabel,
} from "@/features/automations/automation-labels";
import type { AutomationRule } from "@/types/automation-rule";

export function AutomationRuleList({ rules }: { rules: AutomationRule[] }) {
  if (rules.length === 0) {
    return (
      <EmptyState
        actionHref="/automations/new"
        actionLabel="Create rule"
        description="Define a simple rule to create follow-up work after a task is completed."
        icon={Workflow}
        title="No automation rules yet"
      />
    );
  }

  return (
    <div className="overflow-x-auto rounded-md border border-border bg-white shadow-sm">
      <table className="w-full border-collapse text-left text-sm">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            <th className="px-4 py-3 font-medium">Rule</th>
            <th className="px-4 py-3 font-medium">Trigger</th>
            <th className="px-4 py-3 font-medium">Action</th>
            <th className="px-4 py-3 font-medium">Status</th>
          </tr>
        </thead>
        <tbody>
          {rules.map((rule) => (
            <tr className="border-t border-border" key={rule.id}>
              <td className="px-4 py-3">
                <Link
                  className="font-medium text-primary hover:underline"
                  href={`/automations/${rule.id}`}
                >
                  {rule.name}
                </Link>
                {rule.description ? (
                  <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                    {rule.description}
                  </p>
                ) : null}
              </td>
              <td className="px-4 py-3">{triggerLabel(rule.triggerType)}</td>
              <td className="px-4 py-3">{actionLabel(rule.actionType)}</td>
              <td className="px-4 py-3">
                <ActiveBadge active={rule.isActive} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
