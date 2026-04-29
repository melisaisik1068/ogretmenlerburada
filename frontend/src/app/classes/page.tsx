import Link from "next/link";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function ClassesPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <TopNav />
      <main className="container-page py-12">
        <h1 className="text-2xl font-extrabold tracking-tight">Sınıflar</h1>
        <p className="mt-2 text-sm text-slate-600">Bu sayfayı derslig.com benzeri katalog ekranı gibi dolduracağız.</p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link className="btn-outline" href="/classes/8">
            8. Sınıf (LGS)
          </Link>
          <Link className="btn-outline" href="/classes/12">
            12. Sınıf (YKS)
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

