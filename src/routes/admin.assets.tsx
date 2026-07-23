import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import {
  listAssetsAdmin,
  deleteAsset,
  setAssetPublished,
} from "@/lib/admin-assets.functions";

const assetsOpts = queryOptions({
  queryKey: ["admin", "assets"],
  queryFn: () => listAssetsAdmin(),
});

export const Route = createFileRoute("/admin/assets")({
  loader: ({ context }) => context.queryClient.ensureQueryData(assetsOpts),
  component: AssetsLayout,
});

function AssetsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  // Render child (new / $id) OR the list when on /admin/assets exactly.
  if (pathname !== "/admin/assets") return <Outlet />;
  return <AssetsList />;
}

function AssetsList() {
  const { data: assets } = useSuspenseQuery(assetsOpts);
  const qc = useQueryClient();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<string>("all");

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: ["admin", "assets"] });
    qc.invalidateQueries({ queryKey: ["assets"] });
  };

  const del = useMutation({
    mutationFn: (id: string) => deleteAsset({ data: { id } }),
    onSuccess: () => {
      toast.success("Deleted");
      invalidate();
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const togglePub = useMutation({
    mutationFn: (v: { id: string; is_published: boolean }) =>
      setAssetPublished({ data: v }),
    onSuccess: () => invalidate(),
    onError: (e: Error) => toast.error(e.message),
  });

  const categories = useMemo(() => {
    const set = new Map<string, string>();
    for (const a of assets) {
      if (a.category_id && a.category_label) set.set(a.category_id, a.category_label);
    }
    return Array.from(set, ([id, label]) => ({ id, label }));
  }, [assets]);

  const filtered = assets.filter((a) => {
    if (cat !== "all" && a.category_id !== cat) return false;
    if (q) {
      const hay = `${a.title} ${a.slug} ${a.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <div>
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Assets</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {assets.length} total · {assets.filter((a) => a.is_published).length} published
          </p>
        </div>
        <Link
          to="/admin/assets/new"
          className="inline-flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={14} /> New asset
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search title, slug, tags…"
          className="flex-1 min-w-60 rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Preview</th>
              <th className="px-4 py-3 text-left">Title</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Type</th>
              <th className="px-4 py-3 text-left">Formats</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No assets match.
                </td>
              </tr>
            )}
            {filtered.map((a) => (
              <tr key={a.id} className={a.is_published ? "" : "opacity-60"}>
                <td className="px-4 py-2 w-20">
                  {a.preview_url ? (
                    <img
                      src={a.preview_url}
                      alt=""
                      className="h-10 w-16 rounded object-contain bg-secondary"
                    />
                  ) : (
                    <div className="h-10 w-16 rounded bg-secondary" />
                  )}
                </td>
                <td className="px-4 py-2">
                  <div className="font-medium text-foreground">{a.title}</div>
                  <div className="text-xs font-mono text-muted-foreground">{a.slug}</div>
                </td>
                <td className="px-4 py-2 text-muted-foreground">
                  {a.category_label ?? "—"}
                </td>
                <td className="px-4 py-2 text-muted-foreground">{a.type}</td>
                <td className="px-4 py-2 text-muted-foreground">{a.formats.join(", ")}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() =>
                        togglePub.mutate({ id: a.id, is_published: !a.is_published })
                      }
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                      aria-label={a.is_published ? "Unpublish" : "Publish"}
                      title={a.is_published ? "Unpublish" : "Publish"}
                    >
                      {a.is_published ? <Eye size={14} /> : <EyeOff size={14} />}
                    </button>
                    <Link
                      to="/admin/assets/$id"
                      params={{ id: a.id }}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
                    >
                      <Pencil size={14} />
                    </Link>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${a.title}"?`)) del.mutate(a.id);
                      }}
                      className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-destructive"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
