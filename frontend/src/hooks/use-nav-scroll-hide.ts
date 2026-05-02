"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

/**
 * Aşağı kaydırırken üst menüyü gizler; yukarı veya kısa duraklamada tekrar gösterir.
 */
export function useNavScrollHide() {
  const reduce = useReducedMotion();
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const idleRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (reduce) {
      setHidden(false);
      return;
    }

    lastY.current = window.scrollY;

    const clearIdle = () => {
      if (idleRef.current) {
        clearTimeout(idleRef.current);
        idleRef.current = null;
      }
    };

    const onScroll = () => {
      const y = window.scrollY;
      clearIdle();
      idleRef.current = setTimeout(() => setHidden(false), 260);

      if (y < 56) {
        setHidden(false);
        lastY.current = y;
        return;
      }

      const delta = y - lastY.current;
      if (delta > 12) setHidden(true);
      else if (delta < -6) setHidden(false);
      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearIdle();
    };
  }, [reduce]);

  return hidden;
}
