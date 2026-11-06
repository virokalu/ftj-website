import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Reveal } from "@/components/ui/reveal";

export async function SegmentTiles() {
  const t = await getTranslations("home.segments");

  const segments = [
    {
      key: "jdm",
      href: "/inventory?category=jdm",
      image: "/images/cars/segment-jdm.jpg",
      alt: "A modified yellow Toyota Supra widebody at a car show",
      title: t("jdm.title"),
      cta: t("jdm.cta"),
    },
    {
      key: "premium",
      href: "/inventory?category=premium",
      image: "/images/cars/segment-premium.jpg",
      alt: "A sports car on a desert road beside red sandstone rock formations",
      title: t("premium.title"),
      cta: t("premium.cta"),
    },
  ];

  return (
    <section aria-label="Browse by segment" className="grid sm:grid-cols-2">
      {segments.map((segment, index) => (
        <Reveal
          key={segment.key}
          delayMs={index * 150}
          from={index === 0 ? "left" : "right"}
          className="h-full"
        >
          <div className="group relative flex h-full min-h-[70vh] items-end overflow-hidden bg-ink">
            <Image
              src={segment.image}
              alt={segment.alt}
              fill
              sizes="(min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-linear-to-t from-ink via-ink/35 to-transparent"
            />
            <div className="relative p-8 sm:p-12">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                {segment.title}
              </h2>
              <Link
                href={segment.href}
                className="mt-4 inline-flex items-center gap-2 text-sm font-medium tracking-wide text-foreground uppercase"
              >
                <span className="absolute inset-0" aria-hidden="false" />
                {segment.cta}
                <span
                  aria-hidden="true"
                  className="bg-gradient-accent flex h-6 w-6 items-center justify-center rounded-full text-white shadow-[0_0_0_1px_rgba(255,255,255,0.15)] transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5"
                >
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
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
            </div>
          </div>
        </Reveal>
      ))}
    </section>
  );
}
