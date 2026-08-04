import type { ReactNode } from "react";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { cn } from "@/lib/utils";

/**
 * The "eyebrow → link" affordance at the bottom of a card: a small-cap green
 * label with an outward arrow. Presentational only — wrap it in the `Link`
 * (or `a`) that actually navigates, so the whole card stays one target.
 *
 * Takes its colour from `text-primary` for the same reason [Kicker] does.
 */
export function CardLink({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-eyebrow font-bold uppercase text-primary",
        className,
      )}
    >
      {children}
      <MaterialSymbol name="arrow_outward" size={15} />
    </span>
  );
}
