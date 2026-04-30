import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function GET(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const qs = searchParams.toString();

  const res = await fetch(`${base}/api/marketplace/orders/me/${qs ? `?${qs}` : ""}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}

