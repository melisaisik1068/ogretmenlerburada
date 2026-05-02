"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";

import { springInteract, springReveal } from "@/components/motion/bento-motion";
import { HomeBelowFoldSkeleton } from "@/components/skeletons/home-below-fold-skeleton";
import { RippleWrap } from "@/components/ui/ripple-wrap";
import { IMG_HERO_FULL } from "@/lib/image-sizes";

const LandingBelowFoldLazy = dynamic(
  () => import("./landing-below-fold").then((mod) => ({ default: mod.LandingBelowFold })),
  {
    loading: () => <HomeBelowFoldSkeleton />,
    ssr: true,
  },
);

const heroStagger = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.11, delayChildren: 0.15 },
  },
};

const heroFadeUp = {
  hidden: { opacity: 0, y: 44 },
  show: { opacity: 1, y: 0, transition: springReveal },
};

export function LandingMain() {
  const reduce = useReducedMotion() ?? false;
  const heroRef = useRef<HTMLElement | null>(null);
  const [heroImg, setHeroImg] = useState("/images/image_86ee84.jpg");
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallaxY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "16%"]);

  return (
    <main>
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden">
        <m.div className="absolute inset-0 z-0" style={{ y: heroParallaxY }} aria-hidden>
          <div className="absolute inset-0 scale-[1.12]">
            <Image
              src={heroImg}
              alt=""
              fill
              priority
              fetchPriority="high"
              decoding="async"
              quality={78}
              className="object-cover object-center"
              sizes={IMG_HERO_FULL}
              onError={() => {
                setHeroImg((prev) => {
                  if (prev.endsWith("hero-classroom.jpg")) return prev;
                  if (prev.includes("image_86ee84")) return "/images/hero-classroom.jpg";
                  return prev;
                });
              }}
            />
          </div>
        </m.div>
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-gradient-to-br from-[#0f172a]/92 via-[#2563eb]/42 to-[#8b5cf6]/22"
          aria-hidden
        />
        <div className="relative z-[2] mx-auto flex min-h-screen w-full max-w-7xl flex-col justify-center px-4 pb-20 pt-28 sm:px-6 sm:pb-24 sm:pt-32 lg:px-8 lg:pt-36">
          <m.div
            className="max-w-3xl"
            variants={reduce ? undefined : heroStagger}
            initial={reduce ? false : "hidden"}
            animate={reduce ? undefined : "show"}
          >
            <m.div
              variants={reduce ? undefined : heroFadeUp}
              className="inline-flex rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md"
            >
              <span className="text-[var(--brand-amber-light)]">2026</span>
              <span className="mx-2 text-white/40">·</span>
              Güvenilir eğitim ağı
            </m.div>
            <m.h1
              variants={reduce ? undefined : heroFadeUp}
              className="mt-6 text-balance font-[family-name:var(--font-inter-display),system-ui,sans-serif] text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-md sm:text-5xl md:text-6xl lg:text-7xl"
            >
              <span className="bg-gradient-to-r from-white via-white to-[#dbeafe] bg-clip-text text-transparent">
                ÖğretmenAğı
              </span>{" "}
              <span className="text-white/95">ile hedefin daha yakın.</span>
            </m.h1>
            <m.p
              variants={reduce ? undefined : heroFadeUp}
              className="mt-6 max-w-xl text-pretty text-base font-medium leading-relaxed text-white/88 sm:text-lg md:text-xl"
            >
              Sınıfa özel içerikler, onaylı eğitmenler ve eksiksiz bir öğrenme planı.
            </m.p>
            <m.div
              variants={reduce ? undefined : heroFadeUp}
              className="mt-10 flex flex-wrap gap-4"
            >
              <m.span
                className="inline-flex"
                whileHover={reduce ? undefined : { scale: 1.05 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                transition={springInteract}
              >
                <RippleWrap className="max-w-none">
                  <Link href="/classes" className="hero-cta-solid">
                    Keşfe Başlayın
                  </Link>
                </RippleWrap>
              </m.span>
              <m.span
                className="inline-flex"
                whileHover={reduce ? undefined : { scale: 1.05 }}
                whileTap={reduce ? undefined : { scale: 0.98 }}
                transition={springInteract}
              >
                <RippleWrap className="max-w-none">
                  <Link href="/signup" className="hero-cta-ghost">
                    Ücretsiz Kayıt
                  </Link>
                </RippleWrap>
              </m.span>
            </m.div>
          </m.div>
        </div>
      </section>

      <LandingBelowFoldLazy />
    </main>
  );
}
