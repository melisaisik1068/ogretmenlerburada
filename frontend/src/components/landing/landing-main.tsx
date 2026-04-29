"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";

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

export function LandingMain() {
  const reduce = useReducedMotion();

  return (
    <main>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div aria-hidden className="absolute inset-0">
          <Image
            src="/images/hero-classroom.jpg"
            alt=""
            fill
            priority
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-white/55 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(147,197,253,0.22),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(219,234,254,0.35),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(224,242,254,0.28),transparent_55%)]" />
        </div>
        <div className="container-page relative py-12 sm:py-20">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-10">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-white/40 backdrop-blur-md">
                ÖğretmenlerBurada nedir?
              </div>
              <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
                <span className="text-gradient">Akıllı Eğitim Platformu</span>
              </h1>
              <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-600">
                Eğitimde tüm tarafları dijital ortamda birleştiren ve binlerce içerik barındıran bir platform.
                Sınıfınıza göre içerikleri keşfedin, öğrenmeyi daha düzenli ve takip edilebilir hale getirin.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <SpringLink href="/classes" className="btn-accent">
                  Keşfet
                </SpringLink>
                <SpringLink href="/signup" className="btn-outline">
                  Ücretsiz Üye Ol
                </SpringLink>
              </div>

              <motion.div
                initial={reduce ? false : { opacity: 0, y: 16 }}
                animate={reduce ? undefined : { opacity: 1, y: 0 }}
                transition={springInteract}
                className="mt-5 grid gap-3 rounded-3xl border border-white/25 bg-white/55 p-4 text-sm text-slate-700 shadow-2xl shadow-blue-500/5 backdrop-blur-xl"
              >
                <div className="text-xs font-extrabold tracking-tight text-slate-900">Erken Erişim Avantajları</div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/25 bg-white/50 p-3 backdrop-blur-md">
                    <div className="text-xs font-semibold text-slate-500">Öğretmenler için</div>
                    <div className="mt-1 text-sm text-slate-700">
                      İlk 100 öğretmenden biri olun, 6 ay boyunca <span className="font-semibold">%0 komisyon</span>{" "}
                      avantajından yararlanın.
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/25 bg-white/50 p-3 backdrop-blur-md">
                    <div className="text-xs font-semibold text-slate-500">Öğrenciler için</div>
                    <div className="mt-1 text-sm text-slate-700">
                      Lansmana özel: İlk üyeliğinizde seçili materyallere{" "}
                      <span className="font-semibold">ücretsiz erişim</span> kazanın.
                    </div>
                  </div>
                </div>
              </motion.div>

              <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
                <span className="rounded-full bg-white/60 px-3 py-1 ring-1 ring-white/30 backdrop-blur">
                  Öğrenci
                </span>
                <span className="rounded-full bg-white/60 px-3 py-1 ring-1 ring-white/30 backdrop-blur">
                  Öğretmen
                </span>
                <span className="rounded-full bg-white/60 px-3 py-1 ring-1 ring-white/30 backdrop-blur">Veli</span>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className={`${glassCard} shimmer-border p-5`}>
                <Stagger className="grid gap-4">
                  <GlassMotionCard tone="dark" className="p-5">
                    <div className="text-xs font-semibold text-white/70">Hemen başla</div>
                    <div className="mt-2 text-lg font-extrabold tracking-tight">Ücretsiz dene</div>
                    <div className="mt-2 text-sm text-white/70">
                      2 dakikada üyelik oluştur, seviyeni seç ve içeriği keşfet.
                    </div>
                    <div className="mt-4 grid gap-2">
                      <SpringLink href="/signup" className="btn-accent justify-center">
                        Ücretsiz Üye Ol
                      </SpringLink>
                      <SpringLink href="/login" className="btn-secondary justify-center">
                        Giriş Yap
                      </SpringLink>
                    </div>
                  </GlassMotionCard>
                </Stagger>
                <Stagger className="mt-4 grid grid-cols-3 gap-3">
                  {[
                    { k: "Uzman Eğitmenler", v: "Onaylı ve Deneyimli" },
                    { k: "Öğrenci Odaklı", v: "Kişisel Gelişim Takibi" },
                    { k: "Zengin Materyal", v: "PDF, Video ve Testler" },
                  ].map((s) => (
                    <GlassMotionCard key={s.k} className="p-4">
                      <div className="text-xs font-semibold text-slate-500">{s.k}</div>
                      <div className="mt-1 text-sm font-extrabold tracking-tight text-slate-900">{s.v}</div>
                    </GlassMotionCard>
                  ))}
                </Stagger>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grade grid */}
      <section className="container-page py-12 sm:py-16">
        <div className="text-center">
          <div className="text-sm font-extrabold tracking-tight text-slate-900">
            Sınıf seviyenize göre içerikleri keşfedin
          </div>
          <div className="mt-2 text-sm text-slate-600">İlkokuldan lise & sınav hazırlığına kadar.</div>
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
                className={`${glassCard} shimmer-border block p-4 text-center text-sm font-semibold text-slate-900 transition-colors hover:border-blue-200/60`}
              >
                {label}
              </Link>
            </motion.div>
          ))}
        </Stagger>
      </section>

      {/* Student / Teacher */}
      <section className="border-y border-white/40 bg-white/40 py-12 backdrop-blur-xl sm:py-16">
        <div className="container-page grid gap-4 lg:grid-cols-12 lg:gap-6">
          <div className="lg:col-span-6">
            <Stagger className="grid gap-4">
              <GlassMotionCard className="p-6">
                <div className="relative mb-5 h-44 overflow-hidden rounded-2xl ring-1 ring-white/30">
                  <Image src="/images/students.jpg" alt="Öğrenciler" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="text-xs font-semibold text-slate-500">Öğrenciysen</div>
                <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">ÖğretmenlerBurada Öğrenci</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Seviyeni seç, içerikleri keşfet, ilerlemeni takip et.
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <SpringLink href="/signup" className="btn-accent">
                    Ücretsiz Dene
                  </SpringLink>
                  <SpringLink href="/classes" className="btn-outline">
                    Sınıflar
                  </SpringLink>
                </div>
              </GlassMotionCard>
            </Stagger>
          </div>
          <div className="lg:col-span-6">
            <Stagger className="grid gap-4">
              <GlassMotionCard className="p-6">
                <div className="relative mb-5 h-44 overflow-hidden rounded-2xl ring-1 ring-white/30">
                  <Image src="/images/teacher.jpg" alt="Öğretmen" fill className="object-cover object-center" sizes="(max-width: 768px) 100vw, 50vw" />
                </div>
                <div className="text-xs font-semibold text-slate-500">Öğretmensen</div>
                <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">ÖğretmenlerBurada Öğretmen</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Sınıfına göre içerikleri yönet, öğrenci gelişimini takip et, paylaş.
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <SpringLink href="/signup" className="btn-solid">
                    Ücretsiz Üye Ol
                  </SpringLink>
                  <SpringLink href="/schools" className="btn-outline">
                    Okullar için
                  </SpringLink>
                </div>
              </GlassMotionCard>
            </Stagger>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="container-page py-12 sm:py-16">
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              k: "Yapay Zeka Destekli Öğrenme",
              v: "Kişiselleştirilmiş içerik önerileri ve akıllı takip ile öğrenme yolculuğunu güçlendirin.",
            },
            {
              k: "Onaylı Uzman Kadro",
              v: "Titiz belge kontrolü ile seçilen eğitimciler; güvenilir ve şeffaf bir deneyim.",
            },
            {
              k: "7/24 Aktif Topluluk",
              v: "Dilediğiniz zaman içerik ve destek erişimiyle kesintisiz gelişim.",
            },
          ].map((s) => (
            <GlassMotionCard key={s.k} className="p-6">
              <div className="text-lg font-extrabold leading-snug tracking-tight text-slate-900 sm:text-xl">{s.k}</div>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">{s.v}</p>
            </GlassMotionCard>
          ))}
        </Stagger>
      </section>

      {/* Vision */}
      <section className="border-t border-white/40 bg-white/35 py-12 backdrop-blur-xl sm:py-16">
        <div className="container-page">
          <div className="text-center">
            <div className="text-sm font-extrabold tracking-tight text-slate-900">Geleceğin Eğitim Vizyonu</div>
            <div className="mt-2 text-sm text-slate-600">
              ÖğretmenlerBurada, eğitimi sınıfların ötesine taşıyarak teknolojiyle harmanlıyor.
            </div>
          </div>

          <Stagger className="mt-8 grid gap-4 lg:grid-cols-3 lg:gap-6">
            {[
              {
                name: "Eğitimde Yeni Nesil Deneyim",
                role: "Öğrenme kültürü",
                text: "Modern araçlarla desteklenen içerik ve topluluk; öğrenmeyi daha ölçülebilir ve motive edici kılar.",
              },
              {
                name: "Öğretmenler İçin En Adil Pazar Yeri",
                role: "Şeffaf gelir ve görünürlük",
                text: "Emeğin karşılığını güçlendiren yapı; güvenilir öğrenci buluşması ve sürdürülebilir büyüme.",
              },
              {
                name: "Öğrenci Odaklı Gelişim",
                role: "Rehberlik ve topluluk",
                text: "Sadece ders değil; hedeflere giden yolda size eşlik edecek bir ekosistem.",
              },
            ].map((t, i) => (
              <GlassMotionCard key={i} className="p-6">
                <div className="flex items-center gap-3">
                  <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-white/40">
                    <Image src="/images/empty-classroom.jpg" alt="" fill className="object-cover" sizes="40px" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                    <div className="mt-1 text-xs text-slate-500">{t.role}</div>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-600">{t.text}</p>
              </GlassMotionCard>
            ))}
          </Stagger>

          <div className="mt-8 flex justify-center">
            <SpringLink href="/signup" className="btn-accent">
              Hemen Ücretsiz Dene
            </SpringLink>
          </div>

          <Stagger className="mt-10 grid gap-4 sm:grid-cols-3">
            {[
              { t: "Manuel Onay", d: "Tüm öğretmenler belge kontrolünden geçerek sisteme kabul edilir." },
              { t: "İyzico/Stripe Güvencesi", d: "Ödemeleriniz global güvenlik standartlarında korunur." },
              { t: "Canlı Destek", d: "Bir sorun olduğunda her zaman yanınızdayız." },
            ].map((x) => (
              <GlassMotionCard key={x.t} className="rounded-2xl border border-white/25 bg-white/45 p-4 backdrop-blur-lg">
                <div className="text-sm font-extrabold tracking-tight text-slate-900">{x.t}</div>
                <div className="mt-1 text-sm text-slate-600">{x.d}</div>
              </GlassMotionCard>
            ))}
          </Stagger>
        </div>
      </section>
    </main>
  );
}
