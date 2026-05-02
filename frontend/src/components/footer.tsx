import Link from "next/link";
import { ArrowRight, Mail, MapPin, Phone } from "lucide-react";

import { NewsletterForm } from "@/components/newsletter/newsletter-form";

const gradeLinks = [
  { label: "1. Sınıf", href: "/classes/1" },
  { label: "2. Sınıf", href: "/classes/2" },
  { label: "3. Sınıf", href: "/classes/3" },
  { label: "4. Sınıf", href: "/classes/4" },
  { label: "5. Sınıf", href: "/classes/5" },
  { label: "6. Sınıf", href: "/classes/6" },
  { label: "7. Sınıf", href: "/classes/7" },
  { label: "8. Sınıf", href: "/classes/8" },
  { label: "9. Sınıf", href: "/classes/9" },
  { label: "10. Sınıf", href: "/classes/10" },
  { label: "11. Sınıf", href: "/classes/11" },
  { label: "12. Sınıf", href: "/classes/12" },
];

export function SiteFooter() {
  return (
    <footer className="mt-12 bg-slate-950 text-white sm:mt-16">
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <div className="text-lg font-extrabold tracking-tight text-white">ÖğretmenAğı</div>
            <div className="mt-2 text-sm text-white/70">Herkesin kazandığı öğrenme ligi.</div>
            <div className="mt-6 flex flex-col gap-3 text-sm text-white/70">
              <a
                href="mailto:destek@ogretmenlerburada.com"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4 shrink-0 text-[var(--brand-blue-light)] transition-transform duration-200 group-hover:scale-105" aria-hidden />
                <span className="font-medium text-white">destek@ogretmenlerburada.com</span>
              </a>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-white/70" aria-hidden />
                <span>+90 212 000 00 00</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/70" aria-hidden />
                <span>Türkiye · İstanbul</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-sm font-bold text-white">Kurumsal</div>
            <div className="mt-4 grid gap-2 text-sm">
              <Link className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white" href="/schools">
                Okullar
                <ArrowRight className="size-3 translate-x-0 opacity-70 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" aria-hidden />
              </Link>
              <Link className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white" href="/faq">
                SSS
                <ArrowRight className="size-3 translate-x-0 opacity-70 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" aria-hidden />
              </Link>
              <Link className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white" href="/contact">
                İletişim
                <ArrowRight className="size-3 translate-x-0 opacity-70 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="text-sm font-bold text-white">Sınıflar</div>
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
              {gradeLinks.map((l) => (
                <Link
                  key={l.href}
                  className="group text-white/70 transition-colors hover:text-white inline-flex items-center gap-1"
                  href={l.href}
                >
                  {l.label}
                  <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-extrabold tracking-tight text-white">Subscribe our newsletter</div>
              <div className="mt-2 text-sm text-white/70">Duyurular ve yeni kurslardan haberdar ol.</div>
              <NewsletterForm tone="dark" className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div>Copyright © {new Date().getFullYear()} ÖğretmenAğı</div>
          <div className="flex flex-wrap gap-3">
            <Link className="text-white/60 transition hover:text-white" href="#">
              KVKK
            </Link>
            <Link className="text-white/60 transition hover:text-white" href="#">
              Kullanım Koşulları
            </Link>
            <Link className="text-white/60 transition hover:text-white" href="#">
              Gizlilik
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
