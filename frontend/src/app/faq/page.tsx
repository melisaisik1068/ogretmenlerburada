import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function FaqPage() {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <div className="section-eyebrow">FAQ</div>
        <h1 className="section-title">Sıkça Sorulan Sorular</h1>
        <p className="section-lead">SSS akordeonlarını burada Masterstudy’ye yakın bir düzenle kuracağız.</p>
        <div className="mt-8 grid gap-3">
          {[
            { q: "Kurslar nasıl listeleniyor?", a: "Kurslar `GET /api/lessons/courses/` ile backend’den çekilir." },
            { q: "Üyelik ücretsiz mi?", a: "Evet. Ücretsiz üyelikle içeriklere erişebilir, planları sonra yükseltebilirsin." },
            { q: "Eğitmen doğrulaması var mı?", a: "Planlanan özellik. İlk sürümde arayüz hazır; API entegrasyonu ilerleyen adım." },
          ].map((x) => (
            <details key={x.q} className="surface p-5">
              <summary className="cursor-pointer list-none text-sm font-extrabold text-slate-900">
                {x.q} <span className="ml-2 text-slate-400">⌄</span>
              </summary>
              <div className="mt-3 text-sm leading-6 text-slate-600">{x.a}</div>
            </details>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

