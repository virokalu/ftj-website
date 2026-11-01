const GRADIENT =
  "linear-gradient(90deg, transparent 0%, #8a0b14 18%, #b35910 50%, #8a0b14 82%, transparent 100%)";

/**
 * The muted red-to-orange accent line used under the header and in the
 * footer — a faint crisp line with a softer blurred glow beneath it, both
 * sharing the same gradient so every instance looks identical.
 */
export function AccentDivider({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative h-px ${className}`}>
      <div
        className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 opacity-10 blur-sm"
        style={{ backgroundImage: GRADIENT }}
      />
      <div className="relative h-px opacity-35" style={{ backgroundImage: GRADIENT }} />
    </div>
  );
}
