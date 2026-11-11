import { cn } from "@/lib/utils";
import { Download } from "lucide-react";
import { isAssetAvailable, type Asset } from "@/data/assets";

/** Every displayed format resolves to its own original file in the inventory. */
export function AssetDownloads({ asset }: { asset: Asset }) {
  if (!isAssetAvailable(asset)) return null;
  const pairedLogo = asset.type === "logo" && asset.files.length === 2;
  return (
    <div className={cn("flex flex-wrap gap-2", pairedLogo && "grid grid-cols-2 gap-1 sm:gap-2")}>
      {asset.files.map((file) => (
        <a key={file.href} href={file.href} download
          aria-label={`Download ${asset.title} (${file.label ?? file.format})`}
          className={cn("action-focus inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-og-midnight px-3 text-xs font-semibold text-og-midnight transition-colors hover:bg-og-midnight hover:text-white", pairedLogo && "min-w-0 gap-1 whitespace-nowrap px-1.5 text-[11px] sm:gap-1.5 sm:px-3 sm:text-xs")}>
          <Download size={14} className={cn("shrink-0", pairedLogo && "size-3 sm:size-3.5")} aria-hidden="true" /> {file.label ?? file.format}
        </a>
      ))}
    </div>
  );
}
