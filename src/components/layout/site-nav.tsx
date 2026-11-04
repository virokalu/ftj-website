"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccentDivider } from "@/components/ui/accent-divider";

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
  const pathname = usePathname();

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const allItems: NavItem[] = [...items, { href: "/login", label: loginLabel }];

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
        <AccentDivider className="mx-12 sm:mx-24 lg:mx-40" />
      </header>

      {/* Always mounted (rather than conditionally rendered) so the panel
          can slide-transition in/out instead of just popping on/off. */}
      <div
        role="dialog"
        aria-modal={open}
        aria-hidden={!open}
        aria-label={menuLabel}
        className={`fixed inset-0 z-[60] bg-ink/40 transition-opacity duration-700 ease-out ${
          open ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setOpen(false)}
      >
        {/* Partial-width panel on the left; the hero page stays visible,
            just dimmed, in the remaining space to the right (client ref:
            doc/design/ftj-client-design-p04-menu-overlay.png). Slides in
            from off-screen left rather than appearing instantly. */}
        <div
          ref={panelRef}
          onClick={(event) => event.stopPropagation()}
          className={`relative flex h-full w-full flex-col bg-ink/65 backdrop-blur-sm transition-transform duration-700 ease-out sm:w-[60%] md:w-[48%] lg:w-[42%] ${
            open ? "translate-x-0" : "-translate-x-full"
          }`}
        >
            <div className="flex items-center gap-2 px-12 pt-10 sm:px-24 sm:pt-12 lg:px-40 lg:pt-16">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-sm font-medium tracking-[0.2em] text-foreground uppercase transition-colors hover:text-accent"
              >
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path d="M2 2l12 12M14 2 2 14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
                </svg>
                {closeLabel}
              </button>
            </div>

            <nav
              aria-label="Primary"
              className="flex flex-1 flex-col items-end justify-center gap-10 pr-10 pl-6 sm:gap-11 sm:pr-16 lg:gap-12 lg:pr-24"
            >
              {allItems.map((item, index) => {
                const active = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      transition: `color 200ms ease-out, opacity 600ms ease-out ${
                        open ? 400 + index * 90 : 0
                      }ms, translate 600ms ease-out ${open ? 400 + index * 90 : 0}ms`,
                    }}
                    className={`inline-block w-fit text-lg font-medium tracking-[0.12em] uppercase hover:text-accent sm:text-xl ${
                      open ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                    } ${active ? "text-foreground" : "text-foreground-muted"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
    </>
  );
}
