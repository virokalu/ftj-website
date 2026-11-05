import { siteConfig } from "./site-config";
import type { WebsiteCar } from "@/lib/cars/types";

/**
 * schema.org Organization graph for the home page. Keep this the single
 * place that builds JSON-LD so new structured data (Vehicle, BreadcrumbList,
 * ...) added for other pages follows the same escaping path.
 */
export function buildOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "AutoDealer",
    name: siteConfig.fullName,
    alternateName: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

/**
 * schema.org Vehicle graph for a stock detail page (build doc section 8).
 * `Offer` is included only when `price` is not null; every `null` field is
 * omitted rather than emitted as `null`, an empty string or `0`.
 */
export function buildVehicleJsonLd(car: WebsiteCar, canonicalUrl: string) {
  const image = car.photos[0]?.url;

  return {
    "@context": "https://schema.org",
    "@type": "Vehicle",
    name: `${car.brand} ${car.model}`,
    brand: car.brand,
    model: car.model,
    vehicleModelDate: car.year,
    bodyType: car.category,
    fuelType: car.fuelType,
    vehicleTransmission: car.transmission,
    ...(car.colour ? { color: car.colour } : {}),
    ...(image ? { image } : {}),
    ...(car.description ? { description: car.description } : {}),
    ...(car.price
      ? {
          offers: {
            "@type": "Offer",
            price: car.price.amount,
            priceCurrency: car.price.currency,
            availability: "https://schema.org/InStock",
            url: canonicalUrl,
          },
        }
      : {}),
  };
}

/** JSON-LD must be escaped before embedding — it is data, not HTML. */
export function jsonLdScriptProps(data: unknown) {
  return {
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
  };
}
