"use client";

import { useReducedMotion } from "framer-motion";
import { type PointerEventHandler, type ReactNode, useCallback, useId, useState } from "react";

type Ripple = { x: number; y: number; key: number };

/**
 * Göreli düğümde pointer konumundan genişleyen dalga (buton/link).
 */
export function RippleWrap({ children, className = "" }: { children: ReactNode; className?: string }) {
  const reduce = useReducedMotion();
  const uid = useId();
  const [ripples, setRipples] = useState<Ripple[]>([]);

  const onPointerDown: PointerEventHandler<HTMLSpanElement> = useCallback(
    (e) => {
      if (reduce || e.button !== 0) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const key = Date.now();
      setRipples((prev) => [...prev, { x, y, key }]);
      window.setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.key !== key));
      }, 650);
    },
    [reduce],
  );

  return (
    <span className={`relative isolate inline-flex max-w-full overflow-hidden ${className}`} onPointerDown={onPointerDown}>
      {children}
      {ripples.map((r) => (
        <span
          key={`${uid}-${r.key}`}
          className="pointer-events-none absolute animate-[ripple-wave_620ms_ease-out_forwards] rounded-full bg-white/35"
          style={{
            left: r.x,
            top: r.y,
            width: 12,
            height: 12,
            marginLeft: -6,
            marginTop: -6,
          }}
          aria-hidden
        />
      ))}
    </span>
  );
}
