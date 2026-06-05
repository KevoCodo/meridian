import { NextResponse } from "next/server";

import { updateTask } from "@/services/api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const task = await updateTask(id, payload);
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update task" },
      { status: 400 },
    );
  }
}
