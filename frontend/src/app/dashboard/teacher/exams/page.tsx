import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { TeacherExamsClient } from "@/components/exams/teacher-exams-client";
import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

async function requireTeacher() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect("/login?next=/dashboard/teacher/exams");
}

export default async function TeacherExamsPage() {
  await requireTeacher();
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Öğretmen</div>
        <h1 className="section-title">Deneme sınavı oluştur</h1>
        <p className="section-lead">Soru ekle, yayınla; öğrenciler /exams üzerinden girer.</p>
        <Link href="/dashboard/teacher/courses" className="btn-outline mt-4 inline-flex h-10 px-4">
          Öğretmen paneli
        </Link>
        <div className="mt-8">
          <TeacherExamsClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
