import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Swatch as SwatchData } from "@/data/tokens";
import { cn } from "@/lib/utils";

/** WCAG relative luminance for a #rrggbb hex. */
function luminance(hex: string): number {
  const v = hex.replace("#", "");
  const rgb = [0, 2, 4].map((i) => {
    const c = parseInt(v.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rgb[0] + 0.7152 * rgb[1] + 0.0722 * rgb[2];
}

/** Contrast ratio between two hex colors (1–21). */
function contrast(a: string, b: string): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

const WHITE = "#FFFFFF";
const MIDNIGHT = "#17132F";

function ContrastBadge({ label, ok, ratio }: { label: string; ok: boolean; ratio: number }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
        ok ? "bg-primary/15 text-primary" : "bg-destructive/15 text-destructive",
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
        <div className="flex flex-wrap gap-1.5 pt-1">
          <ContrastBadge label="Light bg" ok={swatch.onLight} ratio={contrast(swatch.hex, WHITE)} />
          <ContrastBadge label="Dark bg" ok={swatch.onDark} ratio={contrast(swatch.hex, MIDNIGHT)} />
        </div>
      </div>
    </div>
  );
}
