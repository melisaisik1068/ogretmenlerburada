import { cookies } from "next/headers";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";
import { getApiBaseUrl } from "@/lib/env";
import type { SubscriptionPayload, UserMe } from "@/lib/types/api";

async function loadSession(): Promise<{ user: UserMe | null; subscription: SubscriptionPayload | null }> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) return { user: null, subscription: null };

  const base = getApiBaseUrl();
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

  const meRes = await fetch(`${base}/api/accounts/me/`, { headers, cache: "no-store" });
  if (!meRes.ok) return { user: null, subscription: null };

  const user = (await meRes.json()) as UserMe;

  const subRes = await fetch(`${base}/api/subscriptions/me/`, { headers, cache: "no-store" });
  const subscription = subRes.ok ? ((await subRes.json()) as SubscriptionPayload) : null;

  return { user, subscription };
}

export default async function DashboardPage() {
  const { user, subscription } = await loadSession();

  return <DashboardOverview user={user} subscription={subscription} />;
}
