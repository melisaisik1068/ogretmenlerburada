import de from "./de.json";
import en from "./en.json";
import tr from "./tr.json";

export const dictionaries = { tr, en, de } as const;

export type Locale = keyof typeof dictionaries;

export const LOCALE_COOKIE = "ob_locale";

export function parseLocale(raw: string | undefined | null): Locale {
  if (raw === "en" || raw === "de") return raw;
  return "tr";
}

export function getByPath(obj: unknown, path: string): string {
  const parts = path.split(".");
  let cur: unknown = obj;
  for (const p of parts) {
    if (cur == null || typeof cur !== "object") return path;
    cur = (cur as Record<string, unknown>)[p];
  }
  return typeof cur === "string" ? cur : path;
}
