import { Heading } from "@/components/layout/Heading";
import { assetAnchor, type Asset } from "@/data/assets";
import { AssetDownloads } from "./AssetDownloads";
import { cn } from "@/lib/utils";

export function AssetTiles({ assets }: { assets: Asset[] }) {
  const single = assets.length === 1;
  return (
    <div className={cn("grid gap-4", single ? "grid-cols-1" : assets.length === 2 ? "grid-cols-1 sm:grid-cols-2" : assets.every((asset) => asset.type === "background") ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-2 md:grid-cols-4")}>
      {assets.map((asset) => {
        const logo = asset.type === "logo";
        const light = asset.previewBg === "light";
        return (
          <article key={asset.id} id={assetAnchor(asset.id)} tabIndex={-1}
            className={cn("action-focus visual-container scroll-mt-24 overflow-hidden border border-border bg-white", single && "sm:grid sm:grid-cols-[minmax(180px,0.7fr)_1.3fr]")}>
            <div className={cn("flex items-center justify-center overflow-hidden", asset.type === "background" ? "aspect-video" : "aspect-[16/10]", single && "sm:aspect-auto sm:min-h-48", light ? "border-b border-border bg-white" : "bg-og-midnight")}>
              {asset.preview ? (
                <img src={asset.preview} alt={asset.title} loading="lazy"
                  className={cn(logo ? "max-h-[77%] w-[86%] object-contain" : asset.type === "icon" ? "max-h-[70%] w-[78%] object-contain" : asset.type === "background" ? "h-full w-full object-contain" : "h-full w-full object-cover", logo && asset.tags.includes("logomark") && "w-auto max-w-[66%]")} />
              ) : (
                <span className="text-6xl font-semibold tracking-tight text-og-midnight" aria-label="Figtree font preview">Aa</span>
              )}
            </div>
            <div className={cn("space-y-3 p-3 sm:p-4", single && "sm:p-6")}>
              <div>
                <Heading as="h4" className="text-sm font-semibold leading-snug">{logo ? asset.tags.includes("logomark") ? "Logomark" : "Full logo" : asset.title}</Heading>
                <p className={cn("mt-1 text-xs leading-5", logo ? "text-muted-foreground" : "text-foreground")}>{logo ? light ? "Light backgrounds" : "Dark backgrounds" : asset.description}</p>
              </div>
              <AssetDownloads asset={asset} />
            </div>
          </article>
        );
      })}
    </div>
  );
}
