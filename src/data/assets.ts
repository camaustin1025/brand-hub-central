/**
 * The asset model. Shared by the Downloads grid, the /admin editor, and the
 * Home search index.
 *
 * Types only. The asset rows themselves live in the `assets` table and are
 * read through lib/assets-query.ts — a second hardcoded copy here is what let
 * search and Downloads drift apart, so don't reintroduce one. The original
 * seed rows are in supabase/migrations/, and git history has the old array.
 *
 * `href: null` marks an asset still being re-sourced (every old-hub download
 * link was dead — see docs/Phase 0 - Old Hub Content Audit.md).
 */

export type AssetType = "logo" | "font" | "token" | "background" | "social" | "template";

export type AssetFormat = "SVG" | "PNG" | "EPS" | "TTF" | "JSON" | "CSS" | "ZIP";

export type Asset = {
  id: string;
  title: string;
  description: string;
  type: AssetType;
  formats: AssetFormat[];
  tags: string[];
  preview: string | null;
  previewBg?: "midnight" | "light";
  href: string | null;
};
