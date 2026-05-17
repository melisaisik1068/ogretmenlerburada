import Link from "next/link";

import { requireRole } from "@/lib/auth/server-session";

type HubCard = {
  title: string;
  desc: string;
  href: string;
  cta: string;
  accent?: "solid" | "outline";
  external?: boolean;
};

function buildCards(username: string): HubCard[] {
  return [
    {
      title: "Kurslar & dersler",
      desc: "Video/metin kurs oluştur, ders ekle, yayına al.",
      href: "/dashboard/teacher/courses",
      cta: "Kursları yönet",
      accent: "solid",
    },
    {
      title: "Mağaza — PDF satış",
      desc: "Ders notu, test, soru bankası yükle; fiyat koy, satışa çıkar.",
      href: "/dashboard/teacher/materials",
      cta: "Ürün yükle",
      accent: "solid",
    },
    {
      title: "Canlı ders / randevu",
      desc: "Müsaitlik aç; öğrenciler randevu alsın.",
      href: "/dashboard/teacher/appointments",
      cta: "Takvim & randevular",
    },
    {
      title: "Deneme sınavı",
      desc: "LGS, YKS, ALES formatında sınav hazırla ve yayınla.",
      href: "/dashboard/teacher/exams",
      cta: "Sınav oluştur",
    },
    {
      title: "Ödevler",
      desc: "Ödev ver; öğrenci fotoğraf yüklesin, sen onayla.",
      href: "/dashboard/teacher/homework",
      cta: "Ödev yönet",
    },
    {
      title: "Kurum paketleri",
      desc: "Aylık abonelik paketi tanımla.",
      href: "/dashboard/teacher/packages",
      cta: "Paketler",
    },
    {
      title: "Halka açık profil",
      desc: "Onaylı profilin /t/ sayfasında listelenirsin.",
      href: `/t/${encodeURIComponent(username)}`,
      cta: "Profilimi gör",
      accent: "outline",
      external: true,
    },
    {
      title: "Doğrulama belgesi",
      desc: "Kimlik/diploma yükle.",
      href: "/dashboard/teacher/verification",
      cta: "Belge yükle",
      accent: "outline",
    },
  ];
}

export default async function TeacherHubPage() {
  const user = await requireRole("teacher", "/dashboard/teacher");
  const cards = buildCards(user.username);

  return (
    <main className="container-page py-8 sm:py-12">
      <div className="section-eyebrow">Öğretmen paneli</div>
      <h1 className="section-title">Tüm öğretmen araçları</h1>
      <p className="section-lead">
        Mağaza, kurs, randevu, sınav, ödev ve paket yönetimi. Öğrenciler seni arama ve profil sayfan üzerinden bulur.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        <Link href={`/t/${encodeURIComponent(user.username)}`} className="btn-solid h-10 px-4" target="_blank">
          Halka açık profilim
        </Link>
        <Link href="/shop" className="btn-outline h-10 px-4">
          Mağazayı gör
        </Link>
        <Link href="/search" className="btn-outline h-10 px-4">
          Öğretmen ara
        </Link>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <article key={c.href} className="surface flex flex-col p-6">
            <h2 className="text-lg font-extrabold text-slate-900">{c.title}</h2>
            <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">{c.desc}</p>
            <Link
              href={c.href}
              target={c.external ? "_blank" : undefined}
              className={`mt-5 inline-flex h-10 items-center justify-center px-4 text-sm font-semibold ${
                c.accent === "solid" ? "btn-solid" : "btn-outline"
              }`}
            >
              {c.cta}
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
