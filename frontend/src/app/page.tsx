import Link from "next/link";
import Image from "next/image";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function Home() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <TopNav />

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
            <div className="absolute inset-0 bg-white/65" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,197,94,0.18),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.14),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(6,182,212,0.14),transparent_55%)]" />
          </div>
          <div className="container-page relative py-14 sm:py-20">
            <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                  ÖğretmenlerBurada nedir?
                </div>
                <h1 className="mt-4 text-balance text-4xl font-extrabold tracking-tight sm:text-5xl">
                  <span className="text-gradient">Akıllı Eğitim Platformu</span>
                </h1>
                <p className="mt-4 max-w-2xl text-pretty text-base leading-7 text-slate-600">
                  Eğitimde tüm tarafları dijital ortamda birleştiren ve binlerce içerik barındıran bir platform. Sınıfınıza
                  göre içerikleri keşfedin, öğrenmeyi daha düzenli ve takip edilebilir hale getirin.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href="/classes" className="btn-accent">
                    Keşfet
                  </Link>
                  <Link href="/signup" className="btn-outline">
                    Ücretsiz Üye Ol
                  </Link>
                </div>

                <div className="mt-5 grid gap-2 rounded-2xl bg-white/70 p-4 text-sm text-slate-700 ring-1 ring-slate-200 backdrop-blur">
                  <div className="text-xs font-extrabold tracking-tight text-slate-900">Erken Erişim Avantajları</div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold text-slate-500">Öğretmenler için</div>
                      <div className="mt-1 text-sm text-slate-700">
                        İlk 100 öğretmenden biri olun, 6 ay boyunca <span className="font-semibold">%0 komisyon</span>{" "}
                        avantajından yararlanın.
                      </div>
                    </div>
                    <div className="rounded-xl bg-slate-50 p-3 ring-1 ring-slate-200">
                      <div className="text-xs font-semibold text-slate-500">Öğrenciler için</div>
                      <div className="mt-1 text-sm text-slate-700">
                        Lansmana özel: İlk üyeliğinizde seçili materyallere{" "}
                        <span className="font-semibold">ücretsiz erişim</span> kazanın.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-2 text-xs text-slate-500">
                  <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">Öğrenci</span>
                  <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">Öğretmen</span>
                  <span className="rounded-full bg-slate-50 px-3 py-1 ring-1 ring-slate-200">Veli</span>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="shimmer-border rounded-3xl bg-white p-5 shadow-xl ring-1 ring-slate-200">
                  <div className="rounded-2xl bg-slate-900 p-5 text-white">
                    <div className="text-xs font-semibold text-white/70">Hemen başla</div>
                    <div className="mt-2 text-lg font-extrabold tracking-tight">Ücretsiz dene</div>
                    <div className="mt-2 text-sm text-white/70">
                      2 dakikada üyelik oluştur, seviyeni seç ve içeriği keşfet.
                    </div>
                    <div className="mt-4 grid gap-2">
                      <Link className="btn-accent justify-center" href="/signup">
                        Ücretsiz Üye Ol
                      </Link>
                      <Link className="btn-secondary justify-center" href="/login">
                        Giriş Yap
                      </Link>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    {[
                      { k: "Uzman Eğitmenler", v: "Onaylı ve Deneyimli" },
                      { k: "Öğrenci Odaklı", v: "Kişisel Gelişim Takibi" },
                      { k: "Zengin Materyal", v: "PDF, Video ve Testler" },
                    ].map((s) => (
                      <div key={s.k} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                        <div className="text-xs font-semibold text-slate-500">{s.k}</div>
                        <div className="mt-1 text-sm font-extrabold tracking-tight text-slate-900">{s.v}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Grade grid */}
        <section className="container-page py-14 sm:py-18">
          <div className="text-center">
            <div className="text-sm font-extrabold tracking-tight text-slate-900">
              Sınıf seviyenize göre içerikleri keşfedin
            </div>
            <div className="mt-2 text-sm text-slate-600">İlkokuldan lise & sınav hazırlığına kadar.</div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
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
            ].map((label) => (
              <Link
                key={label}
                href="/classes"
                className="shimmer-border rounded-2xl bg-white p-4 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                {label}
              </Link>
            ))}
          </div>
        </section>

        {/* Student / Teacher blocks */}
        <section className="bg-slate-50 py-14">
          <div className="container-page grid gap-4 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <div className="shimmer-border rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <div className="relative mb-5 h-44 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                  <Image src="/images/students.jpg" alt="Öğrenciler" fill className="object-cover object-center" />
                </div>
                <div className="text-xs font-semibold text-slate-500">Öğrenciysen</div>
                <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">ÖğretmenlerBurada Öğrenci</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Seviyeni seç, içerikleri keşfet, ilerlemeni takip et.
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link className="btn-accent" href="/signup">
                    Ücretsiz Dene
                  </Link>
                  <Link className="btn-outline" href="/classes">
                    Sınıflar
                  </Link>
                </div>
              </div>
            </div>
            <div className="lg:col-span-6">
              <div className="shimmer-border rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <div className="relative mb-5 h-44 overflow-hidden rounded-2xl ring-1 ring-slate-200">
                  <Image src="/images/teacher.jpg" alt="Öğretmen" fill className="object-cover object-center" />
                </div>
                <div className="text-xs font-semibold text-slate-500">Öğretmensen</div>
                <div className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">ÖğretmenlerBurada Öğretmen</div>
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  Sınıfına göre içerikleri yönet, öğrenci gelişimini takip et, paylaş.
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link className="btn-solid" href="/signup">
                    Ücretsiz Üye Ol
                  </Link>
                  <Link className="btn-outline" href="/schools">
                    Okullar için
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="container-page py-14">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { k: "Titizlikle Seçilmiş Uzman Kadro", v: "Manuel Onay" },
              { k: "7/24 Kesintisiz Öğrenme Erişimi", v: "Kişiselleştirme" },
              { k: "Güncel, MEB Müfredatına Uygun İçerikler", v: "Sürekli Güncelleme" },
              { k: "Güvenli Ödeme Altyapısı", v: "256‑Bit SSL" },
            ].map((s) => (
              <div key={s.k} className="rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                <div className="text-xs font-semibold text-slate-500">{s.k}</div>
                <div className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900">{s.v}</div>
                <div className="mt-1 text-sm text-slate-600">
                  {s.k.includes("Uzman") && "Tüm öğretmenler belge kontrolünden geçerek sisteme kabul edilir."}
                  {s.k.includes("7/24") && "Her seviyeye uygun içerik ve takip deneyimi."}
                  {s.k.includes("MEB") && "PDF, video ve testlerle zengin öğrenme."}
                  {s.k.includes("Güvenli") && "Ödemeler global güvenlik standartlarında korunur."}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Vision / Why */}
        <section className="bg-white py-14">
          <div className="container-page">
            <div className="text-center">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">
                Eğitimde Yeni Bir Dönem Başlıyor
              </div>
              <div className="mt-2 text-sm text-slate-600">
                ÖğretmenlerBurada, eğitimi sınıfların ötesine taşıyarak teknolojiyle harmanlıyor.
              </div>
            </div>

            <div className="mt-8 grid gap-4 lg:grid-cols-3">
              {[
                {
                  name: "Vizyonumuz",
                  role: "Neden buradayız?",
                  text: "Eğitimi dijitalle birleştirerek her öğrencinin en iyi öğretmene ulaşmasını hedefliyoruz.",
                },
                {
                  name: "Öğretmenlere Sözümüz",
                  role: "Adil ve modern",
                  text: "Emeğinizin karşılığını tam olarak aldığınız, modern ve adil bir pazar yeri sunuyoruz.",
                },
                {
                  name: "Öğrencilere Sözümüz",
                  role: "Topluluk + rehberlik",
                  text: "Sadece ders değil, başarıya giden yolda size rehberlik edecek bir topluluk inşa ediyoruz.",
                },
              ].map((t, i) => (
                <div key={i} className="shimmer-border rounded-3xl bg-white p-6 ring-1 ring-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="relative h-10 w-10 overflow-hidden rounded-full ring-1 ring-slate-200">
                      <Image src="/images/empty-classroom.jpg" alt="" fill className="object-cover" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-900">{t.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{t.role}</div>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{t.text}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-center">
              <Link className="btn-accent" href="/signup">
                Hemen Ücretsiz Dene
              </Link>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              {[
                { t: "Manuel Onay", d: "Tüm öğretmenler belge kontrolünden geçerek sisteme kabul edilir." },
                { t: "İyzico/Stripe Güvencesi", d: "Ödemeleriniz global güvenlik standartlarında korunur." },
                { t: "Canlı Destek", d: "Bir sorun olduğunda her zaman yanınızdayız." },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                  <div className="text-sm font-extrabold tracking-tight text-slate-900">{x.t}</div>
                  <div className="mt-1 text-sm text-slate-600">{x.d}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
