"use client";

import { useRef, type CSSProperties, type ElementType, type ReactNode } from "react";
import { ANIM_PENDING_ATTR, MOTION_OK, SplitText, gsap, useGSAP } from "@/lib/animations/gsap";

/**
 * Heading whose lines slide up one by one from behind a mask (GSAP
 * SplitText). The split is reverted once the reveal finishes, so the final
 * DOM — and things like text-shadow, which the line masks would clip — is
 * exactly what was server-rendered.
 *
 * Hidden via `data-anim-pending` until the animation has set its start
 * state, so the text never flashes in before animating. Reduced-motion
 * users just see the heading.
 */
export function TextReveal({
  as: Tag = "h2",
  children,
  className,
  style,
  delay = 0,
  stagger = 0.12,
}: {
  as?: ElementType;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const reveal = () => el.removeAttribute(ANIM_PENDING_ATTR);
      const mm = gsap.matchMedia();

      mm.add(MOTION_OK, () => {
        let split: SplitText | undefined;
        let tween: gsap.core.Tween | undefined;
        let cancelled = false;

        // Line breaks depend on the final web font, so wait for it.
        document.fonts.ready.then(() => {
          if (cancelled) return;
          split = SplitText.create(el, { type: "lines", mask: "lines" });
          tween = gsap.from(split.lines, {
            yPercent: 110,
            duration: 0.9,
            ease: "power3.out",
            stagger,
            delay,
            onComplete: () => split?.revert(),
          });
          reveal();
        });

        return () => {
          cancelled = true;
          tween?.kill();
          split?.revert();
        };
      });

      if (!window.matchMedia(MOTION_OK).matches) reveal();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} style={style} {...{ [ANIM_PENDING_ATTR]: "" }}>
      {children}
    </Tag>
  );
}
