import Link from "next/link";
import { Suspense } from "react";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

import { ResetPasswordForm } from "./reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <div className="mx-auto max-w-md surface p-6 sm:p-8">
          <div className="section-eyebrow">Account</div>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight">Yeni şifre</h1>
          <Suspense fallback={<div className="mt-4 text-sm text-slate-500">Yükleniyor…</div>}>
            <ResetPasswordForm />
          </Suspense>
          <div className="mt-4 text-sm text-slate-600">
            <Link href="/login" className="font-semibold text-sky-700 underline underline-offset-4">
              Giriş
            </Link>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
