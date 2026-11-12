/**
 * Marks a section that is still being written. Turn it on or off with `wip`
 * on the section's nav item in data/hub.ts: the nav, search, and page head
 * all read that one flag. Laser Lemon is a fill here with Midnight text,
 * never text on white (canon), matching the "Accent only" badge.
 */
import { cn } from "@/lib/utils";

const TAG_CLASS = "inline-flex shrink-0 items-center rounded-full bg-og-lemon px-1.5 py-0.5 text-[10px] font-bold uppercase leading-none tracking-[0.08em] text-og-midnight";

/** Small tag beside a nav or search label. */
export function WipTag({ id, className }: { id?: string; className?: string }) {
  return (
    <span id={id} className={cn(TAG_CLASS, className)}>
      <span aria-hidden="true">WIP</span>
      <span className="sr-only">, work in progress</span>
    </span>
  );
}

/** Banner at the top of a page or section head. */
export function WipNotice() {
  return (
    <p className="mb-8 flex items-start gap-3 rounded-lg bg-og-midnight px-4 py-3 text-sm leading-5 text-white">
      <span aria-hidden="true" className={cn(TAG_CLASS, "mt-px px-2 py-1 text-[11px]")}>WIP</span>
      <span>
        <strong className="font-bold text-white">Work in progress.</strong> This guidance is still being finalized and may change.
      </span>
    </p>
  );
}
