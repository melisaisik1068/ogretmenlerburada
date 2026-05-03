import type { Metadata, Viewport } from "next";
import { cookies } from "next/headers";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { LocaleProvider } from "@/contexts/locale-context";
import { WhatsAppPurchaseFab } from "@/components/whatsapp-purchase-fab";
import { dictionaries, LOCALE_COOKIE, parseLocale } from "@/i18n";

import { MotionProvider } from "./motion-provider";

const interDisplay = Inter({
  variable: "--font-inter-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  preload: true,
  adjustFontFallback: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  preload: false,
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);
  const dict = dictionaries[locale];
  const meta = dict.meta;
  const brand = dict.nav.brand;

  return {
    ...(siteUrl
      ? {
          metadataBase: new URL(siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl),
        }
      : {}),
    title: meta.title,
    description: meta.description,
    applicationName: brand,
    appleWebApp: {
      capable: true,
      title: brand,
      statusBarStyle: "default",
    },
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      siteName: brand,
      title: meta.title,
      description: meta.description,
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#2563eb" },
    { media: "(prefers-color-scheme: dark)", color: "#1e293b" },
  ],
  width: "device-width",
  initialScale: 1,
};

function apiPreconnectOrigin(): string | null {
  const raw = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  if (!raw.startsWith("http")) return null;
  try {
    return new URL(raw).origin;
  } catch {
    return null;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiOrigin = apiPreconnectOrigin();
  const cookieStore = await cookies();
  const locale = parseLocale(cookieStore.get(LOCALE_COOKIE)?.value);

  return (
    <html
      lang={locale}
      className={`${interDisplay.variable} ${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {apiOrigin ? (
          <>
            <link rel="dns-prefetch" href={apiOrigin} />
            <link rel="preconnect" href={apiOrigin} crossOrigin="anonymous" />
          </>
        ) : null}
      </head>
      <body className="min-h-full flex flex-col bg-[var(--background)]">
        <LocaleProvider initialLocale={locale}>
          <MotionProvider>{children}</MotionProvider>
          <WhatsAppPurchaseFab />
        </LocaleProvider>
      </body>
    </html>
  );
}
