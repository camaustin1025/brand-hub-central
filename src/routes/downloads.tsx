import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssetCard } from "@/components/brand/AssetCard";
import { ModuleHead } from "@/components/brand/SectionHead";
import { assetsQueryOptions } from "@/lib/assets-query";

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

export function Downloads() {
  const { data } = useSuspenseQuery(assetsQueryOptions);
  const { categories, assets } = data;

  // Resolve which categories actually render before laying them out, so the
  // closing interval lands on the last *visible* one rather than on whichever
  // category happens to sit last in the table.
  const groups = categories
    .map((cat) => ({ cat, items: assets.filter((a) => a.categorySlug === cat.slug) }))
    .filter((g) => g.items.length > 0);

  return (
    <>
      <PageHeader
        eyebrow="Downloads"
        title="Grab-and-go assets"
        subhead="Logo kit, font kit, token kits, and social graphics. Search, tags, and an asset detail view arrive with DAM-lite in v1.5."
      />

      {/* Each category is a top-level module, so it opens on the section step
          and on the same ruled head the rest of the site uses. `py-8` gave
          every category the same 32px interval as the gap inside its own card
          grid, so the page read as one long undifferentiated run of tiles. */}
      {groups.map(({ cat, items }, i) => {
        return (
          <section
            key={cat.slug}
            className={`site-container section-step ${i === groups.length - 1 ? "section-end" : ""}`}
          >
            <ModuleHead
              id={cat.slug}
              title={cat.label}
              aside={
                <span className="text-sm text-muted-foreground">
                  {items.length} {items.length === 1 ? "file" : "files"}
                </span>
              }
            />
            <div className="block-step grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
