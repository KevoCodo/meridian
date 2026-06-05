import { NextResponse } from "next/server";

import { updateProject } from "@/services/api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const project = await updateProject(id, payload);
    return NextResponse.json(project);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update project" },
      { status: 400 },
    );
  }
}
