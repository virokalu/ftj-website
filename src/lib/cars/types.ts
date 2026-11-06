import { z } from "zod";

/**
 * Mirrors the public stock contract in docs/cargodev-api-integration.md
 * (sections 3.1 and 5). `price` is `{ amount, currency }` in whole LKR, or
 * `null` for an unpriced listing — never format it anywhere but through
 * `formatPrice` (src/lib/cars/format-price.ts).
 */
export const WebsiteCarSchema = z.object({
  id: z.string(),
  slug: z.string(),
  brand: z.string(),
  model: z.string(),
  year: z.number().int(),
  category: z.string(),
  engine: z.string().nullable(),
  displacementCc: z.number().int().nullable(),
  transmission: z.string(),
  fuelType: z.string(),
  description: z.string().nullable(),
  photos: z.array(z.object({ url: z.string(), alt: z.string() })),
  featured: z.boolean(),
  price: z.object({ amount: z.number().int(), currency: z.string() }).nullable(),
  colour: z.string().nullable(),
});

export type WebsiteCar = z.infer<typeof WebsiteCarSchema>;
