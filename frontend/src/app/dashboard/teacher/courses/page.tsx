import Link from "next/link";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

import { cookies } from "next/headers";

async function requireTeacher() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect("/login?next=/dashboard/teacher/courses");
}

export default async function TeacherCoursesPage() {
  await requireTeacher();
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Instructor</div>
        <h1 className="section-title">Teacher dashboard</h1>
        <p className="section-lead">Kurslarını oluştur, düzenle ve ders ekle.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/dashboard" className="btn-outline h-10 px-4">
            Panele dön
          </Link>
          <Link href="/dashboard/teacher/materials" className="btn-solid h-10 px-4">
            Materials
          </Link>
        </div>

        <div className="mt-8">
          <TeacherCoursesClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function TeacherCoursesClient() {
  "use client";
  const React = require("react") as typeof import("react");
  const { useEffect, useMemo, useState } = React;

  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const [create, setCreate] = useState({ title: "", description: "", subject_slug: "", cover_image_url: "", access_level: "free", is_published: false });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/teacher/courses", { cache: "no-store" });
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

  async function createCourse(e: any) {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/teacher/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(create),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "Kurs oluşturulamadı.");
      return;
    }
    setCreate({ title: "", description: "", subject_slug: "", cover_image_url: "", access_level: "free", is_published: false });
    await load();
  }

  async function patchCourse(id: number, patch: Record<string, unknown>) {
    const res = await fetch(`/api/teacher/courses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) await load();
  }

  async function addLesson(courseId: number) {
    const title = prompt("Lesson title?");
    if (!title) return;
    const res = await fetch(`/api/teacher/courses/${courseId}/add-lesson`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ title, duration_minutes: 45, price_try: 0, order_index: 0, is_published: false, content: "" }),
    });
    if (res.ok) await load();
  }

  const levels = useMemo(() => ["free", "basic", "pro", "enterprise"], []);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <section className="lg:col-span-5">
        <div className="surface p-6">
          <div className="text-sm font-extrabold tracking-tight text-slate-900">Create course</div>
          <form className="mt-4 grid gap-3" onSubmit={createCourse}>
            {error ? <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">{error}</div> : null}
            <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" placeholder="Title" value={create.title} onChange={(e: any) => setCreate({ ...create, title: e.target.value })} />
            <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" placeholder="Subject slug (örn: matematik)" value={create.subject_slug} onChange={(e: any) => setCreate({ ...create, subject_slug: e.target.value })} />
            <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" placeholder="Cover image URL" value={create.cover_image_url} onChange={(e: any) => setCreate({ ...create, cover_image_url: e.target.value })} />
            <textarea className="min-h-24 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Description" value={create.description} onChange={(e: any) => setCreate({ ...create, description: e.target.value })} />
            <select className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={create.access_level} onChange={(e: any) => setCreate({ ...create, access_level: e.target.value })}>
              {levels.map((l: string) => <option key={l} value={l}>{l}</option>)}
            </select>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={create.is_published} onChange={(e: any) => setCreate({ ...create, is_published: e.target.checked })} />
              Publish now
            </label>
            <button className="btn-solid w-full">Create</button>
          </form>
        </div>
      </section>

      <section className="lg:col-span-7">
        <div className="surface p-6">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-extrabold tracking-tight text-slate-900">My courses</div>
            <button className="btn-outline h-10 px-4" type="button" onClick={() => void load()}>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="mt-4 text-sm text-slate-600">Loading…</div>
          ) : items.length === 0 ? (
            <div className="mt-4 text-sm text-slate-600">Henüz kurs yok.</div>
          ) : (
            <div className="mt-5 grid gap-3">
              {items.map((c) => (
                <div key={c.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.subject?.title ?? c.subject_slug ?? "—"}</div>
                      <div className="mt-1 text-base font-extrabold text-slate-900">{c.title}</div>
                      <div className="mt-2 text-xs text-slate-500">
                        Level: <span className="font-semibold">{c.access_level}</span> · Published:{" "}
                        <span className="font-semibold">{String(!!c.is_published)}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/dashboard/teacher/courses/${c.id}`} className="btn-outline h-10 px-4">
                        Edit
                      </Link>
                      <button type="button" className="btn-outline h-10 px-4" onClick={() => void addLesson(c.id)}>
                        Add lesson
                      </button>
                      <button type="button" className="btn-solid h-10 px-4" onClick={() => void patchCourse(c.id, { is_published: !c.is_published })}>
                        Toggle publish
                      </button>
                    </div>
                  </div>
                  {Array.isArray(c.lessons) && c.lessons.length ? (
                    <div className="mt-4 grid gap-2">
                      {c.lessons.map((l: any) => (
                        <div key={l.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                          <span>{l.title}</span>
                          <div className="flex items-center gap-3">
                            <Link href={`/dashboard/teacher/lessons/${l.id}`} className="link-primary text-xs font-semibold">
                              Edit
                            </Link>
                            <span className="text-xs text-slate-500">preview:{String(!!l.is_preview)} · pub:{String(!!l.is_published)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-3 text-xs text-slate-500">No lessons yet.</div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

