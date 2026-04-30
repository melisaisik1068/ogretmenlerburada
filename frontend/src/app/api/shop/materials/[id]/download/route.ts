import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const base = getApiBaseUrl().replace(/\/+$/, "");
  const res = await fetch(`${base}/api/marketplace/materials/${id}/download/`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    return NextResponse.json(data, { status: res.status });
  }

  const buf = await res.arrayBuffer();
  const headers = new Headers();
  const ct = res.headers.get("content-type");
  const cd = res.headers.get("content-disposition");
  if (ct) headers.set("content-type", ct);
  if (cd) headers.set("content-disposition", cd);
  return new NextResponse(buf, { status: 200, headers });
}

