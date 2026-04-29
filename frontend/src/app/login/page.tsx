import Link from "next/link";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function LoginPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <TopNav />
      <main className="container-page py-12">
        <div className="mx-auto max-w-md rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-xl font-extrabold tracking-tight">Giriş Yap</h1>
          <p className="mt-2 text-sm text-slate-600">Şimdilik sadece UI. Sonra backend JWT ile bağlarız.</p>
          <div className="mt-5 grid gap-3">
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-700">Kullanıcı adı</span>
              <input className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200" />
            </label>
            <label className="grid gap-1">
              <span className="text-xs font-semibold text-slate-700">Şifre</span>
              <input
                type="password"
                className="h-11 rounded-xl bg-white px-4 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
              />
            </label>
          </div>
          <button className="btn-solid mt-6 w-full">Giriş Yap</button>
          <div className="mt-4 text-sm text-slate-600">
            Hesabın yok mu?{" "}
            <Link className="font-semibold text-slate-900 underline decoration-slate-300 underline-offset-4" href="/signup">
              Ücretsiz Üye Ol
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

