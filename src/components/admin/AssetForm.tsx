import { useState, useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";
import {
  listCategoriesAdmin,
  upsertAsset,
  uploadAssetFile,
} from "@/lib/admin-assets.functions";

const ASSET_TYPES = ["logo", "font", "token", "background", "social", "template"] as const;
const FORMATS = ["SVG", "PNG", "EPS", "TTF", "JSON", "CSS", "ZIP"] as const;
const PREVIEW_BGS = ["midnight", "light"] as const;

export type AssetFormValues = {
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
};

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.split(",")[1]);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AssetForm({
  initial,
  onSaved,
}: {
  initial: AssetFormValues;
  onSaved: (id: string) => void;
}) {
  const qc = useQueryClient();
  const { data: cats = [] } = useQuery({
    queryKey: ["admin", "categories"],
    queryFn: () => listCategoriesAdmin(),
  });

  const [v, setV] = useState<AssetFormValues>(initial);
  const [tagInput, setTagInput] = useState("");
  const [uploading, setUploading] = useState<"file" | "preview" | null>(null);

  const set = <K extends keyof AssetFormValues>(k: K, val: AssetFormValues[K]) =>
    setV((prev) => ({ ...prev, [k]: val }));

  const save = useMutation({
    mutationFn: (data: AssetFormValues) => upsertAsset({ data }),
    onSuccess: (r) => {
      toast.success("Saved");
      qc.invalidateQueries({ queryKey: ["admin", "assets"] });
      qc.invalidateQueries({ queryKey: ["assets"] });
      onSaved(r.id);
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const categorySlug = useMemo(
    () => cats.find((c) => c.id === v.category_id)?.slug ?? "misc",
    [cats, v.category_id],
  );

  const handleUpload = async (file: File, kind: "file" | "preview") => {
    setUploading(kind);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const folder = kind === "file" ? `assets/${categorySlug}` : "previews";
      const slug = v.slug || slugify(v.title) || "untitled";
      const path = `${folder}/${slug}-${Date.now()}.${ext}`;
      const base64 = await fileToBase64(file);
      const res = await uploadAssetFile({
        data: { path, contentType: file.type || "application/octet-stream", base64 },
      });
      if (kind === "file") set("storage_path", res.path);
      else set("preview_path", res.path);
      toast.success(`Uploaded ${kind}`);
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setUploading(null);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        save.mutate(v);
      }}
      className="space-y-6"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Title">
          <input
            required
            value={v.title}
            onChange={(e) => {
              set("title", e.target.value);
              if (!v.id && (!v.slug || v.slug === slugify(v.title))) {
                set("slug", slugify(e.target.value));
              }
            }}
            className={inputCls}
          />
        </Field>
        <Field label="Slug">
          <input
            required
            value={v.slug}
            onChange={(e) => set("slug", slugify(e.target.value))}
            className={`${inputCls} font-mono`}
          />
        </Field>
      </div>

      <Field label="Description">
        <textarea
          value={v.description}
          onChange={(e) => set("description", e.target.value)}
          rows={3}
          className={inputCls}
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="Category">
          <select
            value={v.category_id ?? ""}
            onChange={(e) => set("category_id", e.target.value || null)}
            className={inputCls}
          >
            <option value="">— None —</option>
            {cats.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Type">
          <select
            value={v.type}
            onChange={(e) => set("type", e.target.value)}
            className={inputCls}
          >
            {ASSET_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Preview background">
          <select
            value={v.preview_bg ?? ""}
            onChange={(e) => set("preview_bg", e.target.value || null)}
            className={inputCls}
          >
            <option value="">Default</option>
            {PREVIEW_BGS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Formats">
        <div className="flex flex-wrap gap-2">
          {FORMATS.map((f) => {
            const on = v.formats.includes(f);
            return (
              <button
                key={f}
                type="button"
                onClick={() =>
                  set(
                    "formats",
                    on ? v.formats.filter((x) => x !== f) : [...v.formats, f],
                  )
                }
                className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                  on
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-white text-foreground hover:bg-secondary"
                }`}
              >
                {f}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Tags">
        <div className="flex flex-wrap items-center gap-1 rounded-md border border-input bg-background p-1.5">
          {v.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1 rounded-full bg-secondary px-2 py-0.5 text-xs"
            >
              {t}
              <button
                type="button"
                onClick={() => set("tags", v.tags.filter((x) => x !== t))}
                className="text-muted-foreground hover:text-destructive"
              >
                <X size={10} />
              </button>
            </span>
          ))}
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => {
              if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
                e.preventDefault();
                const t = tagInput.trim();
                if (!v.tags.includes(t)) set("tags", [...v.tags, t]);
                setTagInput("");
              }
            }}
            placeholder="Type and press Enter"
            className="flex-1 min-w-32 bg-transparent px-1 text-sm outline-none"
          />
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <UploadField
          label="Downloadable file"
          currentPath={v.storage_path}
          uploading={uploading === "file"}
          onUpload={(f) => handleUpload(f, "file")}
          onClear={() => set("storage_path", null)}
        />
        <UploadField
          label="Preview image"
          currentPath={v.preview_path}
          uploading={uploading === "preview"}
          onUpload={(f) => handleUpload(f, "preview")}
          onClear={() => set("preview_path", null)}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Sort order">
          <input
            type="number"
            value={v.sort_order}
            onChange={(e) => set("sort_order", Number(e.target.value))}
            className={inputCls}
          />
        </Field>
        <Field label="Published">
          <label className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              checked={v.is_published}
              onChange={(e) => set("is_published", e.target.checked)}
              className="h-4 w-4 rounded border-input"
            />
            <span className="text-sm text-foreground">
              Visible on downloads page
            </span>
          </label>
        </Field>
      </div>

      <div className="flex items-center justify-end gap-2 border-t border-border pt-4">
        <button
          type="submit"
          disabled={save.isPending}
          className="rounded-md bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          {save.isPending ? "Saving…" : v.id ? "Save changes" : "Create asset"}
        </button>
      </div>
    </form>
  );
}

const inputCls =
  "w-full rounded-md border border-input bg-background px-3 py-2 text-sm";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      {children}
    </label>
  );
}

function UploadField({
  label,
  currentPath,
  uploading,
  onUpload,
  onClear,
}: {
  label: string;
  currentPath: string | null;
  uploading: boolean;
  onUpload: (f: File) => void;
  onClear: () => void;
}) {
  return (
    <Field label={label}>
      <div className="rounded-md border border-dashed border-input bg-background p-3">
        {currentPath ? (
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs font-mono text-muted-foreground">
              {currentPath}
            </span>
            <button
              type="button"
              onClick={onClear}
              className="rounded-md p-1 text-muted-foreground hover:text-destructive"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No file uploaded.</p>
        )}
        <label className="mt-2 inline-flex cursor-pointer items-center gap-1 rounded-md bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-secondary/80">
          <Upload size={12} />
          {uploading ? "Uploading…" : currentPath ? "Replace" : "Upload"}
          <input
            type="file"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) onUpload(f);
              e.target.value = "";
            }}
          />
        </label>
      </div>
    </Field>
  );
}
