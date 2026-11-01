import { siteConfig } from "./site-config";

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

/** JSON-LD must be escaped before embedding — it is data, not HTML. */
export function jsonLdScriptProps(data: unknown) {
  return {
    dangerouslySetInnerHTML: {
      __html: JSON.stringify(data).replace(/</g, "\\u003c"),
    },
  };
}
