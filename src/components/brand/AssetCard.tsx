import { Heading } from "@/components/layout/Heading";
import { Clock } from "lucide-react";
import { isAssetAvailable, type Asset } from "@/data/assets";
import { Button } from "@/components/ui/button";
import { AssetDownloads } from "./AssetDownloads";
import { cn } from "@/lib/utils";

/**
 * Asset tile for the v1 Downloads grid. The same component powers the v1.5
 * DAM-lite grid (it already reads tags/type/formats), so the DAM is additive.
 */
export function AssetCard({ asset, showDescription = true }: { asset: Asset; showDescription?: boolean }) {
  const available = isAssetAvailable(asset);

  return (
    <div className="visual-container group flex flex-col overflow-hidden border border-border bg-card">
      {/* Preview */}
      <div
        className={cn(
          "relative flex h-40 items-center justify-center overflow-hidden",
          asset.previewBg === "light" ? "bg-white" : "bg-og-midnight"
        )}
      >
        {asset.preview ? (
          <img
            src={asset.preview}
            alt={asset.title}
            className={cn("max-h-full max-w-full object-contain", !asset.tags.includes("logomark") && "p-6")}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-og-signature opacity-90" />
        )}
      </div>

      {/* Meta */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex-1 space-y-1">
          <Heading as="h3" className="font-semibold leading-tight">{asset.title}</Heading>
          {showDescription && asset.type !== "background" && <p className="measure text-sm leading-6 text-muted-foreground">{asset.description}</p>}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {asset.formats.map((f) => (
            <span
              key={f}
              className="rounded-[4px] border border-border px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground"
            >
              {f}
            </span>
          ))}
        </div>

        {available ? (
          <AssetDownloads asset={asset} />
        ) : (
          <Button size="sm" variant="secondary" disabled className="w-full">
            <Clock size={16} /> Not available yet
          </Button>
        )}
      </div>
    </div>
  );
}
