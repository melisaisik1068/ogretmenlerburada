import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function ContactPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <TopNav />
      <main className="container-page py-12">
        <h1 className="text-2xl font-extrabold tracking-tight">İletişim</h1>
        <p className="mt-2 text-sm text-slate-600">İletişim formu + adres + telefon alanlarını buraya ekleyeceğiz.</p>
      </main>
      <SiteFooter />
    </div>
  );
}

