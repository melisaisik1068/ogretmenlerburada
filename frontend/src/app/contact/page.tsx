import { ContactForm } from "@/components/auth/contact-form";
import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

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
        <div className="mt-8">
          <ContactForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
