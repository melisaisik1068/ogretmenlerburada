"use client";

import { BookOpen, LineChart, MessageSquare } from "lucide-react";

import { GlassMotionCard, SpringLink, Stagger } from "@/components/motion/bento-motion";
import type { SubscriptionPayload, UserMe } from "@/lib/types/api";
import { subscriptionPlanCode } from "@/lib/subscription";

type Props = {
  user: UserMe | null;
  subscription: SubscriptionPayload | null;
};

export function DashboardOverview({ user, subscription }: Props) {
  const displayName = [user?.first_name, user?.last_name].filter(Boolean).join(" ").trim();
  const greeting = displayName || user?.username || "Üye";
  const planCode = subscriptionPlanCode(subscription);

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

      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassMotionCard className="p-6">
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

        <GlassMotionCard className="p-6">
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

        <GlassMotionCard className="p-6 sm:col-span-2 lg:col-span-1">
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
            <SpringLink href="/contact" className="btn-outline">
              İletişim
            </SpringLink>
          </div>
        </GlassMotionCard>
      </Stagger>
    </main>
  );
}
