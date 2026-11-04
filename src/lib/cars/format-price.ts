import type { WebsiteCar } from "./types";

/**
 * The only place that turns a `WebsiteCar["price"]` into a string — cards,
 * detail, structured data and Open Graph text all call this instead of
 * formatting currency themselves (docs/cargodev-api-integration.md, section 5).
 */
export function formatPrice(price: WebsiteCar["price"]): string {
  if (!price) return "Ask for price";
  return `${price.currency} ${price.amount.toLocaleString("en-US")}`;
}
