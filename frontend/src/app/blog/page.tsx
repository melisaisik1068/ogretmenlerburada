import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";
import { IMG_CARD_GRID_3 } from "@/lib/image-sizes";

type BlogPostList = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  cover_image_url: string;
  published_at: string | null;
};

async function fetchPosts(): Promise<BlogPostList[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/blog/posts/`, { next: { revalidate: 120 }, headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = (await res.json()) as BlogPostList[] | { results?: BlogPostList[] };
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}

export default async function BlogPage() {
  const posts = await fetchPosts();
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Blog</div>
        <h1 className="section-title">Yazılar</h1>
        <p className="section-lead">Duyurular, rehberler ve yeni içerikler.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.length === 0 ? (
            <div className="surface p-6 text-sm text-slate-600 sm:col-span-2 lg:col-span-3">
              Henüz yayınlanmış blog yazısı yok.
            </div>
          ) : (
            posts.map((p) => (
              <article key={p.slug} className="surface overflow-hidden">
                <div className="relative h-40 bg-slate-100">
                  {p.cover_image_url ? (
                    <Image src={p.cover_image_url} alt="" fill className="object-cover" sizes={IMG_CARD_GRID_3} />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(26,115,232,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,182,6,0.20),transparent_55%)]" />
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {p.published_at ? new Date(p.published_at).toLocaleDateString("tr-TR") : "—"}
                  </div>
                  <h2 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{p.title}</h2>
                  <p className="mt-2 line-clamp-3 text-sm text-slate-600">{p.excerpt || "—"}</p>
                  <div className="mt-4">
                    <Link href={`/blog/${p.slug}`} className="link-primary text-sm font-semibold">
                      Oku →
                    </Link>
                  </div>
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

