import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

async function requireAuth(nextPath: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
}

export default async function TeacherLessonEditPage({ params }: { params: Promise<{ lessonId: string }> }) {
  const { lessonId } = await params;
  await requireAuth(`/dashboard/teacher/lessons/${lessonId}`);

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Instructor</div>
        <h1 className="section-title">Edit lesson</h1>
        <p className="section-lead">Video, içerik, sıralama, fiyat, preview/publish alanlarını düzenle.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/dashboard/teacher/courses" className="btn-outline h-10 px-4">
            ← Back
          </Link>
        </div>

        <div className="mt-8">
          <LessonEditClient lessonId={lessonId} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function LessonEditClient({ lessonId }: { lessonId: string }) {
  "use client";
  const React = require("react") as typeof import("react");
  const { useEffect, useState } = React;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [meta, setMeta] = useState<{ courseId?: number; courseTitle?: string }>({});
  const [form, setForm] = useState<any>({
    title: "",
    video_url: "",
    content: "",
    order_index: 0,
    duration_minutes: 0,
    price_try: 0,
    is_preview: false,
    is_published: false,
  });

  async function load() {
    setLoading(true);
    setError("");
    setOk("");
    try {
      const res = await fetch(`/api/teacher/lessons/${lessonId}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Yüklenemedi.");
        return;
      }
      setMeta({ courseId: data.course?.id, courseTitle: data.course?.title });
      setForm({
        title: data.title ?? "",
        video_url: data.video_url ?? "",
        content: data.content ?? "",
        order_index: Number(data.order_index ?? 0),
        duration_minutes: Number(data.duration_minutes ?? 0),
        price_try: Number(data.price_try ?? 0),
        is_preview: !!data.is_preview,
        is_published: !!data.is_published,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonId]);

  async function save(e: any) {
    e.preventDefault();
    setError("");
    setOk("");
    const payload = {
      title: form.title,
      video_url: form.video_url,
      content: form.content,
      order_index: Number(form.order_index ?? 0),
      duration_minutes: Number(form.duration_minutes ?? 0),
      price_try: Number(form.price_try ?? 0),
      is_preview: !!form.is_preview,
      is_published: !!form.is_published,
    };
    const res = await fetch(`/api/teacher/lessons/${lessonId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(typeof data.detail === "string" ? data.detail : "Kaydedilemedi.");
      return;
    }
    setOk("Kaydedildi.");
  }

  if (loading) return <div className="surface p-6 text-sm text-slate-600">Loading…</div>;
  if (error) return <div className="surface p-6 text-sm text-red-700">Error: {error}</div>;

  return (
    <div className="surface p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-slate-600">
          Course: <span className="font-semibold text-slate-900">{meta.courseTitle ?? "—"}</span>
        </div>
        {meta.courseId ? (
          <Link href={`/classes/${meta.courseId}`} className="link-primary text-sm">
            View public course
          </Link>
        ) : null}
      </div>

      <form className="grid gap-4" onSubmit={save}>
        {ok ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{ok}</div> : null}

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Title</span>
          <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
        </label>

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Video URL</span>
          <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.video_url} onChange={(e: any) => setForm({ ...form, video_url: e.target.value })} placeholder="https://…" />
        </label>

        <div className="grid gap-3 sm:grid-cols-3">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Order</span>
            <input type="number" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.order_index} onChange={(e: any) => setForm({ ...form, order_index: parseInt(e.target.value || "0", 10) })} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Duration (min)</span>
            <input type="number" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.duration_minutes} onChange={(e: any) => setForm({ ...form, duration_minutes: parseInt(e.target.value || "0", 10) })} />
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Price (TRY)</span>
            <input type="number" className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.price_try} onChange={(e: any) => setForm({ ...form, price_try: parseInt(e.target.value || "0", 10) })} />
          </label>
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

        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Content</span>
          <textarea className="min-h-52 rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.content} onChange={(e: any) => setForm({ ...form, content: e.target.value })} />
        </label>

        <button className="btn-solid w-full">Save</button>
      </form>
    </div>
  );
}

