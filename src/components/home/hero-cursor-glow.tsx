"use client";

import { useRef } from "react";

/**
 * A flashlight-style reveal: the area right under the cursor lightens
 * slightly, while everywhere else darkens a touch more than the base
 * overlay. Mutates the DOM node's background directly on mousemove
 * instead of using state, so this doesn't trigger a React re-render on
 * every pointer event.
 */
export function HeroCursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    el.style.background = `radial-gradient(circle 340px at ${x}% ${y}%, rgba(255,255,255,0.03) 0%, transparent 55%, rgba(5,5,5,0.1) 100%)`;
  }

  function handleMouseLeave() {
    const el = ref.current;
    if (!el) return;
    el.style.background = "transparent";
  }

  return (
    <div
      ref={ref}
      aria-hidden="true"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="absolute inset-0 transition-[background] duration-150 ease-out"
    />
  );
}
