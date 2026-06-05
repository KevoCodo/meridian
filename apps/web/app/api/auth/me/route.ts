import { proxyAuthRequest } from "@/services/auth-proxy";

export async function GET(request: Request) {
  return proxyAuthRequest(request, "/auth/me");
}
