"use client";

import { useRef, useState } from "react";
import { CarCard } from "@/components/cars/car-card";
import { Reveal } from "@/components/ui/reveal";
import type { WebsiteCar } from "@/lib/cars/types";

export function FleetCarousel({
  cars,
  inquireLabel,
  specLabels,
}: {
  cars: WebsiteCar[];
  inquireLabel: string;
  specLabels: {
    year: string;
    model: string;
    engine: string;
    displacement: string;
    transmission: string;
    fuelType: string;
  };
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  function scrollToIndex(index: number) {
    const track = trackRef.current;
    const card = track?.children[index] as HTMLElement | undefined;
    if (!track || !card) return;
    track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
    setActiveIndex(index);
  }

  function handleScroll() {
    const track = trackRef.current;
    if (!track) return;
    let closest = 0;
    let closestDistance = Infinity;
    Array.from(track.children).forEach((child, index) => {
      const el = child as HTMLElement;
      const distance = Math.abs(el.offsetLeft - track.offsetLeft - track.scrollLeft);
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = index;
      }
    });
    setActiveIndex(closest);
  }

  return (
    <div>
      <div
        ref={trackRef}
        onScroll={handleScroll}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cars.map((car, index) => (
          <Reveal
            key={car.id}
            delayMs={index * 100}
            className="w-[85%] shrink-0 snap-start sm:w-[46%] lg:w-[31%]"
          >
            <CarCard car={car} inquireLabel={inquireLabel} specLabels={specLabels} />
          </Reveal>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={() => scrollToIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
          aria-label="Previous vehicle"
          className="text-foreground-muted transition-colors hover:text-accent disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 2 4 8l6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex gap-3" role="tablist" aria-label="Featured fleet slides">
          {cars.map((car, index) => (
            <button
              key={car.id}
              type="button"
              role="tab"
              aria-selected={index === activeIndex}
              aria-label={`Show ${car.brand} ${car.model}`}
              onClick={() => scrollToIndex(index)}
              className={`h-2.5 w-2.5 rounded-full border border-foreground-muted transition-all ${
                index === activeIndex ? "bg-gradient-accent border-transparent" : "bg-transparent"
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => scrollToIndex(Math.min(cars.length - 1, activeIndex + 1))}
          disabled={activeIndex === cars.length - 1}
          aria-label="Next vehicle"
          className="text-foreground-muted transition-colors hover:text-accent disabled:opacity-30"
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 2l6 6-6 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
