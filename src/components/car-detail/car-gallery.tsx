"use client";

import { useState } from "react";
import Image from "next/image";

export function CarGallery({ photos }: { photos: Array<{ url: string; alt: string }> }) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (photos.length === 0) {
    return <div className="h-[440px] w-full bg-surface-raised sm:h-[620px]" aria-hidden="true" />;
  }

  const active = photos[activeIndex];
  const thumbnails = photos
    .map((photo, index) => ({ photo, index }))
    .filter(({ index }) => index !== activeIndex)
    .slice(0, 2);

  return (
    <div className={`animate-fade-up grid gap-1 ${thumbnails.length > 0 ? "sm:grid-cols-[1fr_240px]" : ""}`}>
      <div className="relative h-[440px] w-full overflow-hidden sm:h-[620px]">
        <Image
          key={active.url}
          src={active.url}
          alt={active.alt}
          fill
          priority
          draggable={false}
          sizes="(min-width: 640px) 55vw, 100vw"
          className="animate-fade-in object-contain"
        />
      </div>

      {thumbnails.length > 0 && (
        <div className="grid gap-1 sm:grid-rows-2">
          {thumbnails.map(({ photo, index }) => (
            <button
              key={photo.url}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={photo.alt}
              className="group relative h-[150px] w-full overflow-hidden sm:h-full"
            >
              <Image
                src={photo.url}
                alt={photo.alt}
                fill
                draggable={false}
                sizes="240px"
                className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
