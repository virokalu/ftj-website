import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/seo/site-config";

/**
 * Static pages only for now. Once inventory pages exist, this grows to
 * page through the stock list the way docs/cargodev-api-integration.md
 * section 4 describes (one request per 24 vehicles).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
