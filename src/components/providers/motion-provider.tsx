"use client";

import type { ReactNode } from "react";
import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

/**
 * Loads only Motion's DOM animation + gesture features (not layout/drag),
 * keeping the bundle small. `strict` makes any accidental use of the full
 * `motion.*` components throw — use `m.*` instead.
 *
 * `reducedMotion="user"` drops transform animations for users who prefer
 * reduced motion, leaving only opacity fades.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
