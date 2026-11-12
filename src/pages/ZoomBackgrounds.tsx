import { Heading } from "@/components/layout/Heading";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Download, Loader2 } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { PRIMARY_ACTION } from "@/components/layout/ChapterHero";
import { AssetTiles } from "@/components/brand/AssetTiles";
import { MarketingContact } from "@/components/social/MarketingContact";
import { availableAssets } from "@/data/assets";
import { isWipSection, ZOOM_BACKGROUNDS_NAV_ID } from "@/data/hub";
import { buildZip, saveBlob } from "@/lib/icon-render";
import { cn } from "@/lib/utils";

const backgrounds = availableAssets().filter((asset) => asset.type === "background");

/** Setup steps per app. Menu names follow each app's desktop client. */
const SETUP = [
  {
    app: "Zoom",
    steps: [
      "In the Zoom desktop app, open Settings, then Backgrounds & effects.",
      "Under Virtual backgrounds, select the plus button, then Add image.",
      "Choose the PNG you downloaded.",
    ],
  },
  {
    app: "Google Meet",
    steps: [
      "Before you join or during a call, select Apply visual effects on your video.",
      "Under Backgrounds, select the upload button.",
      "Choose the PNG you downloaded.",
    ],
  },
  {
    app: "Microsoft Teams",
    steps: [
      "In a meeting, open More, then Video effects.",
      "Under Backgrounds, select Add new.",
      "Choose the PNG you downloaded.",
    ],
  },
];

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
        intro="Approved backgrounds for video calls. Download one, then add it in Zoom, Google Meet, or Microsoft Teams."
        primaryAction={<DownloadAllButton />}
      >
        <Heading as="h2" className="sr-only">Backgrounds</Heading>
        <AssetTiles assets={backgrounds} />

        <section aria-labelledby="zoom-setup-heading" className="mt-16">
          <Heading as="h2" id="zoom-setup-heading" className="reference-section-title">Set up your background</Heading>
          <div className="mt-8 grid gap-x-10 gap-y-8 md:grid-cols-3">
            {SETUP.map(({ app, steps }) => (
              <div key={app}>
                <Heading as="h3" className="reference-item-title">{app}</Heading>
                <ol className="mt-3 space-y-2.5 text-sm leading-6 text-foreground">
                  {steps.map((step, index) => (
                    <li key={step} className="flex gap-3">
                      <span aria-hidden="true" className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-og-midnight text-[11px] font-bold tabular-nums text-white">{index + 1}</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <div className="mt-10 border-t border-border pt-8">
            <Heading as="h3" className="reference-item-title">Does the logo look backwards?</Heading>
            <p className="measure mt-2 text-sm leading-6 text-foreground">
              Most video apps mirror your own preview, so the logo reads backwards to you. Everyone else on the call sees it the right way round. In Zoom, turn off Mirror my video under Settings, then Video, to check.
            </p>
          </div>
        </section>

        <div className="mt-10"><MarketingContact /></div>
      </ChapterPage>
    </HubShell>
  );
}
