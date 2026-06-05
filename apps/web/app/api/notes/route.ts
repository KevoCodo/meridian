import { NextResponse } from "next/server";

import { createNote } from "@/services/api";

export async function POST(request: Request) {
  try {
    const note = await createNote(await request.json());
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create note" },
      { status: 400 },
    );
  }
}
