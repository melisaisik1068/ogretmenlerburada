import { redirect } from "next/navigation";

import { ParentDashboardClient } from "@/components/parent/parent-dashboard-client";
import { loadServerSession } from "@/lib/auth/server-session";
import { getRoleHomePath } from "@/lib/auth/roles";

export default async function ParentDashboardPage() {
  const { user, role } = await loadServerSession();
  if (!user) redirect("/login?next=/dashboard/veli");
  if (role !== "parent") redirect(getRoleHomePath(role));

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ").trim() || user.username;

  return (
    <main className="container-page py-8 sm:py-12">
      <div className="section-eyebrow">Veli paneli</div>
      <h1 className="section-title">Merhaba, {name}</h1>
      <p className="section-lead">
        Çocuğunun deneme netlerini, canlı ders katılımını ve kurs ilerlemesini buradan izle.
      </p>
      <div id="bagla" className="mt-8">
        <ParentDashboardClient />
      </div>
    </main>
  );
}
