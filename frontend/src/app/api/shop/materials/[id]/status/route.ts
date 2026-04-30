import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });

  const base = getApiBaseUrl().replace(/\/+$/, "");
  const res = await fetch(`${base}/api/marketplace/materials/${id}/`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(
    {
      ok: res.ok,
      can_download: (data as any)?.can_download ?? false,
    },
    { status: res.status }
  );
}

