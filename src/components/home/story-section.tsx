import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { ReadMoreLink } from "@/components/ui/read-more-link";
import { Reveal } from "@/components/ui/reveal";
import { SlideDots } from "@/components/ui/slide-dots";

export async function StorySection() {
  const t = await getTranslations("home.story");

  return (
    <section className="bg-paper py-24 text-on-paper sm:py-32">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="relative flex gap-8">
          <div aria-hidden="true" className="hidden pt-2 text-on-paper-muted sm:block">
            <SlideDots count={3} activeIndex={0} />
          </div>
          <div>
            <h2 className="max-w-sm text-2xl font-semibold tracking-tight text-on-paper sm:text-3xl">
              {t("headline")}
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-on-paper-muted">{t("body")}</p>
            <div className="mt-6">
              <ReadMoreLink href="/about" tone="dark">
                {t("cta")}
              </ReadMoreLink>
            </div>
          </div>
        </div>

        <Reveal from="right" className="sm:ml-auto sm:max-w-md">
          <div className="relative aspect-4/5 w-full overflow-hidden">
            <Image
              src="/images/cars/story-motorsport.jpg"
              alt="Aerial view of a coastal motorsport race circuit winding through a hillside landscape"
              fill
              sizes="(min-width: 1024px) 28rem, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
