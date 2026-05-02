import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const uid = String((body as { uid?: string }).uid ?? "").trim();
  const token = String((body as { token?: string }).token ?? "").trim();
  const new_password = (body as { new_password?: string }).new_password;
  if (!uid || !token || !new_password) {
    return NextResponse.json({ detail: "uid, token ve new_password gerekli." }, { status: 400 });
  }

  const base = getApiBaseUrl().replace(/\/+$/, "");
  const res = await fetch(`${base}/api/accounts/password-reset/confirm/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ uid, token, new_password }),
  });
  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}
