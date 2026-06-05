import { notFound } from "next/navigation";

import { AppShell } from "@/components/app-shell";
import { AutomationRuleForm } from "@/features/automations/automation-rule-form";
import { getAutomationRule, getWorkspaces } from "@/services/api";

export default async function EditAutomationRulePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [rule, workspaces] = await Promise.all([
    getAutomationRule(id).catch(() => null),
    getWorkspaces(),
  ]);

  if (!rule) {
    notFound();
  }

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          Edit automation rule
        </p>
        <h1 className="mt-2 text-3xl font-bold">{rule.name}</h1>
      </div>
      <AutomationRuleForm rule={rule} workspaces={workspaces} />
    </AppShell>
  );
}
