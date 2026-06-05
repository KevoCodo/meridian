import { NextResponse } from "next/server";

import { createTask } from "@/services/api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const task = await createTask(payload);
    return NextResponse.json(task, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create task" },
      { status: 400 },
    );
  }
}
