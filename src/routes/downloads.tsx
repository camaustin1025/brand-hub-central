import { createFileRoute } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssetCard } from "@/components/brand/AssetCard";
import { listAssets } from "@/lib/assets.functions";

const assetsQueryOptions = queryOptions({
  queryKey: ["assets", "published"],
  queryFn: () => listAssets(),
});

export const Route = createFileRoute("/downloads")({
  head: () => ({
    meta: [
      { title: "Downloads — Ordergroove Brand Hub" },
      {
        name: "description",
        content:
          "Grab-and-go brand assets: logo kit, font kit, design tokens, backgrounds, and social graphics.",
      },
      { property: "og:title", content: "Downloads — Ordergroove Brand Hub" },
      {
        property: "og:description",
        content: "Grab-and-go brand assets for the Ordergroove team.",
      },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(assetsQueryOptions),
  component: Downloads,
});

function Downloads() {
  const { data } = useSuspenseQuery(assetsQueryOptions);
  const { categories, assets } = data;

  return (
    <>
      <PageHeader
        eyebrow="Downloads"
        title="Grab-and-go assets"
        subhead="Logo kit, font kit, token kits, and social graphics. Search, tags, and an asset detail view arrive with DAM-lite in v1.5."
      />

      {categories.map((cat) => {
        const items = assets.filter((a) => a.categorySlug === cat.slug);
        if (items.length === 0) return null;
        return (
          <section key={cat.slug} className="site-container py-8">
            <h2 className="mb-6 text-2xl font-bold">{cat.label}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((asset) => (
                <AssetCard key={asset.id} asset={asset} />
              ))}
            </div>
          </section>
        );
      })}
    </>
  );
}
