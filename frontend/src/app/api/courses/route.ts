import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const qs = searchParams.toString();
  const res = await fetch(`${base}/api/lessons/courses/${qs ? `?${qs}` : ""}`, {
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

