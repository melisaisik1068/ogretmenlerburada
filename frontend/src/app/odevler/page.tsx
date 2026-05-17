import { redirect } from "next/navigation";

import { HomeworkStudentClient } from "@/components/homework/homework-student-client";
import { loadServerSession } from "@/lib/auth/server-session";
import { getRoleHomePath } from "@/lib/auth/roles";

export default async function OdevlerPage() {
  const { user, role } = await loadServerSession();
  if (!user) redirect("/login?next=/odevler");
  if (role !== "student") redirect(getRoleHomePath(role));

  return (
    <main className="container-page py-10 sm:py-12">
      <div className="section-eyebrow">Öğrenci</div>
      <h1 className="section-title">Ödevlerim</h1>
      <p className="section-lead">Öğretmenin tanımladığı ödevlere fotoğraf yükle.</p>
      <div className="mt-8">
        <HomeworkStudentClient />
      </div>
    </main>
  );
}
