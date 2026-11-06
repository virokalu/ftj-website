import type { Metadata } from "next";
import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ReadMoreLink } from "@/components/ui/read-more-link";
import { TextReveal } from "@/components/animations/text-reveal";
import { FadeIn } from "@/components/animations/fade-in";
import { ImageReveal } from "@/components/animations/image-reveal";
import { Parallax } from "@/components/animations/parallax";
import { siteConfig } from "@/lib/seo/site-config";

export const metadata: Metadata = {
  title: "About Us",
  description: `The story and values behind ${siteConfig.fullName} — sourcing, inspecting and shipping exceptional vehicles worldwide.`,
  alternates: { canonical: "/about" },
};

export default async function AboutPage() {
  const t = await getTranslations("about");

  const [valuesAccentWord, ...valuesRestWords] = t("values.headline").split(" ");
  const valuesRest = valuesRestWords.join(" ");

  return (
    <>
      <section className="relative flex h-[70vh] min-h-[480px] items-end overflow-hidden bg-ink pt-20">
        <div className="absolute inset-0">
          <Image
            src="/images/about/hero.jpg"
            alt="A red Ferrari parked on a city street at night"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink via-ink/40 to-ink/10"
        />
        <Container className="relative pb-14 sm:pb-20">
          <TextReveal
            as="h1"
            className="text-3xl font-semibold tracking-[0.08em] text-foreground uppercase sm:text-4xl lg:text-5xl"
            style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55)" }}
          >
            {t("hero.heading")}
          </TextReveal>
        </Container>
      </section>

      <section className="bg-ink py-16 sm:py-20">
        <Container>
          <FadeIn>
            <p className="mx-auto max-w-2xl text-center text-base leading-relaxed text-foreground-muted sm:text-lg">
              {t("intro")}
            </p>
          </FadeIn>
        </Container>
      </section>

      <section className="bg-paper py-14 text-on-paper sm:py-20">
        <Container>
          <FadeIn>
            <span className="text-xs font-semibold tracking-[0.25em] text-accent uppercase">
              {t("values.sectionHeading")}
            </span>
          </FadeIn>

          <div className="mt-6 grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <FadeIn delay={0.1} className="flex flex-col gap-6">
              <h2 className="max-w-md text-3xl leading-[1.1] font-semibold tracking-tight text-on-paper sm:text-4xl lg:text-5xl">
                <span className="text-gradient-accent">{valuesAccentWord}</span> {valuesRest}
              </h2>
              <p className="max-w-md text-base leading-8 text-on-paper-muted sm:text-lg">{t("values.body")}</p>
            </FadeIn>

            <ImageReveal className="relative h-[380px] w-full overflow-hidden sm:h-[440px] lg:ml-auto lg:h-[500px] lg:max-w-lg">
              <Image
                src="/images/about/road.jpg"
                alt="A line of sports cars gathered on a scenic hillside road"
                fill
                sizes="(min-width: 1024px) 32rem, 90vw"
                className="object-cover"
              />
            </ImageReveal>
          </div>
        </Container>
      </section>

      <section className="relative flex min-h-[70vh] items-center overflow-hidden bg-ink">
        <Parallax className="absolute inset-0" amount={14}>
          <Image
            src="/images/about/motion-blur.jpg"
            alt="A race car captured mid-corner with a dramatic panning motion blur"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-linear-to-r from-ink via-ink/60 to-transparent"
        />
        <Container className="relative py-20 sm:py-28">
          <FadeIn className="max-w-md">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {t("passion.headline")}
            </h2>
            <p className="mt-4 text-base leading-7 text-foreground-muted sm:text-lg">{t("passion.body")}</p>
          </FadeIn>
        </Container>
      </section>

      <section className="mb-12 grid sm:mb-20 lg:grid-cols-2">
        <FadeIn className="flex flex-col justify-center gap-5 bg-ink px-6 py-16 sm:px-10 sm:py-20 lg:px-16">
          <h2 className="max-w-sm text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {t("shipping.headline")}
          </h2>
          <p className="max-w-sm text-base leading-7 text-foreground-muted">{t("shipping.body")}</p>
          <ReadMoreLink href="/contact?openForm=1">{t("shipping.cta")}</ReadMoreLink>
        </FadeIn>

        <ImageReveal className="relative h-[360px] w-full overflow-hidden sm:h-[440px] lg:h-auto lg:min-h-[480px]">
          <Image
            src="/images/about/urus.jpg"
            alt="A yellow Lamborghini Urus parked outside a modern building"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </ImageReveal>
      </section>
    </>
  );
}
