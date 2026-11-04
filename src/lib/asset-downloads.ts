import { supabase } from "@/integrations/supabase/client";

/**
 * One row per download, for the north-star metric (brand assets downloaded each week).
 * Icons are the first asset type to report; other downloads can call this the same way.
 */
export type AssetDownloadType = "icon" | "icon_set";
export type AssetDownloadPayload = {
  user_id: string;
  asset_type: AssetDownloadType;
  /** Icon name for a single icon; "all", a category id, or "search" for a set. */
  asset_id: string;
  /** Background, color and treatment, e.g. "light_brand-green_tinted". */
  variant: string | null;
  format: string;
  item_count: number;
};

// The insert-only table ships in drizzle/migrations/0004. Keep the generated Database type untouched.
type AssetDownloadWriter = {
  from(table: "asset_download_events"): { insert(payload: AssetDownloadPayload): PromiseLike<unknown> };
};

export function recordAssetDownload(userId: string | null | undefined, event: Omit<AssetDownloadPayload, "user_id">): void {
  if (!userId) return;
  const payload: AssetDownloadPayload = { user_id: userId, ...event };
  try {
    // Local development never writes to the shared metrics table.
    if (import.meta.env.DEV) { console.info("[asset-download]", payload); return; }
    void Promise.resolve((supabase as unknown as AssetDownloadWriter).from("asset_download_events").insert(payload)).catch(() => {});
  } catch { /* Tracking must never interrupt a download. */ }
}
