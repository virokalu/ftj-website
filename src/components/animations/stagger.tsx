"use client";

import { m, type HTMLMotionProps, type Variants } from "motion/react";

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

/**
 * Parent for a group of <StaggerItem>s: when the group scrolls into view,
 * its items fade up one after another (0.1s apart). Replays every time.
 */
export function Stagger({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <m.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.2 }}
      {...rest}
    >
      {children}
    </m.div>
  );
}

export function StaggerItem({ children, ...rest }: HTMLMotionProps<"div">) {
  return (
    <m.div variants={item} {...rest}>
      {children}
    </m.div>
  );
}
