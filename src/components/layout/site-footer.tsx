import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { AccentDivider } from "@/components/ui/accent-divider";
import { Container } from "@/components/ui/container";

const SOCIAL_LINKS = [
  { label: "YouTube", href: "https://youtube.com" },
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" },
];

async function getCurrentYear() {
  "use cache";
  return new Date().getFullYear();
}

export async function SiteFooter() {
  const [t, year] = await Promise.all([getTranslations("footer"), getCurrentYear()]);

  // Only FAQ and Contact map to real routes today. The rest (Language,
  // Site map, Legal, News letter, Complaints, Sustainability) are listed in
  // the client design but their scope is still an open question (build
  // brief section 8, #8) — shown as plain labels rather than dead links.
  const columns: Array<Array<{ label: string; href?: string }>> = [
    [
      { label: t("links.language") },
      { label: t("links.faq"), href: "/faq" },
      { label: t("links.siteMap") },
    ],
    [
      { label: t("links.contact"), href: "/contact" },
      { label: t("links.legal") },
      { label: t("links.newsletter") },
    ],
    [{ label: t("links.complaints") }, { label: t("links.sustainability") }],
  ];

  return (
    <footer className="bg-ink relative">
      <AccentDivider className="absolute inset-x-0 top-0 mx-6 sm:mx-10 lg:mx-16" />
      <Container className="flex flex-col gap-12 py-16 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <p className="text-2xl font-bold tracking-[0.25em] text-foreground">
            FT<span className="text-gradient-accent">J</span>
          </p>
          <p className="mt-2 max-w-[22ch] text-xs tracking-wide text-foreground-muted uppercase">
            {t("tagline")}
          </p>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-3 gap-x-10 gap-y-3 text-xs tracking-[0.1em] uppercase">
          {columns.map((column, index) => (
            <ul key={index} className="space-y-3">
              {column.map((item) =>
                item.href ? (
                  <li key={item.label}>
                    <Link href={item.href} className="text-foreground transition-colors hover:text-accent">
                      {item.label}
                    </Link>
                  </li>
                ) : (
                  <li key={item.label} className="text-foreground">
                    {item.label}
                  </li>
                ),
              )}
            </ul>
          ))}
        </nav>

        <ul className="flex gap-4">
          {SOCIAL_LINKS.map((social) => (
            <li key={social.label}>
              <a
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-border text-foreground-muted transition-colors hover:border-accent hover:text-accent"
              >
                <span className="sr-only">{social.label}</span>
                <span aria-hidden="true" className="text-[11px] font-semibold">
                  {social.label[0]}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>

      <AccentDivider className="mx-6 sm:mx-10 lg:mx-16" />
      <Container className="flex flex-col gap-3 py-6 text-xs text-foreground-muted sm:flex-row sm:items-center sm:justify-between">
        <p>
          &copy; {year} FTJ Exports. {t("rights")}
        </p>
        <Link href="/privacy" className="transition-colors hover:text-accent">
          {t("privacy")}
        </Link>
      </Container>
    </footer>
  );
}
