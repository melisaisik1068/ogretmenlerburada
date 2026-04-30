import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const plan = String((body as any)?.plan ?? "").trim();
  if (!plan) return NextResponse.json({ detail: "plan required" }, { status: 400 });

  const base = getApiBaseUrl().replace(/\/+$/, "");
  const res = await fetch(`${base}/api/subscriptions/checkout/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ plan }),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

