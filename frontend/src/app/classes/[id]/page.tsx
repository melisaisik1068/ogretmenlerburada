import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";
import { CourseReviews, RatingBadge } from "@/components/reviews/course-reviews";
import { getApiBaseUrl } from "@/lib/env";
import type { CourseDetail } from "@/lib/types/api";

async function fetchCourse(id: string): Promise<{ ok: true; data: CourseDetail } | { ok: false; status: number }> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/lessons/courses/${id}/`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { ok: false, status: res.status };
    const data = (await res.json()) as CourseDetail;
    return { ok: true, data };
  } catch {
    return { ok: false, status: 0 };
  }
}

type ProgressRow = { lesson_id: number; course_id: number; is_completed: boolean; progress_percent: number };

async function fetchProgress(courseId: string): Promise<ProgressRow[] | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) return null;
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/progress/courses/${courseId}/`, {
      headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as ProgressRow[];
  } catch {
    return null;
  }
}

export default async function CourseDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!id) return notFound();

  const [res, progress] = await Promise.all([fetchCourse(id), fetchProgress(id)]);
  if (!res.ok) {
    if (res.status === 404) return notFound();
  }

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />

      <main className="container-page py-10 sm:py-12">
        {!res.ok ? (
          <div className="surface p-7">
            <div className="section-eyebrow">Course</div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900">Bu kursa erişemiyorsun</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Plan yetersiz olabilir veya kurs yayında değildir. Yükseltme yapıp tekrar deneyebilirsin.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/upgrade" className="btn-accent">
                Planları Gör
              </Link>
              <Link href="/classes" className="btn-outline">
                Kurslara Dön
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-6 lg:grid-cols-12 lg:gap-10">
              <div className="lg:col-span-7">
                <div className="section-eyebrow">Course</div>
                <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{res.data.title}</h1>
                <p className="mt-3 text-sm leading-6 text-slate-600">{res.data.description || "—"}</p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="badge">{res.data.subject.title}</span>
                  <span className="badge">{res.data.access_level?.toUpperCase?.() ?? "—"}</span>
                  <RatingBadge ratingAvg={res.data.rating_avg} ratingCount={res.data.rating_count} />
                  <span className="badge">
                    Teacher:{" "}
                    {[res.data.teacher.first_name, res.data.teacher.last_name].filter(Boolean).join(" ") || res.data.teacher.username}
                  </span>
                </div>

                <div className="mt-8 surface p-6">
                  <div className="text-sm font-extrabold tracking-tight text-slate-900">Lessons</div>
                  {progress ? (
                    <div className="mt-2 text-xs text-slate-500">
                      Completed:{" "}
                      <span className="font-semibold text-slate-900">
                        {progress.filter((p) => p.is_completed).length}
                      </span>
                      {" / "}
                      {res.data.lessons?.length ?? 0}
                    </div>
                  ) : (
                    <div className="mt-2 text-xs text-slate-500">Progress için giriş yapmalısın.</div>
                  )}
                  <div className="mt-4 grid gap-3">
                    {res.data.lessons?.length ? (
                      res.data.lessons.map((l) => (
                        <div key={l.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div className="text-sm font-extrabold text-slate-900">{l.title}</div>
                            <div className="text-xs text-slate-500">
                              {l.duration_minutes} dk • {l.price_try} ₺
                            </div>
                          </div>
                          {l.content ? <div className="mt-2 line-clamp-3 text-sm text-slate-600">{l.content}</div> : null}
                          <div className="mt-4 flex flex-wrap gap-2">
                            <Link href={`/classes/${id}/lessons/${l.id}`} className="btn-solid h-10 px-4">
                              Play
                            </Link>
                            <Link href={`/classes/${id}/lessons/${l.id}`} className="btn-outline h-10 px-4">
                              Details
                            </Link>
                            {progress?.some((p) => p.lesson_id === l.id && p.is_completed) ? (
                              <span className="badge">Completed</span>
                            ) : null}
                            {l.is_preview ? <span className="badge">Preview</span> : null}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-sm text-slate-600">Henüz ders yok.</div>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  <CourseReviews courseId={res.data.id} />
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="surface overflow-hidden">
                  <div className="relative aspect-4/3 bg-slate-100">
                    {res.data.cover_image_url ? (
                      <Image src={res.data.cover_image_url} alt="" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
                    ) : (
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(26,115,232,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,182,6,0.20),transparent_55%)]" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm font-extrabold tracking-tight text-slate-900">Course actions</div>
                    <div className="mt-4 grid gap-2">
                      <Link href="/contact" className="btn-solid justify-center">
                        Enquiry
                      </Link>
                      <Link href="/classes" className="btn-outline justify-center">
                        Browse more
                      </Link>
                    </div>
                    <div className="mt-4 text-xs text-slate-500">
                      Rating/price/student meta, API genişleyince eklenecek.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

