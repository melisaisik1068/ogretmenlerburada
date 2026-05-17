import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  type AppRole,
  getRoleHomePath,
  normalizeRole,
  requiredRolesForPath,
  roleMayAccessPath,
} from "./src/lib/auth/roles";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";
const TENANT_BASE_DOMAIN = (process.env.NEXT_PUBLIC_TENANT_BASE_DOMAIN ?? "").trim().toLowerCase();

const STUDENT_ONLY_PREFIXES = ["/odevler", "/dashboard/appointments", "/dashboard/orders"];

function extractSubdomain(host: string): string | null {
  const h = host.toLowerCase();
  if (!TENANT_BASE_DOMAIN) return null;
  if (h.endsWith(".vercel.app") || TENANT_BASE_DOMAIN === "vercel.app") return null;
  if (!h.endsWith(`.${TENANT_BASE_DOMAIN}`)) return null;
  const prefix = h.slice(0, -(TENANT_BASE_DOMAIN.length + 1));
  if (!prefix || prefix.includes(".")) return null;
  const reserved = new Set(["www", "app", "api", "admin"]);
  if (reserved.has(prefix)) return null;
  return prefix;
}

async function fetchUserRoleFromApi(token: string): Promise<AppRole | null> {
  try {
    const res = await fetch(`${API_BASE}/api/accounts/me/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    const u = (await res.json()) as { role?: string };
    return normalizeRole(u.role);
  } catch {
    return null;
  }
}

function roleFromRequest(req: NextRequest): AppRole | null {
  const fromCookie = normalizeRole(req.cookies.get("ob_role")?.value);
  return fromCookie;
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

  const host = req.headers.get("host") ?? "";
  const username = extractSubdomain(host);
  if (username && !pathname.startsWith("/t/")) {
    const url = req.nextUrl.clone();
    url.pathname = `/t/${username}${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  const isDashboard = pathname.startsWith("/dashboard");
  const isProArea = pathname.startsWith("/dashboard/pro");
  const isVeliLegacy = pathname === "/veli" || pathname.startsWith("/veli/");
  const needsAuth =
    isDashboard ||
    isVeliLegacy ||
    STUDENT_ONLY_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));

  if (isVeliLegacy) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard/veli";
    return NextResponse.redirect(url);
  }

  if (!needsAuth) return NextResponse.next();

  const token = req.cookies.get("ob_access")?.value;
  if (!token) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(url);
  }

  let role = roleFromRequest(req);
  if (!role) {
    role = await fetchUserRoleFromApi(token);
  }

  if (pathname === "/dashboard" && role) {
    const url = req.nextUrl.clone();
    url.pathname = getRoleHomePath(role);
    return NextResponse.redirect(url);
  }

  const roleProtected = requiredRolesForPath(pathname);
  if (roleProtected && role && !roleMayAccessPath(role, pathname)) {
    const url = req.nextUrl.clone();
    url.pathname = getRoleHomePath(role);
    return NextResponse.redirect(url);
  }

  for (const prefix of STUDENT_ONLY_PREFIXES) {
    if ((pathname === prefix || pathname.startsWith(`${prefix}/`)) && role && role !== "student") {
      const url = req.nextUrl.clone();
      url.pathname = getRoleHomePath(role);
      return NextResponse.redirect(url);
    }
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
