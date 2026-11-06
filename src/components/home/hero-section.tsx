import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ReadMoreLink } from "@/components/ui/read-more-link";
import { SlideDots } from "@/components/ui/slide-dots";
import { HeroCursorGlow } from "@/components/home/hero-cursor-glow";
import { Parallax } from "@/components/animations/parallax";
import { TextReveal } from "@/components/animations/text-reveal";

export async function HeroSection() {
  const t = await getTranslations("home.hero");
  const headlineWords = t("headline").split(" ");

  return (
    <section className="relative flex h-screen items-end overflow-hidden bg-ink pb-16">
      <Parallax className="absolute inset-0" start="top top" amount={15}>
        <div className="absolute inset-0 animate-ken-burns">
          <Image
            src="/images/cars/ferrari2.jpg"
            alt="A red Ferrari parked outside a modern glass office building, rear three-quarter view"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </Parallax>

      {/* Taillight glow accents, positioned over the car's rear lights in ferrari2.jpg */}
      <div
        aria-hidden="true"
        className="animate-taillight-glow pointer-events-none absolute top-[59%] left-[19.6%] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-md mix-blend-screen sm:h-11 sm:w-11"
        style={{
          background:
            "radial-gradient(circle, #ffd24d 0%, #ffd24d 38%, #ff2d3d 38%, #ff2d3d 62%, transparent 80%)",
        }}
      />
      <div
        aria-hidden="true"
        className="animate-taillight-glow pointer-events-none absolute top-[55.3%] left-[50.4%] h-8 w-8 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70 blur-md mix-blend-screen sm:h-11 sm:w-11 [animation-delay:200ms]"
        style={{
          background:
            "radial-gradient(circle, #ffd24d 0%, #ffd24d 38%, #ff2d3d 38%, #ff2d3d 62%, transparent 80%)",
        }}
      />

      <div
        aria-hidden="true"
        className="animate-light-sweep pointer-events-none absolute inset-y-0 -left-1/4 w-1/3 bg-linear-to-r from-transparent via-white/15 to-transparent"
      />
      <div aria-hidden="true" className="bg-ink/55 pointer-events-none absolute inset-0" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink via-ink/35 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_25%,var(--color-ink)_100%)] opacity-90"
      />

      <HeroCursorGlow />

      <div
        aria-hidden="true"
        className="animate-fade-in pointer-events-none absolute left-6 top-1/2 hidden -translate-y-1/2 text-foreground/70 [animation-delay:700ms] sm:left-10 lg:left-16 lg:block"
      >
        <SlideDots count={3} activeIndex={0} />
      </div>

      <Container className="relative text-center">
        <TextReveal
          as="h1"
          delay={0.3}
          className="mx-auto max-w-5xl text-xl font-semibold tracking-[0.06em] text-foreground uppercase text-balance sm:text-2xl lg:text-4xl"
          style={{ textShadow: "0 2px 18px rgba(0,0,0,0.55), 0 1px 4px rgba(0,0,0,0.5)" }}
        >
          {headlineWords.map((word, index) => (
            <span
              key={index}
              className={`inline-block ${index < headlineWords.length - 1 ? "mr-2 sm:mr-3" : ""} ${
                index === headlineWords.length - 1 ? "text-gradient-accent" : ""
              }`}
            >
              {word}
              {index < headlineWords.length - 1 ? " " : ""}
            </span>
          ))}
        </TextReveal>
        <div className="animate-fade-up mt-5 flex justify-center [animation-delay:950ms]">
          <ReadMoreLink href="#featured-fleet">{t("cta")}</ReadMoreLink>
        </div>
      </Container>
    </section>
  );
}
