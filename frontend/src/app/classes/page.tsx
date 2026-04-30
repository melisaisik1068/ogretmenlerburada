import Link from "next/link";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";
import { RatingBadge } from "@/components/reviews/course-reviews";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import { getApiBaseUrl } from "@/lib/env";
import type { CoursePublic } from "@/lib/types/api";

type PageResp<T> = { count: number; next: string | null; previous: string | null; results: T[] };
type Subject = { id: number; slug: string; title: string };

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

  const [data, subjects] = await Promise.all([fetchCourses({ ...baseParams, sort, page }), fetchSubjects()]);
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

  const pageWindow = 2;
  const startPage = Math.max(1, currentPage - pageWindow);
  const endPage = Math.min(totalPages, currentPage + pageWindow);
  const pageLinks = Array.from({ length: Math.max(0, endPage - startPage + 1) }, (_, i) => startPage + i);

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
                    Teacher (username or id)
                  </label>
                  <input id="teacher" name="teacher" defaultValue={teacher ?? ""} className="mt-2 h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300" />
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

            <div id="courses" className="mt-5 grid gap-4 sm:grid-cols-2">
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
                        <div className="flex flex-wrap items-center gap-2">
                          <RatingBadge ratingAvg={c.rating_avg} ratingCount={c.rating_count} />
                          <span className="badge">{c.access_level?.toUpperCase?.() ?? "—"}</span>
                        </div>
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
                    <div className="flex items-center gap-2">
                      <WishlistButton kind="course" targetId={c.id} className="h-9 py-1.5" />
                      <Link href={`/classes/${c.id}`} className="link-primary text-xs font-semibold">
                        View →
                      </Link>
                    </div>
                      </div>
                    </div>
                  </article>
                ))
              )}
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

              <div className="flex flex-wrap items-center gap-2">
                {startPage > 1 ? (
                  <>
                    <Link href={`/classes${buildQuery({ ...baseParams, sort, page: "1" })}#courses`} className="badge hover:bg-slate-100">
                      1
                    </Link>
                    <span className="text-xs text-slate-400">…</span>
                  </>
                ) : null}
                {pageLinks.map((p) => {
                  const href = `/classes${buildQuery({ ...baseParams, sort, page: String(p) })}#courses`;
                  const cls = p === currentPage ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100";
                  return (
                    <Link key={p} href={href} className={cls}>
                      {p}
                    </Link>
                  );
                })}
                {endPage < totalPages ? (
                  <>
                    <span className="text-xs text-slate-400">…</span>
                    <Link href={`/classes${buildQuery({ ...baseParams, sort, page: String(totalPages) })}#courses`} className="badge hover:bg-slate-100">
                      {totalPages}
                    </Link>
                  </>
                ) : null}
              </div>

              {nextHref ? (
                <div>
                  <Link href={`${nextHref}#courses`} className="btn-accent w-full justify-center">
                    Load more
                  </Link>
                </div>
              ) : null}
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
