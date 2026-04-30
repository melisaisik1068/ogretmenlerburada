"use client";

import Link from "next/link";

import { RatingBadge } from "@/components/reviews/course-reviews";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
import type { CoursePublic } from "@/lib/types/api";

type PageResp<T> = { count: number; next: string | null; previous: string | null; results: T[] };

export function ClassesResultsClient({
  initial,
  query,
  sort,
  pageSize,
  currentPage,
}: {
  initial: PageResp<CoursePublic>;
  query: Record<string, string | undefined>;
  sort: string;
  pageSize: number;
  currentPage: number;
}) {
  const React = require("react") as typeof import("react");
  const { useMemo, useState } = React;

  const [items, setItems] = useState<CoursePublic[]>(initial.results ?? []);
  const [page, setPage] = useState<number>(currentPage);
  const [loadingMore, setLoadingMore] = useState(false);
  const [err, setErr] = useState("");

  const total = initial.count ?? 0;
  const loaded = items.length;
  const canLoadMore = loaded < total;

  const stableQuery = useMemo(() => query, [JSON.stringify(query)]);

  async function loadMore() {
    if (loadingMore || !canLoadMore) return;
    setLoadingMore(true);
    setErr("");
    try {
      const usp = new URLSearchParams();
      for (const [k, v] of Object.entries(stableQuery)) {
        if (v == null || v === "") continue;
        usp.set(k, v);
      }
      usp.set("sort", sort);
      usp.set("page_size", String(pageSize));
      usp.set("page", String(page + 1));

      const res = await fetch(`/api/courses?${usp.toString()}`, { cache: "no-store" });
      const data = (await res.json().catch(() => ({}))) as PageResp<CoursePublic>;
      if (!res.ok) throw new Error((data as any)?.detail ?? "Load more failed.");
      const more = Array.isArray(data.results) ? data.results : [];
      setItems((prev) => [...prev, ...more]);
      setPage((p) => p + 1);
    } catch (e: any) {
      setErr(typeof e?.message === "string" ? e.message : "Load more failed.");
    } finally {
      setLoadingMore(false);
    }
  }

  return (
    <div>
      {err ? <div className="surface mb-4 border border-red-200 bg-red-50 p-4 text-sm text-red-800">{err}</div> : null}

      <div className="grid gap-4 sm:grid-cols-2">
        {items.length === 0 ? (
          <div className="surface p-6 text-sm text-slate-600 sm:col-span-2">Sonuç bulunamadı. Filtreleri temizleyip tekrar deneyebilirsin.</div>
        ) : (
          items.map((c) => (
            <article key={c.id} className="surface overflow-hidden">
              <div className="relative h-40 bg-slate-100">
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

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="text-xs text-slate-500">
          Total: <span className="font-semibold text-slate-900">{total}</span> · Loaded:{" "}
          <span className="font-semibold text-slate-900">{loaded}</span>
        </div>
        {canLoadMore ? (
          <button className="btn-accent h-10 px-5" type="button" onClick={() => void loadMore()} disabled={loadingMore}>
            {loadingMore ? "Loading…" : "Load more"}
          </button>
        ) : (
          <span className="text-xs text-slate-500">Hepsi yüklendi.</span>
        )}
      </div>
    </div>
  );
}

