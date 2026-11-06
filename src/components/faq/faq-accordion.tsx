"use client";

import { useState } from "react";
import { StaggerItem } from "@/components/animations/stagger";

type FaqItem = { question: string; answer: string };

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div>
      {items.map((item, index) => {
        const open = openIndex === index;

        return (
          <StaggerItem
            key={item.question}
            className={`border-b transition-colors duration-300 ${open ? "border-accent" : "border-border"}`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(open ? null : index)}
              aria-expanded={open}
              className="group flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-wide text-foreground uppercase transition-colors hover:text-accent sm:text-xl"
            >
              {item.question}
              <span
                aria-hidden="true"
                className={`relative flex h-4 w-4 shrink-0 items-center justify-center transition-colors ${
                  open ? "text-accent" : "text-foreground-muted group-hover:text-accent"
                }`}
              >
                <span className="absolute h-px w-4 bg-current" />
                <span
                  className={`absolute h-4 w-px bg-current transition-transform duration-300 ease-out ${
                    open ? "scale-y-0" : "scale-y-100"
                  }`}
                />
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="bg-surface-raised px-6 py-6 sm:px-8">
                  <p className="text-sm leading-relaxed text-foreground-muted sm:text-base">{item.answer}</p>
                </div>
              </div>
            </div>
          </StaggerItem>
        );
      })}
    </div>
  );
}
