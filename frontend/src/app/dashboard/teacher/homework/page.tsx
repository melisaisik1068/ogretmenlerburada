import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { TeacherHomeworkClient } from "@/components/homework/teacher-homework-client";
import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

async function requireTeacher() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect("/login?next=/dashboard/teacher/homework");
}

export default async function TeacherHomeworkPage() {
  await requireTeacher();
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Öğretmen</div>
        <h1 className="section-title">Ödev yönetimi</h1>
        <p className="section-lead">Ödev tanımla, öğrenci fotoğraflarını incele ve onayla.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href="/dashboard/teacher/courses" className="btn-outline h-10 px-4">
            Öğretmen paneli
          </Link>
        </div>
        <div className="mt-8">
          <TeacherHomeworkClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
