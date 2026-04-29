import Link from "next/link";

import { AuthLinks } from "@/components/auth/auth-links";

const gradeGroups: Array<{ title: string; items: Array<{ label: string; href: string }> }> = [
  {
    title: "İLKOKUL",
    items: [
      { label: "1. Sınıf", href: "/classes/1" },
      { label: "2. Sınıf", href: "/classes/2" },
      { label: "3. Sınıf", href: "/classes/3" },
      { label: "4. Sınıf", href: "/classes/4" },
    ],
  },
  {
    title: "ORTAOKUL",
    items: [
      { label: "5. Sınıf", href: "/classes/5" },
      { label: "6. Sınıf", href: "/classes/6" },
      { label: "7. Sınıf", href: "/classes/7" },
      { label: "8. Sınıf (LGS)", href: "/classes/8" },
    ],
  },
  {
    title: "LİSE",
    items: [
      { label: "9. Sınıf", href: "/classes/9" },
      { label: "10. Sınıf", href: "/classes/10" },
      { label: "11. Sınıf", href: "/classes/11" },
      { label: "12. Sınıf (YKS)", href: "/classes/12" },
    ],
  },
];

export function TopNav() {
  return (
    <header className="border-b border-white/35 bg-white/55 backdrop-blur-xl supports-backdrop-filter:bg-white/45">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-slate-900 text-white">Ö</span>
            <span className="text-sm font-extrabold tracking-tight text-slate-900">ÖğretmenlerBurada</span>
          </Link>
        </div>

        <nav className="hidden items-center gap-5 text-sm md:flex">
          <MegaMenu />
          <Link className="link-muted" href="/schools">
            Okullar için
          </Link>
          <Link className="link-muted" href="/faq">
            SSS
          </Link>
          <Link className="link-muted" href="/contact">
            İletişim
          </Link>
        </nav>

        <AuthLinks />

        <div className="md:hidden">
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

function MegaMenu() {
  return (
    <details className="group relative">
      <summary className="list-none cursor-pointer text-slate-700 transition hover:text-slate-900">
        <span className="inline-flex items-center gap-2">
          Sınıflar <span className="text-slate-400 transition group-open:rotate-180">⌄</span>
        </span>
      </summary>
      <div className="absolute left-0 top-full z-50 mt-3 w-[720px] rounded-2xl border border-white/40 bg-white/85 p-5 shadow-2xl shadow-blue-500/5 backdrop-blur-xl ring-1 ring-white/25">
        <div className="grid gap-6 md:grid-cols-3">
          {gradeGroups.map((g) => (
            <div key={g.title}>
              <div className="text-xs font-bold tracking-wide text-slate-500">{g.title}</div>
              <div className="mt-3 grid gap-2">
                {g.items.map((it) => (
                  <Link
                    key={it.href}
                    href={it.href}
                    className="rounded-xl px-3 py-2 text-sm text-slate-800 transition hover:bg-slate-50"
                  >
                    {it.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <Link href="/classes/lgs" className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
            LGS
          </Link>
          <Link href="/classes/yks" className="rounded-xl bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-800">
            YKS
          </Link>
        </div>
      </div>
    </details>
  );
}

function MobileMenu() {
  return (
    <details className="group">
      <summary className="btn-outline h-10 cursor-pointer list-none px-3">
        Menü <span className="ml-2 text-slate-400 transition group-open:rotate-180">⌄</span>
      </summary>
      <div className="container-page py-4">
        <div className="grid gap-3 rounded-2xl border border-white/40 bg-white/85 p-4 shadow-lg shadow-blue-500/5 backdrop-blur-xl ring-1 ring-white/25">
          <div className="text-xs font-bold tracking-wide text-slate-500">Sınıflar</div>
          <div className="grid gap-2 sm:grid-cols-2">
            {gradeGroups.flatMap((g) => g.items).map((it) => (
              <Link key={it.href} href={it.href} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-800">
                {it.label}
              </Link>
            ))}
          </div>
          <div className="grid gap-2 border-t border-slate-100 pt-3">
            <Link className="link-muted" href="/schools">
              Okullar için
            </Link>
            <Link className="link-muted" href="/faq">
              SSS
            </Link>
            <Link className="link-muted" href="/contact">
              İletişim
            </Link>
          </div>
          <div className="mt-1 grid gap-2 sm:grid-cols-2">
            <Link className="btn-outline" href="/login">
              Giriş Yap
            </Link>
            <Link className="btn-accent" href="/signup">
              Ücretsiz Üye Ol
            </Link>
          </div>
        </div>
      </div>
    </details>
  );
}

