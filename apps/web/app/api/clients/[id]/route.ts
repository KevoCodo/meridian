import { NextResponse } from "next/server";

import { updateClient } from "@/services/api";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const payload = await request.json();
    const client = await updateClient(id, payload);
    return NextResponse.json(client);
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to update client" },
      { status: 400 },
    );
  }
}
