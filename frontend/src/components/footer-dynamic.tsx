import dynamic from "next/dynamic";

export const SiteFooter = dynamic(() => import("./footer").then((mod) => ({ default: mod.SiteFooter })), {
  loading: () => <div className="mt-12 min-h-[220px] w-full bg-slate-950 sm:mt-16" aria-hidden />,
});
