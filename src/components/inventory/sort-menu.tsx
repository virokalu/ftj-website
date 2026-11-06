"use client";

import { useState } from "react";

export type SortValue = "newest" | "oldest" | "brandAsc" | "priceAsc" | "priceDesc";

export function SortMenu({
  value,
  onChange,
  label,
  options,
}: {
  value: SortValue;
  onChange: (value: SortValue) => void;
  label: string;
  options: Array<{ value: SortValue; label: string }>;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-foreground uppercase transition-colors hover:text-accent"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M3 4h10M5 8h6M7 12h2" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
        </svg>
        {label}
      </button>

      {open && (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-10 cursor-default"
          />
          <div
            role="listbox"
            className="absolute top-full right-0 z-20 mt-3 w-48 border border-border bg-surface py-2 shadow-xl"
          >
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={value === option.value}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`block w-full px-4 py-2 text-left text-xs tracking-[0.1em] uppercase transition-colors hover:text-accent ${
                  value === option.value ? "text-accent" : "text-foreground-muted"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
