import { Heading } from "@/components/layout/Heading";
import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { CORE, SECONDARY, SUPPORTING, type Swatch, type SwatchGroup } from "@/data/tokens";
import { luminance } from "@/lib/contrast";
import { writeClipboard } from "@/lib/clipboard";
import { cn } from "@/lib/utils";

/**
 * The color palette as tiered rows of compact click-to-copy tiles, modelled on
 * design.pilot.com/marketing. Each row is a header (title, status badge,
 * hairline, note) over an auto-fill grid of tiles.
 *
 * Drop-in for src/components/brand/. All data comes from data/tokens.ts, so
 * nothing here restates a hex.
 */

export type Tier = {
  group: SwatchGroup;
  badge?: { label: string; className: string };
  /** Drops the per-tile usage line when the group note already says it all. */
  hideUsage?: boolean;
};

/** Row order and treatment. Secondary sits above the neutrals on purpose. */
const TIERS: Tier[] = [
  { group: CORE },
  {
    group: SECONDARY,
    badge: { label: "Accent only", className: "bg-og-lemon text-og-midnight" },
    hideUsage: true,
  },
  { group: SUPPORTING },
];

/** Stable row anchors for links within the palette. */
const slug = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

export function ColorTile({ swatch, hideUsage }: { swatch: Swatch; hideUsage?: boolean }) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // White, Border, and Subtitle on dark would vanish into the card without an edge.
  const light = luminance(swatch.hex) > 0.75;

  async function copy() {
    const ok = await writeClipboard(swatch.hex);
    if (!ok) return;
    if (timer.current) clearTimeout(timer.current);
    setCopied(true);
    timer.current = setTimeout(() => setCopied(false), 1400);
    // GA4 hook point: track('copy_hex', { hex: swatch.hex })
  }

  useEffect(() => () => void (timer.current && clearTimeout(timer.current)), []);

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copy ${swatch.name} hex ${swatch.hex}`}
      className="action-focus group flex flex-col overflow-hidden rounded-[10px] border border-border bg-card text-left transition-[transform,box-shadow] duration-150 hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(23,19,47,0.12)] focus-visible:-translate-y-0.5 focus-visible:shadow-[0_6px_20px_rgba(23,19,47,0.12)] motion-reduce:transform-none motion-reduce:transition-none"
    >
      <span
        className={cn(
          "flex h-[66px] shrink-0 items-center justify-center",
          light && "border-b border-border",
        )}
        style={{ backgroundColor: swatch.hex }}
      >
        {/* The hover hint: says what a click does before it happens, and
            confirms it after. Midnight pill with a faint ring so it reads on
            White and on Midnight alike. */}
        <span
          className={cn(
            "inline-flex items-center gap-1 rounded-full bg-og-midnight/85 px-2.5 py-1 text-[11px] font-semibold text-white ring-1 ring-white/25 backdrop-blur transition-opacity",
            copied
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100",
          )}
        >
          {copied ? <Check size={12} aria-hidden="true" /> : <Copy size={12} aria-hidden="true" />}
          {copied ? "Copied" : "Copy hex"}
        </span>
      </span>
      <span className="block flex-1 px-2.5 pt-2.5 pb-2">
        <span className="block text-xs font-bold uppercase leading-snug tracking-[0.04em] text-og-midnight">
          {swatch.name}
        </span>
        {/* Always-on copy icon beside the hex, for touch screens with no hover. */}
        <span
          className={cn(
            "flex items-center gap-1 text-xs",
            copied ? "text-[#008040]" : "text-og-midnight",
          )}
        >
          {copied ? "Copied" : swatch.hex}
          {copied ? (
            <Check size={12} aria-hidden />
          ) : (
            <Copy size={12} aria-hidden className="text-muted-foreground group-hover:text-og-midnight" />
          )}
        </span>
        <span className="mt-1 block font-mono text-[11px] leading-snug text-muted-foreground">
          RGB: {swatch.rgb.replace(/,/g, "")}
        </span>
        {swatch.cmyk && (
          <span className="mt-0.5 block font-mono text-[11px] leading-snug text-muted-foreground">
            CMYK: {swatch.cmyk.replace(/,/g, "")}
          </span>
        )}
        {swatch.pantone && (
          <span className="mt-0.5 block font-mono text-[11px] leading-snug text-muted-foreground">
            Pantone: {swatch.pantone}
          </span>
        )}
        {!hideUsage && !swatch.hideTileUsage && (
          <span className="mt-1 block text-xs leading-snug text-og-midnight">
            {swatch.usage}
          </span>
        )}
        {swatch.tileNote && (
          <span className="mt-1 block text-xs leading-snug text-og-midnight">
            {swatch.tileNote}
          </span>
        )}
      </span>
      <span role="status" className="sr-only">{copied ? `${swatch.name} hex copied` : ""}</span>
    </button>
  );
}

export function ColorTierRow({ tier }: { tier: Tier }) {
  const { group, badge, hideUsage } = tier;
  return (
    <div className="mt-9 first:mt-0">
      {/* Divider stops at the note's measure (68ch of the 12px note), not the full column. */}
      <div className="flex max-w-[68ch] items-center gap-2 border-b border-border pb-2 text-xs">
        <Heading as="h3"
          id={group === CORE ? "core" : slug(group.title)}
          className="scroll-mt-20 text-[15px] font-semibold leading-normal tracking-normal text-og-midnight"
        >
          {group.title}
        </Heading>
        {badge && (
          <span
            className={cn(
              "rounded-[3px] px-1.5 py-0.5 text-[11px] font-bold uppercase leading-normal tracking-[0.12em]",
              badge.className,
            )}
          >
            {badge.label}
          </span>
        )}
      </div>
      {group.note && (
        <p className="mt-2 max-w-[68ch] whitespace-pre-line text-xs leading-snug text-og-midnight">{group.note}</p>
      )}
      {/* 156px floor: the longest name, ELECTRIC EGGPLANT, sets 131px of
          12px bold caps, plus 20px of padding and the border. Any narrower and
          it breaks onto a second line. Below ~1320px wide (full side rail) the
          six Secondary tiles wrap 5 + 1; that was accepted over shrinking the
          names. */}
      <div className="mt-3.5 grid grid-cols-2 gap-2.5 sm:grid-cols-[repeat(auto-fill,minmax(156px,1fr))]">
        {group.swatches.map((s) => (
          <ColorTile key={s.hex} swatch={s} hideUsage={hideUsage} />
        ))}
      </div>
    </div>
  );
}

/** All three rows, in order. */
export function ColorTiers({ tiers = TIERS }: { tiers?: Tier[] }) {
  return (
    <>
      {tiers.map((tier) => (
        <ColorTierRow key={tier.group.title} tier={tier} />
      ))}
    </>
  );
}
