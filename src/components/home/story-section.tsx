import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ReadMoreLink } from "@/components/ui/read-more-link";
import { SlideDots } from "@/components/ui/slide-dots";
import { TextHoverReveal } from "@/components/ui/text-hover-reveal";

export async function StorySection() {
  const t = await getTranslations("home.story");

  return (
    <section className="bg-paper py-20 text-on-paper sm:py-28">
      <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div className="relative -mt-8 flex gap-8 lg:-mt-12">
          <div aria-hidden="true" className="hidden pt-2 text-on-paper-muted sm:block">
            <SlideDots count={3} activeIndex={0} />
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="max-w-md">
              <TextHoverReveal
                textClassName="block text-3xl leading-snug font-semibold tracking-tight text-foreground sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-tight"
                accentClassName="block text-3xl leading-snug font-semibold tracking-tight text-accent sm:text-4xl sm:leading-snug lg:text-5xl lg:leading-tight"
                textStyle={{ textShadow: "0 2px 14px rgba(0,0,0,0.65), 0 0 30px rgba(0,0,0,0.4)" }}
              >
                {t("headline")}
              </TextHoverReveal>
            </h2>
            <p className="max-w-md text-base leading-8 text-on-paper-muted sm:text-lg">{t("body")}</p>
            <div>
              <ReadMoreLink href="/about" tone="dark">
                {t("cta")}
              </ReadMoreLink>
            </div>
          </div>
        </div>

        <div className="animate-scale-in relative h-[420px] w-full overflow-hidden sm:ml-auto sm:h-[480px] sm:max-w-lg lg:h-[560px]">
          <Image
            src="/images/cars/lambo.jpg"
            alt="A grey Lamborghini Huracán, rear three-quarter view"
            fill
            sizes="(min-width: 1024px) 32rem, 90vw"
            className="object-cover object-[center_70%]"
          />
        </div>
      </Container>
    </section>
  );
}
