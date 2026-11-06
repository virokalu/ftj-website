"use client";

import { useRef, type CSSProperties, type ReactNode } from "react";

/**
 * Renders text twice, stacked: a base layer and an accent-colored layer on
 * top. The accent layer is clipped to a soft circle that follows the
 * cursor via a CSS mask, so the color change tracks the mouse path across
 * the text instead of switching all at once on hover.
 */
export function TextHoverReveal({
  children,
  textClassName,
  accentClassName,
  textStyle,
  radius = 140,
}: {
  children: ReactNode;
  textClassName: string;
  accentClassName: string;
  textStyle?: CSSProperties;
  radius?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--reveal-x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--reveal-y", `${event.clientY - rect.top}px`);
    el.style.setProperty("--reveal-opacity", "1");
  }

  function handleMouseLeave() {
    ref.current?.style.setProperty("--reveal-opacity", "0");
  }

  const maskImage = `radial-gradient(circle ${radius}px at var(--reveal-x, 50%) var(--reveal-y, -9999px), black 0%, transparent 100%)`;

  return (
    <div ref={ref} className="relative" onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave}>
      <span className={textClassName} style={textStyle}>
        {children}
      </span>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 ${accentClassName}`}
        style={{
          ...textStyle,
          opacity: "var(--reveal-opacity, 0)",
          transition: "opacity 400ms ease-out",
          WebkitMaskImage: maskImage,
          maskImage,
        }}
      >
        {children}
      </span>
    </div>
  );
}
