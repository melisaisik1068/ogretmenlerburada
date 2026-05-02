import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";
import type { SubscriptionPayload, UserMe } from "@/lib/types/api";

async function requireAuth(nextPath: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return token;
}

async function loadSession(): Promise<{ user: UserMe; subscription: SubscriptionPayload | null }> {
  const token = await requireAuth("/dashboard/subscription");
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

  const meRes = await fetch(`${base}/api/accounts/me/`, { headers, cache: "no-store" });
  if (!meRes.ok) redirect("/login?next=/dashboard/subscription");
  const user = (await meRes.json()) as UserMe;

  const subRes = await fetch(`${base}/api/subscriptions/me/`, { headers, cache: "no-store" });
  const subscription = subRes.ok ? ((await subRes.json()) as SubscriptionPayload) : null;
  return { user, subscription };
}

export default async function SubscriptionPage() {
  const { user, subscription } = await loadSession();
  const planTitle = (subscription as any)?.plan?.title ?? null;
  const billingCycleDaysPlan = Number((subscription as any)?.plan?.billing_cycle_days) || null;
  const status = (subscription as any)?.status ?? null;
  const provider =
    subscription && typeof subscription === "object" && "provider" in subscription
      ? String((subscription as { provider?: string }).provider ?? "")
      : "";
  const cps = (subscription as any)?.current_period_start ?? null;
  const cpe = (subscription as any)?.current_period_end ?? null;
  const cancelAtPeriodEnd = !!(subscription as any)?.cancel_at_period_end;

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Billing</div>
        <h1 className="section-title">My subscription</h1>
        <p className="section-lead">
          Stripe kullanıcılarında otomatik yenileme ve müşteri portalı geçerlidir; İyzico ödemelerinde erişim, plandaki günlük
          süreye göre tarihsel olarak biter — yenileme için tekrar ödeme gerekir.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/dashboard" className="btn-outline h-10 px-4">
            ← Dashboard
          </Link>
          <Link href="/upgrade" className="btn-solid h-10 px-4">
            Plans
          </Link>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="surface p-6">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">Status</div>
              <div className="mt-4 grid gap-2 text-sm text-slate-700">
                <div>
                  User: <span className="font-semibold text-slate-900">{user.username}</span>
                </div>
                <div>
                  Plan: <span className="font-semibold text-slate-900">{planTitle ?? "—"}</span>
                </div>
                <div>
                  Status: <span className="font-semibold text-slate-900">{status ?? "—"}</span>
                </div>
                <div>
                  Period:{" "}
                  <span className="font-semibold text-slate-900">
                    {cps ? new Date(cps).toLocaleString("tr-TR") : "—"} → {cpe ? new Date(cpe).toLocaleString("tr-TR") : "—"}
                  </span>
                </div>
                <div>
                  Cancel at period end: <span className="font-semibold text-slate-900">{String(cancelAtPeriodEnd)}</span>
                </div>
                {provider === "iyzico" ? (
                  <div className="rounded-xl border border-sky-100 bg-sky-50/80 px-3 py-2 text-xs leading-relaxed text-sky-950">
                    Bu üyelik <strong>İyzico tek çekimi</strong> ile açılmıştır. Plan tanımında{" "}
                    <span className="font-mono">billing_cycle_days</span>:{" "}
                    <strong>{billingCycleDaysPlan ?? "—"}</strong> gün (yenilemede süre sıfırlanır).
                  </div>
                ) : null}
              </div>
            </div>
          </section>

          <section className="lg:col-span-5">
            <div className="surface p-6">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">Manage</div>
              <p className="mt-2 text-sm text-slate-600">
                Stripe aboneliğinde iptal/portal; İyzico’da süre sonuna kadar manuel yönetim.
              </p>
              <div className="mt-5">
                <ManageButtons
                  cancelAtPeriodEnd={cancelAtPeriodEnd}
                  hasSubscription={!!planTitle}
                  provider={provider || null}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function ManageButtons({
  cancelAtPeriodEnd,
  hasSubscription,
  provider,
}: {
  cancelAtPeriodEnd: boolean;
  hasSubscription: boolean;
  provider: string | null;
}) {
  "use client";
  const React = require("react") as typeof import("react");
  const { useState } = React;
  const [loading, setLoading] = useState(false);
  const [portalBusy, setPortalBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function call(action: "cancel" | "resume") {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch("/api/subscriptions/manage", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ action }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(typeof (data as any).detail === "string" ? (data as any).detail : "İşlem başarısız.");
        return;
      }
      setMsg(action === "cancel" ? "İptal işaretlendi (period sonunda)." : "Devam ettirildi.");
      window.location.reload();
    } finally {
      setLoading(false);
    }
  }

  async function openBillingPortal() {
    setPortalBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/subscriptions/billing-portal", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(typeof (data as any).detail === "string" ? (data as any).detail : "Portal açılamadı.");
        return;
      }
      const url = (data as any).url as string | undefined;
      if (!url) {
        setMsg("Portal URL alınamadı.");
        return;
      }
      window.location.href = url;
    } finally {
      setPortalBusy(false);
    }
  }

  if (!hasSubscription) {
    return (
      <div className="text-sm text-slate-600">
        Abonelik yok. <Link className="link-primary font-semibold" href="/upgrade">Planlara git</Link>.
      </div>
    );
  }

  return (
    <div className="grid gap-2">
      {msg ? <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{msg}</div> : null}
      {provider === "stripe" ? (
        <button
          className="btn-outline h-11 justify-center"
          type="button"
          disabled={portalBusy}
          onClick={() => void openBillingPortal()}
        >
          {portalBusy ? "Açılıyor…" : "Stripe müşteri portalı / faturalar"}
        </button>
      ) : null}
      {provider === "stripe" ? (
        !cancelAtPeriodEnd ? (
          <button
            className="btn-outline h-11 justify-center border-red-200 text-red-700 hover:bg-red-50"
            type="button"
            disabled={loading}
            onClick={() => void call("cancel")}
          >
            {loading ? "İşleniyor…" : "Cancel subscription"}
          </button>
        ) : (
          <button className="btn-solid h-11 justify-center" type="button" disabled={loading} onClick={() => void call("resume")}>
            {loading ? "İşleniyor…" : "Resume subscription"}
          </button>
        )
      ) : hasSubscription ? (
        <p className="text-xs text-slate-600">
          İyzico üyeliğinde iptal/yenileme yoktur: dönem biter veya süreyi yenilemek için /upgrade üzerinden yeni tek çekim
          yapılır (kart otomatik çekilmez).
        </p>
      ) : null}
    </div>
  );
}

