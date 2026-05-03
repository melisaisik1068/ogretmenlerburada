import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const pageSize = searchParams.get("page_size");
  const base = getApiBaseUrl();
  const url = new URL(`${base}/api/accounts/teachers/`);
  if (q) url.searchParams.set("q", q);
  if (pageSize) url.searchParams.set("page_size", pageSize);
  const res = await fetch(url.toString(), { headers: { Accept: "application/json" }, next: { revalidate: 60 } });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
