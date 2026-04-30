import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

async function requireTeacher() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect("/login?next=/dashboard/teacher/materials");
}

export default async function TeacherMaterialsPage() {
  await requireTeacher();

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Instructor</div>
        <h1 className="section-title">Materials</h1>
        <p className="section-lead">Dosya yükle, fiyat/publish ayarla.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/dashboard/teacher/courses" className="btn-outline h-10 px-4">
            Teacher panel
          </Link>
        </div>

        <div className="mt-8">
          <TeacherMaterialsClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function TeacherMaterialsClient() {
  "use client";
  const React = require("react") as typeof import("react");
  const { useEffect, useState } = React;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [form, setForm] = useState({ title: "", description: "", type: "pdf", price_try: 0, is_published: false, file: null as File | null });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/teacher/materials", { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      const list = Array.isArray(data) ? data : (data.results ?? []);
      setItems(list);
    } catch {
      setError("Yüklenemedi.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function upload(e: any) {
    e.preventDefault();
    setError("");
    if (!form.file) {
      setError("Dosya seçmelisin.");
      return;
    }
    const fd = new FormData();
    fd.set("title", form.title);
    fd.set("description", form.description);
    fd.set("type", form.type);
    fd.set("price_try", String(form.price_try));
    fd.set("is_published", String(form.is_published));
    fd.set("file", form.file);
    const res = await fetch("/api/teacher/materials", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "Upload başarısız.");
      return;
    }
    setForm({ title: "", description: "", type: "pdf", price_try: 0, is_published: false, file: null });
    await load();
  }

  async function patch(id: number, patch: Record<string, unknown>) {
    const res = await fetch(`/api/teacher/materials/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) await load();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-5">
        <div className="surface p-6">
          <div className="text-sm font-extrabold tracking-tight text-slate-900">Upload material</div>
          <form className="mt-4 grid gap-3" onSubmit={upload}>
            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div> : null}
            <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" placeholder="Title" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} required />
            <textarea className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Description" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />
            <select className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })}>
              <option value="pdf">PDF</option>
              <option value="video">Video</option>
              <option value="other">Other</option>
            </select>
            <input type="number" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.price_try} onChange={(e: any) => setForm({ ...form, price_try: parseInt(e.target.value || "0", 10) })} />
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.is_published} onChange={(e: any) => setForm({ ...form, is_published: e.target.checked })} />
              Publish now
            </label>
            <input type="file" className="rounded-xl border border-slate-200 px-3 py-2 text-sm" onChange={(e: any) => setForm({ ...form, file: e.target.files?.[0] ?? null })} />
            <button className="btn-solid w-full">Upload</button>
          </form>
        </div>
      </section>

      <section className="lg:col-span-7">
        <div className="surface p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold tracking-tight text-slate-900">My materials</div>
            <button className="btn-outline h-10 px-4" type="button" onClick={() => void load()}>
              Refresh
            </button>
          </div>
          {loading ? (
            <div className="mt-4 text-sm text-slate-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="mt-4 text-sm text-slate-600">Henüz materyal yok.</div>
          ) : (
            <div className="mt-5 grid gap-3">
              {items.map((m) => (
                <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{m.type}</div>
                      <div className="mt-1 text-base font-extrabold text-slate-900">{m.title}</div>
                      <div className="mt-2 text-xs text-slate-500">
                        {m.price_try} ₺ · Published: <span className="font-semibold">{String(!!m.is_published)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <a className="btn-outline h-10 px-4" href={m.file}>
                        File
                      </a>
                      <button type="button" className="btn-solid h-10 px-4" onClick={() => void patch(m.id, { is_published: !m.is_published })}>
                        Toggle publish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

