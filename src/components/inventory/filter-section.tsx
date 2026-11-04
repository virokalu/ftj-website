"use client";

import { useState, type ReactNode } from "react";
import { AccentDivider } from "@/components/ui/accent-divider";

export function FilterSection({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <AccentDivider className="opacity-70" />
      <div className="py-6">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          className="flex w-full items-center justify-between text-left text-xs font-semibold tracking-[0.15em] text-foreground uppercase"
        >
          {title}
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
            aria-hidden="true"
            className={`shrink-0 text-accent transition-transform duration-300 ease-out ${open ? "rotate-180" : ""}`}
          >
            <path d="M2 4.5 6 8.5l4-4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* CSS grid-rows trick: animates height without measuring it in JS. */}
        <div
          className={`grid transition-[grid-template-rows] duration-300 ease-out ${
            open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
          }`}
        >
          <div className="overflow-hidden">
            <div className="flex flex-col gap-3 pt-5">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
