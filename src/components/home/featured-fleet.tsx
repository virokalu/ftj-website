import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { FleetCarousel } from "@/components/home/fleet-carousel";
import { ReadMoreLink } from "@/components/ui/read-more-link";
import { getFeaturedCars } from "@/lib/cars/get-featured-cars";

export async function FeaturedFleet() {
  const [t, cars] = await Promise.all([getTranslations("home.fleet"), getFeaturedCars()]);

  if (cars.length === 0) return null;

  return (
    <section id="featured-fleet" className="bg-ink py-24 sm:py-32">
      <Container>
        <div className="text-center">
          <h2 className="text-gradient-accent text-2xl font-semibold tracking-[0.15em] uppercase sm:text-3xl">
            {t("heading")}
          </h2>
          <p className="mt-3 text-sm text-foreground-muted">{t("subheading")}</p>
        </div>

        <div className="mt-14">
          <FleetCarousel
            cars={cars}
            inquireLabel={t("inquire")}
            specLabels={{
              year: t("specs.year"),
              model: t("specs.model"),
              engine: t("specs.engine"),
              displacement: t("specs.displacement"),
              transmission: t("specs.transmission"),
              fuelType: t("specs.fuelType"),
            }}
          />
        </div>

        <div className="mt-12 flex justify-center">
          <ReadMoreLink href="/inventory">{t("viewAll")}</ReadMoreLink>
        </div>
      </Container>
    </section>
  );
}
