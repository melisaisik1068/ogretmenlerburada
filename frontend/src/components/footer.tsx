"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ArrowRight, Mail, MapPin, MessageCircle } from "lucide-react";

import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { useI18n } from "@/contexts/locale-context";
import { buildGradeGroups } from "@/i18n/nav-builders";
import { whatsAppPurchaseHref } from "@/lib/whatsapp-purchase";

export function SiteFooter() {
  const { t } = useI18n();
  const gradeLinks = useMemo(() => buildGradeGroups(t).flatMap((g) => g.items), [t]);

  return (
    <footer className="mt-12 bg-slate-950 text-white sm:mt-16">
      <div className="container-page py-12 sm:py-16">
        <div className="grid gap-10 md:grid-cols-12 md:gap-12">
          <div className="md:col-span-4">
            <div className="text-lg font-extrabold tracking-tight text-white">{t("nav.brand")}</div>
            <div className="mt-2 text-sm text-white/70">{t("footer.tagline")}</div>
            <div className="mt-6 flex flex-col gap-3 text-sm text-white/70">
              <a
                href="mailto:destek@ogretmenlerburada.com"
                className="group flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2 transition hover:bg-white/10"
              >
                <Mail className="h-4 w-4 shrink-0 text-[var(--brand-blue-light)] transition-transform duration-200 group-hover:scale-105" aria-hidden />
                <span className="font-medium text-white">destek@ogretmenlerburada.com</span>
              </a>
              <a
                href={whatsAppPurchaseHref()}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/15 px-3 py-2 transition hover:bg-emerald-500/25"
              >
                <MessageCircle className="h-4 w-4 shrink-0 text-[#4ade80] transition-transform duration-200 group-hover:scale-105" aria-hidden />
                <span className="font-medium text-white">{t("footer.whatsappCaption")}</span>
              </a>
              <div className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-white/70" aria-hidden />
                <span>{t("topbar.region")}</span>
              </div>
            </div>
          </div>

          <div className="md:col-span-3">
            <div className="text-sm font-bold text-white">{t("footer.corporate")}</div>
            <div className="mt-4 grid gap-2 text-sm">
              <Link className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white" href="/schools">
                {t("nav.schools")}
                <ArrowRight className="size-3 translate-x-0 opacity-70 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" aria-hidden />
              </Link>
              <Link className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white" href="/faq">
                {t("nav.faq")}
                <ArrowRight className="size-3 translate-x-0 opacity-70 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" aria-hidden />
              </Link>
              <Link className="group inline-flex items-center gap-2 text-white/70 transition-colors hover:text-white" href="/contact">
                {t("nav.contact")}
                <ArrowRight className="size-3 translate-x-0 opacity-70 transition-all duration-200 group-hover:translate-x-1 group-hover:text-white" aria-hidden />
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="text-sm font-bold text-white">{t("footer.gradesTitle")}</div>
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-2 text-sm sm:grid-cols-3">
              {gradeLinks.map((l) => (
                <Link
                  key={l.href}
                  className="group inline-flex items-center gap-1 text-white/70 transition-colors hover:text-white"
                  href={l.href}
                >
                  {l.label}
                  <ArrowRight className="size-3 -translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100" aria-hidden />
                </Link>
              ))}
            </div>

            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-5">
              <div className="text-sm font-extrabold tracking-tight text-white">{t("footer.newsTitle")}</div>
              <div className="mt-2 text-sm text-white/70">{t("footer.newsDesc")}</div>
              <NewsletterForm tone="dark" className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-start" />
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {t("footer.copyright")} © {new Date().getFullYear()} {t("nav.brand")}
          </div>
          <div className="flex flex-wrap gap-3">
            <Link className="text-white/60 transition hover:text-white" href="/kvkk">
              {t("footer.kvkk")}
            </Link>
            <Link className="text-white/60 transition hover:text-white" href="/kullanim-kosullari">
              {t("footer.terms")}
            </Link>
            <Link className="text-white/60 transition hover:text-white" href="/gizlilik">
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
