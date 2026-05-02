"use client";

import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  BentoCard,
  RevealInView,
  SpringLink,
  springInteract,
  springReveal,
  bentoSurface,
  bentoGlowHover,
  bentoGlowRest,
  type BentoGlowTone,
} from "@/components/motion/bento-motion";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RippleWrap } from "@/components/ui/ripple-wrap";

const grades = [
  "1. Sınıf",
  "2. Sınıf",
  "3. Sınıf",
  "4. Sınıf",
  "5. Sınıf",
  "6. Sınıf",
  "7. Sınıf",
  "8. Sınıf (LGS)",
  "9. Sınıf",
  "10. Sınıf",
  "11. Sınıf",
  "12. Sınıf (YKS)",
];

type CoursePublic = {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  access_level: string;
  subject: { id: number; slug: string; title: string };
  teacher: { id: number; username: string; first_name: string; last_name: string };
};

const categoryBento: Array<{
  title: string;
  desc: string;
  href: string;
  span: string;
  glow: BentoGlowTone;
}> = [
  {
    title: "STEM & doğa bilimleri",
    desc: "Fen · matematik · problem çözme",
    href: "/classes",
    span: "md:col-span-7",
    glow: "blue",
  },
  {
    title: "Diller & iletişim",
    desc: "İngilizce · okuma yazma · sınav içerikleri",
    href: "/classes",
    span: "md:col-span-5",
    glow: "violet",
  },
  {
    title: "Sosyal bilgiler",
    desc: "Tarih · coğrafya · güncel bağlantılar",
    href: "/classes",
    span: "md:col-span-5",
    glow: "amber",
  },
  {
    title: "Profesyonel gelişim",
    desc: "BT · sunum · dijital okuryazarlık",
    href: "/classes",
    span: "md:col-span-7",
    glow: "violet",
  },
];

const heroStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

const heroFadeUp = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: springReveal },
};

export function LandingMain() {
  const reduce = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement | null>(null);
  const [heroImg, setHeroImg] = useState("/images/image_86ee84.jpg");
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallaxY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "16%"]);

  return (
    <main>
      {/* Hero — tam ekran + parallax görsel */}
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden">
        <m.div className="absolute inset-0 z-0" style={{ y: heroParallaxY }} aria-hidden>
          <div className="absolute inset-0 scale-[1.12]">
            <Image
              src={heroImg}
              alt=""
              fill
              priority
              quality={78}
              className="object-cover object-center"
              sizes="100vw"
              onError={() => {
                setHeroImg((prev) => {
                  if (prev.endsWith("hero-classroom.jpg")) return prev;
                  if (prev.includes("image_86ee84")) return "/images/hero-classroom.jpg";
                  return prev;
                });
              }}
            />
          </div>
        </m.div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-[#0f172a]/92 via-[#2563eb]/42 to-[#8b5cf6]/22"
          aria-hidden
        />
        <div className="relative z-[2] mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pt-36">
          <m.div
            className="max-w-3xl"
            variants={reduce ? undefined : heroStagger}
            initial={reduce ? false : "hidden"}
            animate={reduce ? undefined : "show"}
          >
            <m.div
              variants={reduce ? undefined : heroFadeUp}
              className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md"
            >
              <span className="text-[var(--brand-amber-light)]">2026</span>
              <span className="mx-2 text-white/40">·</span>
              Güvenilir eğitim ağı
            </m.div>
            <m.h1
              variants={reduce ? undefined : heroFadeUp}
              className="mt-6 text-balance font-[family-name:var(--font-inter-display),system-ui,sans-serif] text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-white via-white to-[#dbeafe] bg-clip-text text-transparent">
                ÖğretmenAğı
              </span>{" "}
              <span className="text-white/95">ile hedefin daha yakın.</span>
            </m.h1>
            <m.p
              variants={reduce ? undefined : heroFadeUp}
              className="mt-6 max-w-xl text-pretty text-base font-medium leading-relaxed text-white/88 sm:text-lg md:text-xl"
            >
              Sınıfa özel içerikler, onaylı eğitmenler ve eksiksiz bir öğrenme planı.
            </m.p>
            <m.div
              variants={reduce ? undefined : heroFadeUp}
              className="mt-10 flex flex-wrap gap-4"
            >
              <m.span
                className="inline-flex"
                whileHover={reduce ? undefined : { scale: 1.05 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                transition={springInteract}
              >
                <RippleWrap className="max-w-none">
                  <Link href="/classes" className="hero-cta-solid">
                    Keşfe Başlayın
                  </Link>
                </RippleWrap>
              </m.span>
              <m.span
                className="inline-flex"
                whileHover={reduce ? undefined : { scale: 1.05 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                transition={springInteract}
              >
                <RippleWrap className="max-w-none">
                  <Link href="/signup" className="hero-cta-ghost">
                    Ücretsiz Kayıt
                  </Link>
                </RippleWrap>
              </m.span>
            </m.div>
          </m.div>
        </div>
      </section>

      {/* Hızlı başlangıç + mini istatistik (hemen altında) */}
      <section className="container-page pb-10 pt-10 sm:pb-14 sm:pt-12">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-12 md:gap-6">
          <RevealInView className="md:col-span-12 xl:col-span-7">
            <BentoCard glowTone="blue">
              <div className="flex flex-1 flex-col justify-between gap-6 p-6 sm:p-7">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hızlı başlangıç</div>
                  <p className="mt-3 text-xl font-extrabold tracking-tight text-[var(--brand-navy)]">
                    Hesabını 2 dakikada oluştur
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Seviyeni seç; kurs, materyal ve topluluğu tek panelden takip et.
                  </p>
                </div>
                <div className="mt-6 grid gap-2">
                  <RippleWrap className="w-full">
                    <Link href="/signup" className="group btn-accent w-full justify-center rounded-2xl">
                      <span>Hesap oluştur</span>
                      <m.span aria-hidden className="ml-2 inline-flex" whileHover={{ x: 5 }} transition={springInteract}>
                        <ArrowRight className="size-4" />
                      </m.span>
                    </Link>
                  </RippleWrap>
                  <RippleWrap className="w-full">
                    <Link href="/login" className="btn-outline w-full justify-center rounded-2xl">
                      Giriş yap
                    </Link>
                  </RippleWrap>
                </div>
              </div>
            </BentoCard>
          </RevealInView>

          <RevealInView className="grid grid-cols-2 gap-3 md:col-span-12 xl:col-span-5 xl:gap-4">
            <StatMini label="Uzman içerik" value="Çok yakında" tone="accent" />
            <StatMini label="Topluluk" value="Moderasyonlu" tone="muted" />
          </RevealInView>
        </div>
      </section>

      {/* Bento categories */}
      <section className="container-page pb-12 sm:pb-16">
        <RevealInView className="text-center">
          <div className="section-eyebrow text-[var(--brand-amber)]">Programlar</div>
          <div className="section-title mx-auto mt-2 text-[var(--brand-navy)]">Esnek bento düzeninde kategori vitrinleri</div>
          <p className="section-lead mx-auto mt-3 max-w-2xl font-medium">
            Her kutu mobilde tek sütun, masaüstünde farklı kolon genişlikleriyle profesyonel vitrin oluşturur.
          </p>
        </RevealInView>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12">
          {categoryBento.map((c) => (
            <RevealInView key={c.title} className={c.span}>
              <BentoCard glowTone={c.glow}>
                <Link href={c.href} className="group flex h-full min-h-[200px] flex-col justify-between gap-7 p-6 sm:p-7">
                  <div className="text-left">
                    <h3 className="text-xl font-bold tracking-tight text-[var(--brand-navy)]">{c.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{c.desc}</p>
                  </div>
                  <m.span
                    className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-blue)]"
                    whileHover={{ x: 6 }}
                    transition={springInteract}
                  >
                    Yol haritasını görün
                    <ArrowRight className="size-4" aria-hidden />
                  </m.span>
                </Link>
              </BentoCard>
            </RevealInView>
          ))}
        </div>
      </section>

      {/* Grades */}
      <section className="container-page pb-12 sm:pb-16">
        <RevealInView className="text-center">
          <div className="section-title text-[var(--brand-navy)]">Sınıf seviyenize göre</div>
          <p className="section-lead mx-auto mt-2 max-w-2xl">İlkokuldan sınav yoğunluklarına kadar seçenekleri keşfedin.</p>
        </RevealInView>

        <StaggerBento grades={grades} reduce={reduce} />
      </section>

      <TopCoursesSection reduce={reduce} />

      {/* Stats */}
      <section className="border-y border-white/20 bg-white/25 py-14 backdrop-blur-md sm:py-20">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              { k: "Aktif eğitmen adayı", v: "100+", glow: "blue" as const },
              { k: "Video & PDF içeriği", v: "Günlük güncellenen", glow: "violet" as const },
              { k: "Öğrenen katılımcı", v: "Büyüyen topluluk", glow: "amber" as const },
              { k: "Kurumsal iş birliği", v: "Uygulanabilir süreç", glow: "neutral" as const },
            ] satisfies Array<{ k: string; v: string; glow: BentoGlowTone }>
          ).map((x) => (
            <RevealInView key={x.k}>
              <m.article
                className={`rounded-3xl border border-white/20 bg-white/40 p-6 text-center backdrop-blur-xl ring-1 ring-white/25`}
                style={reduce ? undefined : { boxShadow: bentoGlowRest(x.glow) }}
                whileHover={reduce ? undefined : bentoGlowHover(x.glow)}
                transition={springInteract}
              >
                <div className="text-3xl font-extrabold tracking-tight text-[var(--brand-navy)]">{x.v}</div>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{x.k}</div>
              </m.article>
            </RevealInView>
          ))}
        </div>
      </section>

      {/* Spotlight */}
      <section className="pb-16 pt-14">
        <div className="container-page grid gap-7 lg:grid-cols-12 lg:gap-10">
          <RevealInView className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <m.div
              className={`rounded-3xl border border-white/20 bg-gradient-to-br from-white/55 via-[#eef2ff]/80 to-[#fdf4ff]/60 p-7 shadow-[0_20px_50px_-12px_rgba(37,99,235,0.15)] backdrop-blur-xl ring-1 ring-white/30 sm:p-9`}
              whileHover={reduce ? undefined : { y: -4, transition: springInteract }}
              transition={springReveal}
            >
              <div className="section-eyebrow text-[var(--brand-blue)]">Öne çıkan eğitmen</div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[var(--brand-navy)]">Ayın yüz yüze motivasyonu</h2>
              <p className="mt-4 text-sm font-medium leading-relaxed text-slate-600">
                Doğrulama süreçleri yakında daha da sıkı; bugün ise deneyimin akışını ve bileşenlerini üst düzeye taşıdık.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <SpringLink href="/signup" className="btn-accent">
                  Eğitmen başvuru
                </SpringLink>
                <SpringLink href="/classes" className="btn-outline">
                  Müfredata göz atın
                </SpringLink>
              </div>
            </m.div>
          </RevealInView>

          <RevealInView className="lg:col-span-7">
            <BentoCard glowTone="amber">
              <div className="grid gap-0 sm:grid-cols-5">
                <div className="relative min-h-[260px] sm:col-span-2">
                  <Image src="/images/teacher.jpg" alt="Eğitmen" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 42vw" />
                </div>
                <div className="flex flex-col justify-center p-8 sm:col-span-3">
                  <div className="inline-flex w-fit rounded-full bg-[var(--surface-muted)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                    Profil yakında yayında
                  </div>
                  <p className="mt-5 text-xl font-black text-[var(--brand-navy)]">Öğretimde tutarlı iletişim</p>
                  <p className="mt-3 text-sm font-medium text-slate-600">
                    Kurs · topluluk · dijital materyal bir arada. Her adımda ne kadar ilerlediğin net biçimde görünür.
                  </p>
                  <ul className="mt-7 grid gap-3 text-sm font-semibold text-[var(--brand-navy)]">
                    {["Canlı ders planlama", "Öğrenci geri bildirimi", "İçerik paylaşımı"].map((t) => (
                      <li key={t} className="flex items-center gap-2 rounded-2xl border border-slate-100 bg-[var(--surface-muted)]/60 px-4 py-3">
                        <span className="size-1.5 rounded-full bg-[var(--brand-blue)]" />
                        {t}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </BentoCard>
          </RevealInView>
        </div>
      </section>

      {/* Blog + newsletter bento */}
      <section className="border-t border-white/15 bg-white/20 pb-20 pt-16 backdrop-blur-sm">
        <div className="container-page grid gap-6 lg:grid-cols-12 lg:gap-8">
          <RevealInView className="lg:col-span-7">
            <div className="rounded-3xl border border-white/20 bg-white/40 p-7 shadow-[0_14px_40px_-12px_rgba(79,70,229,0.12)] backdrop-blur-xl ring-1 ring-white/25 sm:p-9">
              <h2 className="text-2xl font-extrabold tracking-tight text-[var(--brand-navy)]">Blog & ilham köşesi</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">
                İçerik API’si hazır olduğunda bu alan otomatik dolacak; şimdilik tipografi ve geçişler test edilebilir.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { date: "09 Ağu", title: "Liderlik becerilerini nasıl parlatırsın?", tag: "Kariyer" },
                  { date: "03 Haz", title: "Üniversite bütçesini planlamak", tag: "Rehber" },
                ].map((p, idx) => (
                  <m.article
                    key={p.title}
                    className="rounded-3xl border border-white/20 bg-white/35 p-6 backdrop-blur-lg ring-1 ring-white/20"
                    style={reduce ? undefined : { boxShadow: bentoGlowRest(idx === 0 ? "violet" : "blue") }}
                    whileHover={reduce ? undefined : bentoGlowHover(idx === 0 ? "violet" : "blue")}
                    transition={springInteract}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">{p.tag}</div>
                        <h3 className="mt-2 text-lg font-bold text-[var(--brand-navy)]">{p.title}</h3>
                      </div>
                      <div className="rounded-2xl border border-slate-200/80 bg-white px-3 py-2 text-xs font-bold text-slate-700">
                        {p.date}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">İçerik bağlantısı yakında.</p>
                    <Link href="/blog" className="link-primary mt-5 inline-flex items-center gap-1 text-sm">
                      Yazıya git
                      <m.span whileHover={{ x: 4 }} transition={springInteract}>
                        <ArrowRight className="size-4" />
                      </m.span>
                    </Link>
                  </m.article>
                ))}
              </div>
            </div>
          </RevealInView>

          <RevealInView className="lg:col-span-5">
            <BentoCard glowTone="violet" className="flex min-h-[280px] flex-col justify-between">
              <div className="flex h-full flex-col justify-between p-7 sm:p-9">
              <div>
                <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">Bültenimize katılın</h2>
                <p className="mt-2 text-sm font-medium text-slate-600">Yeni kurslar, etkinlikler ve platform özetleri.</p>
              </div>
              <NewsletterForm inputId="newsletterEmailHome" className="mt-7 grid gap-3" />
              </div>
            </BentoCard>
          </RevealInView>
        </div>
      </section>
    </main>
  );
}

function StatMini({ label, value, tone }: { label: string; value: string; tone: "accent" | "muted" }) {
  const rm = !!useReducedMotion();
  const hoverMuted = rm ? undefined : bentoGlowHover("violet");
  const hoverAccent = rm
    ? undefined
    : {
        scale: 1.02,
        boxShadow: "0 24px 48px -8px rgba(37,99,235,0.45), 0 0 40px rgba(245,158,11,0.25)",
      };
  return (
    <m.div
      className={`rounded-3xl border p-5 backdrop-blur-xl ${
        tone === "accent"
          ? "border-[color-mix(in_srgb,var(--brand-amber)_50%,transparent)] bg-gradient-to-br from-[#1d4ed8] via-[#2563eb] to-[#3b82f6] text-white ring-2 ring-[var(--brand-amber)]/40"
          : "border-white/20 bg-white/40 text-[var(--brand-navy)] ring-1 ring-white/25"
      }`}
      style={tone === "muted" ? { boxShadow: bentoGlowRest("violet") } : undefined}
      initial={false}
      whileHover={tone === "accent" ? hoverAccent : hoverMuted}
      transition={springInteract}
    >
      <div className={`text-[11px] font-bold uppercase tracking-wide ${tone === "accent" ? "text-white/70" : "text-slate-400"}`}>
        {label}
      </div>
      <div className={`mt-2 text-sm font-black ${tone === "accent" ? "text-white" : "text-[var(--brand-navy)]"}`}>{value}</div>
    </m.div>
  );
}

function StaggerBento({ grades, reduce }: { grades: string[]; reduce: boolean }) {
  return (
    <m.div
      className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4"
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-40px" }}
      variants={
        reduce
          ? {}
          : { hidden: {}, show: { transition: { staggerChildren: 0.06 } } }
      }
    >
      {grades.map((label) => (
        <m.div
          key={label}
          variants={
            reduce
              ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
              : { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: springReveal } }
          }
          style={reduce ? undefined : { boxShadow: bentoGlowRest("neutral") }}
          whileHover={reduce ? undefined : bentoGlowHover("blue")}
          transition={springInteract}
        >
          <Link
            href="/classes"
            className={`flex min-h-[4.75rem] items-center justify-center p-5 text-center text-sm font-bold text-[var(--brand-navy)] ${bentoSurface}`}
          >
            {label}
          </Link>
        </m.div>
      ))}
    </m.div>
  );
}

function TopCoursesSection({ reduce }: { reduce: boolean }) {
  return (
    <section className="border-t border-white/15 bg-white/25 pb-16 pt-6 backdrop-blur-sm sm:pt-10">
      <div className="container-page">
        <RevealInView className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eyebrow text-[var(--brand-blue)]">Koleksiyon</div>
            <h2 className="section-title text-[var(--brand-navy)]">Öne çıkan kurslar</h2>
            <p className="section-lead mt-2 max-w-xl font-medium">API’den canlı olarak gelen kartlar için Shadcn sekmeli filtre yapısı.</p>
          </div>
          <RippleWrap>
            <Link href="/classes" className="group btn-solid h-11 px-6">
              Tümünü gör
              <m.span className="ml-2 inline-flex" whileHover={{ x: 6 }} transition={springInteract}>
                <ArrowRight className="size-4 text-white/90 group-hover:text-white" />
              </m.span>
            </Link>
          </RippleWrap>
        </RevealInView>

        <TopCoursesContent reduce={reduce} />
      </div>
    </section>
  );
}

function TopCoursesContent({ reduce }: { reduce: boolean }) {
  const [tab, setTab] = useState<"newest" | "oldest" | "rating">("newest");

  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as "newest" | "oldest" | "rating")} className="mt-7">
      <RevealInView>
        <TabsList aria-label="Kurs sıralama" className="w-full flex-wrap gap-2 sm:inline-flex">
          <TabsTrigger value="newest" className="flex-1 min-[460px]:flex-none">
            En yeni
          </TabsTrigger>
          <TabsTrigger value="oldest" className="flex-1 min-[460px]:flex-none">
            En eski
          </TabsTrigger>
          <TabsTrigger value="rating" className="flex-1 min-[460px]:flex-none">
            Genel sıra
          </TabsTrigger>
        </TabsList>
      </RevealInView>
      <TabsContent
        value={tab}
        className="mt-0 border-0 bg-transparent p-0 shadow-none outline-none data-[state=inactive]:hidden"
      >
        <TopCoursesClient reduce={reduce} tab={tab} />
      </TabsContent>
    </Tabs>
  );
}

function courseCardGlowTone(c: CoursePublic, index: number): BentoGlowTone {
  if (c.cover_image_url) return "blue";
  const tones: BentoGlowTone[] = ["violet", "amber", "blue"];
  return tones[index % 3];
}

function TopCoursesClient({ reduce, tab }: { reduce: boolean; tab: "newest" | "oldest" | "rating" }) {
  const [items, setItems] = useState<CoursePublic[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  const base = useMemo(() => (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, ""), []);

  useEffect(() => {
    let alive = true;
    if (!base) {
      Promise.resolve().then(() => {
        if (!alive) return;
        setItems([]);
        setIsLoading(false);
      });
      return () => {
        alive = false;
      };
    }
    async function run() {
      setIsLoading(true);
      try {
        const res = await fetch(`${base}/api/lessons/courses/`, { headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("bad status");
        const data = (await res.json()) as CoursePublic[] | { results?: CoursePublic[] };
        const list = Array.isArray(data) ? data : (data.results ?? []);
        if (!alive) return;
        let sorted = [...list];
        if (tab === "oldest") sorted = sorted.reverse();
        setItems(sorted);
        setVisibleCount(6);
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    }
    void run();
    return () => {
      alive = false;
    };
  }, [base, tab]);

  const visible = items.slice(0, visibleCount);
  const canLoadMore = !isLoading && visibleCount < items.length;

  return (
    <>
      <m.div
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        layout
        initial={reduce ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={reduce ? undefined : springReveal}
        key={`${tab}-${isLoading}`}
      >
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={`${bentoSurface} overflow-hidden`}>
              <div className="h-40 bg-[var(--surface-muted)] animate-pulse" />
              <div className="p-5 space-y-2">
                <div className="h-3 w-24 animate-pulse rounded bg-slate-200" />
                <div className="h-5 w-[88%] animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-full animate-pulse rounded bg-slate-100" />
                <div className="h-3 w-4/6 animate-pulse rounded bg-slate-100" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className={`rounded-3xl border border-dashed border-slate-300/70 p-10 text-center text-sm font-medium text-slate-600 sm:col-span-2 lg:col-span-3`}>
            {base ? "Henüz yayınlı kurs yok veya API’ye bağlanılamıyor." : "NEXT_PUBLIC_API_BASE_URL tanımlı değil."}
          </div>
        ) : (
          visible.map((c, idx) => {
            const glow = courseCardGlowTone(c, idx);
            return (
            <m.article
              key={`${tab}-${c.id}`}
              className={`${bentoSurface} overflow-hidden`}
              style={reduce ? undefined : { boxShadow: bentoGlowRest(glow) }}
              whileHover={reduce ? undefined : bentoGlowHover(glow)}
              transition={springInteract}
            >
              <div className="relative h-40 bg-[var(--surface-muted)]">
                {c.cover_image_url ? (
                  <Image src={c.cover_image_url} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.22),transparent_55%),radial-gradient(circle_at_80%_40%,rgba(139,92,246,0.18),transparent_52%),radial-gradient(circle_at_50%_100%,rgba(245,158,11,0.12),transparent_45%)]" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--brand-blue)]">{c.subject.title}</div>
                  <span className="rounded-full bg-[var(--surface-muted)] px-2 py-1 text-[10px] font-bold uppercase text-[var(--brand-navy)]">
                    {c.access_level?.toUpperCase?.() ?? "—"}
                  </span>
                </div>
                <h3 className="mt-2 text-lg font-extrabold text-[var(--brand-navy)]">{c.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm font-medium leading-relaxed text-slate-600">{c.description || "—"}</p>
                <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-[11px] font-semibold text-slate-500">
                  <span className="text-slate-600">
                    Eğitmen:{" "}
                    <strong className="text-[var(--brand-navy)]">
                      {[c.teacher.first_name, c.teacher.last_name].filter(Boolean).join(" ") || c.teacher.username}
                    </strong>
                  </span>
                  <m.span whileHover={{ x: 4 }} transition={springInteract}>
                    <Link href={`/classes/${c.id}`} className="link-primary inline-flex items-center gap-1 text-xs uppercase tracking-wide">
                      Derse bak
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </m.span>
                </div>
              </div>
            </m.article>
            );
          })
        )}
      </m.div>

      {canLoadMore ? (
        <div className="mt-10 flex justify-center">
          <RippleWrap>
            <m.button
              type="button"
              whileTap={{ scale: 0.985 }}
              onClick={() => setVisibleCount((n) => Math.min(n + 6, items.length))}
              className="btn-outline rounded-2xl px-10"
            >
              Daha fazla yükle
            </m.button>
          </RippleWrap>
        </div>
      ) : null}
    </>
  );
}
