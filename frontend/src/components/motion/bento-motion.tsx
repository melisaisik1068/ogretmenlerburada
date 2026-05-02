"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Etkileşim yayı — buton/link */
export const springInteract = { type: "spring" as const, stiffness: 420, damping: 22 };

/** Görünürlük yaylı oturma (scroll giriş) */
export const springReveal = { type: "spring" as const, stiffness: 320, damping: 28, mass: 0.82 };

/** Eski uyumluluk: ease bazlı yükseliş */
export const fadeInUpTransition = {
  duration: 0.5,
  ease: [0.22, 1, 0.36, 1] as const,
};

export type BentoGlowTone = "blue" | "amber" | "violet" | "neutral";

/** Cam + ince kenarlık (bento hücreler) */
export const bentoSurface =
  "rounded-3xl border border-white/20 bg-white/40 shadow-[0_12px_40px_-12px_rgba(37,99,235,0.12)] backdrop-blur-xl ring-1 ring-white/30 transition-[box-shadow,transform,border-color] duration-300";

export const glassCard =
  "rounded-3xl border border-white/20 bg-white/40 shadow-[0_16px_48px_-12px_rgba(79,70,229,0.14)] backdrop-blur-xl ring-1 ring-white/25";

export function bentoGlowHover(tone: BentoGlowTone) {
  switch (tone) {
    case "blue":
      return {
        y: -8,
        scale: 1.01,
        boxShadow:
          "0 32px 64px -12px rgba(37, 99, 235, 0.38), 0 0 48px rgba(59, 130, 246, 0.18), 0 0 0 1px rgba(255, 255, 255, 0.35)",
        borderColor: "rgba(255, 255, 255, 0.45)",
      };
    case "amber":
      return {
        y: -8,
        scale: 1.01,
        boxShadow:
          "0 32px 64px -12px rgba(245, 158, 11, 0.38), 0 0 44px rgba(251, 191, 36, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.35)",
        borderColor: "rgba(252, 211, 77, 0.35)",
      };
    case "violet":
      return {
        y: -8,
        scale: 1.01,
        boxShadow:
          "0 32px 64px -12px rgba(139, 92, 246, 0.38), 0 0 50px rgba(167, 139, 250, 0.2), 0 0 0 1px rgba(255, 255, 255, 0.35)",
        borderColor: "rgba(196, 181, 253, 0.4)",
      };
    default:
      return {
        y: -6,
        scale: 1.008,
        boxShadow:
          "0 28px 56px -14px rgba(15, 23, 42, 0.12), 0 0 32px rgba(37, 99, 235, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.35)",
      };
  }
}

export function bentoGlowRest(tone: BentoGlowTone) {
  switch (tone) {
    case "blue":
      return "0 12px 40px -12px rgba(37,99,235,0.14), 0 0 0 1px rgba(255,255,255,0.2)";
    case "amber":
      return "0 12px 40px -12px rgba(245,158,11,0.12), 0 0 0 1px rgba(255,255,255,0.2)";
    case "violet":
      return "0 12px 40px -12px rgba(139,92,246,0.14), 0 0 0 1px rgba(255,255,255,0.2)";
    default:
      return "0 10px 36px -12px rgba(15,23,42,0.08), 0 0 0 1px rgba(255,255,255,0.2)";
  }
}

/** Scroll’da yaylı yükseliş */
export function RevealInView({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 32 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-56px 0px -8px 0px" }}
      transition={reduce ? undefined : springReveal}
    >
      {children}
    </motion.div>
  );
}

/** Cam bento kart + glow ile hover yükseliş */
export function BentoCard({
  children,
  className = "",
  glowTone = "neutral",
}: {
  children: ReactNode;
  className?: string;
  glowTone?: BentoGlowTone;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={`${bentoSurface} overflow-hidden ${className}`}
      initial={reduce ? false : { opacity: 0, y: 36 }}
      whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-48px" }}
      transition={reduce ? undefined : springReveal}
      style={reduce ? undefined : { boxShadow: bentoGlowRest(glowTone) }}
      whileHover={reduce ? undefined : bentoGlowHover(glowTone)}
    >
      {children}
    </motion.div>
  );
}

export function SpringLink({
  href,
  className,
  children,
}: {
  href: string;
  className: string;
  children: ReactNode;
}) {
  return (
    <motion.span className="inline-flex" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} transition={springInteract}>
      <Link href={href} className={className}>
        {children}
      </Link>
    </motion.span>
  );
}

export function Stagger({ children, className }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      whileInView={reduce ? undefined : "show"}
      viewport={{ once: true, margin: "-40px" }}
      variants={
        reduce
          ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
          : {
              hidden: {},
              show: {
                transition: { staggerChildren: 0.08, delayChildren: 0.06 },
              },
            }
      }
    >
      {children}
    </motion.div>
  );
}

export function GlassMotionCard({
  children,
  className = "",
  tone = "glass",
  glowOnHover,
}: {
  children: ReactNode;
  className?: string;
  tone?: "glass" | "dark";
  glowOnHover?: BentoGlowTone;
}) {
  const reduce = useReducedMotion();
  const surface =
    tone === "dark"
      ? "rounded-2xl border border-white/30 bg-slate-900/95 text-white shadow-xl shadow-indigo-950/35 backdrop-blur-xl"
      : glassCard;
  const gh = glowOnHover ?? "blue";
  return (
    <motion.div
      className={`${surface} ${className}`}
      variants={
        reduce
          ? {
              hidden: { opacity: 1, y: 0, filter: "blur(0px)" },
              show: { opacity: 1, y: 0, filter: "blur(0px)" },
            }
          : {
              hidden: { opacity: 0, y: 32, filter: "blur(8px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: springReveal,
              },
            }
      }
      whileHover={
        reduce
          ? undefined
          : tone === "dark"
            ? {
                y: -6,
                boxShadow: "0 24px 56px -12px rgba(0, 0, 0, 0.45)",
              }
            : bentoGlowHover(gh)
      }
      transition={springInteract}
    >
      {children}
    </motion.div>
  );
}
