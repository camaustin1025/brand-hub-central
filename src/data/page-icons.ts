import type { IconGlyph } from "./icon-library";

/**
 * Glyphs drawn inline on hub pages, so a page does not fetch the full 70 KB glyph chunk
 * for one or two icons. Two kinds, both 48 x 48 Material Symbols Rounded:
 *
 * - Library glyphs, copied from icon-glyphs.json. `npm run test:hub` fails if any drifts.
 * - Page-only glyphs (PAGE_ONLY_ICONS), not in the downloadable library. Fetched from the
 *   same Google release the library uses (materialsymbolsrounded/<name>/default/48px.svg,
 *   Apache 2.0) and converted with build-glyphs.mjs's transform (scale 0.05, shift 960).
 *   The test fails if one later joins the library, so this copy can switch to it.
 */
export const PAGE_ICONS = {
  // Page-only: Material "work" (briefcase), fetched 2026-11-06.
  work: { name: "work", d: "M7 42 q-1.2 0-2.1-0.9 t-0.9-2.1 v-24 q0-1.2 0.9-2.1 t2.1-0.9 h9 v-5 q0-1.2 0.9-2.1 t2.1-0.9 h10 q1.2 0 2.1 0.9 t0.9 2.1 v5 h9 q1.2 0 2.1 0.9 t0.9 2.1 v24 q0 1.2-0.9 2.1 t-2.1 0.9 H7 Zm0-3 h34 v-24 H7 v24 Zm12-27 h10 v-5 H19 v5 ZM7 39 v-24 24 Z" },
  language: { name: "language", d: "M16.15 42.425 Q12.5 40.85 9.8 38.15 t-4.25-6.375 Q4 28.1 4 23.9 t1.55-7.825 Q7.1 12.45 9.8 9.75 t6.35-4.225 Q19.8 4 24 4 t7.85 1.525 Q35.5 7.05 38.2 9.75 t4.25 6.325 Q44 19.7 44 23.9 t-1.55 7.875 Q40.9 35.45 38.2 38.15 t-6.35 4.275 Q28.2 44 24 44 t-7.85-1.575 ZM24 41.1 q1.75-1.8 2.925-4.125 T28.85 31.45 H19.2 q0.7 3 1.875 5.4 t2.925 4.25 Zm-4.25-0.6 q-1.25-1.9-2.15-4.1 t-1.5-4.95 H8.6 q1.9 3.55 4.4 5.575 T19.75 40.5 Zm8.55-0.05 q3.6-1.15 6.475-3.45 T39.4 31.45 H31.95 q-0.65 2.7-1.525 4.9 T28.3 40.45 ZM7.6 28.45 h7.95 q-0.15-1.35-0.175-2.425 T15.35 23.9 q0-1.25 0.05-2.225 t0.2-2.175 H7.6 q-0.35 1.2-0.475 2.15 t-0.125 2.25 q0 1.3 0.125 2.325 T7.6 28.45 Zm11.05 0 h10.75 q0.2-1.55 0.25-2.525 t0.05-2.025 q0-1-0.05-1.925 t-0.25-2.475 H18.65 q-0.2 1.55-0.25 2.475 t-0.05 1.925 q0 1.05 0.05 2.025 t0.25 2.525 Zm13.75 0 h8 q0.35-1.2 0.475-2.225 T41 23.9 q0-1.3-0.125-2.25 t-0.475-2.15 H32.45 q0.15 1.75 0.2 2.675 t0.05 1.725 q0 1.1-0.075 2.075 T32.4 28.45 Zm-0.5-11.95 h7.5 q-1.65-3.45-4.525-5.75 T28.25 7.5 q1.25 1.85 2.125 4 T31.9 16.5 Zm-12.7 0 h9.7 q-0.55-2.65-1.85-5.125 T24 7 q-1.6 1.35-2.7 3.55 t-2.1 5.95 Zm-10.6 0 h7.55 q0.55-2.7 1.4-4.825 t2.15-4.125 q-3.75 0.95-6.55 3.2 t-4.55 5.75 Z" },
  swap_horiz: { name: "swap_horiz", d: "M9.7 31.85 l5 5 q0.45 0.45 0.45 1.05 t-0.45 1.05 q-0.45 0.45-1.05 0.45 t-1.05-0.45 L5.05 31.4 q-0.25-0.25-0.35-0.5 t-0.1-0.55 q0-0.3 0.1-0.55 t0.35-0.5 l7.55-7.55 q0.45-0.45 1.05-0.45 t1.05 0.45 q0.45 0.45 0.45 1.05 t-0.45 1.05 L9.7 28.85 h14.3 q0.65 0 1.075 0.425 T25.5 30.35 q0 0.65-0.425 1.075 T24 31.85 H9.7 Zm28.6-12.7 H24 q-0.65 0-1.075-0.425 T22.5 17.65 q0-0.65 0.425-1.075 T24 16.15 h14.3 L33.3 11.15 q-0.45-0.45-0.45-1.05 t0.45-1.05 q0.45-0.45 1.05-0.45 t1.05 0.45 l7.55 7.55 q0.25 0.25 0.35 0.5 t0.1 0.55 q0 0.3-0.1 0.55 t-0.35 0.5 L35.4 26.25 q-0.45 0.45-1.05 0.45 t-1.05-0.45 q-0.45-0.45-0.45-1.05 t0.45-1.05 l5-5 Z" },
} satisfies Record<string, IconGlyph>;

export type PageIconName = keyof typeof PAGE_ICONS;

/** Glyphs not in the downloadable icon library. See the note above. */
export const PAGE_ONLY_ICONS: ReadonlySet<PageIconName> = new Set<PageIconName>(["work"]);
