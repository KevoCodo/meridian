import { NextRequest, NextResponse } from "next/server";

import { getAutomationExecutions } from "@/services/api";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const executions = await getAutomationExecutions({
    workspaceId: params.get("workspaceId") ?? undefined,
    automationRuleId: params.get("automationRuleId") ?? undefined,
    triggerEntityId: params.get("triggerEntityId") ?? undefined,
  });
  return NextResponse.json(executions);
}
