"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type Question = { id: number; order_index: number; topic_title: string; choice_count: number };

type Attempt = {
  id: number;
  status: string;
  remaining_seconds: number;
  correct_count: number;
  wrong_count: number;
  blank_count: number;
  net_score: string;
  analysis_summary: string;
};

const CHOICES = ["A", "B", "C", "D", "E"];

export function ExamTakeClient({ examId, questions }: { examId: number; questions: Question[] }) {
  const [attempt, setAttempt] = useState<Attempt | null>(null);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const startExam = useCallback(async () => {
    setError("");
    setLoading(true);
    const res = await fetch("/api/exams/attempts/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ exam_id: examId }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const detail = typeof data.detail === "string" ? data.detail : "Sınava başlanamadı. Giriş yaptın mı?";
      if ((data as { code?: string }).code === "package_required") {
        setError(`${detail} /paketler sayfasından abone ol.`);
      } else {
        setError(detail);
      }
      setLoading(false);
      return;
    }
    setAttempt(data as Attempt);
    setRemaining((data as Attempt).remaining_seconds ?? 0);
    setLoading(false);
  }, [examId]);

  useEffect(() => {
    void startExam();
  }, [startExam]);

  useEffect(() => {
    if (!attempt || attempt.status !== "in_progress") return;
    const t = setInterval(() => {
      setRemaining((r) => Math.max(0, r - 1));
    }, 1000);
    return () => clearInterval(t);
  }, [attempt]);

  useEffect(() => {
    if (!attempt?.id || attempt.status !== "in_progress") return;
    const poll = setInterval(async () => {
      const res = await fetch(`/api/exams/attempts/${attempt.id}/status`);
      if (!res.ok) return;
      const data = (await res.json()) as Attempt;
      setAttempt(data);
      setRemaining(data.remaining_seconds ?? 0);
      if (data.status !== "in_progress") setSubmitting(false);
    }, 15000);
    return () => clearInterval(poll);
  }, [attempt?.id, attempt?.status]);

  useEffect(() => {
    if (remaining === 0 && attempt?.status === "in_progress" && attempt.id) {
      void submitExam(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining]);

  async function saveAnswers() {
    if (!attempt?.id) return;
    const payload = Object.entries(answers).map(([question_id, choice]) => ({
      question_id: Number(question_id),
      choice,
    }));
    await fetch(`/api/exams/attempts/${attempt.id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answers: payload }),
    });
  }

  async function submitExam(auto = false) {
    if (!attempt?.id || submitting) return;
    setSubmitting(true);
    await saveAnswers();
    const res = await fetch(`/api/exams/attempts/${attempt.id}/submit`, { method: "POST" });
    const data = await res.json().catch(() => ({}));
    if (res.ok) setAttempt(data as Attempt);
    else if (!auto) setError("Gönderilemedi.");
    setSubmitting(false);
  }

  function formatTime(sec: number) {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return <p className="text-sm text-slate-600">Sınav yükleniyor…</p>;
  }

  if (error && !attempt) {
    return (
      <div>
        <p className="text-sm text-red-600">{error}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/login" className="btn-solid inline-flex h-10 px-4">
            Giriş yap
          </Link>
          {error.toLowerCase().includes("paket") ? (
            <Link href="/paketler" className="btn-outline inline-flex h-10 px-4">
              Paketlere git
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  if (attempt && attempt.status !== "in_progress") {
    return (
      <div className="surface max-w-2xl p-8">
        <h2 className="text-xl font-bold text-slate-900">Sınav tamamlandı</h2>
        <p className="mt-4 text-3xl font-extrabold text-[var(--brand-navy)]">Net: {attempt.net_score}</p>
        <p className="mt-2 text-sm text-slate-600">
          {attempt.correct_count} doğru · {attempt.wrong_count} yanlış · {attempt.blank_count} boş
        </p>
        {attempt.analysis_summary ? (
          <p className="mt-6 rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {attempt.analysis_summary}
          </p>
        ) : null}
        <Link href={`/exams/${examId}`} className="btn-outline mt-6 inline-flex h-10 px-4">
          Sınav sayfasına dön
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="sticky top-20 z-10 mb-6 flex items-center justify-between rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur">
        <span className="text-sm font-medium text-slate-600">Kalan süre</span>
        <span className={`font-mono text-2xl font-bold ${remaining < 300 ? "text-red-600" : "text-[var(--brand-navy)]"}`}>
          {formatTime(remaining)}
        </span>
        <button
          type="button"
          disabled={submitting}
          onClick={() => void submitExam()}
          className="btn-solid h-9 px-4 text-sm"
        >
          Bitir
        </button>
      </div>

      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="surface p-5">
            <p className="text-sm font-semibold text-slate-900">
              Soru {q.order_index + 1}
              {q.topic_title ? <span className="font-normal text-slate-500"> — {q.topic_title}</span> : null}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {CHOICES.slice(0, q.choice_count || 5).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    setAnswers((prev) => ({ ...prev, [q.id]: c }));
                  }}
                  className={`h-10 w-10 rounded-full border text-sm font-bold transition ${
                    answers[q.id] === c
                      ? "border-[var(--brand-blue)] bg-[var(--brand-blue)] text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:border-slate-400"
                  }`}
                >
                  {c}
                </button>
              ))}
              <button
                type="button"
                onClick={() => {
                  setAnswers((prev) => {
                    const next = { ...prev };
                    delete next[q.id];
                    return next;
                  });
                }}
                className="h-10 rounded-full px-3 text-xs text-slate-500 underline"
              >
                Boş bırak
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
