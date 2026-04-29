"use client";

import { BookOpen, LineChart, MessageSquare } from "lucide-react";

import { GlassMotionCard, SpringLink, Stagger } from "@/components/motion/bento-motion";

export function DashboardOverview() {
  return (
    <main className="container-page py-8 sm:py-12">
      <div className="flex flex-col gap-2 px-0.5">
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Kontrol paneli</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-slate-600">
          Özet görünüm — dersler, mesajlar ve ilerlemen burada toplanır. Yeni nesil arayüz ile odaklanman kolaylaşır.
        </p>
      </div>

      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <GlassMotionCard className="p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">İçerik</div>
              <div className="mt-2 text-lg font-extrabold text-slate-900">Derslerim</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">Kayıtlı programların ve materyallerin özeti.</p>
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
                Haftalık çalışma ritmini ve hedef durumunu buradan takip edeceksin.
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
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Topluluk</div>
              <div className="mt-2 text-lg font-extrabold text-slate-900">Mesajlar</div>
              <p className="mt-2 text-sm leading-relaxed text-slate-600">
                Yakında eğitmen ve veli ile güvenli iletişim kanalları burada olacak.
              </p>
            </div>
            <span className="grid h-11 w-11 place-items-center rounded-2xl border border-indigo-200/60 bg-indigo-500/10 text-indigo-700">
              <MessageSquare className="h-5 w-5" aria-hidden />
            </span>
          </div>
          <div className="mt-5">
            <SpringLink href="/contact" className="btn-accent w-full justify-center sm:w-auto">
              İletişim
            </SpringLink>
          </div>
        </GlassMotionCard>
      </Stagger>
    </main>
  );
}
