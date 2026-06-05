import { proxyAuthRequest } from "@/services/auth-proxy";

export async function POST(request: Request) {
  return proxyAuthRequest(request, "/auth/login");
}
