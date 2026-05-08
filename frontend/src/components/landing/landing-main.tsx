"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { m, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

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
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroParallaxY = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["0%", "16%"]);

  return (
    <main>
      <section ref={heroRef} className="relative min-h-screen w-full overflow-hidden">
        <m.div className="absolute inset-0 z-0" style={{ y: heroParallaxY }} aria-hidden>
          <div className="absolute inset-0 scale-[1.04]">
            <Image
              src="/images/hero-classroom.png"
              alt=""
              fill
              priority
              fetchPriority="high"
              decoding="async"
              quality={75}
              className="object-cover object-center"
              sizes={IMG_HERO_FULL}
            />
          </div>
        </m.div>
        {/* Left-heavy overlay like screenshot: soft pink/purple + navy for readability */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[linear-gradient(90deg,rgba(11,31,58,0.72)_0%,rgba(124,58,237,0.30)_42%,rgba(255,59,149,0.16)_68%,rgba(0,0,0,0)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(700px_circle_at_20%_35%,rgba(124,58,237,0.22),transparent_55%),radial-gradient(700px_circle_at_35%_65%,rgba(255,59,149,0.18),transparent_55%)]"
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
              <span className="bg-gradient-to-r from-white via-white to-[#ffe4f2] bg-clip-text text-transparent">
                Öğretmenler Burada
              </span>
              <span className="text-white/90">.</span>
            </m.h1>
            <m.p
              variants={reduce ? undefined : heroFadeUp}
              className="mt-6 max-w-xl text-pretty text-base font-medium leading-relaxed text-white/88 sm:text-lg md:text-xl"
            >
              Her öğretmen dünyayı değiştirir.
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
