import { LandingMain } from "@/components/landing/landing-main";
import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function Home() {
  return (
    <div className="relative min-h-dvh text-[var(--foreground)]">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <LandingMain />
      <SiteFooter />
    </div>
  );
}
