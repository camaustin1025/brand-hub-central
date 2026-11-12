import { Check, Copy } from "lucide-react";
import type { Swatch as SwatchData } from "@/data/tokens";
import { useCopyText } from "@/hooks/use-copy-text";

/**
 * Click-to-copy color swatch.
 */
export function Swatch({ swatch }: { swatch: SwatchData }) {
  const { copy, copied, error } = useCopyText(swatch.hex.replace("#", ""));

  return (
    <div className="visual-container overflow-hidden border border-border bg-card">
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${swatch.name} hex ${swatch.hex}`}
        className="group block h-28 w-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-white focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-og-midnight"
        style={{ backgroundColor: swatch.hex }}
      >
        <span className="flex h-full w-full items-end justify-end p-3">
          <span className="inline-flex h-8 items-center gap-1.5 rounded-full bg-og-midnight px-3 text-xs font-semibold text-white transition-colors group-hover:bg-og-indigo">
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? "Copied" : "Copy hex"}
          </span>
        </span>
      </button>
      <div className="space-y-2 p-4">
        <div>
          <span className="block font-semibold">{swatch.name}</span>
          <button
            type="button"
            onClick={copy}
            aria-label={`Copy ${swatch.name} hex ${swatch.hex}`}
            className="action-focus inline-flex min-h-11 items-center font-mono text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            {swatch.hex}
          </button>
        </div>
        <p className="measure text-sm text-foreground">{swatch.usage}</p>
        <p role="status" className={error ? "text-xs text-muted-foreground" : "sr-only"}>
          {error ? `Copy unavailable. Select ${swatch.hex} to copy manually.` : copied ? `${swatch.name} hex copied` : ""}
        </p>
      </div>
    </div>
  );
}

