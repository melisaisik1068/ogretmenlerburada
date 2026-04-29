import Link from "next/link";

export default function DashboardProPage() {
  return (
    <main className="container-page py-12">
      <div className="rounded-3xl border border-white/25 bg-white/60 p-8 shadow-2xl shadow-blue-500/10 backdrop-blur-xl ring-1 ring-white/20">
        <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">Pro alanı</p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">Özel içerik ve raporlar</h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
          Bu rota middleware ile korunur: Pro veya Kurumsal plan gerektirir. İçerikleri backend&apos;deki erişim kurallarıyla
          genişletebilirsin.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link className="btn-accent" href="/upgrade">
            Plan yükselt
          </Link>
          <Link className="btn-outline" href="/dashboard">
            Panele dön
          </Link>
        </div>
      </div>
    </main>
  );
}
