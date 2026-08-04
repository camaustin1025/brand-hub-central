import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import type { Asset, AssetFormat, AssetType } from "@/data/assets";

const BUCKET = "brand-assets";
const SIGNED_URL_TTL = 60 * 60; // 1 hour

function createServerSupabase() {
  const url = process.env.SUPABASE_URL!;
  const key = process.env.SUPABASE_PUBLISHABLE_KEY!;
  return createClient<Database>(url, key, {
    auth: { storage: undefined, persistSession: false, autoRefreshToken: false },
    global: {
      fetch: (input, init) => {
        const headers = new Headers(init?.headers);
        if (
          (key.startsWith("sb_publishable_") || key.startsWith("sb_secret_")) &&
          headers.get("Authorization") === `Bearer ${key}`
        ) {
          headers.delete("Authorization");
        }
        headers.set("apikey", key);
        return fetch(input, { ...init, headers });
      },
    },
  });
}

/**
 * A path starting with `/` (or a full URL) is a public /public asset or
 * external URL — use as-is. Anything else is treated as a `brand-assets`
 * bucket key and gets a short-lived signed URL.
 */
function isDirectUrl(path: string | null): boolean {
  if (!path) return false;
  return path.startsWith("/") || path.startsWith("http://") || path.startsWith("https://");
}

async function resolveUrl(
  supabase: ReturnType<typeof createServerSupabase>,
  path: string | null,
  /**
   * Signed URLs are cross-origin, and the `download` attribute on an anchor is
   * ignored cross-origin — the browser navigates instead, rendering PNGs and
   * SVGs in a tab. `download: true` puts the disposition on the URL itself,
   * which is the only thing that survives the origin hop.
   */
  forDownload = false,
): Promise<string | null> {
  if (!path) return null;
  if (isDirectUrl(path)) return path;
  const { data, error } = await supabase.storage
    .from(BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL, forDownload ? { download: true } : undefined);
  if (error || !data) return null;
  return data.signedUrl;
}

export type AssetWithCategory = Asset & {
  categorySlug: string | null;
  categoryLabel: string | null;
};

export const listAssets = createServerFn({ method: "GET" }).handler(async () => {
  const supabase = createServerSupabase();

  const [{ data: categories, error: catErr }, { data: assets, error: assetErr }] =
    await Promise.all([
      supabase.from("asset_categories").select("*").order("sort_order"),
      supabase.from("assets").select("*").eq("is_published", true).order("sort_order"),
    ]);

  if (catErr) throw new Error(catErr.message);
  if (assetErr) throw new Error(assetErr.message);

  const catBySlug = new Map((categories ?? []).map((c) => [c.id, c]));

  const rows: AssetWithCategory[] = await Promise.all(
    (assets ?? []).map(async (row) => {
      const cat = row.category_id ? catBySlug.get(row.category_id) : undefined;
      const [href, preview] = await Promise.all([
        resolveUrl(supabase, row.storage_path, true),
        resolveUrl(supabase, row.preview_path),
      ]);
      return {
        id: row.slug,
        title: row.title,
        description: row.description,
        type: row.type as AssetType,
        formats: (row.formats ?? []) as AssetFormat[],
        tags: row.tags ?? [],
        preview,
        previewBg: (row.preview_bg as "midnight" | "light" | undefined) ?? undefined,
        href,
        categorySlug: cat?.slug ?? null,
        categoryLabel: cat?.label ?? null,
      };
    }),
  );

  return {
    categories: (categories ?? []).map((c) => ({
      slug: c.slug,
      label: c.label,
      sort_order: c.sort_order,
    })),
    assets: rows,
  };
});
