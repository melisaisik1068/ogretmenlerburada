"use client";

import Script from "next/script";
import { useEffect, useId, useMemo, useState } from "react";

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "light" | "dark" | "auto";
          size?: "normal" | "compact";
        },
      ) => string;
      reset?: (widgetId?: string) => void;
    };
  }
}

type Props = {
  onToken: (token: string) => void;
  className?: string;
  theme?: "light" | "dark" | "auto";
  size?: "normal" | "compact";
};

export function Turnstile({ onToken, className = "", theme = "auto", size = "compact" }: Props) {
  const siteKey = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "").trim();
  const containerId = useId();
  const [widgetId, setWidgetId] = useState<string | null>(null);

  const enabled = !!siteKey;
  const elementId = useMemo(() => `turnstile-${containerId}`, [containerId]);

  useEffect(() => {
    if (!enabled) return;
    const el = document.getElementById(elementId);
    if (!el) return;
    if (!window.turnstile?.render) return;
    if (widgetId) return;

    const id = window.turnstile.render(el, {
      sitekey: siteKey,
      theme,
      size,
      callback: (token) => onToken(token),
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
    });
    setWidgetId(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, elementId, siteKey, theme, size]);

  if (!enabled) return null;

  return (
    <div className={className}>
      <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" strategy="afterInteractive" />
      <div id={elementId} />
    </div>
  );
}

