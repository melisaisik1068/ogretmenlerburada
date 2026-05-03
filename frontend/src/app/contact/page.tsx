import { ContactForm } from "@/components/auth/contact-form";
import { SiteFooter } from "@/components/footer-dynamic";
import { TopNav } from "@/components/nav";
import { whatsAppPurchaseHref } from "@/lib/whatsapp-purchase";

export default function ContactPage() {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <div className="section-eyebrow">Contact</div>
        <h1 className="section-title">İletişim</h1>
        <p className="section-lead">
          Mesajınız doğrudan Django&apos;daki iletişim kaydına düşer; ekibimiz admin panelinden yanıtlar.
        </p>
        <p className="mt-4 text-sm text-slate-600">
          <a
            href={whatsAppPurchaseHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#20bd5a]"
          >
            Yazılım satın almak için WhatsApp (0530 766 29 75)
          </a>
        </p>
        <div className="mt-8">
          <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
