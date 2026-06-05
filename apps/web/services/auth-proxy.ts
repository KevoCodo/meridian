import { NextResponse } from "next/server";

import { getBackendBaseUrl } from "@/services/backend";

export async function proxyAuthRequest(request: Request, path: string) {
  const response = await fetch(`${getBackendBaseUrl()}${path}`, {
    method: request.method,
    headers: {
      "Content-Type": "application/json",
      Cookie: request.headers.get("cookie") ?? "",
    },
    body:
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.text(),
    cache: "no-store",
  });

  const body = response.status === 204 ? null : await response.text();
  const nextResponse = new NextResponse(body, {
    status: response.status,
    headers: {
      "Content-Type": response.headers.get("content-type") ?? "application/json",
    },
  });
  const setCookie = response.headers.get("set-cookie");
  if (setCookie) nextResponse.headers.set("set-cookie", setCookie);
  return nextResponse;
}
