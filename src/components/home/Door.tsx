import { Link, type LinkProps } from "@tanstack/react-router";
import { CardLink } from "@/components/brand/CardLink";
import { DoorDiagram, type DoorDiagramVariant } from "@/components/home/DoorDiagram";
import { cn } from "@/lib/utils";

/**
 * One of the three doors on Home.
 *
 * This used to be the same card written twice in index.tsx — once for the
 * Midnight lead and once for the two white ones — so a change to the structure
 * had to be made in both branches and the two hover behaviours drifted apart.
 * The colour split is now a prop; the drifted hovers are preserved verbatim
 * rather than quietly reconciled, because that is a separate call.
 *
 * The card is a rule, a diagram, and a tightly grouped foot. `mt-auto` sits on
 * the diagram, so slack collects between the index rule and the drawing and the
 * title / blurb / link stay welded to the bottom edge.
 */
export type DoorSpec = {
  n: string;
  title: string;
  blurb: string;
  cta: string;
  path: LinkProps["to"];
  /** Midnight lead card. Flips --primary to #00FF85 for everything inside. */
  dark: boolean;
  diagram: DoorDiagramVariant;
};

export function Door({ door }: { door: DoorSpec }) {
  const { dark } = door;

  return (
    <Link
      to={door.path}
      className={cn(
        // 340, not 264: the old floor left 40px between the rule and the title,
        // which is a gap, not a band. 112px of drawing plus its interval needs
        // the extra 76.
        // The lift is shared by all three. It used to be the Midnight card's
        // alone, with the white pair answering a hover by changing border and
        // fill instead — one component reacting two different ways depending on
        // its colour. The lift is the only cue both surfaces can carry, so it
        // is the one they share; the white pair keeps the border change on top
        // of it, since a white card on a white page needs the edge to move too.
        "visual-container flex min-h-[340px] flex-col p-7 transition hover:-translate-y-1",
        dark
          ? // The notch signs the lead door and only the lead door. Three
            // notched cards in a row is a pattern; a pattern is not a signature.
            "dark notch-br bg-og-midnight"
          : "border border-og-border bg-white hover:border-og-midnight hover:bg-og-surface",
      )}
    >
      <span
        className={cn(
          "border-b pb-4 text-xs font-bold tracking-[0.16em] text-primary",
          dark ? "border-white/20" : "border-og-border",
        )}
      >
        {door.n}
      </span>

      <span className="mt-auto pt-8">
        <DoorDiagram variant={door.diagram} />
      </span>

      <h3
        className={cn(
          "mt-7 text-4xl font-bold leading-none tracking-[-0.03em]",
          dark ? "text-white" : "text-og-midnight",
        )}
      >
        {door.title}
      </h3>
      <span
        className={cn("mt-3 text-[15px] leading-normal", dark ? "text-white/66" : "text-og-indigo")}
      >
        {door.blurb}
      </span>
      <CardLink className="mt-5">{door.cta}</CardLink>
    </Link>
  );
}
