import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const material_id = Number((body as { material_id?: number }).material_id ?? 0);
  if (!material_id) return NextResponse.json({ detail: "material_id required" }, { status: 400 });

  const base = getApiBaseUrl().replace(/\/+$/, "");
  const res = await fetch(`${base}/api/marketplace/checkout-iyzico/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ material_id }),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
