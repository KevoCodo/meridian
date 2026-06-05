import { NextResponse } from "next/server";

import { updateNote } from "@/services/api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const note = await updateNote(id, await request.json());
    return NextResponse.json(note);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update note" },
      { status: 400 },
    );
  }
}
