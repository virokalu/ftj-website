"use client";

import { useEffect, useState, type ReactNode } from "react";
import { m } from "motion/react";

// Module-level so it survives the template remounting on every navigation.
let hasNavigated = false;

/**
 * Fade-and-rise entrance for each route, used from app/template.tsx (which
 * remounts on navigation). Skipped on the very first page load so the
 * server-rendered page paints immediately instead of waiting for JS.
 *
 * App Router unmounts the old page synchronously, so there is no exit
 * animation — only the incoming page animates.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  const [isFirstLoad] = useState(() => !hasNavigated);

  useEffect(() => {
    hasNavigated = true;
  }, []);

  return (
    <m.div
      initial={isFirstLoad ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      {children}
    </m.div>
  );
}
