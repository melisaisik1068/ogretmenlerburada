import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

export default function SchoolsPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <TopNav />
      <main className="container-page py-12">
        <h1 className="text-2xl font-extrabold tracking-tight">Okullar için</h1>
        <p className="mt-2 text-sm text-slate-600">Kurumsal paket, okul paneli ve yönetim özellikleri buraya gelecek.</p>
      </main>
      <SiteFooter />
    </div>
  );
}

