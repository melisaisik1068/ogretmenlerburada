import Link from "next/link";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

import { TeacherPackagesClient } from "@/components/packages/teacher-packages-client";
import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

async function requireTeacher() {
  const cookieStore = await cookies();
  const token = cookieStore.get("ob_access")?.value;
  if (!token) redirect("/login?next=/dashboard/teacher/packages");
}

export default async function TeacherPackagesPage() {
  await requireTeacher();
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-10 sm:py-12">
        <div className="section-eyebrow">Kurum</div>
        <h1 className="section-title">Paket yönetimi</h1>
        <p className="section-lead">Öğrencilerine aylık abonelik paketleri tanımla.</p>
        <Link href="/dashboard/teacher/courses" className="btn-outline mt-4 inline-flex h-10 px-4">
          Öğretmen paneli
        </Link>
        <div className="mt-8">
          <TeacherPackagesClient />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
