import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useSuspenseQuery, queryOptions } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { AssetForm } from "@/components/admin/AssetForm";
import { getAssetAdmin } from "@/lib/admin-assets.functions";

const assetOpts = (id: string) =>
  queryOptions({
    queryKey: ["admin", "asset", id],
    queryFn: () => getAssetAdmin({ data: { id } }),
  });

export const Route = createFileRoute("/admin/assets/$id")({
  loader: ({ context, params }) =>
    context.queryClient.ensureQueryData(assetOpts(params.id)),
  component: EditAsset,
});

function EditAsset() {
  const { id } = Route.useParams();
  const { data: a } = useSuspenseQuery(assetOpts(id));
  const navigate = useNavigate();

  return (
    <div>
      <Link
        to="/admin/assets"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft size={14} /> Back to assets
      </Link>
      <h1 className="mt-3 text-2xl font-semibold text-foreground">{a.title}</h1>
      <p className="text-xs font-mono text-muted-foreground">{a.slug}</p>

      <div className="mt-6 rounded-xl border border-border bg-white p-6">
        <AssetForm
          initial={{
            id: a.id,
            slug: a.slug,
            title: a.title,
            description: a.description,
            category_id: a.category_id,
            type: a.type,
            formats: (a.formats ?? []) as string[],
            tags: a.tags ?? [],
            storage_path: a.storage_path,
            preview_path: a.preview_path,
            preview_bg: a.preview_bg,
            is_published: a.is_published,
            sort_order: a.sort_order,
          }}
          onSaved={() => navigate({ to: "/admin/assets" })}
        />
      </div>
    </div>
  );
}
