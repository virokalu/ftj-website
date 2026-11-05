import Link from "next/link";

export function ReadMoreLink({
  href,
  children,
  tone = "light",
}: {
  href: string;
  children: React.ReactNode;
  tone?: "light" | "dark";
}) {
  const toneClasses = tone === "light" ? "text-foreground" : "text-on-paper";

  return (
    <Link
      href={href}
      className={`group inline-flex items-center gap-3 text-sm font-medium tracking-wide uppercase transition-[color,scale] duration-300 ease-out hover:text-accent motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.97] ${toneClasses}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="bg-gradient-accent flex h-6 w-6 items-center justify-center rounded-full text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5"
      >
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
          <path
            d="M1 5h8m0 0L5.5 1.5M9 5 5.5 8.5"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </Link>
  );
}
