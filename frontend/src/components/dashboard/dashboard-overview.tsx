"use client";

import { BookOpen, LineChart, MessageSquare } from "lucide-react";

import { GlassMotionCard, SpringLink, Stagger } from "@/components/motion/bento-motion";
import type { SubscriptionPayload, UserMe } from "@/lib/types/api";
import { subscriptionPlanCode } from "@/lib/subscription";

type Props = {
  user: UserMe | null;
  subscription: SubscriptionPayload | null;
};

function parseDate(value?: string | null): Date | null {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function DashboardOverview({ user, subscription }: Props) {
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  const greeting = displayName || user?.username || "Üye";
  const planCode = subscriptionPlanCode(subscription);
  const trialEndsAt = subscription && typeof subscription === "object" && "trial_ends_at" in subscription ? parseDate(subscription.trial_ends_at ?? null) : null;
  const periodEnd = subscription && typeof subscription === "object" && "current_period_end" in subscription ? parseDate(subscription.current_period_end ?? null) : null;
  const now = new Date();
  const hasActiveTrial = !!(trialEndsAt && trialEndsAt > now);
  const hasActivePeriod = !!(periodEnd && periodEnd > now);
  const hasAnyAccess = Boolean(planCode) && (hasActiveTrial || hasActivePeriod || (subscription as any)?.status === "active");
  const missingAccess = user && !hasAnyAccess;

  return (
    <main className="container-page py-8 sm:py-12">
      <div className="flex flex-col gap-2 px-0.5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hoş geldin</p>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{greeting}</h1>
          </div>
          <div className="rounded-full border border-white/40 bg-white/55 px-4 py-1.5 text-xs font-semibold text-slate-700 backdrop-blur-md">
            Rol:{" "}
            <span className="text-slate-900">{user?.role === "teacher" ? "Öğretmen" : user?.role === "student" ? "Öğrenci" : user?.role ?? "—"}</span>
            {" · "}
            Plan:{" "}
            <span className="text-slate-900">{planCode ? planCode.toUpperCase() : "Atanmadı"}</span>
          </div>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Özet görünüm — backend ile bağlı oturumun burada. Ders katalogları ve abonelik API üzerinden güncellenir.
        </p>
      </div>

      {user ? (
        <TrialUpsellBanner
          missingAccess={missingAccess}
          hasActiveTrial={hasActiveTrial}
          trialEndsAt={trialEndsAt}
        />
      ) : null}

      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassMotionCard className="p-6" glowOnHover="blue">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">İçerik</div>
              <div className="mt-2 text-lg font-extrabold text-slate-900">Derslerim</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Yayında olan kursları keşfet ve kayıtlı içeriklerini takip et.</p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-blue-200/60 bg-blue-500/10 text-blue-700">
              <BookOpen className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <div className="mt-5">
            <SpringLink href="/classes" className="btn-outline w-full justify-center sm:w-auto">
              Sınıflara git
            </SpringLink>
          </div>
        </GlassMotionCard>

        <GlassMotionCard className="p-6" glowOnHover="violet">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Performans</div>
              <div className="mt-2 text-lg font-extrabold text-slate-900">İlerleme</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Öğrenme analitiği yakında API ile birlikte genişleyecek.
              </p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-200/60 bg-emerald-500/10 text-emerald-700">
              <LineChart className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <div className="mt-5">
            <SpringLink href="/faq" className="btn-outline w-full justify-center sm:w-auto">
              Nasıl çalışır?
            </SpringLink>
          </div>
        </GlassMotionCard>

        <GlassMotionCard className="p-6 sm:col-span-2 lg:col-span-1" glowOnHover="amber">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Abonelik</div>
              <div className="mt-2 text-lg font-extrabold text-slate-900">Pro & destek</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Pro özellikleri için plan yükseltmesi yapabilir veya bizimle iletişime geçebilirsin.
              </p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-indigo-200/60 bg-indigo-500/10 text-indigo-700">
              <MessageSquare className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            <SpringLink href="/upgrade" className="btn-accent">
              Planları gör
            </SpringLink>
            <SpringLink href="/dashboard/subscription" className="btn-outline">
              Aboneliğim
            </SpringLink>
            <SpringLink href="/dashboard/orders" className="btn-outline">
              Siparişlerim
            </SpringLink>
            <SpringLink href="/contact" className="btn-outline">
              İletişim
            </SpringLink>
            {user?.role === "teacher" ? (
              <>
                <SpringLink href="/dashboard/teacher/courses" className="btn-solid">
                  Teacher panel
                </SpringLink>
                <SpringLink href="/dashboard/teacher/appointments" className="btn-outline">
                  Canlı ders / Randevu
                </SpringLink>
              </>
            ) : null}
            {user?.role === "student" ? (
              <SpringLink href="/dashboard/appointments" className="btn-solid">
                Canlı ders randevusu
              </SpringLink>
            ) : null}
          </div>
        </GlassMotionCard>
      </Stagger>
    </main>
  );
}

function TrialUpsellBanner({
  missingAccess,
  hasActiveTrial,
  trialEndsAt,
}: {
  missingAccess: boolean;
  hasActiveTrial: boolean;
  trialEndsAt: Date | null;
}) {
  const React = require("react") as typeof import("react");
  const { useState } = React;
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function startTrial() {
    setBusy(true);
    setMsg("");
    try {
      const res = await fetch("/api/subscriptions/start-trial", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMsg(typeof (data as any).detail === "string" ? (data as any).detail : "Deneme başlatılamadı.");
        return;
      }
      window.location.reload();
    } finally {
      setBusy(false);
    }
  }

  if (!missingAccess && !hasActiveTrial) return null;

  return (
    <div className="mt-6 rounded-3xl border border-amber-200/80 bg-white/70 p-5 shadow-sm backdrop-blur">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="text-sm font-extrabold tracking-tight text-slate-900">
            {hasActiveTrial ? "Ücretsiz denemen aktif" : "Ücretsiz deneme bitti / plan gerekli"}
          </div>
          <div className="mt-1 text-sm text-slate-600">
            {hasActiveTrial && trialEndsAt ? (
              <>Deneme bitiş: <span className="font-semibold text-slate-900">{trialEndsAt.toLocaleString("tr-TR")}</span></>
            ) : (
              "7 gün ücretsiz deneme başlatabilir veya planını yükseltebilirsin."
            )}
          </div>
          {msg ? <div className="mt-2 text-sm text-rose-700">{msg}</div> : null}
        </div>
        <div className="flex flex-wrap gap-2">
          {!hasActiveTrial ? (
            <button className="btn-accent h-11" type="button" disabled={busy} onClick={() => void startTrial()}>
              {busy ? "Başlatılıyor…" : "7 gün dene"}
            </button>
          ) : null}
          <SpringLink href="/upgrade" className="btn-outline h-11">
            Planları gör
          </SpringLink>
        </div>
      </div>
    </div>
  );
}
