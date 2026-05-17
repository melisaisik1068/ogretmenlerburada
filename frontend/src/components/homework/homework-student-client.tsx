"use client";

import { useEffect, useState } from "react";

type Homework = {
  id: number;
  title: string;
  description: string;
  due_at: string | null;
  teacher_name: string;
};

export function HomeworkStudentClient() {
  const [items, setItems] = useState<Homework[]>([]);
  const [hwId, setHwId] = useState<number | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(true);

  async function load() {
    setLoading(true);
    const res = await fetch("/api/assignments/homeworks", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    const list = Array.isArray(data) ? data : (data.results ?? []);
    setItems(list);
    setLoading(false);
  }

  useEffect(() => {
    void load();
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!hwId || !file) {
      setMsg("Ödev ve fotoğraf seç.");
      return;
    }
    const fd = new FormData();
    fd.set("photo", file);
    fd.set("note", note);
    const res = await fetch(`/api/assignments/homeworks/${hwId}/submit`, { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(typeof data.detail === "string" ? data.detail : "Yüklenemedi.");
      return;
    }
    setMsg("Ödev gönderildi.");
    setFile(null);
    setNote("");
  }

  if (loading) return <p className="text-sm text-slate-600">Yükleniyor…</p>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="font-bold text-slate-900">Açık ödevler</h2>
          <ul className="mt-4 space-y-3">
            {items.length === 0 ? (
              <li className="text-sm text-slate-600">Açık ödev yok.</li>
            ) : (
              items.map((h) => (
                <li key={h.id}>
                  <button
                    type="button"
                    onClick={() => setHwId(h.id)}
                    className={`surface w-full p-4 text-left ${hwId === h.id ? "ring-2 ring-[var(--brand-blue)]" : ""}`}
                  >
                    <p className="font-semibold">{h.title}</p>
                    <p className="mt-1 text-xs text-slate-500">{h.teacher_name}</p>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>

        <form onSubmit={submit} className="surface p-6">
          <h2 className="font-bold text-slate-900">Fotoğraf yükle</h2>
          <input
            type="file"
            accept="image/*,.pdf"
            className="mt-4 block w-full text-sm"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          <textarea
            className="input-field mt-4 min-h-[80px]"
            placeholder="Not (isteğe bağlı)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
          <button type="submit" className="btn-solid mt-4 h-10 px-4">
            Gönder
          </button>
          {msg ? <p className="mt-3 text-sm text-slate-600">{msg}</p> : null}
        </form>
    </div>
  );
}
