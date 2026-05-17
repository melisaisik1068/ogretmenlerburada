"use client";

import { useEffect, useState } from "react";

type StudentCard = {
  student_id: number;
  display_name: string;
  label: string;
  stats: {
    lessons_completed: number;
    lessons_tracked: number;
    avg_progress_percent: number;
    last_exam_net: number | null;
  };
  exams: { exam_title: string; net_score: number; summary: string }[];
  live_lessons: { starts_at: string; status: string; teacher_name: string; attended: boolean }[];
};

export function ParentDashboardClient() {
  const [students, setStudents] = useState<StudentCard[]>([]);
  const [username, setUsername] = useState("");
  const [label, setLabel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/parent/dashboard", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "Panel yüklenemedi.");
      setStudents([]);
    } else {
      setStudents((data.students as StudentCard[]) ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function linkStudent(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/parent/link-student", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ student_username: username.trim(), label: label.trim() }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "Bağlantı kurulamadı.");
      return;
    }
    setUsername("");
    setLabel("");
    await load();
  }

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor…</p>;

  return (
    <div className="space-y-10">
      <form onSubmit={linkStudent} className="surface max-w-lg p-6">
        <h2 className="font-bold text-slate-900">Çocuğunu bağla</h2>
        <p className="mt-1 text-sm text-slate-600">Öğrencinin kullanıcı adını gir.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <input
            className="input-field"
            placeholder="Öğrenci kullanıcı adı"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            className="input-field"
            placeholder="Etiket (örn. Oğlum)"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>
        <button type="submit" className="btn-solid mt-4 h-10 px-4">
          Bağla
        </button>
        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      </form>

      {students.length === 0 ? (
        <p className="text-sm text-slate-600">Henüz bağlı öğrenci yok.</p>
      ) : (
        students.map((s) => (
          <section key={s.student_id}>
            <h2 className="text-xl font-bold text-slate-900">
              {s.display_name}
              {s.label ? <span className="text-base font-normal text-slate-500"> ({s.label})</span> : null}
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <BentoCard title="Tamamlanan ders" value={String(s.stats.lessons_completed)} />
              <BentoCard title="İzlenen içerik" value={String(s.stats.lessons_tracked)} />
              <BentoCard title="Ortalama ilerleme" value={`%${s.stats.avg_progress_percent}`} />
              <BentoCard
                title="Son deneme neti"
                value={s.stats.last_exam_net != null ? String(s.stats.last_exam_net) : "—"}
              />
            </div>

            {s.exams.length > 0 ? (
              <div className="mt-6 grid gap-4 lg:grid-cols-2">
                {s.exams.map((ex, i) => (
                  <div key={i} className="surface p-5">
                    <p className="font-semibold text-slate-900">{ex.exam_title}</p>
                    <p className="mt-1 text-2xl font-bold text-[var(--brand-navy)]">Net {ex.net_score}</p>
                    <p className="mt-2 text-sm text-slate-600">{ex.summary}</p>
                  </div>
                ))}
              </div>
            ) : null}

            {s.live_lessons.length > 0 ? (
              <div className="mt-6">
                <h3 className="font-semibold text-slate-900">Canlı ders / randevular</h3>
                <ul className="mt-3 space-y-2">
                  {s.live_lessons.map((l, i) => (
                    <li key={i} className="surface flex justify-between px-4 py-3 text-sm">
                      <span>{l.teacher_name}</span>
                      <span className={l.attended ? "text-green-700" : "text-slate-500"}>
                        {l.attended ? "Katıldı" : l.status}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </section>
        ))
      )}
    </div>
  );
}

function BentoCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="surface flex flex-col justify-between p-5 min-h-[120px]">
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-extrabold text-[var(--brand-navy)]">{value}</p>
    </div>
  );
}
