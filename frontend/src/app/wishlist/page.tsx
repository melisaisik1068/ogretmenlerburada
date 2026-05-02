import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";
import type { CoursePublic } from "@/lib/types/api";

type CourseWishlistRow = { course: CoursePublic; created_at: string };

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
type MaterialWishlistRow = { material: Material; created_at: string };

async function fetchWishlists(token: string): Promise<{ courses: CourseWishlistRow[]; materials: MaterialWishlistRow[] }> {
  const base = getApiBaseUrl();
  const headers = { Authorization: `Bearer ${token}`, Accept: "application/json" };

  const [cRes, mRes] = await Promise.all([
    fetch(`${base}/api/wishlist/courses/`, { headers, cache: "no-store" }),
    fetch(`${base}/api/wishlist/materials/`, { headers, cache: "no-store" }),
  ]);

  const courses = (cRes.ok ? await cRes.json() : []) as CourseWishlistRow[];
  const materials = (mRes.ok ? await mRes.json() : []) as MaterialWishlistRow[];
  return { courses, materials };
}

export default async function WishlistPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect("/login");

  const data = await fetchWishlists(token);

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Wishlist</div>
        <h1 className="section-title">Favoriler</h1>
        <p className="section-lead">Beğendiğin kurs ve materyalleri burada toplayabilirsin.</p>

        <div className="mt-8 grid gap-6 lg:grid-cols-12">
          <section className="lg:col-span-7">
            <div className="text-sm font-extrabold tracking-tight text-slate-900">Courses</div>
            <div className="mt-4 grid gap-3">
              {data.courses.length === 0 ? (
                <div className="surface p-6 text-sm text-slate-600">Henüz favori kurs yok.</div>
              ) : (
                data.courses.map((row) => (
                  <div key={row.course.id} className="surface p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.course.subject.title}</div>
                        <div className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">{row.course.title}</div>
                        <div className="mt-2 text-sm text-slate-600 line-clamp-2">{row.course.description || "—"}</div>
                      </div>
                      <Link href={`/classes/${row.course.id}`} className="btn-solid h-10 px-4">
                        Open
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="lg:col-span-5">
            <div className="text-sm font-extrabold tracking-tight text-slate-900">Materials</div>
            <div className="mt-4 grid gap-3">
              {data.materials.length === 0 ? (
                <div className="surface p-6 text-sm text-slate-600">Henüz favori materyal yok.</div>
              ) : (
                data.materials.map((row) => (
                  <div key={row.material.id} className="surface p-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{row.material.type}</div>
                        <div className="mt-1 text-lg font-extrabold tracking-tight text-slate-900">{row.material.title}</div>
                        <div className="mt-2 text-sm text-slate-600 line-clamp-2">{row.material.description || "—"}</div>
                      </div>
                      <Link href={`/shop/${row.material.id}`} className="btn-outline h-10 px-4">
                        Details
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

