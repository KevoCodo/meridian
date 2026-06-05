import { Plus } from "lucide-react";
import Link from "next/link";

import { AppShell } from "@/components/app-shell";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { AutomationRuleList } from "@/features/automations/automation-rule-list";
import { getAutomationRules } from "@/services/api";

export default async function AutomationsPage() {
  const rules = await getAutomationRules();

  return (
    <AppShell>
      <PageHeader
        actions={<Button asChild>
          <Link href="/automations/new">
            <Plus className="mr-2 h-4 w-4" aria-hidden="true" />
            New rule
          </Link>
        </Button>}
        description="Define lightweight workflow intentions and manage supported follow-up automation."
        eyebrow="Workflow definitions"
        title="Automation rules"
      />
      <AutomationRuleList rules={rules} />
    </AppShell>
  );
}
