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
  const [confirm, setConfirm] = useState<null | { title: string; detail?: string; action: () => Promise<void> }>(null);
  const [addLessonOpen, setAddLessonOpen] = useState<null | { courseId: number; courseTitle: string }>(null);

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

  async function deleteCourse(courseId: number) {
    const res = await fetch(`/api/teacher/courses/${courseId}`, { method: "DELETE" });
    if (res.ok) await load();
    else setError("Silinemedi.");
  }

  async function deleteLesson(lessonId: number) {
    const res = await fetch(`/api/teacher/lessons/${lessonId}`, { method: "DELETE" });
    if (res.ok) await load();
    else setError("Silinemedi.");
  }

  const levels = useMemo(() => ["free", "basic", "pro", "enterprise"], []);

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <ConfirmDialog
        open={!!confirm}
        title={confirm?.title ?? ""}
        detail={confirm?.detail ?? ""}
        onClose={() => setConfirm(null)}
        onConfirm={async () => {
          const action = confirm?.action;
          setConfirm(null);
          if (action) await action();
        }}
      />

      <AddLessonDialog
        open={!!addLessonOpen}
        courseTitle={addLessonOpen?.courseTitle ?? ""}
        onClose={() => setAddLessonOpen(null)}
        onCreate={async (payload) => {
          const courseId = addLessonOpen?.courseId;
          if (!courseId) return;
          const res = await fetch(`/api/teacher/courses/${courseId}/add-lesson`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify(payload),
          });
          const data = await res.json().catch(() => ({}));
          if (!res.ok) {
            setError(typeof (data as any).detail === "string" ? (data as any).detail : "Lesson eklenemedi.");
            return;
          }
          setAddLessonOpen(null);
          await load();
        }}
      />

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
                      <button type="button" className="btn-outline h-10 px-4" onClick={() => setAddLessonOpen({ courseId: c.id, courseTitle: c.title })}>
                        Add lesson
                      </button>
                      <button type="button" className="btn-solid h-10 px-4" onClick={() => void patchCourse(c.id, { is_published: !c.is_published })}>
                        Toggle publish
                      </button>
                      <button
                        type="button"
                        className="btn-outline h-10 px-4 border-red-200 text-red-700 hover:bg-red-50"
                        onClick={() =>
                          setConfirm({
                            title: "Kurs silinsin mi?",
                            detail: c.title,
                            action: async () => deleteCourse(c.id),
                          })
                        }
                      >
                        Delete
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
                            <button
                              type="button"
                              className="text-xs font-semibold text-red-700 hover:underline"
                              onClick={() =>
                                setConfirm({
                                  title: "Ders silinsin mi?",
                                  detail: l.title,
                                  action: async () => deleteLesson(l.id),
                                })
                              }
                            >
                              Delete
                            </button>
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

function ConfirmDialog({
  open,
  title,
  detail,
  onClose,
  onConfirm,
}: {
  open: boolean;
  title: string;
  detail?: string;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl">
        <div className="text-base font-extrabold text-slate-900">{title}</div>
        {detail ? <div className="mt-2 text-sm text-slate-600">{detail}</div> : null}
        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" className="btn-outline h-10 px-4" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn-solid h-10 px-4 bg-red-600 hover:bg-red-700" onClick={onConfirm}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function AddLessonDialog({
  open,
  courseTitle,
  onClose,
  onCreate,
}: {
  open: boolean;
  courseTitle: string;
  onClose: () => void;
  onCreate: (payload: Record<string, unknown>) => void;
}) {
  const React = require("react") as typeof import("react");
  const { useEffect, useState } = React;
  const [form, setForm] = useState<any>({ title: "", duration_minutes: 45, price_try: 0, order_index: 0, is_preview: false, is_published: false, content: "", video_url: "" });

  useEffect(() => {
    if (open) setForm({ title: "", duration_minutes: 45, price_try: 0, order_index: 0, is_preview: false, is_published: false, content: "", video_url: "" });
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl">
        <div className="text-base font-extrabold text-slate-900">Add lesson</div>
        <div className="mt-1 text-sm text-slate-600">{courseTitle}</div>

        <div className="mt-4 grid gap-3">
          <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" placeholder="Title" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
          <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" placeholder="Video URL (optional)" value={form.video_url} onChange={(e: any) => setForm({ ...form, video_url: e.target.value })} />
          <div className="grid gap-2 sm:grid-cols-3">
            <input type="number" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.order_index} onChange={(e: any) => setForm({ ...form, order_index: parseInt(e.target.value || "0", 10) })} />
            <input type="number" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.duration_minutes} onChange={(e: any) => setForm({ ...form, duration_minutes: parseInt(e.target.value || "0", 10) })} />
            <input type="number" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.price_try} onChange={(e: any) => setForm({ ...form, price_try: parseInt(e.target.value || "0", 10) })} />
          </div>
          <div className="flex flex-wrap gap-5">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.is_preview} onChange={(e: any) => setForm({ ...form, is_preview: e.target.checked })} />
              Preview
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={form.is_published} onChange={(e: any) => setForm({ ...form, is_published: e.target.checked })} />
              Published
            </label>
          </div>
          <textarea className="min-h-32 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Content (optional)" value={form.content} onChange={(e: any) => setForm({ ...form, content: e.target.value })} />
        </div>

        <div className="mt-5 flex items-center justify-end gap-2">
          <button type="button" className="btn-outline h-10 px-4" onClick={onClose}>
            Cancel
          </button>
          <button
            type="button"
            className="btn-solid h-10 px-4"
            onClick={() => {
              if (!String(form.title || "").trim()) return;
              onCreate({
                title: String(form.title).trim(),
                duration_minutes: Number(form.duration_minutes ?? 0),
                price_try: Number(form.price_try ?? 0),
                order_index: Number(form.order_index ?? 0),
                is_preview: !!form.is_preview,
                is_published: !!form.is_published,
                content: String(form.content ?? ""),
                video_url: String(form.video_url ?? ""),
              });
            }}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}

