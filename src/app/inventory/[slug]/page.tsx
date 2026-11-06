import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { AccentDivider } from "@/components/ui/accent-divider";
import { Reveal } from "@/components/ui/reveal";
import { CarGallery } from "@/components/car-detail/car-gallery";
import { getAllCars } from "@/lib/cars/get-all-cars";
import { getCarBySlug } from "@/lib/cars/get-car-by-slug";
import { formatPrice } from "@/lib/cars/format-price";
import { colourSwatchHex } from "@/lib/cars/colour-swatch";
import { buildVehicleJsonLd, jsonLdScriptProps } from "@/lib/seo/json-ld";
import { siteConfig } from "@/lib/seo/site-config";

type Params = { slug: string };

export async function generateStaticParams() {
  const cars = await getAllCars();
  return cars.map((car) => ({ slug: car.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const car = await getCarBySlug(slug);
  if (!car) return {};

  const title = `${car.year} ${car.brand} ${car.model} for sale | FTJ`;
  const description = car.description
    ? car.description.slice(0, 155)
    : `${car.year} ${car.brand} ${car.model} — ${car.transmission}, ${car.fuelType}. Inquire with FTJ Exports.`;
  const canonical = `/inventory/${car.slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: car.photos[0] ? [{ url: car.photos[0].url }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/**
 * `params` is request-time URL data under Cache Components, so it — and
 * everything that depends on it — is pushed into this child component and
 * wrapped in Suspense below, letting Next.js serve the rest of the route's
 * static shell instantly instead of blocking the whole page on it.
 */
export default function CarDetailPage({ params }: { params: Promise<Params> }) {
  return (
    <Suspense fallback={<CarDetailSkeleton />}>
      <CarDetailContent params={params} />
    </Suspense>
  );
}

function CarDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-ink pt-24 pb-12 sm:pt-28">
        <Container>
          <div className="mx-auto h-[440px] max-w-2xl bg-surface sm:h-[620px]" />
        </Container>
      </div>
      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <div className="h-3 w-32 bg-surface" />
          <div className="mt-8 max-w-2xl">
            <div className="h-8 w-64 bg-surface" />
            <div className="mt-3 h-4 w-24 bg-surface" />
          </div>
        </Container>
      </section>
    </div>
  );
}

async function CarDetailContent({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const [car, t, tf] = await Promise.all([
    getCarBySlug(slug),
    getTranslations("carDetail"),
    getTranslations("home.fleet"),
  ]);

  if (!car) notFound();

  const canonicalUrl = `${siteConfig.url}/inventory/${car.slug}`;

  const specs: Array<{ value: string; label: string }> = [
    { value: String(car.year), label: tf("specs.year") },
    { value: car.model, label: tf("specs.model") },
    { value: car.engine ?? "—", label: tf("specs.engine") },
    {
      value: car.displacementCc ? `${car.displacementCc}cc` : "—",
      label: tf("specs.displacement"),
    },
    { value: car.transmission, label: tf("specs.transmission") },
    { value: car.fuelType, label: tf("specs.fuelType") },
  ];

  return (
    <>
      <script {...jsonLdScriptProps(buildVehicleJsonLd(car, canonicalUrl))} type="application/ld+json" />

      <div className="bg-ink pt-24 pb-12 sm:pt-28">
        <Container>
          <div className="mx-auto max-w-2xl">
            <CarGallery photos={car.photos} />
          </div>
        </Container>
      </div>

      <section className="bg-ink py-14 sm:py-20">
        <Container>
          <Link
            href="/inventory"
            className="text-xs font-medium tracking-[0.15em] text-foreground-muted uppercase transition-colors hover:text-accent"
          >
            ← {t("backToInventory")}
          </Link>

          <div className="mt-8 max-w-2xl">
            <Reveal>
              <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                {car.brand} <span className="text-gradient-accent">{car.model}</span>
              </h1>
              <p className="mt-2 text-sm font-semibold tracking-wide text-accent">{formatPrice(car.price)}</p>
              {car.description && (
                <p className="mt-4 text-xs tracking-wide text-foreground-muted uppercase">{car.description}</p>
              )}
            </Reveal>

            <Reveal delayMs={100} className="mt-20">
              <h2 className="text-lg font-semibold tracking-[0.1em] text-foreground uppercase">
                {t("performanceHeading")}
              </h2>
              <p className="mt-3 text-xs tracking-wide text-foreground-muted uppercase">
                {t("performanceCaption")}
              </p>

              <dl className="mt-8 grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3">
                {specs.map((spec) => (
                  <div key={spec.label} className="flex flex-col-reverse gap-1">
                    <dt className="text-[11px] font-medium tracking-[0.15em] text-foreground-muted uppercase">
                      {spec.label}
                    </dt>
                    <dd className="text-2xl font-bold break-words text-foreground sm:text-3xl">{spec.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {car.colour && (
              <Reveal delayMs={150} className="mt-20">
                <h2 className="text-lg font-semibold tracking-[0.1em] text-foreground uppercase">
                  {t("coloursHeading")}
                </h2>
                <div className="mt-5 flex items-center gap-4">
                  <span
                    aria-hidden="true"
                    className="h-11 w-11 shrink-0 border-2 border-foreground transition-transform duration-300 hover:scale-110"
                    style={{ backgroundColor: colourSwatchHex(car.colour) }}
                  />
                  <span className="text-xs tracking-wide text-foreground-muted uppercase">{car.colour}</span>
                </div>
              </Reveal>
            )}

            <Reveal delayMs={200} className="mt-20">
              <AccentDivider />
              <Link
                href={`/contact?vehicle=${car.slug}`}
                className="group mt-8 inline-flex items-center gap-4 text-sm font-semibold tracking-[0.2em] text-foreground uppercase transition-[color,scale] duration-300 ease-out hover:text-accent motion-safe:hover:scale-[1.03] motion-safe:active:scale-[0.97]"
              >
                {tf("inquire")}
                <span
                  aria-hidden="true"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-accent text-accent transition-colors duration-300 group-hover:bg-accent group-hover:text-white"
                >
                  <svg width="12" height="12" viewBox="0 0 10 10" fill="none">
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
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
