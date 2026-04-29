import type { ReactNode } from "react";

import { TopNav } from "@/components/nav";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-dvh text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      {children}
    </div>
  );
}
