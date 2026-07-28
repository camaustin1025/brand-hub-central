import type { ReactNode } from "react";
import { Kicker } from "@/components/brand/Kicker";

/**
 * Section opener: a green kicker and an optional right-aligned aside, sitting
 * on a Midnight rule. This is the band that separates one module of the page
 * from the next — use it instead of a bare `h2` so every section keeps the
 * same rhythm.
 *
 * The kicker renders as a real `h2` (override with `as` for a nested module),
 * because it names the section: without it the page is a wall of styled spans
 * and screen-reader heading navigation has nothing to land on.
 */
export function SectionHead({
  kicker,
  aside,
  as = "h2",
}: {
  kicker: string;
  aside?: ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-og-midnight pb-3.5">
      <Kicker as={as}>{kicker}</Kicker>
      {aside}
    </div>
  );
}

/**
 * The muted chrome label that fills SectionHead's `aside` slot — an
 * instrument-panel tag (`Sec.02`, `F.01`), never content. Hidden below md,
 * where the space is better spent on the kicker alone.
 */
export function Aside({ children }: { children: ReactNode }) {
  return (
    <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-og-soft md:block">
      {children}
    </span>
  );
}
