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

function getParam(sp: Record<string, string | string[] | undefined>, key: string): string | undefined {
  const v = sp[key];
  if (typeof v === "string") return v;
  if (Array.isArray(v)) return v[0];
  return undefined;
}

function buildQuery(params: Record<string, string | undefined>): string {
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (!v) continue;
    usp.set(k, v);
  }
  const qs = usp.toString();
  return qs ? `?${qs}` : "";
}

function inferPriceBand(accessLevel: string | undefined): "free" | "paid" {
  const v = (accessLevel ?? "").toLowerCase();
  if (!v) return "paid";
  if (v.includes("free") || v.includes("public") || v.includes("open")) return "free";
  return "paid";
}

function sortCourses(courses: CoursePublic[], sort: string | undefined): CoursePublic[] {
  const list = [...courses];
  if (sort === "oldest") return list.reverse();
  // rating not available yet — keep server order
  return list;
}

function filterCourses({
  courses,
  q,
  subject,
  level,
  price,
}: {
  courses: CoursePublic[];
  q?: string;
  subject?: string;
  level?: string;
  price?: string;
}): CoursePublic[] {
  const qq = (q ?? "").trim().toLowerCase();
  const subj = (subject ?? "").trim();
  const lvl = (level ?? "").trim();
  const pr = (price ?? "").trim();
  return courses.filter((c) => {
    if (subj && c.subject.slug !== subj) return false;
    if (lvl && c.access_level !== lvl) return false;
    if (pr && inferPriceBand(c.access_level) !== pr) return false;
    if (!qq) return true;
    const teacher = [c.teacher.first_name, c.teacher.last_name].filter(Boolean).join(" ") || c.teacher.username;
    const hay = `${c.title}\n${c.description ?? ""}\n${teacher}\n${c.subject.title}`.toLowerCase();
    return hay.includes(qq);
  });
}

export default async function ClassesPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sp = searchParams ?? {};
  const sort = getParam(sp, "sort");
  const q = getParam(sp, "q");
  const subject = getParam(sp, "subject");
  const level = getParam(sp, "level");
  const price = getParam(sp, "price"); // free | paid
  const rating = getParam(sp, "rating"); // not implemented yet (UI only)

  const courses = await fetchCourses();
  const filtered = filterCourses({ courses, q, subject, level, price });
  const sorted = sortCourses(filtered, sort);

  const subjectOptions = Array.from(
    new Map(courses.map((c) => [c.subject.slug, c.subject.title] as const)).entries(),
  ).map(([slug, title]) => ({ slug, title }));
  subjectOptions.sort((a, b) => a.title.localeCompare(b.title, "tr"));

  const levelOptions = Array.from(new Set(courses.map((c) => c.access_level).filter(Boolean)));
  levelOptions.sort((a, b) => a.localeCompare(b, "tr"));

  const baseParams = { q, subject, level, price, rating };
  const sortNewestHref = `/classes${buildQuery({ ...baseParams, sort: "newest" })}`;
  const sortOldestHref = `/classes${buildQuery({ ...baseParams, sort: "oldest" })}`;
  const sortRatingHref = `/classes${buildQuery({ ...baseParams, sort: "rating" })}`;

  const teacherCounts = new Map<string, { label: string; count: number }>();
  for (const c of filtered) {
    const label = [c.teacher.first_name, c.teacher.last_name].filter(Boolean).join(" ").trim() || c.teacher.username;
    const key = label.toLowerCase();
    const prev = teacherCounts.get(key);
    teacherCounts.set(key, { label, count: (prev?.count ?? 0) + 1 });
  }
  const featuredTeacher = Array.from(teacherCounts.values()).sort((a, b) => b.count - a.count)[0];
  const featuredTeacherHref = featuredTeacher
    ? `/classes${buildQuery({ ...baseParams, q: featuredTeacher.label, sort: sort ?? "newest" })}`
    : undefined;

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="section-eyebrow">Courses</div>
            <h1 className="section-title">Sınıflar & kurslar</h1>
            <p className="section-lead">
              Yayında olan kurslar backend&apos;den gelir (<span className="font-mono text-xs">GET /api/lessons/courses/</span>).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/classes" className="btn-solid h-10 px-4">
              Tümünü göster
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          {/* Sidebar */}
          <aside className="lg:col-span-4">
            <div className="surface p-5">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">Filter courses</div>
              <form className="mt-4 grid gap-4" action="/classes" method="get">
                <input type="hidden" name="sort" value={sort ?? "newest"} />

                <div>
                  <label htmlFor="q" className="text-xs font-semibold text-slate-600">
                    Search
                  </label>
                  <input
                    id="q"
                    name="q"
                    defaultValue={q ?? ""}
                    placeholder="Kurs adı, öğretmen, açıklama…"
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="text-xs font-semibold text-slate-600">
                    Subject
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    defaultValue={subject ?? ""}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300"
                  >
                    <option value="">All</option>
                    {subjectOptions.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="level" className="text-xs font-semibold text-slate-600">
                    Level
                  </label>
                  <select
                    id="level"
                    name="level"
                    defaultValue={level ?? ""}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300"
                  >
                    <option value="">All</option>
                    {levelOptions.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600">Price</div>
                  <div className="mt-2 grid gap-2">
                    {[
                      { id: "all", label: "All", value: "" },
                      { id: "free", label: "Free", value: "free" },
                      { id: "paid", label: "Paid", value: "paid" },
                    ].map((p) => (
                      <label key={p.id} className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 hover:bg-slate-50">
                        <input
                          type="radio"
                          name="price"
                          value={p.value}
                          defaultChecked={(price ?? "") === p.value}
                        />
                        <span className="font-semibold text-slate-900">{p.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="rating" className="text-xs font-semibold text-slate-600">
                    Rating (coming soon)
                  </label>
                  <select
                    id="rating"
                    name="rating"
                    defaultValue={rating ?? ""}
                    disabled
                    className="mt-2 h-11 w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-3 text-sm text-slate-500 outline-none"
                  >
                    <option value="">Any</option>
                    <option value="4">4.0+</option>
                    <option value="4.5">4.5+</option>
                    <option value="5">5.0</option>
                  </select>
                  <div className="mt-2 text-xs text-slate-500">
                    Rating verisi API’ye eklenince aktif olacak.
                  </div>
                </div>

                <div className="grid gap-2 sm:grid-cols-2">
                  <button type="submit" className="btn-accent justify-center">
                    Apply
                  </button>
                  <Link href="/classes" className="btn-outline justify-center">
                    Clear
                  </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600">
                  Results: <span className="font-semibold text-slate-900">{sorted.length}</span> / {courses.length}
                </div>
              </form>
            </div>

            <div className="mt-6 surface p-5">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">Featured teacher</div>
              <div className="mt-3 text-sm text-slate-600">
                {featuredTeacher ? (
                  <>
                    <div className="text-base font-extrabold text-slate-900">{featuredTeacher.label}</div>
                    <div className="mt-1 text-sm text-slate-600">
                      Courses: <span className="font-semibold text-slate-900">{featuredTeacher.count}</span>
                    </div>
                    {featuredTeacherHref ? (
                      <div className="mt-4">
                        <Link href={featuredTeacherHref} className="btn-solid h-10 px-4">
                          View courses
                        </Link>
                      </div>
                    ) : null}
                  </>
                ) : (
                  <div>Henüz gösterilecek veri yok.</div>
                )}
              </div>
            </div>
          </aside>

          {/* Content */}
          <section className="lg:col-span-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                Showing <span className="font-semibold text-slate-900">{sorted.length}</span> courses
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={sortNewestHref}
                  className={sort !== "oldest" && sort !== "rating" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}
                >
                  Newest
                </Link>
                <Link
                  href={sortOldestHref}
                  className={sort === "oldest" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}
                >
                  Oldest
                </Link>
                <Link
                  href={sortRatingHref}
                  className={sort === "rating" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}
                >
                  Overall rating
                </Link>
              </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {sorted.length === 0 ? (
                <div className="surface p-6 text-sm text-slate-600 sm:col-span-2">
                  Sonuç bulunamadı. Filtreleri temizleyip tekrar deneyebilirsin.
                </div>
              ) : (
                sorted.map((c) => (
                  <article key={c.id} className="surface overflow-hidden">
                    <div className="relative h-40 bg-slate-100">
                      {/* cover_image_url boşsa gradient placeholder */}
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      {c.cover_image_url ? (
                        <img src={c.cover_image_url} alt="" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full bg-[radial-gradient(circle_at_20%_20%,rgba(26,115,232,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,182,6,0.20),transparent_55%)]" />
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.subject.title}</div>
                        <span className="badge">{c.access_level?.toUpperCase?.() ?? "—"}</span>
                      </div>
                      <h2 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{c.title}</h2>
                      <p className="mt-2 line-clamp-3 text-sm text-slate-600">{c.description || "—"}</p>
                      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                        <div>
                          Teacher:{" "}
                          <span className="font-semibold text-slate-700">
                            {[c.teacher.first_name, c.teacher.last_name].filter(Boolean).join(" ") || c.teacher.username}
                          </span>
                        </div>
                        <Link href={`/classes/${c.id}`} className="link-primary text-xs font-semibold">
                          View →
                        </Link>
                      </div>
                    </div>
                  </article>
                ))
              )}
            </div>
          </section>
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
