import type { ReactNode } from "react";

import { DashboardRoleNav } from "@/components/dashboard/dashboard-role-nav";
import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

/** Öğrenci ödev sayfası — panel navigasyonu ile */
export default function OdevlerLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <DashboardRoleNav />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
