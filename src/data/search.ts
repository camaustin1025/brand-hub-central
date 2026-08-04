/**
 * The v1 search index.
 *
 * Split by where the content actually lives. Pages, color tokens, and
 * gradients are canon and ship in the bundle, so they are indexed statically.
 * Assets live in the `assets` table, so they are indexed from the same query
 * the Downloads page renders (lib/assets-query.ts) — search and Downloads can
 * never disagree about what exists.
 *
 * The matcher is small and client-side. v1.5 can swap it for Postgres FTS or
 * Algolia without changing `SearchHit`, so the omni bar survives the switch.
 */

import type { Asset } from "@/data/assets";
import { ALL_ROUTES } from "@/data/nav";
import { COLOR_GROUPS, GRADIENTS } from "@/data/tokens";

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

/** The fields the index needs off an asset row, whatever its source. */
export type IndexableAsset = Pick<Asset, "id" | "title" | "description" | "tags" | "formats"> & {
  categoryLabel?: string | null;
};

const KIND_ICON = {
  Page: "description",
  Color: "palette",
  Gradient: "gradient",
  Download: "download",
} as const;

function hit(h: Omit<SearchHit, "icon" | "terms">, extraTerms: (string | null | undefined)[] = []) {
  return {
    ...h,
    icon: KIND_ICON[h.kind],
    terms: [h.title, h.subtitle, h.kind, ...extraTerms].filter(Boolean).join(" ").toLowerCase(),
  };
}

/** Pages, colors, and gradients — canon, always available, no network. */
export const STATIC_HITS: SearchHit[] = [
  ...ALL_ROUTES.map((r) =>
    hit(
      { id: `page:${r.path}`, kind: "Page", title: r.label, subtitle: r.blurb, path: r.path },
      // Retired labels ride along here, so renaming a route in the nav never
      // costs it a search hit under the name people still type.
      r.terms,
    ),
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
];

/**
 * Index the live asset rows. Only published assets reach here (listAssets
 * filters on is_published), so search never surfaces a draft.
 */
export function assetHits(assets: IndexableAsset[]): SearchHit[] {
  return assets.map((a) =>
    hit(
      {
        id: `asset:${a.id}`,
        kind: "Download",
        title: a.title,
        subtitle: a.categoryLabel ? `${a.categoryLabel} — ${a.description}` : a.description,
        path: "/downloads",
      },
      [...a.tags, ...a.formats, a.categoryLabel],
    ),
  );
}

/**
 * Rank by where the query lands: a title prefix beats a title match, which
 * beats a match anywhere else. Every query term has to appear somewhere.
 */
export function searchHits(query: string, index: SearchHit[], limit = 6): SearchHit[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const words = q.split(/\s+/);

  return index
    .map((h) => {
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
