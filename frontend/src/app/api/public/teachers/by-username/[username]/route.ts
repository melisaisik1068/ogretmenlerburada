import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

type Ctx = { params: Promise<{ username: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const { username } = await ctx.params;
  const u = (username ?? "").trim();
  if (!u) return NextResponse.json({ detail: "Username required" }, { status: 400 });

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/accounts/teachers/by-username/${encodeURIComponent(u)}/`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

