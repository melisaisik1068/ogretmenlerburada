"use client";

import { useEffect, useState } from "react";

type Homework = {
  id: number;
  title: string;
  description: string;
  status: string;
  submission_count?: number;
};

type Submission = {
  id: number;
  student_name: string;
  status: string;
  teacher_feedback: string;
  submitted_at: string;
  photo: string;
};

export function TeacherHomeworkClient() {
  const [items, setItems] = useState<Homework[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/teacher/homeworks", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    setItems(Array.isArray(data) ? data : (data.results ?? []));
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function loadSubmissions(hwId: number) {
    setSelectedId(hwId);
    const res = await fetch(`/api/teacher/homeworks/${hwId}/submissions`, { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    setSubmissions(Array.isArray(data) ? data : []);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/teacher/homeworks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, status: "open" }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "Oluşturulamadı.");
      return;
    }
    setForm({ title: "", description: "" });
    await load();
  }

  async function review(subId: number, status: string, feedback: string) {
    if (!selectedId) return;
    await fetch(`/api/teacher/homeworks/${selectedId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ submission_id: subId, status, teacher_feedback: feedback }),
    });
    await loadSubmissions(selectedId);
  }

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor…</p>;

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div>
        <form onSubmit={create} className="surface p-6">
          <h2 className="font-bold text-slate-900">Yeni ödev</h2>
          <input
            className="input-field mt-4"
            placeholder="Başlık"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
          <textarea
            className="input-field mt-3 min-h-[100px]"
            placeholder="Açıklama"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button type="submit" className="btn-solid mt-4 h-10 px-4">
            Yayınla
          </button>
          {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
        </form>

        <ul className="mt-6 space-y-2">
          {items.map((h) => (
            <li key={h.id}>
              <button
                type="button"
                onClick={() => void loadSubmissions(h.id)}
                className={`surface w-full p-4 text-left ${selectedId === h.id ? "ring-2 ring-[var(--brand-blue)]" : ""}`}
              >
                <p className="font-semibold">{h.title}</p>
                <p className="text-xs text-slate-500">
                  {h.submission_count ?? 0} teslim · {h.status}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="font-bold text-slate-900">Teslimler</h2>
        {!selectedId ? (
          <p className="mt-4 text-sm text-slate-600">Soldan bir ödev seç.</p>
        ) : submissions.length === 0 ? (
          <p className="mt-4 text-sm text-slate-600">Henüz teslim yok.</p>
        ) : (
          <ul className="mt-4 space-y-4">
            {submissions.map((s) => (
              <li key={s.id} className="surface p-4">
                <p className="font-semibold">{s.student_name}</p>
                <p className="text-xs text-slate-500">{s.status}</p>
                {s.photo ? (
                  <a
                    href={s.photo}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-2 inline-block text-sm text-[var(--brand-blue)] underline"
                  >
                    Fotoğrafı aç
                  </a>
                ) : null}
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn-outline h-8 px-3 text-xs"
                    onClick={() => void review(s.id, "approved", "Güzel iş!")}
                  >
                    Onayla
                  </button>
                  <button
                    type="button"
                    className="btn-outline h-8 px-3 text-xs"
                    onClick={() => void review(s.id, "rejected", "Tekrar çekip yükle.")}
                  >
                    Reddet
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
