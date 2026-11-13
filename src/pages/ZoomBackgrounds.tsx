import { Heading } from "@/components/layout/Heading";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, Loader2 } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { PRIMARY_ACTION } from "@/components/layout/ChapterHero";
import { AssetTiles } from "@/components/brand/AssetTiles";
import { MarketingContact } from "@/components/social/MarketingContact";
import { ZoomSetup } from "@/components/brand/ZoomSetup";
import { availableAssets } from "@/data/assets";
import { isWipSection, ZOOM_BACKGROUNDS_NAV_ID } from "@/data/hub";
import { buildZip, saveBlob } from "@/lib/icon-render";
import { cn } from "@/lib/utils";

const backgrounds = availableAssets().filter((asset) => asset.type === "background");

/** Builds the ZIP in the browser from the same PNGs the tiles download, so the repo holds each file once. */
function DownloadAllButton() {
  const [state, setState] = useState<"idle" | "busy" | "done" | "error">("idle");

  async function downloadAll() {
    if (state === "busy") return;
    setState("busy");
    try {
      const entries = await Promise.all(backgrounds.map(async (asset) => {
        const response = await fetch(asset.href!);
        if (!response.ok) throw new Error(asset.href!);
        return { path: asset.href!.split("/").pop()!, data: new Uint8Array(await response.arrayBuffer()) };
      }));
      saveBlob(new Blob([buildZip(entries)], { type: "application/zip" }), "ordergroove-zoom-backgrounds.zip");
      setState("done");
    } catch {
      setState("error");
    }
  }

  return (
    <>
      <button type="button" onClick={downloadAll} disabled={state === "busy"} data-download className={cn(PRIMARY_ACTION, "disabled:cursor-progress disabled:opacity-80")}>
        {state === "busy" ? <Loader2 size={16} aria-hidden="true" className="animate-spin" /> : <Download size={16} aria-hidden="true" />}
        {state === "busy" ? "Preparing ZIP" : `Download all ${backgrounds.length}`}
      </button>
      <span role="status" className={cn("basis-full text-sm text-white", state !== "error" && "sr-only")}>
        {state === "error" ? "The ZIP couldn't be created. Download the backgrounds one at a time, or try again." : state === "done" ? "Zoom backgrounds ZIP downloaded" : ""}
      </span>
    </>
  );
}

export default function ZoomBackgrounds() {
  const { hash } = useLocation();

  // Search results and old homepage links land on one background: scroll to it and focus it.
  useEffect(() => {
    const target = hash ? document.getElementById(hash.slice(1)) : null;
    if (!target) return;
    target.scrollIntoView({ block: "start" });
    target.focus({ preventScroll: true });
  }, [hash]);

  return (
    <HubShell activeId={ZOOM_BACKGROUNDS_NAV_ID}>
      <ChapterPage
        navId={ZOOM_BACKGROUNDS_NAV_ID}
        wip={isWipSection(ZOOM_BACKGROUNDS_NAV_ID)}
        updated="2026-11-11"
        title="Zoom backgrounds"
        intro="Approved backgrounds for video calls. Download one, then add it in Zoom."
        primaryAction={<DownloadAllButton />}
      >
        <Heading as="h2" className="sr-only">Backgrounds</Heading>
        <AssetTiles assets={backgrounds} />

        <ZoomSetup />

        <div className="mt-10"><MarketingContact /></div>
      </ChapterPage>
    </HubShell>
  );
}
