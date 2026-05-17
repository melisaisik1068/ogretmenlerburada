"use client";

import { useEffect, useState } from "react";

type Pkg = {
  id: number;
  title: string;
  slug: string;
  price_try: number;
  billing_cycle_days: number;
  is_active: boolean;
};

export function TeacherPackagesClient() {
  const [items, setItems] = useState<Pkg[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    price_try: 500,
    billing_cycle_days: 30,
    includes_premium_courses: true,
    includes_all_exams: true,
    includes_marketplace: false,
  });
  const [error, setError] = useState("");

  async function load() {
    const res = await fetch("/api/teacher/packages", { cache: "no-store" });
    const data = await res.json().catch(() => ({}));
    setItems(Array.isArray(data) ? data : (data.results ?? []));
  }

  useEffect(() => {
    void load();
  }, []);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/teacher/packages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "Oluşturulamadı.");
      return;
    }
    setForm({
      title: "",
      description: "",
      price_try: 500,
      billing_cycle_days: 30,
      includes_premium_courses: true,
      includes_all_exams: true,
      includes_marketplace: false,
    });
    await load();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <form onSubmit={create} className="surface p-6">
        <h2 className="font-bold">Yeni paket</h2>
        <input
          className="input-field mt-4"
          placeholder="Paket adı"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          required
        />
        <textarea
          className="input-field mt-3 min-h-[80px]"
          placeholder="Açıklama"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <input
          type="number"
          className="input-field mt-3"
          value={form.price_try}
          onChange={(e) => setForm({ ...form, price_try: Number(e.target.value) })}
        />
        <button type="submit" className="btn-solid mt-4 h-10 px-4">
          Kaydet
        </button>
        {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}
      </form>
      <div>
        <h2 className="font-bold">Paketlerin</h2>
        <ul className="mt-4 space-y-2">
          {items.map((p) => (
            <li key={p.id} className="surface p-4 text-sm">
              <span className="font-semibold">{p.title}</span> — {p.price_try} ₺ / {p.billing_cycle_days} gün
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
