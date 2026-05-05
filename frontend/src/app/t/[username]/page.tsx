import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { getApiBaseUrl } from "@/lib/env";

type TeacherPublic = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  bio?: string;
  avatar_url?: string;
};

type CourseCard = {
  id: number;
  title: string;
  description: string;
  cover_image_url: string;
  subject: { slug: string; title: string };
  lessons_count?: number;
  total_duration_minutes?: number;
  min_price_try?: number;
  rating_avg?: number;
  rating_count?: number;
};

async function fetchTeacher(username: string): Promise<TeacherPublic | null> {
  const base = getApiBaseUrl();
  try {
    const res = await fetch(`${base}/api/accounts/teachers/by-username/${encodeURIComponent(username)}/`, {
      next: { revalidate: 120 },
      headers: { Accept: "application/json" },
    });
    if (!res.ok) return null;
    return (await res.json()) as TeacherPublic;
  } catch {
    return null;
  }
}

async function fetchTeacherCourses(username: string): Promise<CourseCard[]> {
  const base = getApiBaseUrl();
  try {
    const url = new URL(`${base}/api/lessons/courses/`);
    url.searchParams.set("teacher", username);
    url.searchParams.set("page_size", "12");
    const res = await fetch(url.toString(), { next: { revalidate: 120 }, headers: { Accept: "application/json" } });
    const data = (await res.json().catch(() => ({}))) as { results?: CourseCard[] } | CourseCard[];
    if (Array.isArray(data)) return data;
    return data.results ?? [];
  } catch {
    return [];
  }
}

export default async function TeacherSubdomainPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const u = (username ?? "").trim();
  if (!u) return notFound();

  const [teacher, courses] = await Promise.all([fetchTeacher(u), fetchTeacherCourses(u)]);
  if (!teacher) return notFound();

  const name = [teacher.first_name, teacher.last_name].filter(Boolean).join(" ").trim() || teacher.username;

  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="surface p-7 sm:p-9">
          <div className="section-eyebrow">Teacher</div>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">{name}</h1>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">{teacher.bio || "—"}</p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link href={`/dashboard/appointments?teacher=${encodeURIComponent(teacher.username)}`} className="btn-accent">
              Randevu al (canlı ders)
            </Link>
            <Link href={`/classes?teacher=${encodeURIComponent(teacher.username)}`} className="btn-outline">
              Tüm kurslar
            </Link>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-end justify-between gap-3">
            <div>
              <div className="section-eyebrow">Courses</div>
              <h2 className="section-title mt-1">Öne çıkan kurslar</h2>
            </div>
            <Link className="btn-outline h-10 px-4" href={`/classes?teacher=${encodeURIComponent(teacher.username)}`}>
              Hepsini gör
            </Link>
          </div>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((c) => (
              <Link key={c.id} href={`/classes/${c.id}`} className="surface group p-6 hover:shadow-md">
                <div className="text-xs font-semibold text-slate-500">{c.subject?.title ?? "Course"}</div>
                <div className="mt-2 text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-(--brand-navy)">
                  {c.title}
                </div>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">{c.description || "—"}</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-500">
                  {typeof c.lessons_count === "number" ? <span className="badge">{c.lessons_count} ders</span> : null}
                  {typeof c.total_duration_minutes === "number" ? <span className="badge">{c.total_duration_minutes} dk</span> : null}
                  {typeof c.min_price_try === "number" ? <span className="badge">{c.min_price_try} ₺+</span> : null}
                </div>
              </Link>
            ))}
            {!courses.length ? <div className="text-sm text-slate-600">Henüz yayınlı kurs yok.</div> : null}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

