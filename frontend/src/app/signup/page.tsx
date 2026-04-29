import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function SignupPage() {
  return (
    <div className="min-h-dvh bg-white text-slate-900">
      <TopNav />
      <main className="container-page py-12">
        <div className="mx-auto max-w-2xl rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
          <h1 className="text-xl font-extrabold tracking-tight">Ücretsiz Üye Ol</h1>
          <p className="mt-2 text-sm text-slate-600">Kayıt akışını burada derslig.com benzeri şekilde tasarlayacağız.</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {["Öğrenci", "Öğretmen", "Veli", "Okul"].map((x) => (
              <button
                key={x}
                className="shimmer-border rounded-2xl bg-white p-5 text-left ring-1 ring-slate-200 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="text-sm font-extrabold tracking-tight text-slate-900">{x}</div>
                <div className="mt-1 text-sm text-slate-600">[DOLDUR] kısa açıklama</div>
              </button>
            ))}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

