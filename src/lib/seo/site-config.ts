/**
 * Central place for site-wide SEO facts (brief section 7: unique
 * title/description per page, canonical origin, Open Graph defaults).
 * Contact details are placeholders pending brief open question #7.
 */
export const siteConfig = {
  name: "FTJ",
  fullName: "FTJ Exports",
  tagline: "Shifting dreams into reality",
  description:
    "FTJ Exports sources and ships premium and JDM vehicles worldwide. Browse the showroom and inquire — no prices, no pressure, just the right car.",
  // TO CONFIRM: real production origin. Falls back to localhost in dev.
  url: process.env.NEXT_PUBLIC_SITE_ORIGIN ?? "http://localhost:3000",
  locale: "en",
} as const;
