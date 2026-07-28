import { Link, type LinkProps } from "@tanstack/react-router";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";

/**
 * A thumbnail tile over a caption — the card Home's "Most downloaded" and
 * "Templates & toolkit" rows are both made of.
 *
 * They were written twice and had drifted apart on every value that could
 * drift: a 150px thumb against a 16/9 one, a 32px glyph against 36, 18px
 * padding against 22, `text-base` against `text-xl`, `og-soft` caption text
 * against `og-indigo`. None of the differences were carrying an idea — the two
 * rows sit forty lines apart and hold the same kind of thing.
 *
 * Reconciled on the values that were already right: 16/9 scales with the card
 * where a fixed 150px does not, and `text-xl` is the ramp's Title step where
 * `text-base` (16px) was not on the ramp at all — the Four-Step Rule has no
 * 16px. The 20px radius comes from `.visual-container`, which is what the rest
 * of the site's cards already use and what DESIGN.md specifies.
 */
export function ThumbCard({
  to,
  icon,
  title,
  meta,
  tag,
}: {
  to: LinkProps["to"];
  /** Material Symbols glyph, standing in until real asset previews land. */
  icon: string;
  title: string;
  meta: string;
  /** Optional status pill beside the title, e.g. "Ready". */
  tag?: string;
}) {
  return (
    <Link
      to={to}
      // overflow-hidden so the hatch panel is clipped by the card's radius
      // rather than squaring off its top two corners.
      className="visual-container flex flex-col overflow-hidden border border-og-border transition-colors hover:border-og-midnight"
    >
      {/* The ratio scales the panel with the card; the ceiling stops it doing
          that forever. At the single-column stage a 16/9 panel on a 592px card
          would be 333px of hatch pattern above two lines of caption. */}
      <span className="thumb-hatch flex aspect-[16/9] max-h-[240px] items-center justify-center border-b border-og-border">
        <MaterialSymbol name={icon} size={32} className="text-og-soft" />
      </span>
      <div className="flex flex-col gap-2 p-[18px]">
        <div className="flex items-center gap-2.5">
          <h3 className="text-xl font-bold tracking-[-0.015em] text-og-midnight">{title}</h3>
          {tag && (
            <span className="shrink-0 whitespace-nowrap border border-og-border px-2 py-[3px] text-[11px] font-bold uppercase tracking-[0.12em] text-og-soft">
              {tag}
            </span>
          )}
        </div>
        <span className="text-[14px] leading-normal text-og-indigo">{meta}</span>
      </div>
    </Link>
  );
}
