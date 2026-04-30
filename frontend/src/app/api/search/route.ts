import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

type AnyList<T> = T[] | { results?: T[] };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") ?? "").trim();
  if (!q) return NextResponse.json({ q: "", courses: [], posts: [], events: [], materials: [] });

  const base = getApiBaseUrl().replace(/\/+$/, "");
  const res = await fetch(`${base}/api/search/?q=${encodeURIComponent(q)}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

