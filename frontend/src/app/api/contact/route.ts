import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function POST(req: Request) {
  let body: { name?: string; email?: string; phone?: string; message?: string; kvkk_consent?: boolean; turnstile_token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Geçersiz gövde." }, { status: 400 });
  }

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/contact/messages/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      name: body.name?.trim(),
      email: body.email?.trim(),
      phone: body.phone?.trim(),
      message: body.message?.trim(),
      kvkk_consent: body.kvkk_consent === true,
      turnstile_token: body.turnstile_token?.trim(),
    }),
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return NextResponse.json(data, { status: res.status });
  }

  return NextResponse.json({ ok: true }, { status: 201 });
}
