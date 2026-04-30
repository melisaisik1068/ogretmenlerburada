import Link from "next/link";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type PlanRow = { code: string; title: string; price_try: number };

async function fetchPlans(): Promise<PlanRow[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/subscriptions/plans/`, {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as PlanRow[] | { results?: PlanRow[] };
    if (Array.isArray(data)) return data;
    return data.results ?? [];
  } catch {
    return [];
  }
}

export default async function UpgradePage() {
  const plans = await fetchPlans();

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <div className="section-eyebrow">Pricing</div>
        <h1 className="section-title">Memberships</h1>
        <p className="section-lead">
          Abonelik planları Django&apos;daki <span className="font-mono text-xs">GET /api/subscriptions/plans/</span>{" "}
          endpoint&apos;inden gelir.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.length === 0 ? (
            <div className="surface p-6 text-sm text-slate-600 md:col-span-3">
              Planlar yüklenemedi veya henüz tanımlı değil. Django admin üzerinden abonelik planları ekleyebilirsin.
            </div>
          ) : (
            plans.map((p) => (
              <div key={p.code} className="surface p-6">
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{p.code}</div>
                <div className="mt-2 text-xl font-extrabold text-slate-900">{p.title}</div>
                <div className="mt-2 text-sm text-slate-600">{p.price_try} ₺ / ay</div>
                <ul className="mt-5 grid gap-2 text-sm text-slate-600">
                  <li>• Kurs içeriklerine erişim</li>
                  <li>• Topluluk & destek</li>
                  <li>• Gelişim takibi (yakında)</li>
                </ul>
                <CheckoutButton planCode={p.code} />
              </div>
            ))
          )}
        </div>

        <div className="mt-10 flex flex-wrap gap-3">
          <Link className="btn-outline" href="/dashboard">
            Panele dön
          </Link>
          <Link className="link-muted text-sm" href="/faq">
            SSS
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function CheckoutButton({ planCode }: { planCode: string }) {
  "use client";
  const React = require("react") as typeof import("react");
  const { useState } = React;
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function go() {
    setLoading(true);
    setErr("");
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ plan: planCode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof (data as any).detail === "string" ? (data as any).detail : "Checkout başlatılamadı.");
        return;
      }
      const url = (data as any).checkout_url as string | undefined;
      if (!url) {
        setErr("Checkout URL alınamadı.");
        return;
      }
      window.location.href = url;
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-5 grid gap-2">
      {err ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{err}</div> : null}
      <button className="btn-accent inline-flex w-full justify-center" type="button" onClick={() => void go()} disabled={loading}>
        {loading ? "Yönlendiriliyor…" : "Subscribe"}
      </button>
      <Link className="link-muted text-xs" href="/contact">
        Kurumsal/özel teklif için iletişim
      </Link>
    </div>
  );
}
