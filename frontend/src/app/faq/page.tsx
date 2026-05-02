import { FaqAccordion } from "@/components/faq/faq-accordion";
import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function FaqPage() {
  return (
    <div className="relative min-h-dvh text-[var(--brand-navy)]">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12 sm:py-16">
        <div className="section-eyebrow text-[var(--brand-blue)]">SSS</div>
        <h1 className="section-title text-[var(--brand-navy)]">Sıkça sorulan sorular</h1>
        <p className="section-lead mt-3 max-w-2xl font-medium">
          Shadcn / Radix tabanlı accordion ile akordeon oturması ve sekme hissiyatı daha akıcı hale gelir.
        </p>
        <div className="mt-10">
          <FaqAccordion />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
