import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";
import { SignupForm } from "@/components/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/30 bg-white/65 p-6 shadow-2xl shadow-blue-500/10 backdrop-blur-xl ring-1 ring-white/25">
          <h1 className="text-xl font-extrabold tracking-tight">Ücretsiz Üye Ol</h1>
          <p className="mt-2 text-sm text-slate-600">
            Kayıt bilgilerin <span className="font-semibold">POST /api/accounts/register/</span> üzerinden backend&apos;e gider; başarılı olunca otomatik oturum açılır.
          </p>
          <SignupForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
