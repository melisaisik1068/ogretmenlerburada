"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import { GlassMotionCard, springInteract, SpringLink, Stagger, glassCard } from "@/components/motion/bento-motion";

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

const categories = [
  { label: "Graphic & Web-design", href: "/classes" },
  { label: "Environmental Sciences", href: "/classes" },
  { label: "Economics & Finances", href: "/classes" },
  { label: "Analysis of Algorithms", href: "/classes" },
  { label: "Software Development", href: "/classes" },
];

export function LandingMain() {
  const reduce = useReducedMotion() ?? false;

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden bg-white">
        <div aria-hidden className="absolute inset-0">
          <Image src="/images/hero-classroom.jpg" alt="" fill priority className="object-cover object-center" />
          <div className="absolute inset-0 bg-white/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(26,115,232,0.16),transparent_45%),radial-gradient(circle_at_90%_10%,rgba(255,182,6,0.18),transparent_45%)]" />
        </div>
        <div className="container-page relative py-12 sm:py-20">
          <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-7">
              <div className="badge bg-white/90">Take the first step</div>
              <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
                <span className="text-gradient">ÖğretmenlerBurada</span> ile öğrenmeye başla
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-600">
                Sınıfına göre içerikleri keşfet, uzman eğitmenlerle ilerlemeni hızlandır. Modern, düzenli ve takip edilebilir
                bir öğrenme deneyimi.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <SpringLink href="/classes" className="btn-accent">
                  Ready to get Started?
                </SpringLink>
                <SpringLink href="/signup" className="btn-outline">
                  Kayıt Ol
                </SpringLink>
              </div>

              <div className="mt-7 flex flex-wrap gap-2 text-xs text-slate-600">
                <span className="badge">Öğrenci</span>
                <span className="badge">Öğretmen</span>
                <span className="badge">Veli</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="surface overflow-hidden">
                <div className="border-b border-slate-200 bg-white px-6 py-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Hemen başla</div>
                  <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">Ücretsiz dene</div>
                  <div className="mt-2 text-sm text-slate-600">2 dakikada üyelik oluştur, seviyeni seç ve içeriği keşfet.</div>
                  <div className="mt-5 grid gap-2 sm:grid-cols-2">
                    <Link href="/signup" className="btn-accent justify-center">
                      Ücretsiz Üye Ol
                    </Link>
                    <Link href="/login" className="btn-solid justify-center">
                      Giriş Yap
                    </Link>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 bg-slate-50 p-5">
                  {[
                    { k: "Uzman Eğitmenler", v: "Onaylı & deneyimli" },
                    { k: "Öğrenci Odaklı", v: "Akıllı takip" },
                    { k: "Zengin Materyal", v: "PDF • Video • Test" },
                  ].map((s) => (
                    <div key={s.k} className="rounded-2xl border border-slate-200 bg-white p-4">
                      <div className="text-[11px] font-semibold text-slate-500">{s.k}</div>
                      <div className="mt-1 text-sm font-extrabold tracking-tight text-slate-900">{s.v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category strip */}
      <section className="bg-white">
        <div className="container-page py-10 sm:py-12">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {categories.map((c) => (
              <Link
                key={c.label}
                href={c.href}
                className="surface flex items-center justify-center px-5 py-4 text-center text-sm font-semibold text-slate-900 transition hover:-translate-y-px hover:shadow-lg"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grade grid */}
      <section className="container-page py-12 sm:py-16">
        <div className="text-center">
          <div className="section-title">Sınıf seviyenize göre içerikleri keşfedin</div>
          <div className="section-lead mx-auto">İlkokuldan lise & sınav hazırlığına kadar.</div>
        </div>

        <Stagger className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {grades.map((label) => (
            <motion.div
              key={label}
              variants={
                reduce
                  ? {
                      hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
                      show: { opacity: 1, y: 0, filter: "blur(0px)" },
                    }
                  : {
                      hidden: { opacity: 0, y: 20, filter: "blur(8px)" },
                      show: {
                        opacity: 1,
                        y: 0,
                        filter: "blur(0px)",
                        transition: { duration: 0.4 },
                      },
                    }
              }
              whileHover={
                reduce
                  ? undefined
                  : { scale: 1.04, boxShadow: "0 20px 40px -12px rgba(37, 99, 235, 0.22)" }
              }
              transition={springInteract}
            >
              <Link
                href="/classes"
                className="surface block p-4 text-center text-sm font-semibold text-slate-900 transition-colors hover:border-slate-300"
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* Top courses */}
      <TopCoursesSection reduce={reduce} />

      {/* Achievements / counters */}
      <section className="bg-slate-50">
        <div className="container-page py-12 sm:py-16">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Foreign followers", v: "18K+" },
              { k: "Classes complete", v: "320+" },
              { k: "Students enrolled", v: "12K+" },
              { k: "Certified teachers", v: "240+" },
            ].map((x) => (
              <div key={x.k} className="surface p-6 text-center">
                <div className="text-3xl font-extrabold tracking-tight text-slate-900">{x.v}</div>
                <div className="mt-2 text-sm text-slate-600">{x.k}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Teacher spotlight */}
      <section className="bg-white">
        <div className="container-page py-12 sm:py-16">
          <div className="grid items-start gap-8 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <div className="section-eyebrow">Teacher of month</div>
              <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">Ayın Eğitmeni</div>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                Öne çıkan eğitmenlerimizi burada sergileyeceğiz. Profil sayfaları ve doğrulama sistemi ilerleyen adımda API ile
                bağlanacak.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <SpringLink href="/signup" className="btn-accent">
                  Eğitmen Ol
                </SpringLink>
                <SpringLink href="/classes" className="btn-outline">
                  Kursları İncele
                </SpringLink>
              </div>
            </div>
            <div className="lg:col-span-7">
              <div className="surface overflow-hidden">
                <div className="grid gap-0 sm:grid-cols-2">
                  <div className="relative min-h-[240px]">
                    <Image src="/images/teacher.jpg" alt="Eğitmen" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 50vw" />
                  </div>
                  <div className="p-6">
                    <div className="badge">Demo Instructor</div>
                    <div className="mt-3 text-xl font-extrabold tracking-tight text-slate-900">Uzman Eğitmen</div>
                    <div className="mt-2 text-sm text-slate-600">
                      Birlikte karanlık olmaz. Öğrenme yolculuğunda sana eşlik edecek içerikler, topluluk ve takip araçları.
                    </div>
                    <div className="mt-5 grid gap-3">
                      {[
                        { t: "Kurslar", d: "Seviyene göre planlı içerikler" },
                        { t: "Topluluk", d: "Soru-cevap ve destek" },
                        { t: "Sertifika", d: "Tamamlanan içerik ödülleri" },
                      ].map((s) => (
                        <div key={s.t} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="text-sm font-extrabold text-slate-900">{s.t}</div>
                          <div className="mt-1 text-sm text-slate-600">{s.d}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Blog + newsletter */}
      <section className="bg-slate-50">
        <div className="container-page py-12 sm:py-16">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="section-title">Masterstudy Blog benzeri içerikler</div>
              <p className="section-lead">
                Blog sistemi henüz bağlı değil; ama görünüm olarak Masterstudy’ye yakın kart yapısını hazırladık.
              </p>
              <div className="mt-7 grid gap-4 sm:grid-cols-2">
                {[
                  { date: "09 Aug", title: "Lider olarak kendini geliştirmek", tag: "Hobiler" },
                  { date: "03 Jun", title: "Diğer üniversite masrafları", tag: "Eğitim" },
                ].map((p) => (
                  <article key={p.title} className="surface p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{p.tag}</div>
                        <div className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{p.title}</div>
                      </div>
                      <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-700">
                        {p.date}
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-slate-600">
                      İçerik yakında. Şimdilik arayüz şablonu.
                    </p>
                    <div className="mt-5">
                      <Link href="#" className="link-primary text-sm font-semibold">
                        Oku →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="surface p-6">
                <div className="text-sm font-extrabold tracking-tight text-slate-900">Subscribe our newsletter</div>
                <p className="mt-2 text-sm text-slate-600">
                  Yeni kurslar ve duyurular için e-posta listesine katıl.
                </p>
                <form
                  className="mt-5 grid gap-3"
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                >
                  <label className="text-xs font-semibold text-slate-600" htmlFor="newsletterEmail">
                    Your e-mail address
                  </label>
                  <input
                    id="newsletterEmail"
                    type="email"
                    placeholder="you@example.com"
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300"
                  />
                  <button type="submit" className="btn-accent justify-center">
                    Subscribe
                  </button>
                  <div className="text-xs text-slate-500">
                    Şimdilik demo: gerçek gönderim daha sonra eklenecek.
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function TopCoursesSection({ reduce }: { reduce: boolean }) {
  return (
    <section className="bg-white">
      <div className="container-page py-12 sm:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eyebrow">Top Courses</div>
            <div className="section-title">Öne çıkan kurslar</div>
            <div className="section-lead">Backend’den gelen kursları burada Masterstudy benzeri kart yapısıyla listeliyoruz.</div>
          </div>
          <Link href="/classes" className="btn-solid h-10 px-4">
            Tüm kurslar
          </Link>
        </div>

        <TopCoursesClient reduce={reduce} />
      </div>
    </section>
  );
}

function TopCoursesClient({ reduce }: { reduce: boolean }) {
  const [tab, setTab] = useState<"newest" | "oldest" | "rating">("newest");
  const [items, setItems] = useState<CoursePublic[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const base = useMemo(() => (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/+$/, ""), []);

  useEffect(() => {
    let alive = true;
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
        // rating tab: API rating yok → mevcut sıralama
        setItems(sorted.slice(0, 6));
      } catch {
        if (!alive) return;
        setItems([]);
      } finally {
        if (!alive) return;
        setIsLoading(false);
      }
    }
    if (!base) {
      setItems([]);
      setIsLoading(false);
      return;
    }
    void run();
    return () => {
      alive = false;
    };
  }, [base, tab]);

  return (
    <>
      <div className="mt-7 flex flex-wrap gap-2">
        {[
          { id: "newest" as const, label: "Newest" },
          { id: "oldest" as const, label: "Oldest" },
          { id: "rating" as const, label: "Overall rating" },
        ].map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={t.id === tab ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}
          >
            {t.label}
          </button>
        ))}
      </div>

      <Stagger className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="surface overflow-hidden">
              <div className="h-36 bg-slate-100" />
              <div className="p-5">
                <div className="h-3 w-24 rounded bg-slate-100" />
                <div className="mt-3 h-4 w-3/4 rounded bg-slate-100" />
                <div className="mt-2 h-3 w-full rounded bg-slate-100" />
                <div className="mt-2 h-3 w-2/3 rounded bg-slate-100" />
              </div>
            </div>
          ))
        ) : items.length === 0 ? (
          <div className="surface p-6 text-sm text-slate-600 sm:col-span-2 lg:col-span-3">
            {base ? "Henüz kurs yok veya API’ye ulaşılamıyor. Kurs ekleyince bu alan dolacak." : "API base URL tanımlı değil."}
          </div>
        ) : (
          items.map((c) => (
            <motion.article
              key={c.id}
              variants={
                reduce
                  ? { hidden: { opacity: 1, y: 0 }, show: { opacity: 1, y: 0 } }
                  : { hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.35 } } }
              }
              className="surface overflow-hidden"
            >
              <div className="relative h-40 bg-slate-100">
                {c.cover_image_url ? (
                  <Image src={c.cover_image_url} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 33vw" />
                ) : (
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(26,115,232,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,182,6,0.20),transparent_55%)]" />
                )}
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.subject.title}</div>
                  <span className="badge">{c.access_level?.toUpperCase?.() ?? "—"}</span>
                </div>
                <h3 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{c.title}</h3>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{c.description || "—"}</p>
                <div className="mt-4 text-xs text-slate-500">
                  Teacher:{" "}
                  <span className="font-semibold text-slate-700">
                    {[c.teacher.first_name, c.teacher.last_name].filter(Boolean).join(" ") || c.teacher.username}
                  </span>
                </div>
              </div>
            </motion.article>
          ))
        )}
      </Stagger>
    </>
  );
}
