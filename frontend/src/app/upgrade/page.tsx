import Link from "next/link";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type PlanRow = { code: string; title: string; price_try: number; billing_cycle_days?: number };

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
          İki ödeme yolu vardır: <strong>Stripe</strong> ile karttan otomatik yenilenen üyelik; <strong>İyzico</strong> ile
          tek çekimde, planda tanımlı süre için erişim (otomatik kart yenilemesi yok).
        </p>
        <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50/90 px-4 py-3 text-sm text-amber-950">
          İyzico satırında gösterilen gün sayısı, Django planındaki <span className="font-mono text-xs">billing_cycle_days</span>{" "}
          alanından gelir (varsayılan 30).
        </div>

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
                <CheckoutButtons planCode={p.code} billingCycleDays={Number(p.billing_cycle_days ?? 30) || 30} />
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

function CheckoutButtons({ planCode, billingCycleDays }: { planCode: string; billingCycleDays: number }) {
  "use client";
  const React = require("react") as typeof import("react");
  const { useState } = React;
  const [loading, setLoading] = useState<"" | "stripe" | "iyzico">("");
  const [err, setErr] = useState("");

  async function goStripe() {
    setLoading("stripe");
    setErr("");
    try {
      const res = await fetch("/api/subscriptions/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ plan: planCode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof (data as any).detail === "string" ? (data as any).detail : "Stripe checkout başlatılamadı.");
        return;
      }
      const url = (data as any).checkout_url as string | undefined;
      if (!url) {
        setErr("Checkout URL alınamadı.");
        return;
      }
      window.location.href = url;
    } finally {
      setLoading("");
    }
  }

  async function goIyzico() {
    setLoading("iyzico");
    setErr("");
    try {
      const res = await fetch("/api/subscriptions/checkout-iyzico", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ plan: planCode }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setErr(typeof (data as any).detail === "string" ? (data as any).detail : "İyzico ödemesi başlatılamadı.");
        return;
      }
      const url = (data as any).payment_page_url as string | undefined;
      if (!url) {
        setErr("Ödeme sayfası alınamadı.");
        return;
      }
      window.location.href = url;
    } finally {
      setLoading("");
    }
  }

  return (
    <div className="mt-5 grid gap-2">
      {err ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{err}</div> : null}
      <p className="text-xs leading-relaxed text-slate-500">
        Stripe: tekrarlayan abonelik, müşteri portalından kart güncellenir.
      </p>
      <button
        className="btn-accent inline-flex w-full justify-center"
        type="button"
        onClick={() => void goStripe()}
        disabled={loading !== ""}
      >
        {loading === "stripe" ? "Yönlendiriliyor…" : "Subscribe (Stripe)"}
      </button>
      <p className="text-xs leading-relaxed text-slate-500">
        İyzico: tek ödeme ile yaklaşık <strong>{billingCycleDays}</strong> günlük erişim; süre bitince yenilemek için tekrar
        ödenir (otomatik yenileme yok).
      </p>
      <button
        className="btn-outline inline-flex w-full justify-center"
        type="button"
        onClick={() => void goIyzico()}
        disabled={loading !== ""}
      >
        {loading === "iyzico" ? "Yönlendiriliyor…" : `Öde (İyzico) — ~${billingCycleDays} gün`}
      </button>
      <Link className="link-muted text-xs" href="/contact">
        Kurumsal/özel teklif için iletişim
      </Link>
    </div>
  );
}
