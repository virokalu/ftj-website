import type { WebsiteCar } from "./types";
import { FEATURED_CARS } from "./mock-data";

/**
 * Repository/adapter function, mirroring `GET /api/public/stock/:slug`
 * (docs/cargodev-api-integration.md, section 3.2). Returns `null` for an
 * unknown, sold or removed slug — callers render a real 404 for that, same
 * as the API does.
 */
export async function getCarBySlug(slug: string): Promise<WebsiteCar | null> {
  return FEATURED_CARS.find((car) => car.slug === slug) ?? null;
}
