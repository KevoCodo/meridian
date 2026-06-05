import { AppShell } from "@/components/app-shell";
import { AutomationRuleForm } from "@/features/automations/automation-rule-form";
import { getWorkspaces } from "@/services/api";

export default async function NewAutomationRulePage() {
  const workspaces = await getWorkspaces();

  return (
    <AppShell>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-normal text-primary">
          New workflow definition
        </p>
        <h1 className="mt-2 text-3xl font-bold">Create automation rule</h1>
      </div>
      <AutomationRuleForm workspaces={workspaces} />
    </AppShell>
  );
}
