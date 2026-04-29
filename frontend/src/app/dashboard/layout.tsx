import type { ReactNode } from "react";

import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-dvh flex-col text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <div className="flex-1">{children}</div>
      <SiteFooter />
    </div>
  );
}
