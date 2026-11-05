import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

/**
 * Single place GSAP plugins are registered. Import gsap, ScrollTrigger,
 * SplitText and useGSAP from here (never straight from "gsap") so every
 * client component gets the registered instances. Only import this from
 * "use client" components.
 */
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, useGSAP);
}

/** Matches when the user hasn't asked for reduced motion. */
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

/** Heavier effects (parallax, reveal masks) only run at 768px and up. */
export const DESKTOP_MOTION_OK = "(min-width: 768px) and (prefers-reduced-motion: no-preference)";

/**
 * Elements rendered with this attribute stay hidden (via globals.css) until
 * their entrance animation has set its own starting state and removes it.
 * Prevents a flash of the final state between server paint and hydration.
 */
export const ANIM_PENDING_ATTR = "data-anim-pending";

export { gsap, ScrollTrigger, SplitText, useGSAP };
