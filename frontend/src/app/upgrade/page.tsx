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
        <h1 className="text-2xl font-extrabold tracking-tight">Plan yükselt</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Abonelik planları Django&apos;daki <span className="font-mono text-xs">GET /api/subscriptions/plans/</span>{" "}
          endpoint&apos;inden gelir.
        </p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {plans.length === 0 ? (
            <div className="rounded-3xl border border-white/30 bg-white/55 p-6 text-sm text-slate-600 backdrop-blur-xl">
              Planlar yüklenemedi veya henüz tanımlı değil. Django admin üzerinden abonelik planları ekleyebilirsin.
            </div>
          ) : (
            plans.map((p) => (
              <div
                key={p.code}
                className="rounded-3xl border border-white/25 bg-white/60 p-6 shadow-xl shadow-blue-500/5 backdrop-blur-xl ring-1 ring-white/20"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{p.code}</div>
                <div className="mt-2 text-xl font-extrabold text-slate-900">{p.title}</div>
                <div className="mt-2 text-sm text-slate-600">{p.price_try} ₺ / ay</div>
                <Link className="btn-accent mt-5 inline-flex w-full justify-center" href="/contact">
                  Teklif al
                </Link>
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
