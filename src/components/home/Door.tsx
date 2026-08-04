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
 * There is no colour split left to prop: all three doors are Midnight, which
 * collapses the component to one path.
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
  /**
   * The first door. Not a colour flag — every door is Midnight now — but the
   * one that carries the notch. `dark` used to live here because the surface
   * was what varied; the surface is constant, so the field names the thing that
   * actually differs rather than holding a value that is true three times in
   * three.
   */
  lead?: boolean;
  diagram: DoorDiagramVariant;
};

export function Door({ door }: { door: DoorSpec }) {
  return (
    <Link
      to={door.path}
      className={cn(
        // 340, not 264: the old floor left 40px between the rule and the title,
        // which is a gap, not a band. 112px of drawing plus its interval needs
        // the extra 76.
        //
        // `dark` on every door, so --primary resolves to #00FF85 inside all
        // three. That is the argument for the surface: green on the white page
        // has to be the AA-corrected #008040, so Midnight is the only way the
        // real brand green reaches this module at all.
        //
        // The hover is the lift and nothing else. The white cards used to also
        // change fill, and carrying that over would desynchronise the drawing —
        // door 02's format stack occludes with `fill-og-midnight` to match the
        // card behind it, so moving the card off Midnight would show the seams.
        "dark visual-container flex min-h-[340px] flex-col bg-og-midnight p-7 transition hover:-translate-y-1",
        // With all three on one surface the notch is the only thing marking the
        // lead, which is more work than it did before, not less. Still one card:
        // three notches in a row is a pattern, and a pattern is not a signature.
        door.lead && "notch-br",
      )}
    >
      <span className="border-b border-white/20 pb-4 text-eyebrow font-bold text-primary">
        {door.n}
      </span>

      <span className="mt-auto pt-8">
        <DoorDiagram variant={door.diagram} />
      </span>

      <h3 className="mt-7 text-4xl font-bold leading-none tracking-[-0.03em] text-white">
        {door.title}
      </h3>
      <span className="mt-3 text-body text-white/66">{door.blurb}</span>
      <CardLink className="mt-5">{door.cta}</CardLink>
    </Link>
  );
}
