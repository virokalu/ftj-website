"use client";

import { useMemo, useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { CarCard } from "@/components/cars/car-card";
import { Counter } from "@/components/animations/counter";
import { Reveal } from "@/components/ui/reveal";
import { FilterSection } from "@/components/inventory/filter-section";
import { CheckboxOption } from "@/components/inventory/checkbox-option";
import { SortMenu, type SortValue } from "@/components/inventory/sort-menu";
import { AccentDivider } from "@/components/ui/accent-divider";
import type { WebsiteCar } from "@/lib/cars/types";

type Labels = {
  heading: string;
  availableWord: string;
  sortBy: string;
  sort: { newest: string; oldest: string; brandAsc: string; priceAsc: string; priceDesc: string };
  filter: {
    heading: string;
    clearAll: string;
    price: string;
    category: string;
    brand: string;
    transmission: string;
    fuelType: string;
  };
  empty: string;
  inquire: string;
  specs: {
    year: string;
    model: string;
    engine: string;
    displacement: string;
    transmission: string;
    fuelType: string;
  };
};

/**
 * LKR is the only currency the CargoDev API returns
 * (docs/cargodev-api-integration.md, section 5) — buckets stay in LKR
 * rather than converting. `max` is exclusive; the open-ended top bucket
 * has none. Unpriced listings never match any bucket.
 */
const PRICE_BUCKETS: Array<{ id: string; min?: number; max?: number; label: string }> = [
  { id: "under-75m", max: 75_000_000, label: "Under LKR 75M" },
  { id: "75m-125m", min: 75_000_000, max: 125_000_000, label: "LKR 75M – 125M" },
  { id: "125m-175m", min: 125_000_000, max: 175_000_000, label: "LKR 125M – 175M" },
  { id: "175m-plus", min: 175_000_000, label: "LKR 175M+" },
];

function toggleInSet(set: Set<string>, value: string) {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

function matchesPriceBuckets(car: WebsiteCar, bucketIds: Set<string>) {
  if (bucketIds.size === 0) return true;
  if (!car.price) return false;
  const amount = car.price.amount;
  return PRICE_BUCKETS.some(
    (bucket) => bucketIds.has(bucket.id) && amount >= (bucket.min ?? -Infinity) && amount < (bucket.max ?? Infinity),
  );
}

export function InventoryBrowser({ cars, labels }: { cars: WebsiteCar[]; labels: Labels }) {
  const [priceBuckets, setPriceBuckets] = useState<Set<string>>(new Set());
  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [transmissions, setTransmissions] = useState<Set<string>>(new Set());
  const [fuelTypes, setFuelTypes] = useState<Set<string>>(new Set());
  const [sort, setSort] = useState<SortValue>("newest");
  // Cards glide to their new spots when filters/sort change (respects reduced motion).
  const [gridRef] = useAutoAnimate<HTMLDivElement>({ duration: 350, easing: "ease-out" });

  const facets = useMemo(
    () => ({
      categories: Array.from(new Set(cars.map((car) => car.category))).sort(),
      brands: Array.from(new Set(cars.map((car) => car.brand))).sort(),
      transmissions: Array.from(new Set(cars.map((car) => car.transmission))).sort(),
      fuelTypes: Array.from(new Set(cars.map((car) => car.fuelType))).sort(),
    }),
    [cars],
  );

  const filtered = useMemo(() => {
    const result = cars.filter(
      (car) =>
        matchesPriceBuckets(car, priceBuckets) &&
        (categories.size === 0 || categories.has(car.category)) &&
        (brands.size === 0 || brands.has(car.brand)) &&
        (transmissions.size === 0 || transmissions.has(car.transmission)) &&
        (fuelTypes.size === 0 || fuelTypes.has(car.fuelType)),
    );

    return result.sort((a, b) => {
      if (sort === "newest") return b.year - a.year;
      if (sort === "oldest") return a.year - b.year;
      if (sort === "priceAsc") return (a.price?.amount ?? Infinity) - (b.price?.amount ?? Infinity);
      if (sort === "priceDesc") return (b.price?.amount ?? -Infinity) - (a.price?.amount ?? -Infinity);
      return a.brand.localeCompare(b.brand);
    });
  }, [cars, priceBuckets, categories, brands, transmissions, fuelTypes, sort]);

  const activeCount =
    priceBuckets.size + categories.size + brands.size + transmissions.size + fuelTypes.size;

  function clearAll() {
    setPriceBuckets(new Set());
    setCategories(new Set());
    setBrands(new Set());
    setTransmissions(new Set());
    setFuelTypes(new Set());
  }

  return (
    <div className="grid gap-12 lg:grid-cols-[260px_1fr] lg:gap-16">
      <aside className="animate-fade-up">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-[0.1em] text-foreground uppercase">
            {labels.filter.heading}
          </h2>
          {activeCount > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="text-xs font-medium tracking-[0.1em] text-foreground-muted uppercase transition-colors hover:text-accent"
            >
              {labels.filter.clearAll}
            </button>
          )}
        </div>

        <FilterSection title={labels.filter.price} defaultOpen>
          {PRICE_BUCKETS.map((bucket) => (
            <CheckboxOption
              key={bucket.id}
              label={bucket.label}
              checked={priceBuckets.has(bucket.id)}
              onChange={() => setPriceBuckets((prev) => toggleInSet(prev, bucket.id))}
            />
          ))}
        </FilterSection>

        <FilterSection title={labels.filter.category} defaultOpen>
          {facets.categories.map((category) => (
            <CheckboxOption
              key={category}
              label={category}
              checked={categories.has(category)}
              onChange={() => setCategories((prev) => toggleInSet(prev, category))}
            />
          ))}
        </FilterSection>

        <FilterSection title={labels.filter.brand}>
          {facets.brands.map((brand) => (
            <CheckboxOption
              key={brand}
              label={brand}
              checked={brands.has(brand)}
              onChange={() => setBrands((prev) => toggleInSet(prev, brand))}
            />
          ))}
        </FilterSection>

        <FilterSection title={labels.filter.transmission}>
          {facets.transmissions.map((transmission) => (
            <CheckboxOption
              key={transmission}
              label={transmission}
              checked={transmissions.has(transmission)}
              onChange={() => setTransmissions((prev) => toggleInSet(prev, transmission))}
            />
          ))}
        </FilterSection>

        <FilterSection title={labels.filter.fuelType}>
          {facets.fuelTypes.map((fuelType) => (
            <CheckboxOption
              key={fuelType}
              label={fuelType}
              checked={fuelTypes.has(fuelType)}
              onChange={() => setFuelTypes((prev) => toggleInSet(prev, fuelType))}
            />
          ))}
        </FilterSection>

        <AccentDivider className="opacity-70" />
      </aside>

      <div>
        <div className="animate-fade-up flex flex-wrap items-end justify-between gap-6" style={{ animationDelay: "100ms" }}>
          <div>
            <h1 className="text-2xl font-semibold tracking-[0.05em] text-foreground uppercase sm:text-3xl">
              {labels.heading}
            </h1>
            <p className="mt-2 text-xs font-medium tracking-[0.15em] text-foreground-muted uppercase">
              <Counter value={filtered.length} /> {labels.availableWord}
            </p>
          </div>

          <SortMenu
            value={sort}
            onChange={setSort}
            label={labels.sortBy}
            options={[
              { value: "newest", label: labels.sort.newest },
              { value: "oldest", label: labels.sort.oldest },
              { value: "brandAsc", label: labels.sort.brandAsc },
              { value: "priceAsc", label: labels.sort.priceAsc },
              { value: "priceDesc", label: labels.sort.priceDesc },
            ]}
          />
        </div>

        {filtered.length === 0 ? (
          <p className="mt-16 text-sm text-foreground-muted">{labels.empty}</p>
        ) : (
          <div ref={gridRef} className="mt-10 grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((car, index) => (
              <Reveal key={car.id} delayMs={(index % 3) * 100}>
                <CarCard car={car} inquireLabel={labels.inquire} specLabels={labels.specs} priority={index < 3} />
              </Reveal>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
