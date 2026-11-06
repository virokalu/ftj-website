import type { WebsiteCar } from "./types";
import { FEATURED_CARS } from "./mock-data";

/**
 * Repository/adapter function (build brief, section 5). Pages call this,
 * never fetch directly, so swapping mock data for
 * `GET /api/public/stock?...` later only changes this file's insides.
 */
export async function getFeaturedCars(): Promise<WebsiteCar[]> {
  return FEATURED_CARS;
}
