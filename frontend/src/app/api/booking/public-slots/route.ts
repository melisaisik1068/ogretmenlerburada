import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const teacher = searchParams.get("teacher");
  if (!teacher) return NextResponse.json([], { status: 200 });

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/booking/availabilities/public-slots/?teacher=${encodeURIComponent(teacher)}`, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });
  const data = await res.json().catch(() => []);
  return NextResponse.json(data, { status: res.status });
}
