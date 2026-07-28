import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type KickerTag = "span" | "h2" | "h3" | "h4";

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
 * Defaults to `span` for the decorative uses (step numbers, card labels).
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
    <Tag className={cn("text-xs font-bold uppercase tracking-[0.16em] text-primary", className)}>
      {children}
    </Tag>
  );
}
