"use client";

import { useMemo, useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const uid = useMemo(() => searchParams.get("uid") ?? "", [searchParams]);
  const token = useMemo(() => searchParams.get("token") ?? "", [searchParams]);
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    if (pw !== pw2) {
      setMsg("Şifreler eşleşmiyor.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ uid, token, new_password: pw }),
      });
      const data = (await res.json().catch(() => ({}))) as { detail?: unknown };
      if (!res.ok) {
        const d = data.detail;
        setMsg(typeof d === "string" ? d : "İşlem başarısız.");
        return;
      }
      setMsg("Şifre güncellendi. Giriş yapabilirsiniz.");
    } finally {
      setLoading(false);
    }
  }

  const ready = !!uid && !!token;

  if (!ready) {
    return (
      <p className="mt-3 text-sm text-red-700">Bağlantı eksik veya geçersiz. E-postadaki sıfırlama linkini kullanın.</p>
    );
  }

  return (
    <form className="mt-5 grid gap-3" onSubmit={submit}>
      {msg ? <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{msg}</div> : null}
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Yeni şifre</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          minLength={8}
          className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>
      <label className="grid gap-1">
        <span className="text-xs font-semibold text-slate-700">Yeni şifre tekrar</span>
        <input
          type="password"
          autoComplete="new-password"
          required
          value={pw2}
          onChange={(e) => setPw2(e.target.value)}
          minLength={8}
          className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
        />
      </label>
      <button type="submit" disabled={loading} className="btn-solid mt-1 w-full disabled:opacity-60">
        {loading ? "Kaydediliyor…" : "Şifreyi kaydet"}
      </button>
    </form>
  );
}
