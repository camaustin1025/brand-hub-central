/**
 * The v1 search index: a flat, in-memory list built from the content already
 * on the site (pages, color tokens, gradients, downloadable assets).
 *
 * It is deliberately small and client-side. v1.5 swaps the matcher for
 * Postgres FTS or Algolia against the assets table without changing the shape
 * of a `SearchHit`, so the omni bar's UI survives the switch.
 */

import { ALL_ROUTES } from "@/data/nav";
import { COLOR_GROUPS, GRADIENTS } from "@/data/tokens";
import { ASSETS } from "@/data/assets";

export type SearchHit = {
  id: string;
  /** Bucket shown as the trailing label on a result row. */
  kind: "Page" | "Color" | "Gradient" | "Download";
  title: string;
  subtitle: string;
  path: string;
  /** Material Symbols glyph for the result row. */
  icon: string;
  /** Lowercased haystack; never rendered. */
  terms: string;
};

const KIND_ICON = {
  Page: "description",
  Color: "palette",
  Gradient: "gradient",
  Download: "download",
} as const;

function hit(h: Omit<SearchHit, "icon" | "terms">, extraTerms: string[] = []): SearchHit {
  return {
    ...h,
    icon: KIND_ICON[h.kind],
    terms: [h.title, h.subtitle, h.kind, ...extraTerms].join(" ").toLowerCase(),
  };
}

export const SEARCH_INDEX: SearchHit[] = [
  ...ALL_ROUTES.map((r) =>
    hit({ id: `page:${r.path}`, kind: "Page", title: r.label, subtitle: r.blurb, path: r.path }),
  ),
  ...COLOR_GROUPS.flatMap((g) =>
    g.swatches.map((s) =>
      hit(
        {
          id: `color:${s.hex}`,
          kind: "Color",
          title: s.name,
          subtitle: `${s.hex} — ${s.usage}`,
          path: "/visual-identity",
        },
        [s.hex, s.rgb, "hex", "swatch"],
      ),
    ),
  ),
  ...GRADIENTS.map((g) =>
    hit(
      {
        id: `gradient:${g.name}`,
        kind: "Gradient",
        title: g.name,
        subtitle: g.css,
        path: "/visual-identity",
      },
      g.stops,
    ),
  ),
  ...ASSETS.map((a) =>
    hit(
      {
        id: `asset:${a.id}`,
        kind: "Download",
        title: a.title,
        subtitle: a.description,
        path: "/downloads",
      },
      [...a.tags, ...a.formats],
    ),
  ),
];

/**
 * Rank by where the query lands: a title prefix beats a title match, which
 * beats a match anywhere else. Every query term has to appear somewhere.
 */
export function searchHits(query: string, limit = 6): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const words = q.split(/\s+/);

  return SEARCH_INDEX.map((h) => {
    if (!words.every((w) => h.terms.includes(w))) return null;
    const title = h.title.toLowerCase();
    const score = title.startsWith(q) ? 0 : title.includes(q) ? 1 : 2;
    return { h, score };
  })
    .filter((r): r is { h: SearchHit; score: number } => r !== null)
    .sort((a, b) => a.score - b.score || a.h.title.localeCompare(b.h.title))
    .slice(0, limit)
    .map((r) => r.h);
}
