import { isAssetAvailable, type Asset } from "@/data/assets";
import { DownloadLink } from "./DownloadLink";

/** Every displayed format resolves to its own original file in the inventory. */
export function AssetDownloads({ asset }: { asset: Asset }) {
  if (!isAssetAvailable(asset)) return null;
  return (
    <div className="flex flex-wrap gap-x-4 gap-y-1">
      {asset.files.map((file) => (
        <DownloadLink key={file.href} href={file.href} label={`Download ${asset.title} (${file.label ?? file.format})`}>
          {file.label ?? file.format}
        </DownloadLink>
      ))}
    </div>
  );
}
