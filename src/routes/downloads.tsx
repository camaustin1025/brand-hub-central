import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { AssetCard } from "@/components/brand/AssetCard";
import { ASSETS, ASSET_CATEGORIES } from "@/data/assets";

export const Route = createFileRoute("/downloads")({
  component: Downloads,
});

function Downloads() {
  return (
    <>
      <PageHeader
        eyebrow="Downloads"
        title="Grab-and-go assets"
        subhead="Logo kit, font kit, token kits, and social graphics. Search, tags, and an asset detail view arrive with DAM-lite in v1.5."
      />

      {ASSET_CATEGORIES.map((cat) => {
        const items = ASSETS.filter((a) => a.type === cat.type);
        if (items.length === 0) return null;
        return (
          <section key={cat.type} className="site-container py-8">
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
