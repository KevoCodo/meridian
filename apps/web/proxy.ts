import { NextRequest, NextResponse } from "next/server";

const publicPages = new Set(["/login", "/register"]);

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAuthApi = pathname.startsWith("/api/auth/");
  const authenticated = await hasValidSession(request);

  if (publicPages.has(pathname)) {
    return authenticated
      ? NextResponse.redirect(new URL("/", request.url))
      : NextResponse.next();
  }

  if (!authenticated && !isAuthApi) {
    if (pathname.startsWith("/api/")) {
      return NextResponse.json({ detail: "Authentication required" }, { status: 401 });
    }
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

async function hasValidSession(request: NextRequest) {
  if (!request.cookies.has("meridian_session")) return false;
  const response = await fetch(`${getBackendBaseUrl()}/auth/me`, {
    headers: { Cookie: request.headers.get("cookie") ?? "" },
    cache: "no-store",
  }).catch(() => null);
  return response?.ok ?? false;
}

function getBackendBaseUrl() {
  return (
    process.env.API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL ??
    "http://localhost:8001"
  );
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
