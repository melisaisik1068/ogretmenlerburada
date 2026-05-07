"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { ChevronDown, Languages, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import { useMemo, useState } from "react";

import { AuthLinks } from "@/components/auth/auth-links";
import { useI18n } from "@/contexts/locale-context";
import { useNavScrollHide } from "@/hooks/use-nav-scroll-hide";
import { buildGradeGroups, type GradeGroup } from "@/i18n/nav-builders";

import { springInteract, springReveal } from "./motion/bento-motion";

const navListVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05, delayChildren: 0.12 },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, y: -14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: springReveal,
  },
};

type NavItem = { label: string; href: string };

function buildNavLinks(t: (path: string) => string): NavItem[] {
  return [
    { label: t("nav.home"), href: "/" },
    { label: t("nav.blog"), href: "/blog" },
    { label: t("nav.events"), href: "/events" },
    { label: t("nav.shop"), href: "/shop" },
    { label: t("nav.search"), href: "/search" },
    { label: t("nav.wishlist"), href: "/wishlist" },
    { label: t("nav.schools"), href: "/schools" },
    { label: t("nav.upgrade"), href: "/upgrade" },
    { label: t("nav.faq"), href: "/faq" },
    { label: t("nav.contact"), href: "/contact" },
  ];
}

function NavLinkMotion({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <m.span className="inline-flex" whileHover={{ y: -1 }} transition={springInteract}>
      <Link
        href={href}
        className="relative text-sm font-medium text-slate-600 transition-colors duration-200 after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-[var(--brand-blue)] after:transition-transform after:duration-200 hover:text-[var(--brand-navy)] hover:after:scale-x-100"
      >
        {children}
      </Link>
    </m.span>
  );
}

export function TopNav() {
  const { t } = useI18n();
  const gradeGroups = useMemo(() => buildGradeGroups(t), [t]);
  const navLinks = useMemo(() => buildNavLinks(t), [t]);
  const brand = t("nav.brand");
  const [brandPrimary, ...brandRest] = brand.split(" ");
  const brandSecondary = brandRest.join(" ");

  const navHidden = useNavScrollHide();
  const pathname = usePathname();
  const spacerForUnderlap = pathname !== "/";
  const reduceNav = !!useReducedMotion();
  const listVars = reduceNav ? { hidden: {}, visible: { transition: {} } } : navListVariants;
  const itemVars = reduceNav
    ? {
        hidden: { opacity: 1, y: 0 },
        visible: { opacity: 1, y: 0 },
      }
    : navItemVariants;

  return (
    <>
      <m.header
        className="fixed inset-x-0 top-0 z-50 will-change-transform"
        initial={false}
        animate={{ y: navHidden ? "-100%" : 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
      >
        <TopBar />
        <div className="relative border-b border-white/25 bg-linear-to-r from-white/35 via-white/20 to-white/30 shadow-[0_8px_32px_-10px_rgba(124,58,237,0.22)] backdrop-blur-xl">
          <div
            className="pointer-events-none absolute inset-x-0 top-9 h-[calc(100%-2.25rem)] bg-linear-to-r from-[#ff3b95]/55 via-[#a855f7]/40 to-[#7c3aed]/35 opacity-65 sm:top-10 sm:h-[calc(100%-2.5rem)]"
            aria-hidden
          />
          <m.div
            className="container-page relative flex h-14 items-center justify-between gap-3 sm:h-16"
            variants={listVars}
            initial={reduceNav ? "visible" : "hidden"}
            animate="visible"
          >
            <m.div className="flex items-center gap-2" variants={itemVars} whileHover={{ scale: 1.01 }} transition={springInteract}>
              <Link href="/" className="flex items-center gap-2">
                <Image
                  src="/logo.png"
                  alt="Öğretmenler Burada"
                  width={64}
                  height={64}
                  priority
                  className="h-10 w-10 object-contain sm:h-11 sm:w-11"
                />
                <span className="leading-none">
                  <span className="block text-[17px] font-extrabold tracking-tight text-[#ff3b95] sm:text-lg">
                    {brandPrimary}
                  </span>
                  <span className="block text-[17px] font-extrabold tracking-tight text-[var(--brand-navy)] sm:text-lg">
                    {brandSecondary}
                  </span>
                </span>
              </Link>
            </m.div>

            <nav className="hidden items-center gap-5 lg:gap-6 lg:flex xl:gap-7">
              <m.span variants={itemVars}>
                <NavLinkMotion href="/">{navLinks[0]?.label}</NavLinkMotion>
              </m.span>
              <m.span variants={itemVars}>
                <CoursesMegaDropdown gradeGroups={gradeGroups} />
              </m.span>
              {navLinks.slice(1).map((n) => (
                <m.span key={n.href} variants={itemVars}>
                  <NavLinkMotion href={n.href}>{n.label}</NavLinkMotion>
                </m.span>
              ))}
            </nav>

            <m.div className="hidden items-center gap-3 lg:flex" variants={itemVars}>
              <AuthLinks />
            </m.div>

            <m.div className="flex items-center gap-2 lg:hidden" variants={itemVars}>
              <AuthLinks />
              <MobileMenuDrawer gradeGroups={gradeGroups} navLinks={navLinks} />
            </m.div>
          </m.div>
        </div>
      </m.header>
      {spacerForUnderlap ? <div className="h-14 shrink-0 sm:h-[6.5rem]" aria-hidden /> : null}
    </>
  );
}

function TopBar() {
  const { t } = useI18n();
  return (
    <div className="border-b border-white/10 bg-linear-to-r from-[#d81b78] via-[#ff3b95] to-[#7c3aed] text-white/90 shadow-[0_4px_24px_rgba(255,59,149,0.20)] backdrop-blur-md">
      <div className="container-page flex h-9 items-center justify-between text-[11px] font-medium sm:h-10 sm:text-xs">
        <div className="flex items-center gap-4 lg:gap-6">
          <span className="text-white/80">{t("topbar.hours")}</span>
          <span className="hidden text-white/60 lg:inline">{t("topbar.region")}</span>
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
  const { setLocale, t, locale } = useI18n();
  const flag = locale.toUpperCase();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white transition hover:bg-white/15"
          aria-label={t("nav.langAria")}
        >
          <Languages className="size-3.5" aria-hidden />
          {flag}
          <ChevronDown className="size-3 opacity-75" aria-hidden />
        </button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={8}
          className="z-50 w-44 overflow-hidden rounded-2xl border border-slate-200/90 bg-white p-1.5 shadow-xl outline-none ring-1 ring-slate-200/70"
          align="end"
        >
          <DropdownMenu.Item
            className="cursor-pointer rounded-xl px-3 py-2 text-sm text-[var(--brand-navy)] outline-none hover:bg-[var(--surface-muted)] focus:bg-[var(--surface-muted)]"
            onSelect={() => setLocale("tr")}
          >
            {t("nav.langTr")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer rounded-xl px-3 py-2 text-sm text-[var(--brand-navy)] outline-none hover:bg-[var(--surface-muted)] focus:bg-[var(--surface-muted)]"
            onSelect={() => setLocale("en")}
          >
            {t("nav.langEn")}
          </DropdownMenu.Item>
          <DropdownMenu.Item
            className="cursor-pointer rounded-xl px-3 py-2 text-sm text-[var(--brand-navy)] outline-none hover:bg-[var(--surface-muted)] focus:bg-[var(--surface-muted)]"
            onSelect={() => setLocale("de")}
          >
            {t("nav.langDe")}
          </DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}

function CoursesMegaDropdown({ gradeGroups }: { gradeGroups: GradeGroup[] }) {
  const { t } = useI18n();
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="group inline-flex items-center gap-1.5 rounded-full px-0 py-1 text-sm font-medium text-slate-600 outline-none ring-offset-2 ring-[var(--brand-blue)] transition-colors hover:text-[var(--brand-navy)] focus-visible:ring-2">
        {t("nav.courses")}
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
              {t("nav.lgs")}
            </Link>
            <Link
              href="/classes/yks"
              className="rounded-2xl bg-[var(--surface-muted)] px-3 py-2 text-xs font-semibold text-[var(--brand-navy)] transition hover:bg-slate-200/80"
            >
              {t("nav.yks")}
            </Link>
            <Link
              href="/classes"
              className="group ml-auto inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-[var(--brand-navy)] to-[var(--brand-blue)] px-4 py-2 text-xs font-bold text-white shadow-md transition hover:brightness-110"
            >
              {t("nav.allCourses")}
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

function MobileMenuDrawer({ gradeGroups, navLinks }: { gradeGroups: GradeGroup[]; navLinks: NavItem[] }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      <m.button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        whileTap={{ scale: 0.97 }}
        onClick={() => setOpen((o) => !o)}
        className="inline-flex h-10 items-center gap-2 rounded-2xl border border-slate-200/90 bg-white px-3 text-sm font-semibold text-[var(--brand-navy)] shadow-sm"
      >
        <Menu className="size-4" aria-hidden />
        {t("nav.mobileMenu")}
      </m.button>
      <AnimatePresence>
        {open ? (
          <>
            <m.button
              type="button"
              aria-label={t("nav.closeMenu")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-slate-900/35 backdrop-blur-[2px]"
              onClick={() => setOpen(false)}
            />
            <m.div
              id="mobile-nav"
              role="dialog"
              aria-modal
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
              className="fixed left-3 right-3 top-20 z-[70] max-h-[min(80vh,calc(100dvh-6rem))] overflow-auto rounded-3xl border border-slate-200/90 bg-white p-5 shadow-xl"
            >
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("nav.mobileCourses")}</div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {gradeGroups.map((g) => (
                  <div key={g.title}>
                    <div className="text-xs font-bold text-[var(--brand-navy)]">{g.title}</div>
                    <div className="mt-2 grid gap-2">
                      {g.items.map((it) => (
                        <m.div key={it.href} whileHover={{ x: 3 }} transition={springInteract}>
                          <Link href={it.href} onClick={() => setOpen(false)} className="block rounded-xl bg-[var(--surface-muted)] px-3 py-2 text-sm font-medium">
                            {it.label}
                          </Link>
                        </m.div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-5 grid gap-2 border-t border-slate-100 pt-5">
                {navLinks.map((n) => (
                  <m.div key={n.href} whileHover={{ x: 3 }} transition={springInteract}>
                    <Link
                      href={n.href}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-1 py-2 text-sm font-medium text-slate-700 hover:bg-[var(--surface-muted)]"
                    >
                      {n.label}
                    </Link>
                  </m.div>
                ))}
              </div>
              <div className="mt-5 grid gap-3 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <Link href="/login" className="btn-outline h-11 justify-center" onClick={() => setOpen(false)}>
                  {t("auth.login")}
                </Link>
                <Link href="/signup" className="btn-accent h-11 justify-center" onClick={() => setOpen(false)}>
                  {t("auth.signup")}
                </Link>
              </div>
            </m.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
