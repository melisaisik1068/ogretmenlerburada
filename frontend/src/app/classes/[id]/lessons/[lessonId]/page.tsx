import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";
import type { CourseDetail, LessonPublic } from "@/lib/types/api";

type LessonDetail = LessonPublic;

type OutlineRow = {
  id: number;
  title: string;
  is_preview: boolean;
  is_completed: boolean;
  locked: boolean;
};

async function fetchCourse(id: string): Promise<CourseDetail | null> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/lessons/courses/${id}/`, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as CourseDetail;
}

async function fetchLesson(lessonId: string): Promise<LessonDetail | null> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/lessons/lessons/${lessonId}/`, { headers: { Accept: "application/json" }, cache: "no-store" });
  if (!res.ok) return null;
  return (await res.json()) as LessonDetail;
}

async function fetchOutline(courseId: string, token: string): Promise<OutlineRow[] | null> {
  const base = getApiBaseUrl();
  const res = await fetch(`${base}/api/progress/courses/${courseId}/outline/`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  return (await res.json()) as OutlineRow[];
}

export default async function LessonPlayerPage({
  params,
}: {
  params: Promise<{ id: string; lessonId: string }>;
}) {
  const { id, lessonId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect(`/login?next=/classes/${id}/lessons/${lessonId}`);

  const [course, outline] = await Promise.all([fetchCourse(id), fetchOutline(id, token)]);
  const currentOutline = outline?.find((o) => String(o.id) === String(lessonId));

  if (currentOutline?.locked) {
    return (
      <div className="relative min-h-dvh bg-white text-slate-900">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
        <TopNav />
        <main className="container-page py-10 sm:py-12">
          <div className="surface p-7">
            <div className="section-eyebrow">Locked lesson</div>
            <div className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{currentOutline.title}</div>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Bu ders kilitli. Devam etmek için önce önceki dersleri tamamlamalısın.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href={`/classes/${id}`} className="btn-solid h-10 px-4">
                Kursa dön
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  const lesson = await fetchLesson(lessonId);
  if (!course || !lesson) {
    return (
      <div className="relative min-h-dvh bg-white text-slate-900">
        <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
        <TopNav />
        <main className="container-page py-10 sm:py-12">
          <div className="surface p-7">
            <div className="text-xl font-extrabold tracking-tight text-slate-900">Ders bulunamadı</div>
            <div className="mt-4">
              <Link href={`/classes/${id}`} className="btn-outline">
                Kursa dön
              </Link>
            </div>
          </div>
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="section-eyebrow">Course Player</div>
            <div className="mt-1 text-sm text-slate-600">{course.title}</div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">{lesson.title}</h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/classes/${id}`} className="btn-outline h-10 px-4">
              Kursa dön
            </Link>
            <CompleteButton lessonId={lesson.id} />
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <div className="surface p-6">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">Lesson content</div>
              {lesson.video_url ? (
                <div className="mt-5 aspect-video overflow-hidden rounded-2xl border border-slate-200 bg-black">
                  <iframe
                    className="h-full w-full"
                    src={lesson.video_url}
                    title="Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : null}
              <div className="mt-5 space-y-4 text-sm leading-7 text-slate-700">
                {lesson.content ? lesson.content.split("\n").map((line, idx) => <p key={idx}>{line}</p>) : <p>—</p>}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="surface p-6">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">Lessons</div>
              <div className="mt-4 grid gap-2">
                {(outline ?? course.lessons.map((l) => ({ id: l.id, title: l.title, is_preview: false, is_completed: false, locked: false }))).map((l) => {
                  const isActive = l.id === lesson.id;
                  const disabled = l.locked;
                  return (
                    <Link
                      key={l.id}
                      href={disabled ? "#" : `/classes/${id}/lessons/${l.id}`}
                      aria-disabled={disabled}
                      className={`rounded-xl border px-3 py-2 text-sm transition ${
                        isActive ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white hover:bg-slate-50"
                      } ${disabled ? "pointer-events-none opacity-60" : ""}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span>{l.title}</span>
                        <span className="text-xs">
                          {l.locked ? "🔒" : l.is_preview ? "PREVIEW" : l.is_completed ? "✓" : ""}
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
              <div className="mt-5 text-xs text-slate-500">
                Progress: <Link className="link-primary font-semibold" href={`/classes/${id}`}>kurs sayfasında</Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function CompleteButton({ lessonId }: { lessonId: number }) {
  "use client";
  const [loading, setLoading] = (require("react") as typeof import("react")).useState(false);
  const [done, setDone] = (require("react") as typeof import("react")).useState(false);

  async function toggle() {
    setLoading(true);
    try {
      const next = !done;
      const res = await fetch("/api/progress/upsert", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ lesson_id: lessonId, is_completed: next, progress_percent: next ? 100 : 0 }),
      });
      if (res.ok) setDone(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button type="button" disabled={loading} onClick={() => void toggle()} className={done ? "btn-accent h-10 px-4 disabled:opacity-60" : "btn-solid h-10 px-4 disabled:opacity-60"}>
      {done ? "Completed" : "Mark complete"}
    </button>
  );
}

