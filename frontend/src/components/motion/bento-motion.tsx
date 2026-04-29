"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/** Spring physics per brief: stiffness 400, damping 15 */
export const springInteract = { type: "spring" as const, stiffness: 400, damping: 15 };

export const glassCard =
  "rounded-3xl border border-white/20 bg-white/60 shadow-2xl shadow-blue-500/5 backdrop-blur-xl";

export function SpringLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
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
}: {
  children: ReactNode;
  className?: string;
  tone?: "glass" | "dark";
}) {
  const reduce = useReducedMotion();
  const surface =
    tone === "dark"
      ? "rounded-2xl border border-white/30 bg-slate-900/95 text-white shadow-xl shadow-blue-900/25 backdrop-blur-xl"
      : glassCard;
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
              hidden: { opacity: 0, y: 20, filter: "blur(10px)" },
              show: {
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
                transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
              },
            }
      }
      whileHover={
        reduce
          ? undefined
          : tone === "dark"
            ? {
                y: -5,
                boxShadow: "0 22px 48px -12px rgba(15, 23, 42, 0.55)",
              }
            : {
                y: -5,
                boxShadow: "0 25px 50px -12px rgba(59, 130, 246, 0.12)",
              }
      }
      transition={springInteract}
    >
      {children}
    </motion.div>
  );
}
