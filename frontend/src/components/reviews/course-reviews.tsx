"use client";

import { useEffect, useMemo, useState } from "react";

type Review = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  user: { username?: string; first_name?: string; last_name?: string };
};

function Stars({ value }: { value: number }) {
  const v = Math.max(0, Math.min(5, value));
  return (
    <div className="flex items-center gap-0.5" aria-label={`Rating ${v} / 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < v ? "text-amber-500" : "text-slate-300"}>
          ★
        </span>
      ))}
    </div>
  );
}

export function CourseReviews({ courseId }: { courseId: number }) {
  const [items, setItems] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<string>("");

  const avg = useMemo(() => {
    if (!items.length) return 0;
    return items.reduce((a, b) => a + (b.rating || 0), 0) / items.length;
  }, [items]);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/course-reviews?course=${courseId}`, { cache: "no-store" });
      const data = (await res.json().catch(() => [])) as Review[];
      if (Array.isArray(data)) setItems(data);
      else setItems([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("");
    const res = await fetch("/api/reviews/course-reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ course: courseId, rating, comment: comment.trim() }),
    });
    const data = (await res.json().catch(() => ({}))) as { detail?: string };
    if (!res.ok) {
      setStatus(data.detail || "Yorum eklenemedi (giriş yapman gerekebilir).");
      return;
    }
    setComment("");
    await load();
    setStatus("Kaydedildi.");
  }

  return (
    <div className="surface p-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="text-sm font-extrabold tracking-tight text-slate-900">Reviews</div>
          <div className="mt-2 flex items-center gap-3 text-sm text-slate-600">
            <Stars value={Math.round(avg)} />
            <span>
              {items.length ? avg.toFixed(1) : "—"} ({items.length})
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="mt-6 grid gap-3">
        <div className="grid gap-2 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Rating</span>
            <select
              value={rating}
              onChange={(e) => setRating(parseInt(e.target.value, 10))}
              className="h-11 rounded-xl bg-white px-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
            >
              {[5, 4, 3, 2, 1].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="text-xs font-semibold text-slate-700">Comment</span>
            <input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="h-11 rounded-xl bg-white px-3 text-sm ring-1 ring-slate-200 outline-none focus:ring-2 focus:ring-sky-200"
              placeholder="Kısa yorum…"
            />
          </label>
        </div>
        <button className="btn-solid w-full disabled:opacity-60" disabled={!comment.trim()}>
          Submit review
        </button>
        {status ? <div className="text-xs text-slate-600">{status}</div> : null}
      </form>

      <div className="mt-6 grid gap-3">
        {loading ? (
          <div className="text-sm text-slate-600">Yükleniyor…</div>
        ) : items.length === 0 ? (
          <div className="text-sm text-slate-600">Henüz yorum yok.</div>
        ) : (
          items.map((r) => {
            const name = [r.user?.first_name, r.user?.last_name].filter(Boolean).join(" ").trim() || r.user?.username || "User";
            return (
              <div key={r.id} className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-extrabold text-slate-900">{name}</div>
                  <Stars value={r.rating} />
                </div>
                {r.comment ? <div className="mt-2 text-sm text-slate-600">{r.comment}</div> : null}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

export function RatingBadge({ ratingAvg, ratingCount }: { ratingAvg?: number; ratingCount?: number }) {
  if (!ratingCount) return <span className="badge">No reviews</span>;
  const avg = typeof ratingAvg === "number" ? ratingAvg : 0;
  return (
    <span className="badge">
      ★ {avg.toFixed(1)} ({ratingCount})
    </span>
  );
}

