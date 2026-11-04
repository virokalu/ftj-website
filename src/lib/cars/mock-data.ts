import type { WebsiteCar } from "./types";

/**
 * Placeholder featured fleet. The CargoDev public API
 * (docs/cargodev-api-integration.md) will replace this once
 * `getFeaturedCars` is wired to `GET /api/public/stock`. Keeping the
 * shape identical to `WebsiteCar` means that swap touches one file.
 */
export const FEATURED_CARS: WebsiteCar[] = [
  {
    id: "featured-1",
    slug: "lamborghini-huracan-sto-2023",
    brand: "Lamborghini",
    model: "Huracán STO",
    year: 2023,
    category: "Premium",
    engine: "V10",
    displacementCc: 5204,
    transmission: "Automatic",
    fuelType: "Petrol",
    description:
      "Track-homologated and road legal: a naturally aspirated V10 flagship built for a buyer who wants presence on every street.",
    photos: [{ url: "/images/cars/fleet-1.jpg", alt: "Matte grey Lamborghini Huracán STO, front three-quarter view" }],
    featured: true,
    price: { amount: 142_000_000, currency: "LKR" },
  },
  {
    id: "featured-2",
    slug: "ferrari-458-speciale-2015",
    brand: "Ferrari",
    model: "458 Speciale",
    year: 2015,
    category: "Premium",
    engine: "V8",
    displacementCc: 4497,
    transmission: "Automatic",
    fuelType: "Petrol",
    description:
      "The hardcore, naturally aspirated send-off to the 458 line: razor-sharp throttle response and a soundtrack to match.",
    photos: [{ url: "/images/cars/fleet-2.jpg", alt: "Ferrari 458 Speciale with tricolor side livery, parked at night" }],
    featured: true,
    price: { amount: 68_000_000, currency: "LKR" },
  },
  {
    id: "featured-3",
    slug: "nissan-gt-r-2021",
    brand: "Nissan",
    model: "GT-R",
    year: 2021,
    category: "JDM",
    engine: "Twin-Turbo V6",
    displacementCc: 3799,
    transmission: "Automatic",
    fuelType: "Petrol",
    description:
      "Godzilla: a motorsport-bred chassis and all-wheel drive launch control built for the road.",
    photos: [{ url: "/images/cars/fleet-3.jpg", alt: "Black Nissan GT-R, rear three-quarter view" }],
    featured: true,
    price: null,
  },
  {
    id: "featured-4",
    slug: "mclaren-765lt-2021",
    brand: "McLaren",
    model: "765LT",
    year: 2021,
    category: "Premium",
    engine: "Twin-Turbo V8",
    displacementCc: 3994,
    transmission: "Automatic",
    fuelType: "Petrol",
    description:
      "McLaren's Longtail treatment: lighter, faster and sharper, with carbon fibre throughout and dihedral doors.",
    photos: [{ url: "/images/cars/fleet-4.jpg", alt: "McLaren 765LT with doors open, side profile" }],
    featured: true,
    price: { amount: 195_000_000, currency: "LKR" },
  },
];
