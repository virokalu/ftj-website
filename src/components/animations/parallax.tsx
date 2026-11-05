"use client";

import { useRef, type ReactNode } from "react";
import { DESKTOP_MOTION_OK, gsap, useGSAP } from "@/lib/animations/gsap";

/**
 * Drifts its children vertically while the parent section scrolls past
 * (GSAP ScrollTrigger, scrubbed). Desktop + motion-OK only; on mobile and
 * for reduced motion it's a plain wrapper.
 *
 * The parent element is the trigger, so the wrapper being moved never
 * skews its own trigger positions.
 */
export function Parallax({
  children,
  className,
  amount = 12,
  start = "top bottom",
}: {
  children: ReactNode;
  className?: string;
  /** Total travel as a percentage of the wrapper's height. */
  amount?: number;
  /** ScrollTrigger start; use "top top" for sections that load at the top of the page. */
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      gsap.matchMedia().add(DESKTOP_MOTION_OK, () => {
        gsap.to(el, {
          yPercent: amount,
          ease: "none",
          scrollTrigger: { trigger: el.parentElement ?? el, start, end: "bottom top", scrub: true },
        });
      });
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
