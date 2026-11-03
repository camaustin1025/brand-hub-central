import { Download } from "lucide-react";
import { isAssetAvailable, type Asset } from "@/data/assets";

/** Every displayed format resolves to its own original file in the inventory. */
export function AssetDownloads({ asset }: { asset: Asset }) {
  if (!isAssetAvailable(asset)) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {asset.files.map((file) => (
        <a key={file.href} href={file.href} download
          aria-label={`Download ${asset.title} (${file.label ?? file.format})`}
          className="action-focus inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full border border-og-midnight px-3 text-xs font-semibold text-og-midnight transition-colors hover:bg-og-midnight hover:text-white">
          <Download size={14} aria-hidden="true" /> {file.label ?? file.format}
        </a>
      ))}
    </div>
  );
}
