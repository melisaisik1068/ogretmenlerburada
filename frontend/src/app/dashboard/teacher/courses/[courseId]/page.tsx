import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

async function requireAuth(nextPath: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
}

export default async function TeacherCourseEditPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params;
  await requireAuth(`/dashboard/teacher/courses/${courseId}`);

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Instructor</div>
        <h1 className="section-title">Edit course</h1>
        <p className="section-lead">Başlık, açıklama, kapak, seviye ve yayın durumunu düzenle.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/dashboard/teacher/courses" className="btn-outline h-10 px-4">
            ← Back
          </Link>
        </div>

        <div className="mt-8">
          <CourseEditClient courseId={courseId} />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function CourseEditClient({ courseId }: { courseId: string }) {
  "use client";
  const React = require("react") as typeof import("react");
  const { useEffect, useState } = React;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [ok, setOk] = useState("");

  const [form, setForm] = useState<any>({
    title: "",
    description: "",
    cover_image_url: "",
    subject_slug: "",
    access_level: "free",
    is_published: false,
  });

  async function load() {
    setLoading(true);
    setError("");
    setOk("");
    try {
      const res = await fetch(`/api/teacher/courses/${courseId}`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof data.detail === "string" ? data.detail : "Yüklenemedi.");
        return;
      }
      setForm({
        title: data.title ?? "",
        description: data.description ?? "",
        cover_image_url: data.cover_image_url ?? "",
        subject_slug: data.subject?.slug ?? "",
        access_level: data.access_level ?? "free",
        is_published: !!data.is_published,
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function save(e: any) {
    e.preventDefault();
    setError("");
    setOk("");
    const res = await fetch(`/api/teacher/courses/${courseId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(form),
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
      <form className="grid gap-4" onSubmit={save}>
        {ok ? <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-900">{ok}</div> : null}
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Title</span>
          <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.title} onChange={(e: any) => setForm({ ...form, title: e.target.value })} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Subject slug</span>
          <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.subject_slug} onChange={(e: any) => setForm({ ...form, subject_slug: e.target.value })} placeholder="örn: matematik" />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Cover image URL</span>
          <input className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.cover_image_url} onChange={(e: any) => setForm({ ...form, cover_image_url: e.target.value })} />
        </label>
        <label className="grid gap-1">
          <span className="text-xs font-semibold text-slate-700">Description</span>
          <textarea className="min-h-28 rounded-xl border border-slate-200 px-3 py-2 text-sm" value={form.description} onChange={(e: any) => setForm({ ...form, description: e.target.value })} />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Access level</span>
            <select className="h-11 rounded-xl border border-slate-200 px-3 text-sm" value={form.access_level} onChange={(e: any) => setForm({ ...form, access_level: e.target.value })}>
              {["free", "basic", "pro", "enterprise"].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700 sm:mt-6">
            <input type="checkbox" checked={form.is_published} onChange={(e: any) => setForm({ ...form, is_published: e.target.checked })} />
            Published
          </label>
        </div>
        <button className="btn-solid w-full">Save</button>
      </form>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link href="/dashboard/teacher/courses" className="btn-outline h-10 px-4">
          Done
        </Link>
      </div>
    </div>
  );
}

