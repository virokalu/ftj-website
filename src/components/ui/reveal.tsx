"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Direction = "bottom" | "left" | "right";

const HIDDEN_TRANSFORM: Record<Direction, string> = {
  bottom: "translate-y-10",
  left: "-translate-x-12 translate-y-10",
  right: "translate-x-12 translate-y-10",
};

/**
 * Fades + slides its children into place when scrolling down into view,
 * and resets while off-screen so it plays again the next time you scroll
 * down to it. Scrolling up only ever snaps it straight to its visible
 * state (no animation) so it's never left invisible on screen, but the
 * entrance animation itself is reserved for downward scrolling only.
 */
export function Reveal({
  children,
  className = "",
  delayMs = 0,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  delayMs?: number;
  from?: Direction;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [animate, setAnimate] = useState(true);
  const lastScrollY = useRef(0);
  const direction = useRef<"down" | "up">("down");

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function onScroll() {
      const y = window.scrollY;
      direction.current = y >= lastScrollY.current ? "down" : "up";
      lastScrollY.current = y;
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimate(direction.current === "down");
          setVisible(true);
        } else {
          setVisible(false);
        }
      },
      { threshold: 0.05, rootMargin: "0px 0px -40px 0px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={`${animate ? "transition-all duration-700 ease-out" : ""} ${
        visible ? "translate-x-0 translate-y-0 opacity-100" : `${HIDDEN_TRANSFORM[from]} opacity-0`
      } ${className}`}
      style={{ transitionDelay: animate ? `${delayMs}ms` : "0ms" }}
    >
      {children}
    </div>
  );
}
