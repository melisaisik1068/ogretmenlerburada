import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type Material = {
  id: number;
  title: string;
  description: string;
  type: string;
  file: string;
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
              <p className="mt-2 text-sm text-slate-600">Ödeme akışı daha sonra bağlanacak. Şimdilik dosya linki.</p>
              <div className="mt-5 grid gap-2">
                <a href={m.file} className="btn-accent justify-center">
                  Download
                </a>
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

