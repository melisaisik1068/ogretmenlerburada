import type { ReactNode } from "react";

import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";

export function LegalDocPage({
  eyebrow,
  title,
  lead,
  children,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  children: ReactNode;
}) {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <div className="section-eyebrow">{eyebrow}</div>
        <h1 className="section-title">{title}</h1>
        {lead ? <p className="section-lead">{lead}</p> : null}
        <div className="mt-8 max-w-3xl space-y-4 text-sm leading-relaxed text-slate-700 [&_p]:m-0 [&_strong]:font-semibold [&_strong]:text-slate-900">
          {children}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
