import type { Metadata } from "next";
import { HeroSection } from "@/components/home/hero-section";
import { SegmentTiles } from "@/components/home/segment-tiles";
import { StorySection } from "@/components/home/story-section";
import { FeaturedFleet } from "@/components/home/featured-fleet";
import { siteConfig } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  title: `${siteConfig.fullName} — ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: siteConfig.fullName,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.fullName,
    type: "website",
    images: [{ url: "/images/cars/hero-supercar.jpg" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.fullName,
    description: siteConfig.description,
  },
};

export default function Home() {
  return (
    <>
      <HeroSection />
      <SegmentTiles />
      <StorySection />
      <FeaturedFleet />
    </>
  );
}
