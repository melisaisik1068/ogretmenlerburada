import { redirect } from "next/navigation";

import { loadServerSession } from "@/lib/auth/server-session";
import { getRoleHomePath } from "@/lib/auth/roles";

/** /dashboard → rolüne göre doğru panele yönlendir */
export default async function DashboardPage() {
  const { user, role } = await loadServerSession();
  if (!user) redirect("/login?next=/dashboard");
  redirect(getRoleHomePath(role));
}
