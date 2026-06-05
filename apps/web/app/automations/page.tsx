import { Plus, Workflow } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { AutomationRuleList } from "@/features/automations/automation-rule-list";
import { getAutomationRules } from "@/services/api";

export default async function AutomationsPage() {
  const rules = await getAutomationRules();

  return (
    <AppShell>
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-normal text-primary">
            Workflow definitions
          </p>
          <div className="mt-2 flex items-center gap-3">
            <Workflow className="h-7 w-7 text-primary" aria-hidden="true" />
            <h1 className="text-3xl font-bold">Automation rules</h1>
          </div>
          <p className="mt-2 text-muted-foreground">
            Define lightweight workflow intentions for future automation execution.
          </p>
        </div>
        <Button asChild>
          <Link href="/automations/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New rule
          </Link>
        </Button>
      </div>
      <AutomationRuleList rules={rules} />
    </AppShell>
  );
}
