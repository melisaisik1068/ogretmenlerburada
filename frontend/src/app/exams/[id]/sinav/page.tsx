import { notFound } from "next/navigation";

import { ExamTakeClient } from "@/components/exams/exam-take-client";
import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type ExamDetail = {
  id: number;
  title: string;
  questions: { id: number; order_index: number; topic_title: string; choice_count: number }[];
};

async function loadExam(id: string): Promise<ExamDetail | null> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/exams/exams/${id}/`, { cache: "no-store" });
    if (!res.ok) return null;
    return (await res.json()) as ExamDetail;
  } catch {
    return null;
  }
}

export default async function ExamTakePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const exam = await loadExam(id);
  if (!exam) notFound();

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <h1 className="section-title">{exam.title}</h1>
        <p className="section-lead">Şıkları işaretle; süre sunucuda sayılır.</p>
        <div className="mt-8">
          <ExamTakeClient examId={exam.id} questions={exam.questions} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
