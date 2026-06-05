import { NextResponse } from "next/server";

import { updateAutomationRule } from "@/services/api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const rule = await updateAutomationRule(id, await request.json());
    return NextResponse.json(rule);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update rule" },
      { status: 400 },
    );
  }
}
