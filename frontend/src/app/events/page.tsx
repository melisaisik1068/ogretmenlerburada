import Image from "next/image";
import Link from "next/link";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";
import { IMG_CARD_GRID_3 } from "@/lib/image-sizes";

type EventList = {
  id: number;
  slug: string;
  title: string;
  location: string;
  starts_at: string | null;
  ends_at: string | null;
  cover_image_url: string;
};

async function fetchEvents(): Promise<EventList[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/events/events/`, { next: { revalidate: 120 }, headers: { Accept: "application/json" } });
    if (!res.ok) return [];
    const data = (await res.json()) as EventList[] | { results?: EventList[] };
    return Array.isArray(data) ? data : (data.results ?? []);
  } catch {
    return [];
  }
}

export default async function EventsPage() {
  const events = await fetchEvents();
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Events</div>
        <h1 className="section-title">Etkinlikler</h1>
        <p className="section-lead">Yaklaşan etkinlikler ve duyurular.</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.length === 0 ? (
            <div className="surface p-6 text-sm text-slate-600 sm:col-span-2 lg:col-span-3">
              Henüz yayınlanmış etkinlik yok.
            </div>
          ) : (
            events.map((e) => (
              <article key={e.slug} className="surface overflow-hidden">
                <div className="relative h-40 bg-slate-100">
                  {e.cover_image_url ? (
                    <Image src={e.cover_image_url} alt="" fill className="object-cover" sizes={IMG_CARD_GRID_3} />
                  ) : (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(26,115,232,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(255,182,6,0.20),transparent_55%)]" />
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    {e.starts_at ? new Date(e.starts_at).toLocaleString("tr-TR") : "—"}
                  </div>
                  <h2 className="mt-2 text-lg font-extrabold tracking-tight text-slate-900">{e.title}</h2>
                  <div className="mt-2 text-sm text-slate-600">{e.location || "—"}</div>
                  <div className="mt-4">
                    <Link href={`/events/${e.slug}`} className="link-primary text-sm font-semibold">
                      Details →
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

