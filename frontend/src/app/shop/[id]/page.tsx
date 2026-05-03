import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type Material = {
  id: number;
  title: string;
  description: string;
  type: string;
  file?: string;
  can_download?: boolean;
  price_try: number;
  created_at: string;
  seller: { id: number; username: string; first_name: string; last_name: string };
};

async function fetchMaterial(id: string): Promise<Material | null> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/marketplace/materials/${id}/`, { next: { revalidate: 120 }, headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as Material;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  if (!id) return { title: "Materyal | ÖğretmenAğı" };
  const m = await fetchMaterial(id);
  if (!m) return { title: "Materyal | ÖğretmenAğı", robots: { index: false, follow: true } };
  const title = `${m.title} | Mağaza | ÖğretmenAğı`;
  const rawDesc = (m.description ?? "").replace(/\s+/g, " ").trim();
  const description =
    rawDesc.length > 155 ? `${rawDesc.slice(0, 152)}…` : rawDesc || `${m.title} — dijital materyal (${m.type}).`;
  return {
    title,
    description,
    openGraph: { title, description, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function ShopDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const m = await fetchMaterial(id);
  if (!m) return notFound();

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="section-eyebrow">Shop</div>
          <Link href="/shop" className="btn-outline h-10 px-4">
            Tüm materyaller
          </Link>
        </div>

        <div className="mt-4 grid gap-6 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{m.title}</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">{m.description || "—"}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <span className="badge">{m.type?.toUpperCase?.() ?? "—"}</span>
              <span className="badge">{m.price_try} ₺</span>
              <span className="badge">
                Seller: {[m.seller.first_name, m.seller.last_name].filter(Boolean).join(" ") || m.seller.username}
              </span>
            </div>
          </div>
          <div className="lg:col-span-5">
            <div className="surface p-6">
              <div className="text-sm font-extrabold tracking-tight text-slate-900">Purchase</div>
              <p className="mt-2 text-sm text-slate-600">Satın aldıktan sonra indirme açılır.</p>
              <p className="mt-2 text-xs leading-relaxed text-slate-500">
                <strong>Stripe</strong>: uluslararası kart. <strong>İyzico</strong>: yerel kart (CheckoutForm); aynı ürün ikisi için de geçerlidir,
                doğrulanan ödemede erişiminiz tanımlanır.
              </p>
              <div className="mt-5 grid gap-2">
                <PurchaseActions materialId={m.id} priceTry={m.price_try} />
                <Link href="/contact" className="btn-outline justify-center">
                  Enquiry
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function PurchaseActions({ materialId, priceTry }: { materialId: number; priceTry: number }) {
  "use client";
  const React = require("react") as typeof import("react");
  const { useEffect, useState } = React;
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<"" | "stripe" | "iyzico">("");
  const [msg, setMsg] = useState("");
  const [canDownload, setCanDownload] = useState<boolean>(false);
  const [authed, setAuthed] = useState<boolean>(true);

  async function load() {
    setLoading(true);
    setMsg("");
    try {
      const res = await fetch(`/api/shop/materials/${materialId}/status`, { cache: "no-store" });
      const data = await res.json().catch(() => ({}));
      if (res.status === 401) {
        setAuthed(false);
        setCanDownload(false);
        return;
      }
      if (!res.ok) {
        setMsg(typeof (data as any).detail === "string" ? (data as any).detail : "Durum alınamadı.");
        return;
      }
      setAuthed(true);
      setCanDownload(!!(data as any).can_download);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materialId]);

  async function buy() {
    setBusy("stripe");
    setMsg("");
    try {
      const res = await fetch("/api/shop/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ material_id: materialId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          setAuthed(false);
          setMsg("Giriş yapmalısın.");
          return;
        }
        setMsg(typeof (data as any).detail === "string" ? (data as any).detail : "Checkout başlatılamadı.");
        return;
      }
      if ((data as any).already_owned) {
        setCanDownload(true);
        setMsg("Zaten satın alınmış.");
        return;
      }
      if ((data as any).free) {
        setCanDownload(true);
        setMsg("Ücretsiz — erişim verildi.");
        return;
      }
      const url = (data as any).checkout_url as string | undefined;
      if (!url) {
        setMsg("Checkout URL alınamadı.");
        return;
      }
      window.location.href = url;
    } finally {
      setBusy("");
    }
  }

  async function buyIyzico() {
    setBusy("iyzico");
    setMsg("");
    try {
      const res = await fetch("/api/shop/checkout-iyzico", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ material_id: materialId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (res.status === 401) {
          setAuthed(false);
          setMsg("Giriş yapmalısın.");
          return;
        }
        setMsg(typeof (data as any).detail === "string" ? (data as any).detail : "İyzico başlatılamadı.");
        return;
      }
      if ((data as any).already_owned) {
        setCanDownload(true);
        setMsg("Zaten satın alınmış.");
        return;
      }
      if ((data as any).free) {
        setCanDownload(true);
        setMsg("Ücretsiz — erişim verildi.");
        return;
      }
      const url = (data as any).payment_page_url as string | undefined;
      if (!url) {
        setMsg("Ödeme sayfası alınamadı.");
        return;
      }
      window.location.href = url;
    } finally {
      setBusy("");
    }
  }

  async function download() {
    setBusy("stripe");
    setMsg("");
    try {
      const res = await fetch(`/api/shop/materials/${materialId}/download`, { cache: "no-store" });
      const ct = res.headers.get("content-type") || "application/octet-stream";
      if (res.status === 401) {
        setAuthed(false);
        setMsg("Giriş yapmalısın.");
        return;
      }
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setMsg(typeof (data as any).detail === "string" ? (data as any).detail : "İndirilemedi.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(new Blob([blob], { type: ct }));
      const a = document.createElement("a");
      a.href = url;
      a.download = `material-${materialId}`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } finally {
      setBusy("");
    }
  }

  return (
    <div className="grid gap-2">
      {msg ? <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">{msg}</div> : null}
      {loading ? (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">Loading…</div>
      ) : !authed ? (
        <Link className="btn-solid justify-center" href={`/login?next=${encodeURIComponent(`/shop/${materialId}`)}`}>
          Sign in to purchase
        </Link>
      ) : canDownload ? (
        <button className="btn-accent justify-center" type="button" onClick={() => void download()} disabled={busy !== ""}>
          {busy === "stripe" ? "İndiriliyor…" : "Download"}
        </button>
      ) : priceTry > 0 ? (
        <div className="grid gap-2">
          <button
            className="btn-solid justify-center"
            type="button"
            onClick={() => void buy()}
            disabled={busy !== ""}
          >
            {busy === "stripe" ? "Yönlendiriliyor…" : `Buy (Stripe) — ${priceTry} ₺`}
          </button>
          <button
            className="btn-outline justify-center"
            type="button"
            onClick={() => void buyIyzico()}
            disabled={busy !== ""}
          >
            {busy === "iyzico" ? "Yönlendiriliyor…" : `Öde (İyzico) — ${priceTry} ₺`}
          </button>
        </div>
      ) : (
        <button className="btn-solid justify-center" type="button" onClick={() => void buy()} disabled={busy !== ""}>
          {busy === "stripe" ? "Yönlendiriliyor…" : "Get free access"}
        </button>
      )}
    </div>
  );
}

