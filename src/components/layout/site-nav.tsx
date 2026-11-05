"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AccentDivider } from "@/components/ui/accent-divider";
import { ANIM_PENDING_ATTR, MOTION_OK, gsap, useGSAP } from "@/lib/animations/gsap";

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
  const headerRef = useRef<HTMLElement>(null);
  const pathname = usePathname();

  // Page-load intro (runs once — the header lives in the root layout): the
  // bar slides down, then the logo letters F, T, J scale in one by one.
  useGSAP(
    () => {
      const header = headerRef.current;
      if (!header) return;

      gsap.matchMedia().add(MOTION_OK, () => {
        gsap
          .timeline({ defaults: { ease: "power3.out" } })
          .from(header, { yPercent: -100, autoAlpha: 0, duration: 0.7 })
          .from("[data-logo-letter]", { autoAlpha: 0, scale: 0.6, duration: 0.5, stagger: 0.12 }, "-=0.35");
      });

      header.removeAttribute(ANIM_PENDING_ATTR);
    },
    { scope: headerRef },
  );

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    // Lock the page behind the overlay so a scroll gesture over the panel
    // can't chain up and scroll the page once the panel has no more room to
    // scroll. The scrolling box is <html>, not <body>, in this layout, so
    // both need locking. data-lenis-prevent (below) only stops Lenis from
    // hijacking the gesture — it doesn't stop native scroll-chaining, which
    // is why this lock is still needed on top of it.
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    document.addEventListener("keydown", onKeyDown);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, [open]);

  const allItems: NavItem[] = [...items, { href: "/login", label: loginLabel }];

  return (
    <>
      <header ref={headerRef} className="absolute inset-x-0 top-0 z-50" {...{ [ANIM_PENDING_ATTR]: "" }}>
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
            <span data-logo-letter className="inline-block">
              F
            </span>
            <span data-logo-letter className="inline-block">
              T
            </span>
            <span data-logo-letter className="text-gradient-accent inline-block">
              J
            </span>
          </Link>

          <Link
            href="/login"
            className="relative flex items-center gap-1.5 text-sm font-medium tracking-[0.15em] text-foreground uppercase transition-colors after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:text-accent hover:after:scale-x-100"
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
          data-lenis-prevent
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
                    className={`relative inline-block w-fit text-lg font-medium tracking-[0.12em] uppercase after:absolute after:inset-x-0 after:-bottom-1.5 after:h-px after:origin-right after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 after:ease-out hover:text-accent hover:after:scale-x-100 sm:text-xl ${
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
