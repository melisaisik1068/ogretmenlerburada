import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

async function requireAuth(nextPath: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
}

export default async function OrdersPage() {
  await requireAuth("/dashboard/orders");
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Shop</div>
        <h1 className="section-title">My orders</h1>
        <p className="section-lead">Satın aldıkların ve sipariş geçmişin.</p>

        <div className="mt-6 flex flex-wrap gap-2">
          <Link href="/dashboard" className="btn-outline h-10 px-4">
            ← Dashboard
          </Link>
          <Link href="/shop" className="btn-solid h-10 px-4">
            Shop
          </Link>
        </div>

        <div className="mt-8">
          <OrdersClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

type OrderRow = {
  id: number;
  status: string;
  total_try: number;
  provider: string;
  created_at: string;
  items: Array<{ unit_price_try: number; material: { id: number; title: string; type?: string; price_try?: number } }>;
};

function OrdersClient() {
  "use client";
  const React = require("react") as typeof import("react");
  const { useEffect, useState } = React;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rows, setRows] = useState<OrderRow[]>([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);

  async function load(p: number) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/orders?page=${p}&page_size=12`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(typeof (data as any).detail === "string" ? (data as any).detail : "Yüklenemedi.");
        return;
      }
      setRows((data as any).results ?? []);
      setCount((data as any).count ?? 0);
      setPage(p);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load(1);
  }, []);

  const totalPages = Math.max(1, Math.ceil((count || 0) / 12));

  if (loading) return <div className="surface p-6 text-sm text-slate-600">Loading…</div>;
  if (error) return <div className="surface p-6 text-sm text-red-700">Error: {error}</div>;

  return (
    <div className="grid gap-4">
      {rows.length === 0 ? (
        <div className="surface p-6 text-sm text-slate-600">Henüz sipariş yok.</div>
      ) : (
        rows.map((o) => (
          <div key={o.id} className="surface p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                  #{o.id} · {o.provider}
                </div>
                <div className="mt-1 text-base font-extrabold text-slate-900">
                  {o.status.toUpperCase()} · {o.total_try} ₺
                </div>
                <div className="mt-2 text-xs text-slate-500">{new Date(o.created_at).toLocaleString("tr-TR")}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Link href="/shop" className="btn-outline h-10 px-4">
                  Shop
                </Link>
              </div>
            </div>
            <div className="mt-4 grid gap-2">
              {o.items.map((it) => (
                <div key={it.material.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                  <div className="truncate">
                    <span className="font-semibold text-slate-900">{it.material.title}</span>{" "}
                    <span className="text-xs text-slate-500">({it.material.type ?? "material"})</span>
                  </div>
                  <Link className="link-primary text-xs font-semibold" href={`/shop/${it.material.id}`}>
                    Open →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Page {page}/{totalPages} · Total {count}
        </div>
        <div className="flex items-center gap-2">
          <button className="btn-outline h-10 px-4" type="button" disabled={page <= 1} onClick={() => void load(page - 1)}>
            ← Prev
          </button>
          <button className="btn-outline h-10 px-4" type="button" disabled={page >= totalPages} onClick={() => void load(page + 1)}>
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

