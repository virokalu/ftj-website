import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/container";
import { InventoryBrowser } from "@/components/inventory/inventory-browser";
import { getAllCars } from "@/lib/cars/get-all-cars";

export const metadata: Metadata = {
  title: "Inventory",
  description:
    "Browse FTJ Exports' current showroom of verified luxury and JDM vehicles, ready for export.",
  alternates: { canonical: "/inventory" },
};

export default async function InventoryPage() {
  const [t, tf, cars] = await Promise.all([
    getTranslations("inventory"),
    getTranslations("home.fleet"),
    getAllCars(),
  ]);

  return (
    <section className="bg-ink py-20 sm:py-28">
      <Container>
        <InventoryBrowser
          cars={cars}
          labels={{
            heading: t("heading"),
            availableWord: t("availableWord"),
            sortBy: t("sortBy"),
            sort: {
              newest: t("sort.newest"),
              oldest: t("sort.oldest"),
              brandAsc: t("sort.brandAsc"),
              priceAsc: t("sort.priceAsc"),
              priceDesc: t("sort.priceDesc"),
            },
            filter: {
              heading: t("filter.heading"),
              clearAll: t("filter.clearAll"),
              price: t("filter.price"),
              category: t("filter.category"),
              brand: t("filter.brand"),
              transmission: t("filter.transmission"),
              fuelType: t("filter.fuelType"),
            },
            empty: t("empty"),
            inquire: tf("inquire"),
            specs: {
              year: tf("specs.year"),
              model: tf("specs.model"),
              engine: tf("specs.engine"),
              displacement: tf("specs.displacement"),
              transmission: tf("specs.transmission"),
              fuelType: tf("specs.fuelType"),
            },
          }}
        />
      </Container>
    </section>
  );
}
