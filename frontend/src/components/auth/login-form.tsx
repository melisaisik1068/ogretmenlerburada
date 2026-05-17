"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import { getRoleHomePath, normalizeRole } from "@/lib/auth/roles";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextUrl = searchParams.get("next") || "";
  const kayitBasarili = searchParams.get("kayit") === "basarili";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = (await res.json().catch(() => ({}))) as { detail?: string; role?: string };
      if (!res.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Giriş yapılamadı.");
        return;
      }
      const role = normalizeRole(data.role);
      const fallback = getRoleHomePath(role);
      const target =
        nextUrl.startsWith("/") && nextUrl !== "/dashboard" ? nextUrl : fallback;
      router.push(target);
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="mt-5 grid gap-3" onSubmit={onSubmit}>
      {kayitBasarili ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800" role="status">
          Hesabınız oluşturuldu. Şimdi giriş yapabilirsiniz.
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800" role="alert">
          {error}
        </div>
      ) : null}
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Kullanıcı adı</span>
        <input
          name="username"
          autoComplete="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Şifre</span>
        <input
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>
      <button type="submit" disabled={loading} className="btn-solid mt-2 w-full disabled:opacity-60">
        {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
      </button>
      <div className="text-right text-xs">
        <Link className="font-semibold text-sky-700 underline decoration-sky-300 underline-offset-4" href="/forgot-password">
          Şifremi unuttum
        </Link>
      </div>
    </form>
  );
}
