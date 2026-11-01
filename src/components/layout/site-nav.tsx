"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

type NavItem = { href: string; label: string };

export function SiteNav({
  items,
  loginLabel,
  menuLabel,
  closeLabel,
}: {
  items: NavItem[];
  loginLabel: string;
  menuLabel: string;
  closeLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header className="absolute inset-x-0 top-0 z-50">
        <div className="relative flex h-20 items-center justify-between px-12 sm:px-24 lg:px-40">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            className="flex items-center gap-1.5 text-sm font-medium tracking-[0.15em] text-foreground uppercase transition-colors hover:text-accent"
          >
            <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 4.5h16M1 9h16M1 13.5h16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            {menuLabel}
          </button>

          <Link
            href="/"
            className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-[0.25em] text-foreground"
          >
            FT<span className="text-gradient-accent">J</span>
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-1.5 text-sm font-medium tracking-[0.15em] text-foreground uppercase transition-colors hover:text-accent"
          >
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="5" r="3" stroke="currentColor" strokeWidth="1.3" />
              <path d="M2 14c1-3 3.5-4.5 6-4.5S13 11 14 14" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">{loginLabel}</span>
          </Link>
        </div>
        <div aria-hidden="true" className="relative mx-12 h-px sm:mx-24 lg:mx-40">
          <div
            className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 opacity-10 blur-sm"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent 0%, #8a0b14 18%, #b35910 50%, #8a0b14 82%, transparent 100%)",
            }}
          />
          <div
            className="relative h-px opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(90deg, transparent 0%, #8a0b14 18%, #b35910 50%, #8a0b14 82%, transparent 100%)",
            }}
          />
        </div>
      </header>

      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={menuLabel}
          className="fixed inset-0 z-[60] flex flex-col bg-ink"
        >
          <div className="flex h-20 items-center justify-end px-6 sm:px-10 lg:px-16">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:text-accent"
            >
              {closeLabel}
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
              </svg>
            </button>
          </div>

          <nav aria-label="Primary" className="flex flex-1 flex-col items-center justify-center gap-6">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-3xl font-semibold tracking-tight text-foreground transition-colors hover:text-accent sm:text-4xl"
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="mt-4 text-sm font-medium tracking-[0.2em] text-accent uppercase"
            >
              {loginLabel}
            </Link>
          </nav>
        </div>
      )}
    </>
  );
}
