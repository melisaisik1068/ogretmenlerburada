import Link from "next/link";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type SearchResult = {
  q: string;
  courses: Array<{ id: number; title: string; snippet?: string; subject?: { slug?: string; title?: string }; teacher?: { username?: string; name?: string } }>;
  posts: Array<{ slug: string; title: string; snippet?: string }>;
  events: Array<{ slug: string; title: string; snippet?: string; location?: string }>;
  materials: Array<{ id: number; title: string; snippet?: string; type?: string; price_try?: number }>;
};

type Subject = { id: number; slug: string; title: string };

async function fetchSubjects(): Promise<Subject[]> {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  try {
    const res = await fetch(`${base}/api/lessons/subjects/?page_size=60`, { headers: { Accept: "application/json" }, next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = (await res.json()) as any;
    const list = Array.isArray(data) ? data : (data.results ?? []);
    return (list as Subject[]).slice().sort((a, b) => a.title.localeCompare(b.title, "tr"));
  } catch {
    return [];
  }
}

async function fetchSearch(params: { q: string; subject?: string; type?: string; limit?: number }): Promise<SearchResult> {
  const base = getApiBaseUrl().replace(/\/+$/, "");
  const needle = params.q.trim();
  if (!needle) return { q: "", courses: [], posts: [], events: [], materials: [] };
  try {
    const usp = new URLSearchParams({ q: needle });
    if (params.subject) usp.set("subject", params.subject);
    if (params.type) usp.set("type", params.type);
    if (typeof params.limit === "number") usp.set("limit", String(params.limit));
    const res = await fetch(`${base}/api/search/?${usp.toString()}`, { headers: { Accept: "application/json" }, next: { revalidate: 60 } });
    if (!res.ok) return { q: needle, courses: [], posts: [], events: [], materials: [] };
    return (await res.json()) as SearchResult;
  } catch {
    return { q: needle, courses: [], posts: [], events: [], materials: [] };
  }
}

function scoreTitle(title: string, q: string): number {
  const needle = q.trim().toLocaleLowerCase("tr");
  const hay = (title ?? "").toLocaleLowerCase("tr");
  if (!needle || !hay) return 0;
  if (hay === needle) return 100;
  if (hay.startsWith(needle)) return 50;
  const idx = hay.indexOf(needle);
  if (idx >= 0) return 10 - Math.min(9, idx);
  return 0;
}

function highlight(text: string, q: string): any {
  const needle = q.trim();
  if (!needle) return text;
  const re = new RegExp(`(${needle.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi");
  const parts = text.split(re);
  if (parts.length <= 1) return text;
  return parts.map((p, i) =>
    i % 2 === 1 ? (
      <mark key={i} className="rounded bg-amber-200/70 px-1">
        {p}
      </mark>
    ) : (
      <span key={i}>{p}</span>
    )
  );
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams?: Record<string, string | string[] | undefined>;
}) {
  const q = typeof searchParams?.q === "string" ? searchParams.q : "";
  const tabRaw = typeof searchParams?.tab === "string" ? searchParams.tab : "all";
  const tab = (["all", "courses", "shop", "blog", "events"] as const).includes(tabRaw as any) ? (tabRaw as any) : "all";
  const subject = typeof searchParams?.subject === "string" ? searchParams.subject : "";
  const type = typeof searchParams?.type === "string" ? searchParams.type : "";

  const [data, subjects] = await Promise.all([fetchSearch({ q, subject: subject || undefined, type: type || undefined, limit: 16 }), fetchSubjects()]);
  const hasResults = data.courses.length + data.posts.length + data.events.length + data.materials.length > 0;

  const courses = [...data.courses].sort((a, b) => scoreTitle(b.title, q) - scoreTitle(a.title, q));
  const posts = [...data.posts].sort((a, b) => scoreTitle(b.title, q) - scoreTitle(a.title, q));
  const events = [...data.events].sort((a, b) => scoreTitle(b.title, q) - scoreTitle(a.title, q));
  const materials = [...data.materials].sort((a, b) => scoreTitle(b.title, q) - scoreTitle(a.title, q));

  const counts = { courses: courses.length, shop: materials.length, blog: posts.length, events: events.length };
  const qsBase = (extra: Record<string, string>) => {
    const usp = new URLSearchParams();
    if (q) usp.set("q", q);
    if (subject) usp.set("subject", subject);
    if (type) usp.set("type", type);
    for (const [k, v] of Object.entries(extra)) usp.set(k, v);
    const s = usp.toString();
    return s ? `/search?${s}` : "/search";
  };

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Search</div>
        <h1 className="section-title">Global Search</h1>
        <p className="section-lead">Kurslar, blog, events ve shop içinde ara.</p>

        <form className="mt-6 flex flex-col gap-2 sm:flex-row" action="/search" method="get">
          <input
            name="q"
            defaultValue={q}
            placeholder="Örn: matematik, LGS, PDF, webinar…"
            className="h-11 flex-1 rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300"
          />
          <input type="hidden" name="tab" value={tab} />
          <input type="hidden" name="subject" value={subject} />
          <input type="hidden" name="type" value={type} />
          <button type="submit" className="btn-solid h-11 px-5">
            Ara
          </button>
        </form>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="surface p-4">
            <label className="text-xs font-semibold text-slate-600">Subject</label>
            <form action="/search" method="get" className="mt-2 flex gap-2">
              <input type="hidden" name="q" value={q} />
              <input type="hidden" name="tab" value={tab} />
              <input type="hidden" name="type" value={type} />
              <select name="subject" defaultValue={subject} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300">
                <option value="">All</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.slug}>
                    {s.title}
                  </option>
                ))}
              </select>
              <button className="btn-outline h-11 px-4" type="submit">
                Apply
              </button>
            </form>
          </div>
          <div className="surface p-4">
            <label className="text-xs font-semibold text-slate-600">Material type</label>
            <form action="/search" method="get" className="mt-2 flex gap-2">
              <input type="hidden" name="q" value={q} />
              <input type="hidden" name="tab" value={tab} />
              <input type="hidden" name="subject" value={subject} />
              <select name="type" defaultValue={type} className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-300">
                <option value="">All</option>
                <option value="pdf">PDF</option>
                <option value="video">Video</option>
                <option value="other">Other</option>
              </select>
              <button className="btn-outline h-11 px-4" type="submit">
                Apply
              </button>
            </form>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={qsBase({ tab: "all" })} className={tab === "all" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}>
            All
          </Link>
          <Link href={qsBase({ tab: "courses" })} className={tab === "courses" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}>
            Courses <span className="ml-1 text-xs opacity-80">({counts.courses})</span>
          </Link>
          <Link href={qsBase({ tab: "shop" })} className={tab === "shop" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}>
            Shop <span className="ml-1 text-xs opacity-80">({counts.shop})</span>
          </Link>
          <Link href={qsBase({ tab: "blog" })} className={tab === "blog" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}>
            Blog <span className="ml-1 text-xs opacity-80">({counts.blog})</span>
          </Link>
          <Link href={qsBase({ tab: "events" })} className={tab === "events" ? "badge bg-slate-900 text-white ring-1 ring-slate-900" : "badge hover:bg-slate-100"}>
            Events <span className="ml-1 text-xs opacity-80">({counts.events})</span>
          </Link>
        </div>

        {q && !hasResults ? (
          <div className="mt-8 surface p-6 text-sm text-slate-600">“{q}” için sonuç bulunamadı.</div>
        ) : null}

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className={tab === "all" || tab === "courses" ? "lg:col-span-6" : "hidden"}>
            <div className="text-sm font-extrabold tracking-tight text-slate-900">Courses</div>
            <div className="mt-3 grid gap-3">
              {courses.length === 0 ? (
                <div className="surface p-5 text-sm text-slate-600">—</div>
              ) : (
                courses.map((c) => (
                  <div key={c.id} className="surface p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{c.subject?.title ?? "Course"}</div>
                      {c.teacher?.name || c.teacher?.username ? <div className="text-xs text-slate-500">{c.teacher?.name ?? c.teacher?.username}</div> : null}
                    </div>
                    <div className="mt-1 text-base font-extrabold text-slate-900">{highlight(c.title, q)}</div>
                    {c.snippet ? <div className="mt-2 text-sm text-slate-600">{highlight(c.snippet, q)}</div> : null}
                    <div className="mt-3">
                      <Link href={`/classes/${c.id}`} className="link-primary text-sm font-semibold">
                        Open →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={tab === "all" || tab === "shop" ? "lg:col-span-6" : "hidden"}>
            <div className="text-sm font-extrabold tracking-tight text-slate-900">Shop</div>
            <div className="mt-3 grid gap-3">
              {materials.length === 0 ? (
                <div className="surface p-5 text-sm text-slate-600">—</div>
              ) : (
                materials.map((m) => (
                  <div key={m.id} className="surface p-5">
                    <div className="flex items-center justify-between gap-2">
                      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{m.type ?? "Material"}</div>
                      {typeof m.price_try === "number" ? <span className="badge">{m.price_try} ₺</span> : null}
                    </div>
                    <div className="mt-1 text-base font-extrabold text-slate-900">{highlight(m.title, q)}</div>
                    {m.snippet ? <div className="mt-2 text-sm text-slate-600">{highlight(m.snippet, q)}</div> : null}
                    <div className="mt-3">
                      <Link href={`/shop/${m.id}`} className="link-primary text-sm font-semibold">
                        Details →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={tab === "all" || tab === "blog" ? "lg:col-span-6" : "hidden"}>
            <div className="text-sm font-extrabold tracking-tight text-slate-900">Blog</div>
            <div className="mt-3 grid gap-3">
              {posts.length === 0 ? (
                <div className="surface p-5 text-sm text-slate-600">—</div>
              ) : (
                posts.map((p) => (
                  <div key={p.slug} className="surface p-5">
                    <div className="mt-1 text-base font-extrabold text-slate-900">{highlight(p.title, q)}</div>
                    {p.snippet ? <div className="mt-2 text-sm text-slate-600">{highlight(p.snippet, q)}</div> : null}
                    <div className="mt-3">
                      <Link href={`/blog/${p.slug}`} className="link-primary text-sm font-semibold">
                        Read →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className={tab === "all" || tab === "events" ? "lg:col-span-6" : "hidden"}>
            <div className="text-sm font-extrabold tracking-tight text-slate-900">Events</div>
            <div className="mt-3 grid gap-3">
              {events.length === 0 ? (
                <div className="surface p-5 text-sm text-slate-600">—</div>
              ) : (
                events.map((e) => (
                  <div key={e.slug} className="surface p-5">
                    <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{e.location ?? "Event"}</div>
                    <div className="mt-1 text-base font-extrabold text-slate-900">{highlight(e.title, q)}</div>
                    {e.snippet ? <div className="mt-2 text-sm text-slate-600">{highlight(e.snippet, q)}</div> : null}
                    <div className="mt-3">
                      <Link href={`/events/${e.slug}`} className="link-primary text-sm font-semibold">
                        Details →
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

