"use client";

import Link from "next/link";

import { GlassMotionCard, SpringLink, Stagger } from "@/components/motion/bento-motion";
import type { SubscriptionPayload, UserMe } from "@/lib/types/api";
import { subscriptionPlanCode } from "@/lib/subscription";

type Props = {
  user: UserMe;
  subscription: SubscriptionPayload | null;
};

export function StudentDashboard({ user, subscription }: Props) {
  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.username;
  const planCode = subscriptionPlanCode(subscription);

  const cards = [
    {
      title: "Kurslar & dersler",
      desc: "Canlı ve kayıtlı içeriklere git, ilerlemeni takip et.",
      href: "/classes",
      cta: "Kurslara git",
    },
    {
      title: "Deneme sınavları",
      desc: "LGS, YKS, ALES formatında süreli sınavlara gir.",
      href: "/exams",
      cta: "Sınavlar",
    },
    {
      title: "Ödevlerim",
      desc: "Öğretmenin verdiği ödevlere fotoğraf yükle.",
      href: "/odevler",
      cta: "Ödevler",
    },
    {
      title: "Mağaza",
      desc: "PDF not ve test satın al, indir.",
      href: "/shop",
      cta: "Mağaza",
    },
    {
      title: "Kurum paketi",
      desc: "Premium video ve sınav erişimi için abone ol.",
      href: "/paketler",
      cta: "Paketler",
    },
    {
      title: "Canlı ders randevusu",
      desc: "Öğretmen müsaitliğinden randevu al.",
      href: "/dashboard/appointments",
      cta: "Randevu al",
    },
    {
      title: "Siparişlerim",
      desc: "Mağaza alışveriş geçmişi.",
      href: "/dashboard/orders",
      cta: "Siparişler",
    },
    {
      title: "İstek listesi",
      desc: "Kaydettiğin kurs ve materyaller.",
      href: "/wishlist",
      cta: "Liste",
    },
  ];

  return (
    <main className="container-page py-8 sm:py-12">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Öğrenci paneli</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">Merhaba, {name}</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Plan: <span className="font-semibold text-slate-900">{planCode ? planCode.toUpperCase() : "—"}</span>
          {" · "}
          Tüm öğrenme araçların burada.
        </p>
      </div>

      <Stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <GlassMotionCard key={c.href} className="flex flex-col p-6" glowOnHover="blue">
            <h2 className="text-lg font-extrabold text-slate-900">{c.title}</h2>
            <p className="mt-2 flex-1 text-sm text-slate-600">{c.desc}</p>
            <Link href={c.href} className="btn-solid mt-5 inline-flex h-10 items-center justify-center px-4 text-sm">
              {c.cta}
            </Link>
          </GlassMotionCard>
        ))}
      </Stagger>

      <div className="mt-8 flex flex-wrap gap-2">
        <SpringLink href="/upgrade" className="btn-outline h-10 px-4">
          Üyelik yükselt
        </SpringLink>
        <SpringLink href="/dashboard/subscription" className="btn-outline h-10 px-4">
          Aboneliğim
        </SpringLink>
      </div>
    </main>
  );
}
