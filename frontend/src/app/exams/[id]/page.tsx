import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type ExamDetail = {
  id: number;
  title: string;
  exam_type: string;
  description: string;
  duration_minutes: number;
  show_leaderboard: boolean;
  questions: { id: number; order_index: number; topic_title: string; choice_count: number }[];
};

async function loadExam(id: string): Promise<ExamDetail | null> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/exams/exams/${id}/`, { next: { revalidate: 30 } });
    if (!res.ok) return null;
    return (await res.json()) as ExamDetail;
  } catch {
    return null;
  }
}

export default async function ExamDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = await loadExam(id);
  if (!exam) notFound();

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <Link href="/exams" className="text-sm font-medium text-[var(--brand-blue)] hover:underline">
          ← Sınavlara dön
        </Link>
        <h1 className="mt-4 section-title">{exam.title}</h1>
        <p className="section-lead">{exam.description || "—"}</p>
        <p className="mt-2 text-sm text-slate-600">
          {exam.duration_minutes} dakika · {exam.questions.length} soru
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link href={`/exams/${exam.id}/sinav`} className="btn-solid h-11 px-6">
            Sınava başla
          </Link>
          {exam.show_leaderboard ? (
            <Link href={`/exams/${exam.id}/siralama`} className="btn-outline h-11 px-6">
              Sıralama tablosu
            </Link>
          ) : null}
        </div>

        <section className="mt-10">
          <h2 className="text-lg font-bold text-slate-900">Soru konuları</h2>
          <ul className="mt-4 grid gap-2 sm:grid-cols-2">
            {exam.questions.map((q) => (
              <li key={q.id} className="surface px-4 py-3 text-sm text-slate-700">
                <span className="font-semibold text-slate-900">Soru {q.order_index + 1}</span>
                {q.topic_title ? ` — ${q.topic_title}` : ""}
              </li>
            ))}
          </ul>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
