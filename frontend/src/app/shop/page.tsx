import Link from "next/link";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";
import { WishlistButton } from "@/components/wishlist/wishlist-button";
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

async function fetchMaterials(): Promise<Material[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/marketplace/materials/`, { next: { revalidate: 120 }, headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = (await res.json()) as Material[] | { results?: Material[] };
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}

export default async function ShopPage() {
  const materials = await fetchMaterials();
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Shop</div>
        <h1 className="section-title">Materyaller</h1>
        <p className="section-lead">PDF, video ve diğer materyaller (Marketplace).</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {materials.length === 0 ? (
            <div className="surface p-6 text-sm text-slate-600 sm:col-span-2 lg:col-span-3">Henüz ürün yok.</div>
          ) : (
            materials.map((m) => (
              <article key={m.id} className="surface p-6">
                <div className="flex items-center justify-between gap-3">
                  <span className="badge">{m.type?.toUpperCase?.() ?? "—"}</span>
                  <span className="badge">{m.price_try} ₺</span>
                </div>
                <h2 className="mt-3 text-lg font-extrabold tracking-tight text-slate-900">{m.title}</h2>
                <p className="mt-2 line-clamp-3 text-sm text-slate-600">{m.description || "—"}</p>
                <div className="mt-4 text-xs text-slate-500">
                  Seller:{" "}
                  <span className="font-semibold text-slate-700">
                    {[m.seller.first_name, m.seller.last_name].filter(Boolean).join(" ") || m.seller.username}
                  </span>
                </div>
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link href={`/shop/${m.id}`} className="btn-solid h-10 px-4">
                    Details
                  </Link>
                  <WishlistButton kind="material" targetId={m.id} className="h-10" />
                </div>
              </article>
            ))
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

