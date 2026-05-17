import { HomeworkStudentClient } from "@/components/homework/homework-student-client";
import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

export default function OdevlerPage() {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Ödevler</div>
        <h1 className="section-title">Ödevini fotoğrafla gönder</h1>
        <p className="section-lead">Öğretmenin tanımladığı ödevi çekip sisteme yükle.</p>
        <div className="mt-8">
          <HomeworkStudentClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
