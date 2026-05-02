import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <div className="mx-auto max-w-2xl">
          <div className="surface p-6 sm:p-8">
          <div className="section-eyebrow">Register</div>
          <h1 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">Ücretsiz Üye Ol</h1>
          <p className="mt-2 text-sm text-slate-600">
            Kayıt bilgilerin <span className="font-semibold">POST /api/accounts/register/</span> üzerinden backend&apos;e gider; başarılı olunca otomatik oturum açılır.
          </p>
          <SignupForm />
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
