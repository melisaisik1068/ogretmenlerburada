import Link from "next/link";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";
import type { CoursePublic } from "@/lib/types/api";

async function fetchCourses(): Promise<CoursePublic[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/lessons/courses/`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as CoursePublic[] | { results?: CoursePublic[] };
    if (Array.isArray(data)) return data;
    return data.results ?? [];
  } catch {
    return [];
  }
}

export default async function ClassesPage() {
  const courses = await fetchCourses();

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <h1 className="text-2xl font-extrabold tracking-tight">Sınıflar & kurslar</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Yayında olan kurslar backend&apos;den (<span className="font-mono text-xs">GET /api/lessons/courses/</span>) gelir.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {courses.length === 0 ? (
            <div className="rounded-3xl border border-white/30 bg-white/55 p-6 text-sm text-slate-600 backdrop-blur-xl ring-1 ring-white/20">
              Henüz yayında kurs yok veya API&apos;ye ulaşılamıyor. Django&apos;da içerik oluşturduğunda burada listelenir.
            </div>
          ) : (
            courses.map((c) => (
              <article
                key={c.id}
                className="rounded-3xl border border-white/25 bg-white/60 p-5 shadow-xl shadow-blue-500/5 backdrop-blur-xl ring-1 ring-white/20"
              >
                <div className="text-xs font-semibold uppercase tracking-wide text-sky-700">{c.subject.title}</div>
                <h2 className="mt-2 text-lg font-extrabold text-slate-900">{c.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{c.description || "—"}</p>
                <div className="mt-3 text-xs text-slate-500">
                  Seviye: <span className="font-semibold text-slate-700">{c.access_level}</span>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  Eğitmen:{" "}
                  <span className="font-medium text-slate-800">
                    {[c.teacher.first_name, c.teacher.last_name].filter(Boolean).join(" ") || c.teacher.username}
                  </span>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="mt-10 flex flex-wrap gap-2">
          <Link className="btn-outline" href="/classes/8">
            8. Sınıf (LGS)
          </Link>
          <Link className="btn-outline" href="/classes/12">
            12. Sınıf (YKS)
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
