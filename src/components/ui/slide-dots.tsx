export function SlideDots({ count, activeIndex = 0 }: { count: number; activeIndex?: number }) {
  return (
    <div aria-hidden="true" className="flex flex-col gap-3">
      {Array.from({ length: count }).map((_, index) => (
        <span
          key={index}
          className={`h-2.5 w-2.5 rounded-full border border-current ${
            index === activeIndex ? "bg-current" : "bg-transparent"
          }`}
        />
      ))}
    </div>
  );
}
