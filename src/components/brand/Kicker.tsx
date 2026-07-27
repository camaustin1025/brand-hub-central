import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * The recurring small-cap kicker — the system's rhythm marker above a heading
 * or section (DESIGN.md, The Eyebrow Rule).
 *
 * Colour comes from `text-primary`, not a fixed green, so the Green-Contrast
 * Rule applies itself: `--primary` is #009A50 on light and flips to #00FF85
 * inside any `.dark` island. Only override the colour when the surface is
 * neither — the gradient marquee, for instance, takes Midnight.
 */
export function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("text-xs font-bold uppercase tracking-[0.16em] text-primary", className)}>
      {children}
    </span>
  );
}
