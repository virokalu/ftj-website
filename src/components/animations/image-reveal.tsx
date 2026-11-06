"use client";

import { useRef, type ReactNode } from "react";
import { gsap, MOTION_OK, useGSAP } from "@/lib/animations/gsap";

/**
 * Showcase image wrapper. Desktop: a bottom-to-top clip-path reveal that
 * replays every time it scrolls into view (and reverses out when scrolled
 * past going back up), plus a gentle scrubbed parallax on the image inside.
 * Mobile: a light fade, same replay behaviour. Reduced motion: static.
 *
 * `className` must give the box its size and `relative overflow-hidden`;
 * children (typically a `fill` next/image) fill the inner layer.
 */
export function ImageReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      const inner = innerRef.current;
      if (!el || !inner) return;

      gsap.matchMedia().add(
        { desktop: "(min-width: 768px)", motionOk: MOTION_OK },
        ({ conditions }) => {
          if (!conditions?.motionOk) return;

          if (!conditions.desktop) {
            gsap.from(el, {
              autoAlpha: 0,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 85%",
                end: "bottom top",
                toggleActions: "restart none none reverse",
              },
            });
            return;
          }

          gsap.fromTo(
            el,
            { clipPath: "inset(100% 0% 0% 0%)" },
            {
              clipPath: "inset(0% 0% 0% 0%)",
              duration: 1.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: el,
                start: "top 80%",
                end: "bottom top",
                toggleActions: "restart none none reverse",
              },
            },
          );
          gsap.fromTo(
            inner,
            { yPercent: -6, scale: 1.15 },
            {
              yPercent: 6,
              scale: 1.15,
              ease: "none",
              scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
            },
          );
        },
      );
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className={className}>
      <div ref={innerRef} className="absolute inset-0">
        {children}
      </div>
    </div>
  );
}
