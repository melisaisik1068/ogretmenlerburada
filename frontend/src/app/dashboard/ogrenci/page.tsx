import { redirect } from "next/navigation";

import { StudentDashboard } from "@/components/dashboard/student-dashboard";
import { loadServerSession } from "@/lib/auth/server-session";
import { getRoleHomePath } from "@/lib/auth/roles";

export default async function StudentDashboardPage() {
  const { user, subscription, role } = await loadServerSession();
  if (!user) redirect("/login?next=/dashboard/ogrenci");
  if (role !== "student") redirect(getRoleHomePath(role));

  return <StudentDashboard user={user} subscription={subscription} />;
}
