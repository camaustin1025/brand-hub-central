import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import type { Swatch as SwatchData } from "@/data/tokens";
import { contrast, passesBodyText } from "@/lib/contrast";
import { writeClipboard } from "@/hooks/use-copy-toast";
import { cn } from "@/lib/utils";

const WHITE = "#FFFFFF";
const MIDNIGHT = "#17132F";

/**
 * The verdict is derived from the ratio it displays, never from a flag beside
 * it. These two used to come from different places — `ok` from a hand-kept
 * `onLight`/`onDark` boolean in data/tokens.ts, the ratio from contrast() — and
 * they disagreed on six of the fifteen swatches. #009A50 rendered a green
 * "✓ Light bg" chip over a tooltip reading 3.66:1, which is the exact mistake
 * this module exists to stop people making.
 */
function ContrastBadge({ label, ratio }: { label: string; ratio: number }) {
  const ok = passesBodyText(ratio);
  return (
    <span
      // Solid fill, not a /15 tint: the tinted version measured 3.9–4.1:1, so
      // the badge that reports the contrast rule was itself failing it.
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-micro font-medium",
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
  const [state, setState] = useState<"idle" | "copied" | "blocked">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const copied = state === "copied";

  // Shares the hook's writer, so a denied Clipboard API call still falls back to
  // execCommand rather than rejecting into nothing. A rejected write used to
  // leave the swatch looking simply inert.
  async function copy() {
    const ok = await writeClipboard(swatch.hex);
    if (timer.current) clearTimeout(timer.current);
    setState(ok ? "copied" : "blocked");
    timer.current = setTimeout(() => setState("idle"), ok ? 1500 : 3000);
    // GA4 hook point: track('copy_hex', { hex: swatch.hex })
  }

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

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
            className={cn(
              "flex min-h-11 items-center font-mono text-sm transition-colors hover:text-foreground",
              state === "blocked" ? "text-destructive" : "text-muted-foreground",
            )}
          >
            {state === "copied" ? "Copied" : state === "blocked" ? "Copy blocked" : swatch.hex}
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{swatch.usage}</p>
        <div className="flex flex-wrap gap-1.5 pt-1">
          <ContrastBadge label="Light bg" ratio={contrast(swatch.hex, WHITE)} />
          <ContrastBadge label="Dark bg" ratio={contrast(swatch.hex, MIDNIGHT)} />
        </div>
      </div>
    </div>
  );
}
