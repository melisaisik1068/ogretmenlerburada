"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import {
  BentoCard,
  RevealInView,
  SpringLink,
  springInteract,
  bentoSurface,
} from "@/components/motion/bento-motion";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

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

const categoryBento = [
  {
    title: "STEM & doğa bilimleri",
    desc: "Fen · matematik · problem çözme",
    href: "/classes",
    span: "md:col-span-7",
  },
  {
    title: "Diller & iletişim",
    desc: "İngilizce · okuma yazma · sınav içerikleri",
    href: "/classes",
    span: "md:col-span-5",
  },
  {
    title: "Sosyal bilgiler",
    desc: "Tarih · coğrafya · güncel bağlantılar",
    href: "/classes",
    span: "md:col-span-5",
  },
  {
    title: "Profesyonel gelişim",
    desc: "BT · sunum · dijital okuryazarlık",
    href: "/classes",
    span: "md:col-span-7",
  },
];

export function LandingMain() {
  const reduce = useReducedMotion() ?? false;

  return (
    <main>
      <section className="container-page pb-10 pt-6 sm:pb-14 sm:pt-10">
        <div className="grid gap-4 sm:gap-5 md:grid-cols-12 md:gap-6">
          <RevealInView className="md:col-span-7 xl:col-span-8 md:min-h-[320px] xl:min-h-[380px]">
            <motion.div
              className={`relative isolate flex min-h-[280px] flex-col justify-end overflow-hidden p-8 sm:p-10 ${bentoSurface}`}
              whileHover={reduce ? undefined : { scale: 1.01 }}
              transition={springInteract}
            >
              <Image
                src="/images/hero-classroom.jpg"
                alt=""
                fill
                priority
                className="-z-20 object-cover object-center"
              />
              <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[var(--brand-navy)]/92 via-[var(--brand-navy)]/55 to-transparent" />
              <div className="max-w-xl text-white">
                <div className="inline-flex rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-wider backdrop-blur">
                  Güvenilir eğitim ağı
                </div>
                <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-white drop-shadow-sm sm:text-5xl xl:text-[3.35rem]">
                  <span className="bg-gradient-to-r from-white to-[#c7d9ff] bg-clip-text text-transparent">
                    ÖğretmenlerBurada
                  </span>{" "}
                  ile hedefin daha yakın.
                </h1>
                <p className="mt-4 max-w-xl text-pretty text-sm leading-relaxed text-white/85 sm:text-base">
                  Sınıfa özel içerikler, onaylı eğitmenler ve eksiksiz bir öğrenme planıyla ilerlemenin en akıcı yolu burada başlıyor.
                </p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <SpringLink href="/classes" className="btn-accent">
                    Keşfe başlayın
                  </SpringLink>
                  <SpringLink href="/signup" className="btn-outline bg-white/10 text-white ring-white/35 hover:bg-white/15 hover:text-white">
                    Ücretsiz kayıt
                  </SpringLink>
                </div>
              </div>
            </motion.div>
          </RevealInView>

          <div className="flex flex-col gap-4 md:col-span-5 xl:col-span-4">
            <RevealInView>
              <motion.div
                className={`flex flex-1 flex-col justify-between p-6 sm:p-7 ${bentoSurface}`}
                whileHover={reduce ? undefined : { scale: 1.02 }}
                transition={springInteract}
              >
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
                  <Link
                    href="/signup"
                    className="group btn-accent justify-center rounded-2xl"
                  >
                    <span>Hesap oluştur</span>
                    <motion.span aria-hidden className="ml-2 inline-flex" whileHover={{ x: 5 }} transition={springInteract}>
                      <ArrowRight className="size-4" />
                    </motion.span>
                  </Link>
                  <Link href="/login" className="btn-outline justify-center rounded-2xl">
                    Giriş yap
                  </Link>
                </div>
              </motion.div>
            </RevealInView>

            <RevealInView className="grid flex-1 grid-cols-2 gap-3 sm:grid-cols-2">
              <StatMini label="Uzman içerik" value="Çok yakında" tone="accent" />
              <StatMini label="Topluluk" value="Moderasyonlu" tone="muted" />
            </RevealInView>
          </div>
        </div>
      </section>

      {/* Bento categories */}
      <section className="container-page pb-12 sm:pb-16">
        <RevealInView className="text-center">
          <div className="section-eyebrow text-[var(--brand-blue)]">Programlar</div>
          <div className="section-title mx-auto mt-2 text-[var(--brand-navy)]">Esnek bento düzeninde kategori vitrinleri</div>
          <p className="section-lead mx-auto mt-3 max-w-2xl font-medium">
            Her kutu mobilde tek sütun, masaüstünde farklı kolon genişlikleriyle profesyonel vitrin oluşturur.
          </p>
        </RevealInView>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-12">
          {categoryBento.map((c) => (
            <RevealInView key={c.title} className={c.span}>
              <motion.div whileHover={{ scale: reduce ? 1 : 1.015 }} transition={springInteract}>
                <Link href={c.href} className={`flex h-full flex-col justify-between gap-7 p-6 sm:p-7 ${bentoSurface} group`}>
                  <div className="text-left">
                    <h3 className="text-xl font-bold tracking-tight text-[var(--brand-navy)]">{c.title}</h3>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-slate-600">{c.desc}</p>
                  </div>
                  <motion.span className="inline-flex items-center gap-2 text-sm font-bold text-[var(--brand-blue)]" whileHover={{ x: 6 }} transition={springInteract}>
                    Yol haritasını görün
                    <ArrowRight className="size-4" aria-hidden />
                  </motion.span>
                </Link>
              </motion.div>
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
      <section className="bg-[var(--surface-muted)] py-14 sm:py-20">
        <div className="container-page grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { k: "Aktif eğitmen adayı", v: "100+" },
            { k: "Video & PDF içeriği", v: "Günlük güncellenen" },
            { k: "Öğrenen katılımcı", v: "Büyüyen topluluk" },
            { k: "Kurumsal iş birliği", v: "Uygulanabilir süreç" },
          ].map((x, i) => (
            <RevealInView key={x.k}>
              <motion.article
                className={`rounded-3xl border border-slate-200/90 bg-[var(--surface)] p-6 text-center shadow-sm ${i === 0 ? "border-[var(--brand-blue)]/25" : ""}`}
                whileHover={reduce ? undefined : { y: -3, scale: 1.01 }}
                transition={springInteract}
              >
                <div className="text-3xl font-extrabold tracking-tight text-[var(--brand-navy)]">{x.v}</div>
                <div className="mt-3 text-xs font-semibold uppercase tracking-wide text-slate-500">{x.k}</div>
              </motion.article>
            </RevealInView>
          ))}
        </div>
      </section>

      {/* Spotlight */}
      <section className="bg-[var(--surface)] pb-16 pt-14">
        <div className="container-page grid gap-7 lg:grid-cols-12 lg:gap-10">
          <RevealInView className="lg:col-span-5 lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-3xl border border-slate-200/90 bg-gradient-to-br from-[var(--surface-muted)] to-white p-7 shadow-sm sm:p-9">
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
            </div>
          </RevealInView>

          <RevealInView className="lg:col-span-7">
            <BentoCard className="">
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
      <section className="bg-[var(--surface-muted)] pb-20 pt-16">
        <div className="container-page grid gap-6 lg:grid-cols-12 lg:gap-8">
          <RevealInView className="lg:col-span-7">
            <div className="rounded-3xl border border-slate-200/90 bg-[var(--surface)] p-7 shadow-sm sm:p-9">
              <h2 className="text-2xl font-extrabold tracking-tight text-[var(--brand-navy)]">Blog & ilham köşesi</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">
                İçerik API’si hazır olduğunda bu alan otomatik dolacak; şimdilik tipografi ve geçişler test edilebilir.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {[
                  { date: "09 Ağu", title: "Liderlik becerilerini nasıl parlatırsın?", tag: "Kariyer" },
                  { date: "03 Haz", title: "Üniversite bütçesini planlamak", tag: "Rehber" },
                ].map((p) => (
                  <motion.article
                    key={p.title}
                    className={`rounded-3xl border border-slate-200/90 bg-[var(--surface-muted)]/50 p-6 shadow-sm`}
                    whileHover={reduce ? undefined : { y: -4 }}
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
                      <motion.span whileHover={{ x: 4 }} transition={springInteract}>
                        <ArrowRight className="size-4" />
                      </motion.span>
                    </Link>
                  </motion.article>
                ))}
              </div>
            </div>
          </RevealInView>

          <RevealInView className="lg:col-span-5">
            <div className={`flex h-full flex-col justify-between p-7 sm:p-9 ${bentoSurface}`}>
              <div>
                <h2 className="text-xl font-extrabold text-[var(--brand-navy)]">Bültenimize katılın</h2>
                <p className="mt-2 text-sm font-medium text-slate-600">Yeni kurslar, etkinlikler ve platform özetleri.</p>
              </div>
              <NewsletterForm inputId="newsletterEmailHome" className="mt-7 grid gap-3" />
            </div>
          </RevealInView>
        </div>
      </section>
    </main>
  );
}

function StatMini({ label, value, tone }: { label: string; value: string; tone: "accent" | "muted" }) {
  return (
    <motion.div
      className={`rounded-3xl border border-slate-200/90 p-5 shadow-sm ${
        tone === "accent" ? "bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-blue)] text-white" : "bg-white text-[var(--brand-navy)]"
      }`}
      initial={false}
      whileHover={{ scale: 1.02 }}
      transition={springInteract}
    >
      <div className={`text-[11px] font-bold uppercase tracking-wide ${tone === "accent" ? "text-white/70" : "text-slate-400"}`}>
        {label}
      </div>
      <div className={`mt-2 text-sm font-black ${tone === "accent" ? "text-white" : "text-[var(--brand-navy)]"}`}>{value}</div>
    </motion.div>
  );
}

function StaggerBento({ grades, reduce }: { grades: string[]; reduce: boolean }) {
  return (
    <motion.div
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
        <motion.div
          key={label}
          variants={
            reduce
              ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
              : { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.42, ease: [0.22, 1, 0.36, 1] } } }
          }
          whileHover={reduce ? undefined : { scale: 1.02 }}
          transition={springInteract}
        >
          <Link
            href="/classes"
            className={`flex min-h-[4.75rem] items-center justify-center p-5 text-center text-sm font-bold text-[var(--brand-navy)] ${bentoSurface} hover:bg-[var(--surface-muted)]/70`}
          >
            {label}
          </Link>
        </motion.div>
      ))}
    </motion.div>
  );
}

function TopCoursesSection({ reduce }: { reduce: boolean }) {
  return (
    <section className="bg-[var(--surface)] pb-16 pt-6 sm:pt-10">
      <div className="container-page">
        <RevealInView className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eyebrow text-[var(--brand-blue)]">Koleksiyon</div>
            <h2 className="section-title text-[var(--brand-navy)]">Öne çıkan kurslar</h2>
            <p className="section-lead mt-2 max-w-xl font-medium">API’den canlı olarak gelen kartlar için Shadcn sekmeli filtre yapısı.</p>
          </div>
          <Link href="/classes" className="group btn-solid h-11 px-6">
            Tümünü gör
            <motion.span className="ml-2 inline-flex" whileHover={{ x: 6 }} transition={springInteract}>
              <ArrowRight className="size-4 text-white/90 group-hover:text-white" />
            </motion.span>
          </Link>
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
      <motion.div
        className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        layout
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
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
          visible.map((c) => (
            <motion.article
              key={`${tab}-${c.id}`}
              className={`${bentoSurface} overflow-hidden`}
              whileHover={reduce ? undefined : { scale: 1.02 }}
              transition={springInteract}
            >
              <div className="relative h-40 bg-[var(--surface-muted)]">
                {c.cover_image_url ? (
                  <Image src={c.cover_image_url} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(30,77,183,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(53,105,233,0.15),transparent_52%)]" />
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
                  <motion.span whileHover={{ x: 4 }} transition={springInteract}>
                    <Link href={`/classes/${c.id}`} className="link-primary inline-flex items-center gap-1 text-xs uppercase tracking-wide">
                      Derse bak
                      <ArrowRight className="size-3.5" />
                    </Link>
                  </motion.span>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </motion.div>

      {canLoadMore ? (
        <div className="mt-10 flex justify-center">
          <motion.button
            type="button"
            whileTap={{ scale: 0.985 }}
            onClick={() => setVisibleCount((n) => Math.min(n + 6, items.length))}
            className="btn-outline rounded-2xl px-10"
          >
            Daha fazla yükle
          </motion.button>
        </div>
      ) : null}
    </>
  );
}
