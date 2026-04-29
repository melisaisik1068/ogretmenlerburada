import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

async function requiresPro(token: string) {
  const res = await fetch(`${API_BASE}/api/subscriptions/me/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });
  if (!res.ok) return false;
  const sub = (await res.json()) as { plan?: { code?: string } } | null;
  const code = sub?.plan?.code;
  return code === "pro" || code === "enterprise";
}

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const isDashboard = pathname.startsWith("/dashboard");
  const isProArea = pathname.startsWith("/dashboard/pro");

  if (!isDashboard) return NextResponse.next();

  const token = req.cookies.get("ob_access")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  if (isProArea) {
    const ok = await requiresPro(token);
    if (!ok) {
      const url = req.nextUrl.clone();
      url.pathname = "/upgrade";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};

