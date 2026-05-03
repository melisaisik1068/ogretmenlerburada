"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { LOCALE_COOKIE, type Locale, dictionaries, getByPath, parseLocale } from "@/i18n";

type I18nContextValue = {
  locale: Locale;
  setLocale: (next: Locale) => void;
  t: (path: string) => string;
};

const LocaleContext = createContext<I18nContextValue | null>(null);

export function LocaleProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [locale, setLoc] = useState<Locale>(() => parseLocale(initialLocale));

  useEffect(() => {
    setLoc(parseLocale(initialLocale));
  }, [initialLocale]);

  const t = useCallback(
    (path: string) => {
      return getByPath(dictionaries[locale] as unknown, path);
    },
    [locale],
  );

  const setLocale = useCallback(
    (next: Locale) => {
      setLoc(next);
      document.cookie = `${LOCALE_COOKIE}=${next};path=/;max-age=31536000;SameSite=Lax`;
      router.refresh();
    },
    [router],
  );

  const value = useMemo(() => ({ locale, setLocale, t }), [locale, setLocale, t]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) {
    throw new Error("useI18n must be used within LocaleProvider");
  }
  return ctx;
}
