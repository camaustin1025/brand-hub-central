import { cn } from "@/lib/utils";

/**
 * The diagram that fills the lower half of a door card.
 *
 * One drawing grammar for all three, which is the only thing keeping these
 * from being decoration: a 240×112 field, 1px strokes, and **exactly one green
 * element per drawing — the verb**. Everything else is hairline. A door labelled
 * "Downloads" gets a drawing that says retrieval; if you cannot name the verb,
 * the drawing does not belong here.
 *
 * Colours are picked for contrast, not for weight. These carry meaning, so the
 * strokes owe 3:1 against the card (SC 1.4.11) — which rules out `og-border`
 * (#D8D7DF is 1.3:1 on white) and rules out `white/16` on Midnight. The pairs:
 *
 *   light card   hairline #666279  5.3:1    green #008040 (`--primary`)  5.05:1
 *   Midnight     hairline white/40 4.6:1    green #00FF85 (`--primary`) 13.4:1
 *
 * `text-primary` is never hardcoded either way — `--primary` flips inside the
 * `.dark` island, so one component draws on both surfaces. No green on white.
 *
 * Inline SVG rather than files in /public: an image tag cannot inherit the
 * surface's `--primary`, so three drawings on two surfaces would be six assets
 * and six requests. This is ~2.5KB in the bundle and no request at all.
 */

export type DoorDiagramVariant = "measure" | "retrieve" | "assemble";

/** Meaning-bearing strokes. Not og-border — see the contrast note above. */
const LINE = "stroke-og-soft dark:stroke-white/40";
/** Solid masses (the wordmark block, the occluding card fills). */
const MASS = "fill-og-soft dark:fill-white/40";
/** The card surface, used to occlude where the format stack overlaps. */
const SURFACE = "fill-white dark:fill-og-midnight";

export function DoorDiagram({
  variant,
  className,
}: {
  variant: DoorDiagramVariant;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 240 112"
      // w-full, not a fixed height: at md a three-up door card is ~171px of
      // inner width, and a 240px-wide drawing would run out of the card. It
      // scales down proportionally and caps at its drawn size.
      className={cn("h-auto w-full max-w-[240px]", className)}
      fill="none"
      strokeLinecap="square"
      aria-hidden
      focusable="false"
    >
      {variant === "measure" && <Measure />}
      {variant === "retrieve" && <Retrieve />}
      {variant === "assemble" && <Assemble />}
    </svg>
  );
}

/**
 * 01 Guidelines — the verb is *measure*.
 *
 * The clear-space diagram, which is what a guideline literally looks like. The
 * numbers do the arguing: the mark is 32 tall, and the dashed reserve sits 32
 * off it on all four sides, so the green dimension measuring the mark is
 * exactly as tall as the band it is drawn inside. The rule ("clear space equals
 * the height of the mark") is legible from the proportions alone.
 *
 * An earlier pass drew this at half the size in the left third of the field.
 * It was accurate and it read as a speck — at ~170px of card width these
 * drawings only survive as large, simple shapes.
 */
function Measure() {
  return (
    <>
      <rect x="40" y="8" width="160" height="96" strokeDasharray="4 5" className={LINE} />
      <rect x="72" y="40" width="96" height="32" className={MASS} stroke="none" />
      {/* The one green element: the mark's height, drawn inside the reserve so
          the two read as the same measure without a second annotation. */}
      <path d="M48 40 H64 M48 72 H64 M56 40 V72" strokeWidth="2" className="stroke-primary" />
    </>
  );
}

/**
 * 02 Downloads — the verb is *retrieve*.
 *
 * A stack of formats and one pull. The rects are filled with the card surface
 * so they occlude where they overlap and read as sheets rather than as a grid.
 */
function Retrieve() {
  return (
    <>
      {[
        { x: 8, y: 10 },
        { x: 22, y: 34 },
        { x: 36, y: 58 },
      ].map((r) => (
        <rect
          key={r.y}
          x={r.x}
          y={r.y}
          width="104"
          height="28"
          className={cn(SURFACE, LINE)}
          strokeWidth="1"
        />
      ))}
      {/* The one green element: the pull. */}
      <path
        d="M186 12 V62 M172 48 L186 63 L200 48"
        strokeWidth="2"
        strokeLinecap="butt"
        className="stroke-primary"
      />
      <path d="M164 74 V86 H208 V74" className={LINE} />
    </>
  );
}

/**
 * 03 Toolkit — the verb is *assemble*.
 *
 * One source fanning into three artifacts: a template is a thing that becomes
 * other things. The nodes are inert; the fan is what the toolkit actually does.
 */
function Assemble() {
  return (
    <>
      <rect x="8" y="40" width="48" height="32" className={LINE} />
      {[8, 43, 78].map((y) => (
        <rect key={y} x="172" y={y} width="60" height="26" className={LINE} />
      ))}
      {/* The one green element: the fan. */}
      <path
        d="M56 56 C112 56 116 21 172 21 M56 56 H172 M56 56 C112 56 116 91 172 91"
        strokeWidth="2"
        className="stroke-primary"
      />
    </>
  );
}
