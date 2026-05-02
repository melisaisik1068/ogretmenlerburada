"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      const res = await fetch("/api/auth/password-reset/request", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      await res.json().catch(() => ({}));
      setMsg(res.ok ? "E-posta adresi kayıtlıysa bir sıfırlama bağlantısı gönderdik." : "İstek tamamlanamadı.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <div className="mx-auto max-w-md surface p-6 sm:p-8">
          <div className="section-eyebrow">Account</div>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight">Şifre sıfırlama</h1>
          <p className="mt-2 text-sm text-slate-600">Kayıtlı e-postanıza güvenli bir bağlantı gönderilir.</p>
          <form className="mt-5 grid gap-3" onSubmit={submit}>
            {msg ? <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{msg}</div> : null}
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-700">E-posta</span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
            <button type="submit" disabled={loading} className="btn-solid mt-1 w-full disabled:opacity-60">
              {loading ? "Gönderiliyor…" : "Bağlantı gönder"}
            </button>
          </form>
          <div className="mt-4 text-sm text-slate-600">
            <Link href="/login" className="font-semibold text-sky-700 underline underline-offset-4">
              Girişe dön
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
