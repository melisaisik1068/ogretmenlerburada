import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

export async function POST(req: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const username = body.username?.trim();
  const password = body.password;
  if (!username || !password) {
    return NextResponse.json({ detail: "Kullanıcı adı ve şifre gerekli." }, { status: 400 });
  }

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const data = (await res.json().catch(() => ({}))) as {
    access?: string;
    refresh?: string;
    detail?: string;
    non_field_errors?: string[];
  };

  if (!res.ok) {
    const msg =
      typeof data.detail === "string"
        ? data.detail
        : data.non_field_errors?.join(" ") ?? "Giriş başarısız.";
    return NextResponse.json({ detail: msg }, { status: res.status });
  }

  if (!data.access) {
    return NextResponse.json({ detail: "Sunucu jeton döndürmedi." }, { status: 502 });
  }

  const cookieStore = await cookies();
  cookieStore.set("ob_access", data.access, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 55,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  if (data.refresh) {
    cookieStore.set("ob_refresh", data.refresh, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return NextResponse.json({ ok: true });
}
