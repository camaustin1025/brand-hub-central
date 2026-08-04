import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";
import { requireAdmin } from "@/lib/admin-session";

const BUCKET = "brand-assets";
const SIGNED_URL_TTL = 60 * 60;

// Every function in this module runs with the service role and therefore
// bypasses RLS, so every one of them carries `requireAdmin` — the check has to
// be on the server, because a serverFn is a public HTTP endpoint no matter what
// the UI does. Do not add an export here without that middleware.
function createServerSupabase() {
  const url = process.env.SUPABASE_URL!;
  // No fallback to the publishable key. `anon` no longer holds write grants
  // (see the lock_down_anon_writes migration) and cannot read unpublished
  // drafts, so falling back would turn a misconfiguration into a run of
  // confusing row-level failures instead of one clear error.
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!key) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set; admin operations are unavailable.");
  }
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

async function resolveSigned(
  supabase: ReturnType<typeof createServerSupabase>,
  path: string | null,
): Promise<string | null> {
  if (!path) return null;
  if (path.startsWith("/") || path.startsWith("http")) return path;
  const { data } = await supabase.storage.from(BUCKET).createSignedUrl(path, SIGNED_URL_TTL);
  return data?.signedUrl ?? null;
}

export type AdminCategory = {
  id: string;
  slug: string;
  label: string;
  sort_order: number;
  asset_count: number;
};

export type AdminAsset = {
  id: string;
  slug: string;
  title: string;
  description: string;
  category_id: string | null;
  category_label: string | null;
  type: string;
  formats: string[];
  tags: string[];
  storage_path: string | null;
  preview_path: string | null;
  preview_bg: string | null;
  is_published: boolean;
  sort_order: number;
  updated_at: string;
  preview_url: string | null;
};

// ---------- Categories ----------

export const listCategoriesAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const supabase = createServerSupabase();
    const [{ data: cats, error: e1 }, { data: assets, error: e2 }] = await Promise.all([
      supabase.from("asset_categories").select("*").order("sort_order"),
      supabase.from("assets").select("category_id"),
    ]);
    if (e1) throw new Error(e1.message);
    if (e2) throw new Error(e2.message);
    const counts = new Map<string, number>();
    for (const a of assets ?? []) {
      if (a.category_id) counts.set(a.category_id, (counts.get(a.category_id) ?? 0) + 1);
    }
    return (cats ?? []).map<AdminCategory>((c) => ({
      id: c.id,
      slug: c.slug,
      label: c.label,
      sort_order: c.sort_order,
      asset_count: counts.get(c.id) ?? 0,
    }));
  });

export const upsertCategory = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: { id?: string; slug: string; label: string; sort_order: number }) => data)
  .handler(async ({ data }) => {
    const supabase = createServerSupabase();
    if (data.id) {
      const { error } = await supabase
        .from("asset_categories")
        .update({ slug: data.slug, label: data.label, sort_order: data.sort_order })
        .eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await supabase
      .from("asset_categories")
      .insert({ slug: data.slug, label: data.label, sort_order: data.sort_order })
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteCategory = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createServerSupabase();
    const { count } = await supabase
      .from("assets")
      .select("id", { count: "exact", head: true })
      .eq("category_id", data.id);
    if ((count ?? 0) > 0) {
      throw new Error(`Category has ${count} asset(s). Reassign or delete those first.`);
    }
    const { error } = await supabase.from("asset_categories").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Assets ----------

export const listAssetsAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .handler(async () => {
    const supabase = createServerSupabase();
    const [{ data: cats }, { data: assets, error }] = await Promise.all([
      supabase.from("asset_categories").select("id,label"),
      supabase.from("assets").select("*").order("sort_order"),
    ]);
    if (error) throw new Error(error.message);
    const catMap = new Map((cats ?? []).map((c) => [c.id, c.label]));
    const rows: AdminAsset[] = await Promise.all(
      (assets ?? []).map(async (a) => ({
        id: a.id,
        slug: a.slug,
        title: a.title,
        description: a.description,
        category_id: a.category_id,
        category_label: a.category_id ? (catMap.get(a.category_id) ?? null) : null,
        type: a.type,
        formats: a.formats ?? [],
        tags: a.tags ?? [],
        storage_path: a.storage_path,
        preview_path: a.preview_path,
        preview_bg: a.preview_bg,
        is_published: a.is_published,
        sort_order: a.sort_order,
        updated_at: a.updated_at,
        preview_url: await resolveSigned(supabase, a.preview_path),
      })),
    );
    return rows;
  });

export const getAssetAdmin = createServerFn({ method: "GET" })
  .middleware([requireAdmin])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createServerSupabase();
    const { data: a, error } = await supabase.from("assets").select("*").eq("id", data.id).single();
    if (error) throw new Error(error.message);
    const preview_url = await resolveSigned(supabase, a.preview_path);
    const file_url = await resolveSigned(supabase, a.storage_path);
    return { ...a, preview_url, file_url };
  });

export const upsertAsset = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    (data: {
      id?: string;
      slug: string;
      title: string;
      description: string;
      category_id: string | null;
      type: string;
      formats: string[];
      tags: string[];
      storage_path: string | null;
      preview_path: string | null;
      preview_bg: string | null;
      is_published: boolean;
      sort_order: number;
    }) => data,
  )
  .handler(async ({ data }) => {
    const supabase = createServerSupabase();
    const payload = {
      slug: data.slug,
      title: data.title,
      description: data.description,
      category_id: data.category_id,
      type: data.type,
      formats: data.formats,
      tags: data.tags,
      storage_path: data.storage_path,
      preview_path: data.preview_path,
      preview_bg: data.preview_bg,
      is_published: data.is_published,
      sort_order: data.sort_order,
      updated_at: new Date().toISOString(),
    };
    if (data.id) {
      const { error } = await supabase.from("assets").update(payload).eq("id", data.id);
      if (error) throw new Error(error.message);
      return { id: data.id };
    }
    const { data: row, error } = await supabase
      .from("assets")
      .insert(payload)
      .select("id")
      .single();
    if (error) throw new Error(error.message);
    return { id: row.id };
  });

export const deleteAsset = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: { id: string }) => data)
  .handler(async ({ data }) => {
    const supabase = createServerSupabase();
    const { error } = await supabase.from("assets").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const setAssetPublished = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator((data: { id: string; is_published: boolean }) => data)
  .handler(async ({ data }) => {
    const supabase = createServerSupabase();
    const { error } = await supabase
      .from("assets")
      .update({ is_published: data.is_published })
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

// ---------- Upload ----------
// Accepts base64-encoded file bytes and stores in the brand-assets bucket.
// Returns the bucket path (not a URL) so the caller can save it as
// storage_path / preview_path.

/** Bytes. Base64 inflates ~4/3, so the encoded body is ~13MB at this ceiling. */
const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

/** The only prefixes an upload may land under. */
const ALLOWED_PREFIXES = ["assets/", "previews/"];

const ALLOWED_CONTENT_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/svg+xml",
  "image/webp",
  "image/gif",
  "font/ttf",
  "font/woff2",
  "application/json",
  "text/css",
  "application/zip",
  "application/pdf",
  "application/postscript",
  "application/octet-stream",
]);

/**
 * The caller chooses the object key, so it has to be constrained here: an
 * unconstrained key plus `upsert` lets a caller overwrite any object in the
 * bucket — including the canonical logos every consumer of the hub reads.
 * Reject traversal, absolute paths, and anything outside the two known folders.
 */
function assertSafeUploadPath(path: string): void {
  if (!path || path.length > 200) throw new Error("Invalid upload path");
  if (!/^[a-zA-Z0-9/._-]+$/.test(path)) throw new Error("Invalid upload path");
  if (path.startsWith("/") || path.includes("..") || path.includes("//")) {
    throw new Error("Invalid upload path");
  }
  if (!ALLOWED_PREFIXES.some((p) => path.startsWith(p))) {
    throw new Error("Invalid upload path");
  }
}

export const uploadAssetFile = createServerFn({ method: "POST" })
  .middleware([requireAdmin])
  .inputValidator(
    (data: {
      path: string; // e.g. "assets/logos/logo-dark.svg"
      contentType: string;
      base64: string;
    }) => data,
  )
  .handler(async ({ data }) => {
    assertSafeUploadPath(data.path);
    if (!ALLOWED_CONTENT_TYPES.has(data.contentType)) {
      throw new Error(`Unsupported content type: ${data.contentType}`);
    }
    // Check the encoded length before decoding, so an oversized body is
    // rejected without ever being materialised.
    if (typeof data.base64 !== "string" || data.base64.length > MAX_UPLOAD_BYTES * 1.4) {
      throw new Error("File is too large (10MB max)");
    }

    const supabase = createServerSupabase();
    const bytes = Uint8Array.from(atob(data.base64), (c) => c.charCodeAt(0));
    if (bytes.byteLength > MAX_UPLOAD_BYTES) {
      throw new Error("File is too large (10MB max)");
    }
    const { error } = await supabase.storage.from(BUCKET).upload(data.path, bytes, {
      contentType: data.contentType,
      upsert: true,
    });
    if (error) throw new Error(error.message);
    return { path: data.path };
  });
