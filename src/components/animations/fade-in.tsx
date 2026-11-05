"use client";

import { m, type HTMLMotionProps } from "motion/react";

type FadeInProps = HTMLMotionProps<"div"> & {
  /** Seconds before the fade starts once in view. */
  delay?: number;
  /** Starting vertical offset in px. */
  y?: number;
};

/** Fades and slides its children up once, the first time they scroll into view. */
export function FadeIn({ children, delay = 0, y = 30, ...rest }: FadeInProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: "easeOut", delay }}
      {...rest}
    >
      {children}
    </m.div>
  );
}
