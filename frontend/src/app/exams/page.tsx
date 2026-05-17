import Link from "next/link";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type ExamRow = {
  id: number;
  title: string;
  exam_type: string;
  description: string;
  duration_minutes: number;
  question_count: number;
};

async function loadExams(type?: string): Promise<ExamRow[]> {
  const base = getApiBaseUrl();
  const qs = type ? `?type=${encodeURIComponent(type)}` : "";
  try {
    const res = await fetch(`${base}/api/exams/exams/${qs}`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = (await res.json()) as ExamRow[] | { results?: ExamRow[] };
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}

const TYPE_LABEL: Record<string, string> = {
  lgs: "LGS",
  yks: "YKS",
  ales: "ALES",
  custom: "Özel",
};

export default async function ExamsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const sp = await searchParams;
  const type = (sp.type || "").trim();
  const exams = await loadExams(type || undefined);

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Deneme sınavları</div>
        <h1 className="section-title">LGS · YKS · ALES</h1>
        <p className="section-lead">
          Süre sunucuda işler; tarayıcıyı kapatsan da kaldığın yerden devam edersin. Bitince net ve konu analizi gelir.
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          {["", "lgs", "yks", "ales"].map((t) => (
            <Link
              key={t || "all"}
              href={t ? `/exams?type=${t}` : "/exams"}
              className={`btn-outline h-9 px-4 text-sm ${type === t || (!type && !t) ? "ring-2 ring-[var(--brand-blue)]" : ""}`}
            >
              {t ? TYPE_LABEL[t] : "Tümü"}
            </Link>
          ))}
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exams.length === 0 ? (
            <div className="surface p-6 text-sm text-slate-600 sm:col-span-2 lg:col-span-3">
              Henüz yayınlanmış sınav yok.
            </div>
          ) : (
            exams.map((e) => (
              <article key={e.id} className="surface flex flex-col p-6">
                <span className="badge w-fit">{TYPE_LABEL[e.exam_type] ?? e.exam_type}</span>
                <h2 className="mt-3 text-lg font-extrabold tracking-tight text-slate-900">{e.title}</h2>
                <p className="mt-2 line-clamp-2 text-sm text-slate-600">{e.description || "—"}</p>
                <p className="mt-3 text-xs text-slate-500">
                  {e.duration_minutes} dk · {e.question_count} soru
                </p>
                <div className="mt-auto flex gap-2 pt-5">
                  <Link href={`/exams/${e.id}`} className="btn-solid h-10 px-4">
                    Detay
                  </Link>
                  <Link href={`/exams/${e.id}/sinav`} className="btn-outline h-10 px-4">
                    Sınava gir
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
