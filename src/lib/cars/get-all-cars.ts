import type { WebsiteCar } from "./types";
import { FEATURED_CARS } from "./mock-data";

/**
 * Repository/adapter function (build brief, section 5). Pages call this,
 * never fetch directly. Currently the same placeholder set as
 * `getFeaturedCars` until this is wired to `GET /api/public/stock`
 * (docs/cargodev-api-integration.md) and returns the full showroom.
 */
export async function getAllCars(): Promise<WebsiteCar[]> {
  return FEATURED_CARS;
}
