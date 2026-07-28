/**
 * WCAG contrast maths, shared by the swatch badges and the legibility matrix on
 * /visual-identity. Kept in one place so the hub can never report two different
 * ratios for the same pair of colours.
 */

/** WCAG relative luminance for a #rrggbb hex. */
export function luminance(hex: string): number {
  const v = hex.replace("#", "");
  const rgb = [0, 2, 4].map((i) => {
    const c = parseInt(v.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/** Contrast ratio between two hex colors (1–21). */
export function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * The verdict a ratio earns *for body text*, which is the question the hub is
 * actually asking — most of its green is set at 12–15px.
 *
 * "Large only" is the 3:1 band: a genuine WCAG pass at 24px+, or 18.7px+ bold,
 * but a fail at body size. It is phrased this way rather than "AA Large"
 * because the badge pairs it with a ✗, and "✗ AA Large" reads as a
 * contradiction when what it means is "passes, but not for the size you're
 * probably setting".
 */
export type ContrastGrade = "AAA" | "AA" | "Large only" | "Fail";

export function grade(ratio: number): ContrastGrade {
  if (ratio >= 7) return "AAA";
  if (ratio >= 4.5) return "AA";
  if (ratio >= 3) return "Large only";
  return "Fail";
}

/** True when the pair clears AA for normal body text. */
export function passesBodyText(ratio: number): boolean {
  return ratio >= 4.5;
}
