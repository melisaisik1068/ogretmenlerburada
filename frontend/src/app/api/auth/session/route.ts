import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";
import type { SubscriptionPayload, UserMe } from "@/lib/types/api";

export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) {
    return NextResponse.json({ user: null, subscription: null as SubscriptionPayload | null });
  }

  const base = getApiBaseUrl();
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

  const meRes = await fetch(`${base}/api/accounts/me/`, { headers, cache: "no-store" });
  if (!meRes.ok) {
    return NextResponse.json({ user: null, subscription: null });
  }

  const user = (await meRes.json()) as UserMe;

  const subRes = await fetch(`${base}/api/subscriptions/me/`, { headers, cache: "no-store" });
  let subscription: SubscriptionPayload | null = null;
  if (subRes.ok) {
    subscription = (await subRes.json()) as SubscriptionPayload;
  }

  return NextResponse.json({ user, subscription });
}
