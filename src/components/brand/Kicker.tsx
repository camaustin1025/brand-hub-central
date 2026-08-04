import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KickerTag = "span" | "p" | "h2" | "h3" | "h4";

/**
 * The recurring small-cap kicker — the system's rhythm marker above a heading
 * or section (DESIGN.md, The Eyebrow Rule).
 *
 * Colour comes from `text-primary`, not a fixed green, so the Green-Contrast
 * Rule applies itself: `--primary` is the AA-safe #008040 on light and flips
 * to #00FF85 inside any `.dark` island. Only override the colour when the
 * surface is neither — the gradient marquee, for instance, takes Midnight.
 *
 * `as` exists because the kicker is usually the only text naming its section,
 * so on a real section it should *be* the heading rather than a styled span.
 * Defaults to `span` for the decorative uses (step numbers, card labels); `p`
 * is for the block eyebrow above a page title, which used to be served by a
 * duplicate `.eyebrow` CSS class that disagreed with this component on weight.
 *
 * Size, tracking, and line-height all come from the `text-eyebrow` step rather
 * than from `text-xs` plus a hand-typed `tracking-[0.16em]` — that trio was
 * being retyped at twenty call sites, two of which had already drifted to
 * 0.14em.
 */
export function Kicker({
  children,
  className,
  as: Tag = "span",
}: {
  children: ReactNode;
  className?: string;
  as?: KickerTag;
}) {
  return (
    <Tag className={cn("text-eyebrow font-bold uppercase text-primary", className)}>
      {children}
    </Tag>
  );
}
