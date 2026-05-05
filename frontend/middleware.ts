import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const TENANT_BASE_DOMAIN = (process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN ?? "").trim().toLowerCase();

function extractSubdomain(host: string): string | null {
  const h = host.toLowerCase();
  if (!TENANT_BASE_DOMAIN) return null;
  if (!h.endsWith(`.${TENANT_BASE_DOMAIN}`)) return null;
  const prefix = h.slice(0, -(TENANT_BASE_DOMAIN.length + 1)); // remove ".base"
  if (!prefix) return null;
  // Only single-label subdomains supported: username.firma.com
  if (prefix.includes(".")) return null;
  const reserved = new Set(["www", "app", "api", "admin"]);
  if (reserved.has(prefix)) return null;
  return prefix;
}

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

  // Teacher subdomain → rewrite to teacher storefront route (/t/[username])
  // Example: ahmet.firma.com/classes → /t/ahmet/classes
  const host = req.headers.get("host") ?? "";
  const username = extractSubdomain(host);
  if (username && !pathname.startsWith("/t/")) {
    const url = req.nextUrl.clone();
    url.pathname = `/t/${username}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

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
  matcher: ["/:path*"],
};

