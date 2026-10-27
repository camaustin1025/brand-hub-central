import { Download } from "lucide-react";
import type { Asset } from "@/data/assets";
import { cn } from "@/lib/utils";

const isLogo = (asset: Asset) => asset.type === "logo";
const isMark = (asset: Asset) => asset.tags.includes("logomark");
const isLight = (asset: Asset) => asset.previewBg === "light";

/** Logos are named by artwork and background; everything else by its own title. */
function label(asset: Asset) {
  if (!isLogo(asset)) return { name: asset.title, detail: asset.description };
  return {
    name: isMark(asset) ? "Logomark" : "Full logo",
    detail: isLight(asset) ? "Light backgrounds" : "Dark backgrounds",
  };
}

/**
 * Downloads as compact tiles: four to a row on desktop, each with a preview,
 * a short label, and a small format button.
 */
export function AssetTiles({ assets }: { assets: Asset[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {assets.map((asset) => {
        const { name, detail } = label(asset);
        return (
          <div key={asset.id} className="visual-container flex flex-col overflow-hidden border border-border bg-card">
            <div className={cn("flex aspect-[16/10] items-center justify-center overflow-hidden", isLight(asset) ? "border-b border-border bg-white" : "bg-og-midnight")}>
              <img
                src={asset.preview!}
                alt={asset.title}
                className={cn(isLogo(asset) ? "object-contain" : "h-full w-full object-cover", isLogo(asset) && (isMark(asset) ? "h-24" : "w-[78%]"))}
              />
            </div>
            {/* Tiles run ~150px wide below xl, so the button drops under the label until there is room beside it. */}
            <div className="flex flex-1 flex-col items-start gap-2 p-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold leading-tight">{name}</h4>
                <p className="mt-0.5 text-xs text-muted-foreground">{detail}</p>
              </div>
              {/* download attr + GA4 hook point: track('download_asset', { id }) */}
              <a
                href={asset.href!}
                download
                aria-label={`Download ${asset.title} (${asset.formats[0]})`}
                className="action-focus inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-og-midnight px-3 text-xs font-bold text-og-midnight transition-colors hover:bg-og-midnight hover:text-white"
              >
                <Download size={13} /> {asset.formats[0]}
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
}
