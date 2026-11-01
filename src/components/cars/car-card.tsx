import Image from "next/image";
import Link from "next/link";
import type { WebsiteCar } from "@/lib/cars/types";

type SpecLabels = {
  year: string;
  model: string;
  engine: string;
  displacement: string;
  transmission: string;
  fuelType: string;
};

export function CarCard({
  car,
  inquireLabel,
  specLabels,
  priority = false,
}: {
  car: WebsiteCar;
  inquireLabel: string;
  specLabels: SpecLabels;
  priority?: boolean;
}) {
  const cover = car.photos[0];

  const specs: Array<{ value: string; label: string }> = [
    { value: String(car.year), label: specLabels.year },
    { value: car.model, label: specLabels.model },
    { value: car.engine ?? "—", label: specLabels.engine },
    {
      value: car.displacementCc ? `${car.displacementCc}cc` : "—",
      label: specLabels.displacement,
    },
    { value: car.transmission, label: specLabels.transmission },
    { value: car.fuelType, label: specLabels.fuelType },
  ];

  return (
    <article className="flex h-full touch-pan-x touch-pan-y flex-col border border-border bg-surface select-none">
      <div className="relative h-[220px] w-full overflow-hidden sm:h-[240px]">
        {cover ? (
          <Image
            src={cover.url}
            alt={cover.alt}
            fill
            priority={priority}
            draggable={false}
            sizes="(min-width: 1024px) 380px, 85vw"
            className="object-cover"
          />
        ) : (
          <div className="h-full w-full bg-surface-raised" aria-hidden="true" />
        )}
      </div>

      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-lg font-semibold tracking-tight text-foreground">
          {car.brand} <span className="text-gradient-accent">{car.model}</span>
        </h3>
        {car.description && (
          <p className="mt-2 line-clamp-2 text-sm text-foreground-muted">{car.description}</p>
        )}

        <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-4">
          {specs.map((spec) => (
            <div key={spec.label} className="min-w-0">
              <dt className="text-[10px] font-medium tracking-[0.12em] text-foreground-muted uppercase">
                {spec.label}
              </dt>
              <dd className="mt-1 text-sm font-semibold break-words text-foreground">{spec.value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6 border-t border-border pt-4">
          <Link
            href={`/contact?vehicle=${car.slug}`}
            className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.15em] text-foreground uppercase transition-colors hover:text-accent"
          >
            {inquireLabel}
            <span
              aria-hidden="true"
              className="bg-gradient-accent flex h-5 w-5 items-center justify-center rounded-full text-white"
            >
              <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                <path
                  d="M1 5h8m0 0L5.5 1.5M9 5 5.5 8.5"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
