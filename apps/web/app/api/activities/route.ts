import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/services/backend";
import type { Activity } from "@/types/activity";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  const activities = await backendFetch<Activity[]>(
    `/activities${query ? `?${query}` : ""}`,
  );
  return NextResponse.json(activities);
}
