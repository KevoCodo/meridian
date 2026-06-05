import { NextRequest, NextResponse } from "next/server";

import { createAutomationRule, getAutomationRules } from "@/services/api";

export async function GET(request: NextRequest) {
  const rules = await getAutomationRules(
    request.nextUrl.searchParams.get("workspaceId") ?? undefined,
  );
  return NextResponse.json(rules);
}

export async function POST(request: Request) {
  try {
    const rule = await createAutomationRule(await request.json());
    return NextResponse.json(rule, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create rule" },
      { status: 400 },
    );
  }
}
