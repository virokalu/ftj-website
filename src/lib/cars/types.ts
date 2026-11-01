import { z } from "zod";

/**
 * Mirrors the public WebsiteCar contract proposed in
 * doc/design/ftj-website-brief.md (section 5). Price is intentionally
 * absent: the public API never returns it, not just hides it.
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
});

export type WebsiteCar = z.infer<typeof WebsiteCarSchema>;
