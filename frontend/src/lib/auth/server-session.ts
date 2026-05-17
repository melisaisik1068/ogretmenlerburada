import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getApiBaseUrl } from "@/lib/env";
import type { SubscriptionPayload, UserMe } from "@/lib/types/api";

import { type AppRole, getRoleHomePath, normalizeRole } from "./roles";

export async function loadServerSession(): Promise<{
  user: UserMe | null;
  subscription: SubscriptionPayload | null;
  role: AppRole | null;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) {
    return { user: null, subscription: null, role: null };
  }

  const base = getApiBaseUrl();
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

  const meRes = await fetch(`${base}/api/accounts/me/`, { headers, cache: "no-store" });
  if (!meRes.ok) {
    return { user: null, subscription: null, role: null };
  }

  const user = (await meRes.json()) as UserMe;
  const role = normalizeRole(user.role);

  let subscription: SubscriptionPayload | null = null;
  if (role === "student" || role === "teacher") {
    const subRes = await fetch(`${base}/api/subscriptions/me/`, { headers, cache: "no-store" });
    if (subRes.ok) {
      subscription = (await subRes.json()) as SubscriptionPayload;
    }
  }

  return { user, subscription, role };
}

export async function requireAuth(nextPath: string): Promise<UserMe> {
  const { user } = await loadServerSession();
  if (!user) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return user;
}

export async function requireRole(allowed: AppRole | AppRole[], nextPath: string): Promise<UserMe> {
  const user = await requireAuth(nextPath);
  const role = normalizeRole(user.role);
  const list = Array.isArray(allowed) ? allowed : [allowed];
  if (!role || !list.includes(role)) {
    redirect(getRoleHomePath(role));
  }
  return user;
}
