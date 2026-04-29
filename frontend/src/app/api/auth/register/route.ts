import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { getApiBaseUrl } from "@/lib/env";

type RegisterBody = {
  username?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
};

export async function POST(req: Request) {
  let body: RegisterBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ detail: "Geçersiz istek gövdesi." }, { status: 400 });
  }

  const username = body.username?.trim();
  const password = body.password;
  const role = body.role?.trim();

  if (!username || !password || !role) {
    return NextResponse.json({ detail: "Zorunlu alanlar eksik." }, { status: 400 });
  }

  const base = getApiBaseUrl();
  const regRes = await fetch(`${base}/api/accounts/register/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      username,
      email: body.email?.trim() ?? "",
      password,
      first_name: body.first_name?.trim() ?? "",
      last_name: body.last_name?.trim() ?? "",
      role,
    }),
  });

  const regData = await regRes.json().catch(() => ({}));

  if (!regRes.ok) {
    return NextResponse.json(regData, { status: regRes.status });
  }

  const tokRes = await fetch(`${base}/api/auth/token/`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({ username, password }),
  });

  const tokData = (await tokRes.json().catch(() => ({}))) as { access?: string; refresh?: string };

  if (!tokRes.ok || !tokData.access) {
    return NextResponse.json(
      { detail: "Kayıt oluştu ancak oturum açılamadı. Lütfen giriş yapın.", registered: true },
      { status: 201 },
    );
  }

  const cookieStore = await cookies();
  cookieStore.set("ob_access", tokData.access, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 55,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  if (tokData.refresh) {
    cookieStore.set("ob_refresh", tokData.refresh, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return NextResponse.json({ ok: true, registered: true });
}
