import Link from "next/link";

import { PackagesClient } from "@/components/packages/packages-client";
import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

export type InstitutionPackage = {
  id: number;
  title: string;
  slug: string;
  description: string;
  price_try: number;
  billing_cycle_days: number;
  includes_premium_courses: boolean;
  includes_all_exams: boolean;
  includes_marketplace: boolean;
};

async function loadPackages(): Promise<InstitutionPackage[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/subscriptions/institution-packages/`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}

export default async function PaketlerPage() {
  const packages = await loadPackages();

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Kurum paketleri</div>
        <h1 className="section-title">Aylık abonelik paketleri</h1>
        <p className="section-lead">
          Premium videolar, deneme sınavları ve mağaza avantajlarını tek pakette satın al.
        </p>
        <PackagesClient initialPackages={packages} />
        <p className="mt-8 text-center text-sm text-slate-500">
          Kurum sahibi misin?{" "}
          <Link href="/dashboard/teacher/packages" className="font-semibold text-[var(--brand-blue)] underline">
            Paket yönetimi
          </Link>
        </p>
      </main>
      <SiteFooter />
    </div>
  );
}
