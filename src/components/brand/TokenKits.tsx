import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { Check, Copy } from "lucide-react";
import { buttonVariants, chipClasses } from "@/components/ui/button";
import { DownloadLink } from "./DownloadLink";
import { TOKEN_KITS } from "@/data/token-kits";
import { useCopyText } from "@/hooks/use-copy-text";

/** A same-origin file URL for generated text, released when the text changes or the box unmounts. */
function useFileUrl(content: string, mime: string) {
  const url = useMemo(() => URL.createObjectURL(new Blob([content], { type: `${mime};charset=utf-8` })), [content, mime]);
  useEffect(() => () => URL.revokeObjectURL(url), [url]);
  return url;
}

/**
 * Copy-and-paste token kits in the Gradient CSS pattern: tabs for each format,
 * one code block, a Copy button and a file download. Every kit is generated from
 * tokens.ts and typography.ts, so it can't drift from the page.
 */
export function TokenKits() {
  const [activeId, setActiveId] = useState(TOKEN_KITS[0].id);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const kit = TOKEN_KITS.find((entry) => entry.id === activeId) ?? TOKEN_KITS[0];
  const { copy, copied, error } = useCopyText(kit.content);
  const fileUrl = useFileUrl(kit.content, kit.mime);
  const copyLabel = kit.id === "ai" ? "Copy brief" : `Copy ${kit.label}`;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const index = TOKEN_KITS.findIndex((entry) => entry.id === activeId);
    const moves: Record<string, number> = { ArrowRight: index + 1, ArrowLeft: index - 1, Home: 0, End: TOKEN_KITS.length - 1 };
    if (!(event.key in moves)) return;
    event.preventDefault();
    const next = (moves[event.key] + TOKEN_KITS.length) % TOKEN_KITS.length;
    setActiveId(TOKEN_KITS[next].id);
    tabs.current[next]?.focus();
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-white">
      <div role="tablist" aria-label="Token format" onKeyDown={onKeyDown}
        className="flex flex-wrap gap-2 border-b border-border px-6 py-4">
        {TOKEN_KITS.map((entry, index) => {
          const selected = entry.id === activeId;
          return (
            <button key={entry.id} ref={(node) => { tabs.current[index] = node; }}
              type="button" role="tab" id={`token-tab-${entry.id}`} aria-controls="token-panel"
              aria-selected={selected} tabIndex={selected ? 0 : -1}
              onClick={() => setActiveId(entry.id)}
              className={chipClasses(selected)}>
              {entry.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" id="token-panel" aria-labelledby={`token-tab-${kit.id}`} className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm leading-6 text-foreground">{kit.hint}</p>
          <button type="button" onClick={copy} className={buttonVariants({ variant: "outline", size: "sm" })}>
            {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
            {copied ? "Copied" : copyLabel}
          </button>
        </div>
        <pre tabIndex={0} aria-label={`${kit.label} tokens`}
          className="action-focus max-h-[420px] overflow-auto rounded-md bg-og-gray-950 p-4 text-[13px] leading-6"><code>{kit.content}</code></pre>
        <p role="status" className={error ? "text-sm text-muted-foreground" : "sr-only"}>
          {error ? "Copy unavailable. Select the code above to copy it manually." : copied ? `${kit.label} copied` : ""}
        </p>
        <DownloadLink href={fileUrl} filename={kit.filename} label={`Download ${kit.filename}`}>
          {kit.filename}
        </DownloadLink>
      </div>
    </div>
  );
}
