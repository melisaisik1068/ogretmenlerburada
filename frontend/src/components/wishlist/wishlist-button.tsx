"use client";

import { useEffect, useMemo, useState } from "react";
import { Heart } from "lucide-react";

type Kind = "course" | "material";

type Props = {
  kind: Kind;
  targetId: number;
  className?: string;
};

export function WishlistButton({ kind, targetId, className = "" }: Props) {
  const endpoints = useMemo(() => {
    if (kind === "course") {
      return {
        list: "/api/wishlist/courses",
        add: "/api/wishlist/courses",
        del: `/api/wishlist/courses/${targetId}`,
        key: "course",
        idKey: "course_id",
      } as const;
    }
    return {
      list: "/api/wishlist/materials",
      add: "/api/wishlist/materials",
      del: `/api/wishlist/materials/${targetId}`,
      key: "material",
      idKey: "material_id",
    } as const;
  }, [kind, targetId]);

  const [active, setActive] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let alive = true;
    async function load() {
      try {
        const res = await fetch(endpoints.list, { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as Array<Record<string, unknown>>;
        const ids = new Set<number>();
        for (const row of data) {
          const item = row[endpoints.key] as { id?: number } | undefined;
          if (item?.id) ids.add(item.id);
        }
        if (!alive) return;
        setActive(ids.has(targetId));
      } catch {
        // ignore
      }
    }
    void load();
    return () => {
      alive = false;
    };
  }, [endpoints.key, endpoints.list, targetId]);

  async function toggle() {
    setLoading(true);
    try {
      if (!active) {
        const res = await fetch(endpoints.add, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ [endpoints.idKey]: targetId }),
        });
        if (res.ok) setActive(true);
      } else {
        const res = await fetch(endpoints.del, { method: "DELETE", headers: { Accept: "application/json" } });
        if (res.ok) setActive(false);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={() => void toggle()}
      disabled={loading}
      className={`inline-flex items-center justify-center rounded-xl border px-3 py-2 text-sm font-semibold transition ${
        active
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
      } disabled:opacity-60 ${className}`}
      title={active ? "Favorilerden çıkar" : "Favorilere ekle"}
      aria-pressed={active}
    >
      <Heart className={`h-4 w-4 ${active ? "fill-current" : ""}`} aria-hidden />
      <span className="ml-2 hidden sm:inline">{active ? "Wishlisted" : "Wishlist"}</span>
    </button>
  );
}

