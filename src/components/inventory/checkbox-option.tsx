export function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 text-sm text-foreground-muted transition-colors hover:text-foreground">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span
        aria-hidden="true"
        className={`flex h-4 w-4 shrink-0 items-center justify-center border transition-colors ${
          checked ? "border-accent bg-accent" : "border-border"
        }`}
      >
        {checked && (
          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
            <path d="M1 4l2 2 4-4" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      {label}
    </label>
  );
}
