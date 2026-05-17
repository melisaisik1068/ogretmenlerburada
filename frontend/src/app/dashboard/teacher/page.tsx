import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

async function requireTeacher() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect("/login?next=/dashboard/teacher");

  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/accounts/me/`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) redirect("/login?next=/dashboard/teacher");
  const user = (await res.json()) as { role?: string; username?: string };
  if (user.role !== "teacher") redirect("/dashboard");
  return user as { username: string };
}

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
      desc: "Aylık abonelik paketi tanımla (video + sınav erişimi).",
      href: "/dashboard/teacher/packages",
      cta: "Paketler",
    },
    {
      title: "Halka açık profil",
      desc: "Onaylı profilin /t/ sayfasında; kursların ve mağaza ürünlerin listelenir.",
      href: `/t/${encodeURIComponent(username)}`,
      cta: "Profilimi gör",
      accent: "outline",
      external: true,
    },
    {
      title: "Doğrulama belgesi",
      desc: "Kimlik/diploma yükle; onay sonrası tam öğretmen yetkisi.",
      href: "/dashboard/teacher/verification",
      cta: "Belge yükle",
      accent: "outline",
    },
  ];
}

export default async function TeacherHubPage() {
  const user = await requireTeacher();
  const cards = buildCards(user.username);

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Öğretmen paneli</div>
        <h1 className="section-title">Tüm öğretmen araçları</h1>
        <p className="section-lead">
          Mağaza satışı, kurs, canlı ders, sınav, ödev ve paket yönetimi tek merkezden. Öğrenciler seni arama ve
          profil sayfan üzerinden bulur.
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
          <Link href="/dashboard" className="btn-outline h-10 px-4">
            Ana panel
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

        <section className="mt-12 surface p-6">
          <h2 className="font-bold text-slate-900">Öğrenci bulma nasıl çalışır?</h2>
          <p className="mt-2 text-sm text-slate-600">
            Ayrı bir “öğrenci avı” modülü yok; öğrenciler seni şu yollarla bulur: site araması, onaylı öğretmen
            listesi, <strong>/t/kullanici-adin</strong> profil sayfan (kurs + mağaza), mağazada satıcı filtresi ve
            canlı ders randevusu. Doğrulama belgen onaylı olmalı.
          </p>
          <h3 className="mt-6 font-semibold text-slate-800">Yakında eklenebilir</h3>
          <ul className="mt-2 list-inside list-disc space-y-1 text-sm text-slate-600">
            <li>Kayıtlı öğrenci listesi ve mesajlaşma (CRM)</li>
            <li>Mağaza satış / hakediş özeti ekranı</li>
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
