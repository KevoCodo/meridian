import { NextResponse } from "next/server";

import { createClient } from "@/services/api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const client = await createClient(payload);
    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create client" },
      { status: 400 },
    );
  }
}
