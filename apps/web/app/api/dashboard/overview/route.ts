import { NextRequest, NextResponse } from "next/server";

import { backendFetch } from "@/services/backend";
import type { DashboardOverview } from "@/types/dashboard";

export async function GET(request: NextRequest) {
  const query = request.nextUrl.searchParams.toString();
  const overview = await backendFetch<DashboardOverview>(
    `/dashboard/overview${query ? `?${query}` : ""}`,
  );
  return NextResponse.json(overview);
}
