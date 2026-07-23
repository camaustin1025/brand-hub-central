import { queryOptions } from "@tanstack/react-query";
import { listAssets } from "@/lib/assets.functions";

/**
 * The published assets, shared by Downloads (which renders them) and the Home
 * omni bar (which indexes them). One query key means one fetch and one cache
 * entry, so search can never describe a different set of assets than the
 * Downloads page shows.
 */
export const assetsQueryOptions = queryOptions({
  queryKey: ["assets", "published"],
  queryFn: () => listAssets(),
  // Without this, react-query revalidates on every mount, so a Home -> Downloads
  // hop refetches immediately. Five minutes sits well inside the one-hour TTL on
  // the signed storage URLs this returns, so cached rows are never dead links.
  staleTime: 5 * 60 * 1000,
});
