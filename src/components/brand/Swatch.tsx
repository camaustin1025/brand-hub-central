import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Swatch as SwatchData } from "@/data/tokens";

/**
 * Click-to-copy color swatch.
 */
export function Swatch({ swatch }: { swatch: SwatchData }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(swatch.hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
    // GA4 hook point: track('copy_hex', { hex: swatch.hex })
  }

  return (
    <div className="visual-container overflow-hidden border border-border bg-card">
      <button
        onClick={copy}
        aria-label={`Copy ${swatch.name} hex ${swatch.hex}`}
        className="group block h-28 w-full"
        style={{ backgroundColor: swatch.hex }}
      >
        <span className="flex h-full w-full items-start justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100">
          <span className="rounded-md bg-black/40 p-1.5 text-white backdrop-blur">
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </span>
        </span>
      </button>
      <div className="space-y-2 p-4">
        <div className="flex items-center justify-between">
          <span className="font-semibold">{swatch.name}</span>
          <button
            onClick={copy}
            className="font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? "Copied" : swatch.hex}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{swatch.usage}</p>
      </div>
    </div>
  );
}

