/**
 * The public stock contract only gives a free-text `colour` name, no hex
 * value — this maps common keywords to a representative swatch so the
 * detail page can show a colour chip. Unrecognised names (e.g. "Tricolor")
 * fall back to a neutral grey rather than guessing.
 */
const KNOWN_COLOURS: Array<[string, string]> = [
  ["red", "#c81e2c"],
  ["black", "#0a0a0a"],
  ["yellow", "#f2c200"],
  ["white", "#f5f5f5"],
  ["grey", "#6b6b6b"],
  ["gray", "#6b6b6b"],
  ["blue", "#1d3a8f"],
  ["green", "#1f5c3a"],
  ["silver", "#b8bcc2"],
  ["orange", "#e3651d"],
];

export function colourSwatchHex(colour: string | null): string {
  if (!colour) return "#3a3a3a";
  const key = colour.toLowerCase();
  const match = KNOWN_COLOURS.find(([name]) => key.includes(name));
  return match ? match[1] : "#3a3a3a";
}
