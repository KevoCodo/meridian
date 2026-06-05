import { NextResponse } from "next/server";

import { createProject } from "@/services/api";

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    const project = await createProject(payload);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Unable to create project" },
      { status: 400 },
    );
  }
}
