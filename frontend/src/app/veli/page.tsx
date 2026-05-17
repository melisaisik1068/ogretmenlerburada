import { ParentDashboardClient } from "@/components/parent/parent-dashboard-client";
import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

export default function VeliPage() {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Veli paneli</div>
        <h1 className="section-title">Çocuğunun gelişimini takip et</h1>
        <p className="section-lead">
          Deneme netleri, canlı ders katılımı ve kurs ilerlemesi tek ekranda.
        </p>
        <div className="mt-8">
          <ParentDashboardClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
