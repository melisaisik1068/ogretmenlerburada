import { Suspense } from "react";

import { LoginForm } from "@/components/auth/login-form";
import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function LoginPage() {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <div className="mx-auto max-w-md">
          <div className="surface p-6 sm:p-8">
            <div className="section-eyebrow">Sign In</div>
            <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">Giriş Yap</h1>
            <p className="mt-2 text-sm text-slate-600">Hesabın Django API ile doğrulanır; oturum güvenli çerezde saklanır.</p>
          <Suspense fallback={<div className="mt-5 text-sm text-slate-500">Yükleniyor…</div>}>
            <LoginForm />
          </Suspense>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
