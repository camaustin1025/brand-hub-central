import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import {
  listCategoriesAdmin,
  upsertCategory,
  deleteCategory,
  type AdminCategory,
} from "@/lib/admin-assets.functions";

const catsOpts = queryOptions({
  queryKey: ["admin", "categories"],
  queryFn: () => listCategoriesAdmin(),
});

export const Route = createFileRoute("/admin/categories")({
  loader: ({ context }) => context.queryClient.ensureQueryData(catsOpts),
  component: CategoriesPage,
});

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function CategoriesPage() {
  const { data: cats } = useSuspenseQuery(catsOpts);
  const qc = useQueryClient();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "categories"] });
    qc.invalidateQueries({ queryKey: ["assets"] });
  };

  const upsert = useMutation({
    mutationFn: (data: Parameters<typeof upsertCategory>[0]["data"]) =>
      upsertCategory({ data }),
    onSuccess: () => {
      toast.success("Saved");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const del = useMutation({
    mutationFn: (id: string) => deleteCategory({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const [newLabel, setNewLabel] = useState("");
  const [newSlug, setNewSlug] = useState("");

  return (
    <div>
      <h1 className="text-2xl font-semibold text-foreground">Categories</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Group assets in the downloads page.
      </p>

      <div className="mt-6 rounded-xl border border-border bg-white">
        <div className="border-b border-border px-5 py-4">
          <h2 className="text-sm font-semibold">Add category</h2>
          <div className="mt-3 grid gap-2 sm:grid-cols-[1fr,1fr,auto]">
            <input
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Label (e.g. Logos)"
              value={newLabel}
              onChange={(e) => {
                setNewLabel(e.target.value);
                if (!newSlug) setNewSlug(slugify(e.target.value));
              }}
            />
            <input
              className="rounded-md border border-input bg-background px-3 py-2 text-sm font-mono"
              placeholder="slug"
              value={newSlug}
              onChange={(e) => setNewSlug(slugify(e.target.value))}
            />
            <button
              disabled={!newLabel || !newSlug || upsert.isPending}
              onClick={() =>
                upsert.mutate(
                  {
                    slug: newSlug,
                    label: newLabel,
                    sort_order: (cats[cats.length - 1]?.sort_order ?? 0) + 10,
                  },
                  {
                    onSuccess: () => {
                      setNewLabel("");
                      setNewSlug("");
                    },
                  },
                )
              }
              className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              <Plus size={14} /> Add
            </button>
          </div>
        </div>

        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-5 py-3 text-left">Label</th>
              <th className="px-5 py-3 text-left">Slug</th>
              <th className="px-5 py-3 text-left">Order</th>
              <th className="px-5 py-3 text-left">Assets</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cats.map((c) => (
              <CategoryRow
                key={c.id}
                cat={c}
                onSave={(patch) => upsert.mutate({ id: c.id, ...patch })}
                onDelete={() => {
                  if (confirm(`Delete "${c.label}"?`)) del.mutate(c.id);
                }}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CategoryRow({
  cat,
  onSave,
  onDelete,
}: {
  cat: AdminCategory;
  onSave: (patch: { slug: string; label: string; sort_order: number }) => void;
  onDelete: () => void;
}) {
  const [label, setLabel] = useState(cat.label);
  const [slug, setSlug] = useState(cat.slug);
  const [order, setOrder] = useState(cat.sort_order);
  const dirty = label !== cat.label || slug !== cat.slug || order !== cat.sort_order;

  return (
    <tr>
      <td className="px-5 py-2">
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
        />
      </td>
      <td className="px-5 py-2">
        <input
          value={slug}
          onChange={(e) => setSlug(slugify(e.target.value))}
          className="w-full rounded-md border border-input bg-background px-2 py-1 text-sm font-mono"
        />
      </td>
      <td className="px-5 py-2 w-24">
        <input
          type="number"
          value={order}
          onChange={(e) => setOrder(Number(e.target.value))}
          className="w-20 rounded-md border border-input bg-background px-2 py-1 text-sm"
        />
      </td>
      <td className="px-5 py-2 text-muted-foreground">{cat.asset_count}</td>
      <td className="px-5 py-2 text-right">
        <div className="flex justify-end gap-2">
          {dirty && (
            <button
              onClick={() => onSave({ slug, label, sort_order: order })}
              className="rounded-md bg-primary px-3 py-1 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save
            </button>
          )}
          <button
            onClick={onDelete}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
            aria-label="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </td>
    </tr>
  );
}
