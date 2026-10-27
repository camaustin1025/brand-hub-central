import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Swatch, SwatchGroup } from "@/data/tokens";
import { cn } from "@/lib/utils";

/** Midnight or white, whichever has the higher WCAG contrast on `hex`. */
function inkOn(hex: string) {
  const channel = (offset: number) => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  const onMidnight = (luminance + 0.05) / 0.0585; // Midnight #17132F relative luminance is ~0.0085
  const onWhite = 1.05 / (luminance + 0.05);
  return onMidnight >= onWhite ? "#17132F" : "#FFFFFF";
}

/** One click-to-copy block in the band, labelled in its own legible ink. */
function BandBlock({ swatch, small = false }: { swatch: Swatch; small?: boolean }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(swatch.hex);
    } catch {
      return; // Clipboard blocked (permissions or insecure context); the hex stays visible to select.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
    // GA4 hook point: track('copy_hex', { hex: swatch.hex })
  }

  return (
    <button
      onClick={copy}
      aria-label={`Copy ${swatch.name} ${swatch.hex}`}
      className={cn(
        "group relative flex flex-col justify-end text-left focus-visible:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-current",
        small ? "h-20 p-3" : "h-36 p-4",
        swatch.hex === "#FFFFFF" && "shadow-[inset_0_0_0_1px_rgb(23_19_47/0.1)]"
      )}
      style={{ backgroundColor: swatch.hex, color: inkOn(swatch.hex) }}
    >
      <span className="absolute right-3 top-3 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </span>
      <span className={cn("font-semibold leading-tight", small ? "text-xs" : "text-sm")}>{swatch.name}</span>
      <span className={cn("mt-0.5 font-mono", small ? "text-[11px]" : "text-xs")}>{copied ? "Copied" : swatch.hex}</span>
    </button>
  );
}

/**
 * The whole palette in one strip: core colors on top, secondary below, each
 * block labelled with its name and hex. Core usage rules sit under the strip.
 */
export function ColorBand({ core, secondary }: { core: SwatchGroup; secondary: SwatchGroup }) {
  return (
    <div>
      <div className="visual-container overflow-hidden">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {core.swatches.map((swatch) => <BandBlock key={swatch.hex} swatch={swatch} />)}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6">
          {secondary.swatches.map((swatch) => <BandBlock key={swatch.hex} swatch={swatch} small />)}
        </div>
      </div>
      <div className="mt-4 grid gap-x-4 gap-y-3 text-sm leading-6 text-muted-foreground sm:grid-cols-2 md:grid-cols-4">
        {core.swatches.map((swatch) => (
          <p key={swatch.hex}><strong className="text-foreground">{swatch.name}:</strong> {swatch.usage}</p>
        ))}
      </div>
      {secondary.note && (
        <p className="mt-3 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">{secondary.title}:</strong> {secondary.note}</p>
      )}
    </div>
  );
}
