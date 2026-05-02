import dynamic from "next/dynamic";
import Link from "next/link";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { ClassesResultsSkeleton } from "@/components/skeletons/classes-results-skeleton";
import { getApiBaseUrl } from "@/lib/env";
import type { CoursePublic } from "@/lib/types/api";

const ClassesResultsLazy = dynamic(
  () => import("./classes-results-client").then((m) => ({ default: m.ClassesResultsClient })),
  { loading: () => <ClassesResultsSkeleton /> },
);

type PageResp<T> = { count: number; next: string | null; previous: string | null; results: T[] };
type Subject = { id: number; slug: string; title: string };
type Teacher = { id: number; username: string; first_name?: string; last_name?: string };

async function fetchSubjects(): Promise<Subject[]> {
  const base = getApiBaseUrl();
  const out: Subject[] = [];
  let next: string | null = `${base}/api/lessons/subjects/?page_size=60`;
  for (let guard = 0; guard < 10 && next; guard++) {
    try {
      const res = await fetch(next, { next: { revalidate: 60 }, headers: { Accept: "application/json" } });
      if (!res.ok) break;
      const data = (await res.json()) as PageResp<Subject> | Subject[];
      const results = Array.isArray(data) ? data : (data.results ?? []);
      for (const s of results) out.push(s);
      next = Array.isArray(data) ? null : (data.next ?? null);
    } catch {
      break;
    }
  }
  return out.sort((a, b) => a.title.localeCompare(b.title, "tr"));
}

async function fetchTeachers(): Promise<Teacher[]> {
  const base = getApiBaseUrl();
  const out: Teacher[] = [];
  let next: string | null = `${base}/api/accounts/teachers/?page_size=60`;
  for (let guard = 0; guard < 10 && next; guard++) {
    try {
      const res = await fetch(next, { next: { revalidate: 300 }, headers: { Accept: "application/json" } });
      if (!res.ok) break;
      const data = (await res.json()) as any;
      const results = Array.isArray(data) ? data : (data.results ?? []);
      for (const t of results) out.push(t);
      next = Array.isArray(data) ? null : (data.next ?? null);
    } catch {
      break;
    }
  }
  return out;
}

async function fetchCourses(params: Record<string, string | undefined>): Promise<PageResp<CoursePublic>> {
  const base = getApiBaseUrl();
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === "") continue;
    usp.set(k, v);
  }
  try {
    const res = await fetch(`${base}/api/lessons/courses/?${usp.toString()}`, {
      next: { revalidate: 60 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return { count: 0, next: null, previous: null, results: [] };
    const data = (await res.json()) as PageResp<CoursePublic>;
    return data;
  } catch {
    return { count: 0, next: null, previous: null, results: [] };
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

export default async function ClassesPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const sp = searchParams ?? {};
  const sort = getParam(sp, "sort") ?? "newest";
  const q = getParam(sp, "q");
  const subject = getParam(sp, "subject");
  const teacher = getParam(sp, "teacher");
  const level = getParam(sp, "level");
  const priceMin = getParam(sp, "price_min");
  const priceMax = getParam(sp, "price_max");
  const durationMin = getParam(sp, "duration_min");
  const durationMax = getParam(sp, "duration_max");
  const page = getParam(sp, "page") ?? "1";
  const pageSizeParam = getParam(sp, "page_size") ?? "12";

  const baseParams = { q, subject, teacher, level, price_min: priceMin, price_max: priceMax, duration_min: durationMin, duration_max: durationMax, page_size: pageSizeParam };

  const [data, subjects, teachers] = await Promise.all([fetchCourses({ ...baseParams, sort, page }), fetchSubjects(), fetchTeachers()]);
  const sorted = data.results;

  const sortNewestHref = `/classes${buildQuery({ ...baseParams, sort: "newest", page: "1" })}`;
  const sortOldestHref = `/classes${buildQuery({ ...baseParams, sort: "oldest", page: "1" })}`;
  const sortDurationHref = `/classes${buildQuery({ ...baseParams, sort: "duration_desc", page: "1" })}`;
  const sortPriceAscHref = `/classes${buildQuery({ ...baseParams, sort: "price_asc", page: "1" })}`;
  const sortPriceDescHref = `/classes${buildQuery({ ...baseParams, sort: "price_desc", page: "1" })}`;

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const pageSize = Math.max(1, Math.min(60, parseInt(pageSizeParam, 10) || 12));
  const totalPages = Math.max(1, Math.ceil((data.count || 0) / pageSize));
  const prevHref = currentPage > 1 ? `/classes${buildQuery({ ...baseParams, sort, page: String(currentPage - 1) })}` : null;
  const nextHref = currentPage < totalPages ? `/classes${buildQuery({ ...baseParams, sort, page: String(currentPage + 1) })}` : null;

  const chips: Array<{ label: string; href: string }> = [];
  const remove = (key: string) => {
    const next = { ...baseParams, sort, page: "1" } as any;
    delete next[key];
    return `/classes${buildQuery(next)}`;
  };
  if (q) chips.push({ label: `q: ${q}`, href: remove("q") });
  if (subject) chips.push({ label: `subject: ${subject}`, href: remove("subject") });
  if (teacher) chips.push({ label: `teacher: ${teacher}`, href: remove("teacher") });
  if (level) chips.push({ label: `level: ${level}`, href: remove("level") });
  if (priceMin) chips.push({ label: `min ₺${priceMin}`, href: remove("price_min") });
  if (priceMax) chips.push({ label: `max ₺${priceMax}`, href: remove("price_max") });
  if (durationMin) chips.push({ label: `min ${durationMin}m`, href: remove("duration_min") });
  if (durationMax) chips.push({ label: `max ${durationMax}m`, href: remove("duration_max") });

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
                <input type="hidden" name="sort" value={sort} />
                <input type="hidden" name="page" value="1" />

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
                    {subjects.map((s) => (
                      <option key={s.id} value={s.slug}>
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
                    <option value="free">free</option>
                    <option value="basic">basic</option>
                    <option value="pro">pro</option>
                    <option value="enterprise">enterprise</option>
                  </select>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600">Price range (TRY)</div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input name="price_min" defaultValue={priceMin ?? ""} placeholder="Min" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300" />
                    <input name="price_max" defaultValue={priceMax ?? ""} placeholder="Max" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300" />
                  </div>
                </div>

                <div>
                  <div className="text-xs font-semibold text-slate-600">Duration range (min)</div>
                  <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input name="duration_min" defaultValue={durationMin ?? ""} placeholder="Min" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300" />
                    <input name="duration_max" defaultValue={durationMax ?? ""} placeholder="Max" className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300" />
                  </div>
                </div>

                <div>
                  <label htmlFor="page_size" className="text-xs font-semibold text-slate-600">
                    Page size
                  </label>
                  <select
                    id="page_size"
                    name="page_size"
                    defaultValue={pageSizeParam}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300"
                  >
                    {[12, 24, 36, 48, 60].map((n) => (
                      <option key={n} value={String(n)}>
                        {n} / page
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="teacher" className="text-xs font-semibold text-slate-600">
                    Teacher
                  </label>
                  <select
                    id="teacher"
                    name="teacher"
                    defaultValue={teacher ?? ""}
                    className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300"
                  >
                    <option value="">All</option>
                    {teachers.map((t) => {
                      const label = [t.first_name, t.last_name].filter(Boolean).join(" ") || t.username;
                      return (
                        <option key={t.id} value={t.username}>
                          {label}
                        </option>
                      );
                    })}
                  </select>
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
                  Results: <span className="font-semibold text-slate-900">{data.count}</span> · Page {currentPage}/{totalPages}
                </div>
              </form>
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
                  className={sort === "newest" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}
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
                  href={sortDurationHref}
                  className={sort === "duration_desc" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}
                >
                  Duration
                </Link>
                <Link href={sortPriceAscHref} className={sort === "price_asc" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}>
                  Price ↑
                </Link>
                <Link href={sortPriceDescHref} className={sort === "price_desc" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}>
                  Price ↓
                </Link>
              </div>
            </div>

            {chips.length ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <Link key={c.label} href={c.href} className="badge hover:bg-slate-100">
                    {c.label} ×
                  </Link>
                ))}
              </div>
            ) : null}

            <div id="courses" className="mt-5">
              <ClassesResultsLazy
                key={JSON.stringify({ ...baseParams, sort })}
                initial={data}
                query={baseParams}
                sort={sort}
                pageSize={pageSize}
                currentPage={currentPage}
              />
            </div>

            <div className="mt-8 grid gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-500">
                  Total: <span className="font-semibold text-slate-900">{data.count}</span> · Page size:{" "}
                  <span className="font-semibold text-slate-900">{pageSize}</span>
                </div>
                <div className="flex items-center gap-2">
                  {prevHref ? (
                    <Link href={`${prevHref}#courses`} className="btn-outline h-10 px-4">
                      ← Prev
                    </Link>
                  ) : (
                    <span className="btn-outline h-10 px-4 opacity-50">← Prev</span>
                  )}
                  {nextHref ? (
                    <Link href={`${nextHref}#courses`} className="btn-outline h-10 px-4">
                      Next →
                    </Link>
                  ) : (
                    <span className="btn-outline h-10 px-4 opacity-50">Next →</span>
                  )}
                </div>
              </div>
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
