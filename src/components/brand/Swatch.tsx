import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Swatch as SwatchData } from "@/data/tokens";
import { contrast } from "@/lib/contrast";
import { cn } from "@/lib/utils";

const WHITE = "#FFFFFF";
const MIDNIGHT = "#17132F";

function ContrastBadge({ label, ok, ratio }: { label: string; ok: boolean; ratio: number }) {
  return (
    <span
      // Solid fill, not a /15 tint: the tinted version measured 3.9–4.1:1, so
      // the badge that reports the contrast rule was itself failing it.
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        ok ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground",
      )}
      title={`Contrast ratio ${ratio.toFixed(2)}:1 (WCAG AA text needs 4.5:1)`}
    >
      {ok ? "✓" : "✗"} {label}
    </span>
  );
}

/**
 * Click-to-copy color swatch with a live contrast badge that encodes the
 * green rule (#009A50 on light, #00FF85 on dark) directly into the UI.
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
        {/* Wraps rather than collides: the swatch grid sizes its tiles to the
            group (a six-value group gets narrower tiles than a four-value one),
            so a long name and its hex have to be able to stack. */}
        <div className="flex flex-wrap items-center justify-between gap-x-2">
          <span className="font-semibold">{swatch.name}</span>
          <button
            onClick={copy}
            className="flex min-h-11 items-center font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {copied ? "Copied" : swatch.hex}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{swatch.usage}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <ContrastBadge label="Light bg" ok={swatch.onLight} ratio={contrast(swatch.hex, WHITE)} />
          <ContrastBadge
            label="Dark bg"
            ok={swatch.onDark}
            ratio={contrast(swatch.hex, MIDNIGHT)}
          />
        </div>
      </div>
    </div>
  );
}
