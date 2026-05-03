import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

import { WhatsAppPurchaseFab } from "@/components/whatsapp-purchase-fab";

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

export const metadata: Metadata = {
  ...(siteUrl
    ? {
        metadataBase: new URL(siteUrl.endsWith("/") ? siteUrl.slice(0, -1) : siteUrl),
      }
    : {}),
  title: "ÖğretmenAğı | Güvenilir Eğitim Ağı & Onaylı Eğitmenler",
  description:
    "Sınıfa özel içerikler, onaylı eğitmenler ve eksiksiz bir öğrenme planı. ÖğretmenAğı ile güvenilir dijital eğitim.",
  applicationName: "ÖğretmenAğı",
  appleWebApp: {
    capable: true,
    title: "ÖğretmenAğı",
    statusBarStyle: "default",
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    siteName: "ÖğretmenAğı",
    title: "ÖğretmenAğı | Güvenilir Eğitim Ağı & Onaylı Eğitmenler",
    description:
      "Sınıfa özel içerikler, onaylı eğitmenler ve eksiksiz bir öğrenme planı. ÖğretmenAğı ile güvenilir dijital eğitim.",
  },
  robots: { index: true, follow: true },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const apiOrigin = apiPreconnectOrigin();

  return (
    <html
      lang="tr"
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
        <MotionProvider>{children}</MotionProvider>
        <WhatsAppPurchaseFab />
      </body>
    </html>
  );
}
