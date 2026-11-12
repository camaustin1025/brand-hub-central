import { Heading } from "@/components/layout/Heading";
import { Check, Copy } from "lucide-react";
import { DownloadLink } from "./DownloadLink";
import { findAssetFile } from "@/data/assets";
import { BACKGROUND_GRADIENT, BACKGROUND_GRADIENT_CSS } from "@/data/tokens";
import { useCopyText } from "@/hooks/use-copy-text";
import { buttonVariants } from "@/components/ui/button";

export function GradientDetails() {
  const download = findAssetFile("brand-gradient", "PNG");
  const { copy, copied, error } = useCopyText(BACKGROUND_GRADIENT_CSS);

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div className="grid lg:grid-cols-2">
        <img
          className="aspect-video w-full self-center"
          src={BACKGROUND_GRADIENT.image}
          width={BACKGROUND_GRADIENT.width}
          height={BACKGROUND_GRADIENT.height}
          alt="Cyan to Lemon gradient, with cyan at the upper right and lemon at the lower left"
        />
        <div className="p-6">
          <Heading as="h4" className="text-xl font-bold">{BACKGROUND_GRADIENT.name}</Heading>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Download the PNG for backgrounds or copy the CSS for web.
          </p>
          <dl className="mt-5 space-y-4">
            {BACKGROUND_GRADIENT.stops.map((stop) => (
              <div key={stop.hex} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-9 w-9 shrink-0 rounded-md ring-1 ring-inset ring-og-midnight/10" style={{ backgroundColor: stop.hex }} />
                <div>
                  <dt className="text-sm font-semibold">{stop.name}</dt>
                  <dd className="text-sm text-muted-foreground"><code>{stop.hex}</code> at {stop.position}%</dd>
                </div>
              </div>
            ))}
            <div className="flex flex-wrap gap-x-8 gap-y-3 border-t border-border pt-4 text-sm">
              <div><dt className="font-semibold">Angle</dt><dd className="mt-1 text-muted-foreground">{BACKGROUND_GRADIENT.angle.toFixed(2)}° (CSS)</dd></div>
              <div><dt className="font-semibold">Original file</dt><dd className="mt-1 text-muted-foreground">PNG · {BACKGROUND_GRADIENT.width} × {BACKGROUND_GRADIENT.height} · 16:9</dd></div>
            </div>
          </dl>
        </div>
      </div>
      <div className="space-y-4 border-t border-border p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Heading as="h4" className="text-sm font-semibold">Gradient CSS</Heading>
          <button type="button" onClick={copy} className={buttonVariants({ variant: "outline", size: "sm" })}>
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? "Copied" : "Copy CSS"}
          </button>
        </div>
        <code className="block rounded-md bg-og-gray-950 p-4 text-sm leading-6 [overflow-wrap:anywhere]">
          {BACKGROUND_GRADIENT_CSS}
        </code>
        <p role="status" className={error ? "text-sm text-muted-foreground" : "sr-only"}>
          {error ? "Copy unavailable. Select the CSS above to copy manually." : copied ? "Gradient CSS copied" : ""}
        </p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {download && <DownloadLink href={download.href} label="Download the Cyan to Lemon gradient (PNG)">Download PNG</DownloadLink>}
        </div>
      </div>
    </div>
  );
}
