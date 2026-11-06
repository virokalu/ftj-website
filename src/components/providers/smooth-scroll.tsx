"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/animations/gsap";

/**
 * Site-wide Lenis smooth scrolling, driven by GSAP's ticker so Lenis and
 * ScrollTrigger read the same scroll position on the same frame.
 * Skipped entirely for users who prefer reduced motion (native scrolling).
 *
 * Scrollable overlays (menu panel, enquiry panel) opt out with the
 * `data-lenis-prevent` attribute so they keep native scrolling. They also
 * lock <html>/<body> to overflow:hidden themselves while open — deliberately
 * NOT using Lenis's own `autoToggle` for that, since autoToggle makes Lenis
 * read and write that same `overflow` property too. Two systems fighting
 * over one CSS property left Lenis's internal stopped/started state out of
 * sync with reality, which showed up as the native scrollbar vanishing at
 * odd times (e.g. scrolling near the footer) even with no overlay open.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.1,
      smoothWheel: true,
      // Kill leftover wheel momentum when a link is clicked, so the next
      // page doesn't keep gliding after the router scrolls it to the top.
      stopInertiaOnNavigate: true,
    });

    lenis.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      gsap.ticker.lagSmoothing(500, 33);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
