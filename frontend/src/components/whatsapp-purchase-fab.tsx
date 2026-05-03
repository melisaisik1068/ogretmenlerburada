"use client";

import { MessageCircle } from "lucide-react";

import { useI18n } from "@/contexts/locale-context";
import { whatsAppPurchaseHref } from "@/lib/whatsapp-purchase";

export function WhatsAppPurchaseFab() {
  const { t } = useI18n();
  const href = whatsAppPurchaseHref();

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-5 right-4 z-50 inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-900/20 ring-1 ring-white/20 transition hover:bg-[#20bd5a] hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#25D366] sm:bottom-8"
      aria-label={t("whatsappFab.aria")}
    >
      <MessageCircle className="size-5 shrink-0" aria-hidden />
      <span className="max-w-[11rem] leading-tight sm:max-w-none">{t("whatsappFab.label")}</span>
    </a>
  );
}
