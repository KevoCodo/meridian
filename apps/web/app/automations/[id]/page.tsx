import { Edit, Workflow } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import {
  actionLabel,
  ActiveBadge,
  executionExplanation,
  triggerLabel,
} from "@/features/automations/automation-labels";
import { getAutomationRule } from "@/services/api";

export default async function AutomationRuleDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rule = await getAutomationRule(id).catch(() => null);

  if (!rule) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Automation rule
          </p>
          <h1 className="mt-2 text-3xl font-bold">{rule.name}</h1>
        </div>
        <Button asChild>
          <Link href={`/automations/${rule.id}/edit`}>
            <Edit className="mr-2 h-4 w-4" aria-hidden="true" />
            Edit rule
          </Link>
        </Button>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-md border border-border bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Workflow className="h-5 w-5 text-primary" aria-hidden="true" />
            <h2 className="text-lg font-semibold">Rule definition</h2>
          </div>
          <dl className="grid gap-4 text-sm">
            <Info label="Trigger" value={triggerLabel(rule.triggerType)} />
            <Info label="Action" value={actionLabel(rule.actionType)} />
            <Info label="Status" value={<ActiveBadge active={rule.isActive} />} />
            <Info label="Workspace ID" value={rule.workspaceId} mono />
          </dl>
        </section>

        <section className="rounded-md border border-border bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold">Definition details</h2>
          <dl className="mt-4 grid gap-4 text-sm">
            <Info label="Created" value={formatDateTime(rule.createdAt)} />
            <Info label="Updated" value={formatDateTime(rule.updatedAt)} />
            <Info
              label="Execution"
              value={
                rule.triggerType === "task_completed" &&
                rule.actionType === "create_follow_up_task"
                  ? "Enabled when active"
                  : "Not supported yet"
              }
            />
          </dl>
        </section>

        <section className="rounded-md border border-border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold">What this rule does</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            {executionExplanation(rule)}
          </p>
        </section>

        <section className="rounded-md border border-border bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold">Description</h2>
          <p className="mt-4 whitespace-pre-wrap text-sm text-muted-foreground">
            {rule.description || "No description has been provided for this rule."}
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

function formatDateTime(value: string) {
  return new Intl.DateTimeFormat("en", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
