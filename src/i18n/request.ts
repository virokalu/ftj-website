import { getRequestConfig } from "next-intl/server";

// Single-locale for now (English only, per the build brief's open question #3
// default). All copy still goes through next-intl message files so adding a
// locale later is a routing change, not a rewrite.
export const defaultLocale = "en" as const;

export default getRequestConfig(async () => {
  const locale = defaultLocale;

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
