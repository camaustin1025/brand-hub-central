import type { ReactNode } from "react";
import { chapterAnchor, useSinglePageContext } from "@/components/hub/single-page-context";

/**
 * Section opener: the section's name and an optional right-aligned aside,
 * sitting on a Midnight rule. This is the band that separates one module of
 * the page from the next — use it instead of a bare `h2` so every section
 * keeps the same rhythm.
 *
 * The name renders as a real `h2` (override with `as` for a nested module) at
 * the same headline step ModuleHead uses. It used to be a 12px green kicker —
 * Home's sections read as modules you scan past — but the hierarchy pass sized
 * every section head to the headline step, so Home and the guideline pages now
 * mark a section with the same weight. The prop keeps the `kicker` name so the
 * call sites didn't churn.
 */
export function SectionHead({
  kicker,
  aside,
  as: Tag = "h2",
}: {
  kicker: string;
  aside?: ReactNode;
  as?: "h2" | "h3";
}) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-og-midnight pb-3.5">
      <Tag className="text-headline font-extrabold tracking-[-0.03em]">{kicker}</Tag>
      {aside}
    </div>
  );
}

/**
 * The heavier section opener the inner routes use: a real `h2` on the same
 * Midnight rule SectionHead draws, with the intro note hanging below it.
 *
 * Home marks a section with a 12px kicker because its sections are short
 * modules you scan past. The guideline pages are the opposite — their headings
 * are the scanning structure, so downgrading them to a kicker would flatten the
 * page. Same rule, same rhythm, different weight above it.
 *
 * `id` is required: it is the anchor the side nav's section list links to and
 * the element its observer watches, so a module without one silently drops out
 * of the page's contents. The labels live in `data/sections.ts`, keyed by path
 * — change an id here and change it there.
 */
export function ModuleHead({
  id,
  title,
  note,
  aside,
}: {
  id: string;
  title: string;
  note?: ReactNode;
  aside?: ReactNode;
}) {
  const { idPrefix } = useSinglePageContext();
  const anchor = chapterAnchor(idPrefix, id);

  return (
    <>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-og-midnight pb-3.5">
        <h2
          id={anchor}
          className="scroll-mt-[calc(var(--stick)+var(--step-block))] text-headline font-extrabold tracking-[-0.03em]"
        >
          {title}
        </h2>
        {aside}
      </div>
      {note && <p className="mt-4 max-w-[68ch] text-sm text-muted-foreground">{note}</p>}
    </>
  );
}

/**
 * The muted chrome label that fills SectionHead's `aside` slot — an
 * instrument-panel tag (`Sec.02`, `F.01`), never content. Hidden below md,
 * where the space is better spent on the kicker alone.
 */
export function Aside({ children }: { children: ReactNode }) {
  return (
    <span className="hidden text-eyebrow font-semibold uppercase text-og-soft md:block">
      {children}
    </span>
  );
}
