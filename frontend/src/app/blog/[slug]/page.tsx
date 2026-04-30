import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type BlogPostDetail = {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  cover_image_url: string;
  published_at: string | null;
};

async function fetchPost(slug: string): Promise<BlogPostDetail | null> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/blog/posts/${slug}/`, { next: { revalidate: 120 }, headers: { Accept: "application/json" } });
    if (!res.ok) return null;
    return (await res.json()) as BlogPostDetail;
  } catch {
    return null;
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) return notFound();

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="section-eyebrow">Blog</div>
          <Link href="/blog" className="btn-outline h-10 px-4">
            Tüm yazılar
          </Link>
        </div>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">{post.title}</h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">{post.excerpt}</p>

        <div className="mt-6 surface overflow-hidden">
          <div className="relative h-56 bg-slate-100 sm:h-72">
            {post.cover_image_url ? (
              <Image src={post.cover_image_url} alt="" fill className="object-cover" sizes="100vw" />
            ) : (
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(26,115,232,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,182,6,0.20),transparent_55%)]" />
            )}
          </div>
          <div className="p-6 sm:p-8">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {post.published_at ? new Date(post.published_at).toLocaleString("tr-TR") : "—"}
            </div>
            <div className="mt-5 max-w-none space-y-4 text-sm leading-7 text-slate-700">
              {/* content markdown ise sonra renderer eklenebilir; şimdilik plain text */}
              {post.content ? post.content.split("\n").map((line, idx) => <p key={idx}>{line}</p>) : <p>—</p>}
            </div>
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

