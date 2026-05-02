"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Languages, Menu } from "lucide-react";
import { useState } from "react";

import { AuthLinks } from "@/components/auth/auth-links";

import { springInteract } from "./motion/bento-motion";

const gradeGroups: Array<{ title: string; items: Array<{ label: string; href: string }> }> = [
  {
    title: "İlkokul",
    items: [
      { label: "1. Sınıf", href: "/classes/1" },
      { label: "2. Sınıf", href: "/classes/2" },
      { label: "3. Sınıf", href: "/classes/3" },
      { label: "4. Sınıf", href: "/classes/4" },
    ],
  },
  {
    title: "Ortaokul",
    items: [
      { label: "5. Sınıf", href: "/classes/5" },
      { label: "6. Sınıf", href: "/classes/6" },
      { label: "7. Sınıf", href: "/classes/7" },
      { label: "8. Sınıf (LGS)", href: "/classes/8" },
    ],
  },
  {
    title: "Lise",
    items: [
      { label: "9. Sınıf", href: "/classes/9" },
      { label: "10. Sınıf", href: "/classes/10" },
      { label: "11. Sınıf", href: "/classes/11" },
      { label: "12. Sınıf (YKS)", href: "/classes/12" },
    ],
  },
];

const navLinks = [
  { label: "Ana Sayfa", href: "/" },
  { label: "Blog", href: "/blog" },
  { label: "Etkinlikler", href: "/events" },
  { label: "Mağaza", href: "/shop" },
  { label: "Ara", href: "/search" },
  { label: "İstek listesi", href: "/wishlist" },
  { label: "Okullar", href: "/schools" },
  { label: "Üyelik", href: "/upgrade" },
  { label: "SSS", href: "/faq" },
  { label: "İletişim", href: "/contact" },
];

function NavLinkMotion({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.span className="inline-flex" whileHover={{ y: -1 }} transition={springInteract}>
      <Link
        href={href}
        className="relative text-sm font-medium text-slate-600 transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--brand-blue)] after:transition-transform after:duration-200 hover:text-[var(--brand-navy)] hover:after:scale-x-100"
      >
        {children}
      </Link>
    </motion.span>
  );
}

export function TopNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/90 bg-[var(--surface)]/90 shadow-sm backdrop-blur-md">
      <TopBar />
      <div className="container-page flex h-14 items-center justify-between gap-3 sm:h-16">
        <motion.div className="flex items-center gap-3" initial={false} whileHover={{ scale: 1.01 }} transition={springInteract}>
          <Link href="/" className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-[var(--brand-navy)] to-[var(--brand-blue)] text-sm font-black text-white shadow-md">
              Ö
            </span>
            <span className="text-sm font-extrabold tracking-tight text-[var(--brand-navy)] sm:text-base">
              ÖğretmenlerBurada
            </span>
          </Link>
        </motion.div>

        <nav className="hidden items-center gap-5 lg:gap-6 lg:flex xl:gap-7">
          <NavLinkMotion href="/">Ana Sayfa</NavLinkMotion>
          <CoursesMegaDropdown />
          {navLinks.slice(1).map((n) => (
            <NavLinkMotion key={n.href} href={n.href}>
              {n.label}
            </NavLinkMotion>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <AuthLinks />
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <AuthLinks />
          <MobileMenuDrawer />
        </div>
      </div>
    </header>
  );
}

function TopBar() {
  return (
    <div className="hidden border-b border-slate-200/90 bg-[var(--brand-navy)] text-white/85 sm:block">
      <div className="container-page flex h-10 items-center justify-between text-[11px] font-medium sm:text-xs">
        <div className="flex items-center gap-4 lg:gap-6">
          <span className="text-white/80">Pzt - Cmt 08:00 – 18:00</span>
          <span className="hidden text-white/60 lg:inline">Türkiye · İstanbul</span>
          <a className="text-white transition hover:text-white" href="tel:+902120000000">
            +90 212 000 00 00
          </a>
        </div>
        <LangDropdown />
      </div>
    </div>
  );
}

function LangDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white transition hover:bg-white/15"
          aria-label="Dil seçin"
        >
          <Languages className="size-3.5" aria-hidden />
          TR
          <ChevronDown className="size-3 opacity-75" aria-hidden />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="z-50 w-44 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl outline-none ring-1 ring-slate-200/70"
          align="end"
        >
          <DropdownMenu.Item className="cursor-pointer rounded-xl px-3 py-2 text-sm text-[var(--brand-navy)] outline-none hover:bg-[var(--surface-muted)] focus:bg-[var(--surface-muted)]">
            Türkçe
          </DropdownMenu.Item>
          <DropdownMenu.Item className="cursor-pointer rounded-xl px-3 py-2 text-sm text-[var(--brand-navy)] outline-none hover:bg-[var(--surface-muted)] focus:bg-[var(--surface-muted)]">
            English
          </DropdownMenu.Item>
          <DropdownMenu.Item className="cursor-pointer rounded-xl px-3 py-2 text-sm text-[var(--brand-navy)] outline-none hover:bg-[var(--surface-muted)] focus:bg-[var(--surface-muted)]">
            Deutsch
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function CoursesMegaDropdown() {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="group inline-flex items-center gap-1.5 rounded-full px-0 py-1 text-sm font-medium text-slate-600 outline-none ring-offset-2 ring-[var(--brand-blue)] transition-colors hover:text-[var(--brand-navy)] focus-visible:ring-2">
        Kurslar
        <ChevronDown className="size-4 text-slate-400 transition-transform duration-300 group-data-[state=open]:rotate-180" />
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={10}
          align="start"
          className="z-50 w-[calc(100vw-1.25rem)] max-w-[760px] overflow-hidden rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl ring-1 ring-slate-200/70 outline-none lg:w-[760px]"
        >
          <div className="grid gap-8 md:grid-cols-3">
            {gradeGroups.map((g) => (
              <div key={g.title}>
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{g.title}</div>
                <div className="mt-3 grid gap-1">
                  {g.items.map((it) => (
                    <DropdownMenu.Item key={it.href} className="select-none rounded-xl px-0 outline-none focus:bg-transparent" asChild>
                      <Link href={it.href} className="group flex rounded-xl px-3 py-2 text-sm font-medium text-slate-800 hover:bg-[var(--surface-muted)]">
                        <span className="transition-transform duration-200 group-hover:translate-x-1">{it.label}</span>
                      </Link>
                    </DropdownMenu.Item>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-100 pt-5">
            <Link
              href="/classes/lgs"
              className="rounded-2xl bg-[var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] transition hover:bg-slate-200/80"
            >
              LGS
            </Link>
            <Link
              href="/classes/yks"
              className="rounded-2xl bg-[var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] transition hover:bg-slate-200/80"
            >
              YKS
            </Link>
            <Link
              href="/classes"
              className="ml-auto inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-blue)] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:brightness-110"
            >
              Tüm kurslar
              <span aria-hidden className="transition-transform group-hover:translate-x-1">
                →
              </span>
            </Link>
          </div>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function MobileMenuDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-3 text-sm font-semibold text-[var(--brand-navy)] shadow-sm"
      >
        <Menu className="size-4" aria-hidden />
        Menü
      </motion.button>
      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="Menüyü kapat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-slate-900/35 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <motion.div
              id="mobile-nav"
              role="dialog"
              aria-modal
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-3 right-3 top-[4.75rem] z-50 max-h-[min(80vh,calc(100dvh-5.5rem))] overflow-auto rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xl"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Kurslar</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {gradeGroups.map((g) => (
                  <div key={g.title}>
                    <div className="text-xs font-bold text-[var(--brand-navy)]">{g.title}</div>
                    <div className="mt-2 grid gap-2">
                      {g.items.map((it) => (
                        <motion.div key={it.href} whileHover={{ x: 3 }} transition={springInteract}>
                          <Link href={it.href} onClick={() => setOpen(false)} className="block rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium">
                            {it.label}
                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 border-t border-slate-100 pt-5">
                {navLinks.map((n) => (
                  <motion.div key={n.href} whileHover={{ x: 3 }} transition={springInteract}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-1 py-2 text-sm font-medium text-slate-700 hover:bg-[var(--surface-muted)]"
                    >
                      {n.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <Link href="/login" className="btn-outline h-11 justify-center" onClick={() => setOpen(false)}>
                  Giriş Yap
                </Link>
                <Link href="/signup" className="btn-accent h-11 justify-center" onClick={() => setOpen(false)}>
                  Ücretsiz Üye Ol
                </Link>
              </div>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
