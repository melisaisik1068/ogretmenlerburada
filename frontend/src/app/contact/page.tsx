import { ContactForm } from "@/components/auth/contact-form";
import { SiteFooter } from "@/components/footer";
import { TopNav } from "@/components/nav";

export default function ContactPage() {
  return (
    <div className="relative min-h-dvh bg-white text-slate-900">
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 mesh-bg" />
      <TopNav />
      <main className="container-page py-12">
        <h1 className="text-2xl font-extrabold tracking-tight">İletişim</h1>
        <p className="mt-2 max-w-2xl text-sm text-slate-600">
          Mesajınız doğrudan Django&apos;daki iletişim kaydına düşer; ekibimiz admin panelinden yanıtlar.
        </p>
        <ContactForm />
      </main>
      <SiteFooter />
    </div>
  );
}
