"use client";

import { useEffect, useState } from "react";

type Exam = {
  id: number;
  title: string;
  exam_type: string;
  duration_minutes: number;
  is_published: boolean;
  questions?: { id: number; topic_title: string }[];
};

export function TeacherExamsClient() {
  const [items, setItems] = useState<Exam[]>([]);
  const [selected, setSelected] = useState<Exam | null>(null);
  const [examForm, setExamForm] = useState({
    title: "",
    exam_type: "lgs",
    description: "",
    duration_minutes: 60,
  });
  const [qForm, setQForm] = useState({ topic_title: "", correct_choice: "A" });
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/teacher/exams", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    setItems(Array.isArray(data) ? data : (data.results ?? []));
  }

  useEffect(() => {
    void load();
  }, []);

  async function createExam(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/teacher/exams", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(examForm),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "Sınav oluşturulamadı.");
      return;
    }
    setExamForm({ title: "", exam_type: "lgs", description: "", duration_minutes: 60 });
    await load();
    setSelected(data as Exam);
  }

  async function addQuestion(e: React.FormEvent) {
    e.preventDefault();
    if (!selected) return;
    await fetch(`/api/teacher/exams/${selected.id}/questions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(qForm),
    });
    setQForm({ topic_title: "", correct_choice: "A" });
    const res = await fetch(`/api/teacher/exams/${selected.id}`, { cache: "no-store" });
    if (res.ok) setSelected((await res.json()) as Exam);
  }

  async function publish() {
    if (!selected) return;
    const res = await fetch(`/api/teacher/exams/${selected.id}/publish`, { method: "POST" });
    if (res.ok) {
      await load();
      setSelected(null);
    } else {
      const data = await res.json().catch(() => ({}));
      setError(typeof data.detail === "string" ? data.detail : "Yayınlanamadı.");
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <form onSubmit={createExam} className="surface p-6">
          <h2 className="font-bold">Yeni deneme sınavı</h2>
          <input
            className="input-field mt-4"
            placeholder="Başlık"
            value={examForm.title}
            onChange={(e) => setExamForm({ ...examForm, title: e.target.value })}
            required
          />
          <select
            className="input-field mt-3"
            value={examForm.exam_type}
            onChange={(e) => setExamForm({ ...examForm, exam_type: e.target.value })}
          >
            <option value="lgs">LGS</option>
            <option value="yks">YKS</option>
            <option value="ales">ALES</option>
            <option value="custom">Özel</option>
          </select>
          <input
            type="number"
            className="input-field mt-3"
            value={examForm.duration_minutes}
            onChange={(e) => setExamForm({ ...examForm, duration_minutes: Number(e.target.value) })}
          />
          <button type="submit" className="btn-solid mt-4 h-10 px-4">
            Oluştur
          </button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </form>
        <ul className="mt-6 space-y-2">
          {items.map((ex) => (
            <li key={ex.id}>
              <button
                type="button"
                className={`surface w-full p-4 text-left ${selected?.id === ex.id ? "ring-2 ring-[var(--brand-blue)]" : ""}`}
                onClick={async () => {
                  const res = await fetch(`/api/teacher/exams/${ex.id}`, { cache: "no-store" });
                  if (res.ok) setSelected((await res.json()) as Exam);
                }}
              >
                <p className="font-semibold">{ex.title}</p>
                <p className="text-xs text-slate-500">
                  {ex.exam_type.toUpperCase()} · {ex.is_published ? "Yayında" : "Taslak"}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {selected ? (
        <div className="surface p-6">
          <h2 className="font-bold">{selected.title}</h2>
          <p className="mt-1 text-sm text-slate-600">{selected.questions?.length ?? 0} soru</p>
          <form onSubmit={addQuestion} className="mt-4 grid gap-3">
            <input
              className="input-field"
              placeholder="Konu adı"
              value={qForm.topic_title}
              onChange={(e) => setQForm({ ...qForm, topic_title: e.target.value })}
              required
            />
            <select
              className="input-field"
              value={qForm.correct_choice}
              onChange={(e) => setQForm({ ...qForm, correct_choice: e.target.value })}
            >
              {["A", "B", "C", "D", "E"].map((c) => (
                <option key={c} value={c}>
                  Doğru: {c}
                </option>
              ))}
            </select>
            <button type="submit" className="btn-outline h-10 px-4">
              Soru ekle
            </button>
          </form>
          <button type="button" onClick={() => void publish()} className="btn-solid mt-4 h-10 px-4">
            Yayınla
          </button>
        </div>
      ) : (
        <p className="text-sm text-slate-600">Soru eklemek için soldan bir sınav seç.</p>
      )}
    </div>
  );
}
