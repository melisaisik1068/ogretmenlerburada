import type { Metadata, Viewport } from "next";
import { Geist_Mono, Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

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

export const metadata: Metadata = {
  title: "ÖğretmenAğı | Güvenilir Eğitim Ağı & Onaylı Eğitmenler",
  description:
    "Sınıfa özel içerikler, onaylı eğitmenler ve eksiksiz bir öğrenme planı. ÖğretmenAğı ile güvenilir dijital eğitim.",
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
      </body>
    </html>
  );
}
