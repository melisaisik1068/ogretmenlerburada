import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";

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
    <footer className="mt-12 border-t border-white/30 bg-white/55 backdrop-blur-xl sm:mt-16">
      <div className="container-page py-10 sm:py-12">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-4">
            <div className="text-lg font-extrabold tracking-tight text-slate-900">ÖğretmenlerBurada</div>
            <div className="mt-2 text-sm text-slate-600">Herkesin kazandığı öğrenme ligi.</div>
            <div className="mt-5 flex flex-col gap-3 text-sm text-slate-600">
              <a
                href="mailto:destek@ogretmenlerburada.com"
                className="flex items-center gap-3 rounded-2xl border border-white/40 bg-white/45 px-3 py-2 transition hover:border-blue-200/60 hover:bg-white/70"
              >
                <Mail className="h-4 w-4 shrink-0 text-blue-600" aria-hidden />
                <span className="font-medium text-slate-900">destek@ogretmenlerburada.com</span>
              </a>
              <div className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/45 px-3 py-2">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden />
                <span>Kurumsal iletişim hatları · önümüzdeki dönemde aktif</span>
              </div>
              <div className="flex items-start gap-3 rounded-2xl border border-white/40 bg-white/45 px-3 py-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-indigo-600" aria-hidden />
                <span>Türkiye · İstanbul merkezli ekip</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-sm font-bold text-slate-900">Kurumsal</div>
            <div className="mt-3 grid gap-2 text-sm">
              <Link className="link-muted" href="/schools">
                Okullar için
              </Link>
              <Link className="link-muted" href="/faq">
                Sıkça Sorulan Sorular
              </Link>
              <Link className="link-muted" href="/contact">
                İletişim
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="text-sm font-bold text-slate-900">Sınıflar</div>
            <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
              {gradeLinks.map((l) => (
                <Link key={l.href} className="link-muted" href={l.href}>
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/25 pt-6 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <div>Copyright © {new Date().getFullYear()} ÖğretmenlerBurada</div>
          <div className="flex flex-wrap gap-3">
            <Link className="link-muted" href="#">
              KVKK
            </Link>
            <Link className="link-muted" href="#">
              Kullanım Koşulları
            </Link>
            <Link className="link-muted" href="#">
              Gizlilik
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
