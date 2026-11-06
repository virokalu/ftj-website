"use client";

import { useLayoutEffect, useRef } from "react";
import { animate, useReducedMotion } from "motion/react";
import { useInView } from "react-intersection-observer";

/**
 * Renders a whole number that counts up from 0 the first time it scrolls
 * into view, then animates between values whenever `value` changes.
 *
 * The server renders the real value (correct without JS / for crawlers).
 * The animation writes to the existing text node's nodeValue rather than
 * replacing it, so React's own updates keep working.
 */
export function Counter({
  value,
  duration = 0.8,
  className = "",
}: {
  value: number;
  duration?: number;
  className?: string;
}) {
  const { ref: inViewRef, inView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const spanRef = useRef<HTMLSpanElement | null>(null);
  const displayed = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const text = spanRef.current?.firstChild;
    if (!text || !inView) return;

    const from = displayed.current ?? 0;
    if (reduceMotion || from === value) {
      displayed.current = value;
      text.nodeValue = String(value);
      return;
    }

    text.nodeValue = String(from);
    const controls = animate(from, value, {
      duration,
      ease: "easeOut",
      onUpdate: (latest) => {
        displayed.current = Math.round(latest);
        text.nodeValue = String(displayed.current);
      },
    });
    return () => controls.stop();
  }, [inView, value, duration, reduceMotion]);

  return (
    <span
      ref={(node) => {
        spanRef.current = node;
        inViewRef(node);
      }}
      className={`tabular-nums ${className}`}
    >
      {value}
    </span>
  );
}
