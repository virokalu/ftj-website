import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { MotionProvider } from "@/components/providers/motion-provider";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { siteConfig } from "@/lib/seo/site-config";
import { buildOrganizationJsonLd, jsonLdScriptProps } from "@/lib/seo/json-ld";
import "lenis/dist/lenis.css";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.fullName} — ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.fullName}`,
  },
  description: siteConfig.description,
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const messages = await getMessages();

  return (
    <html
      lang={siteConfig.locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-ink" suppressHydrationWarning>
        <script {...jsonLdScriptProps(buildOrganizationJsonLd())} type="application/ld+json" />
        <NextIntlClientProvider messages={messages}>
          <MotionProvider>
            <SmoothScroll>
              <SiteHeader />
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </SmoothScroll>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
