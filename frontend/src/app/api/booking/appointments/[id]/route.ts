import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/booking/appointments/${id}/`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { id } = await ctx.params;
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/booking/appointments/${id}/`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
