import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { AccentDivider } from "@/components/ui/accent-divider";
import { ReadMoreLink } from "@/components/ui/read-more-link";
import { TextReveal } from "@/components/animations/text-reveal";
import { Stagger } from "@/components/animations/stagger";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { siteConfig } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Answers to common questions about buying, shipping and inquiring with ${siteConfig.fullName}.`,
  alternates: { canonical: "/faq" },
};

type FaqItem = { question: string; answer: string };

export default async function FaqPage() {
  const t = await getTranslations("faq");
  const items = t.raw("items") as FaqItem[];

  return (
    <section className="bg-ink pt-32 pb-20 sm:pt-40 sm:pb-28">
      <Container>
        <TextReveal
          as="h1"
          className="text-2xl font-semibold tracking-[0.06em] text-foreground uppercase sm:text-3xl lg:text-4xl"
        >
          {t("heading")}
        </TextReveal>

        <Stagger className="mt-14 sm:mt-16">
          <FaqAccordion items={items} />
        </Stagger>

        <div className="mt-14">
          <ReadMoreLink href="/contact?openForm=1">{t("getInTouch")}</ReadMoreLink>
        </div>

        <AccentDivider className="mt-16" />
      </Container>
    </section>
  );
}
