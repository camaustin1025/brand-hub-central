import { createFileRoute } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Swatch } from "@/components/brand/Swatch";
import { CopyToast } from "@/components/brand/CopyToast";
import { COLOR_GROUPS, GRADIENTS } from "@/data/tokens";
import { contrast, grade, passesBodyText } from "@/lib/contrast";
import { useCopyToast } from "@/hooks/use-copy-toast";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/visual-identity")({
  component: VisualIdentity,
});

/**
 * The three greens the system actually ships, and the three surfaces they land
 * on. Ratios below are computed, never typed in — if a token changes, the table
 * corrects itself rather than going quietly stale.
 */
const GREENS = [
  {
    name: "Groovy Green",
    hex: "#00FF85",
    role: "Accent on Midnight only",
  },
  {
    name: "Green",
    hex: "#009A50",
    role: "Brand swatch. Fills and large type",
  },
  {
    name: "UI accent",
    hex: "#008040",
    role: "What text-primary paints on light",
  },
] as const;

const SURFACES = [
  { name: "White", hex: "#FFFFFF" },
  { name: "Cloud", hex: "#F5F5F8" },
  { name: "Midnight", hex: "#17132F" },
] as const;

/**
 * Logo misuse. Each tile renders the real wordmark through the exact CSS that
 * breaks it, so the rule is demonstrated rather than asserted — a written
 * "don't stretch" is far easier to ignore than a stretched logo.
 */
type Misuse = {
  label: string;
  why: string;
  style: React.CSSProperties;
  surface: string;
  src: string;
  /** Renders the mark hard against the tile edges, to show crowding. */
  tight?: boolean;
};

const MISUSE: Misuse[] = [
  {
    label: "Don't recolor the wordmark",
    why: "The mark is Midnight on light, white on Midnight. Nothing else.",
    style: { filter: "hue-rotate(280deg) saturate(3)" },
    surface: "bg-white",
    src: "/logo-white.png",
  },
  {
    label: "Don't stretch or condense",
    why: "Scale both axes together, always.",
    style: { transform: "scaleX(1.55)" },
    surface: "bg-white",
    src: "/logo-white.png",
  },
  {
    label: "Don't rotate",
    why: "The wordmark sits level. No angles, no arcs.",
    style: { transform: "rotate(-11deg)" },
    surface: "bg-white",
    src: "/logo-white.png",
  },
  {
    label: "Don't add effects",
    why: "No shadows, glows, bevels, or outlines.",
    style: { filter: "drop-shadow(0 4px 6px rgba(23,19,47,0.55))" },
    surface: "bg-white",
    src: "/logo-white.png",
  },
  {
    label: "Don't place it on the gradient",
    why: "The marquee is a background for type, not a bed for the mark.",
    style: {},
    surface: "bg-og-signature",
    src: "/logo-white.png",
  },
  {
    label: "Don't crowd it",
    why: "Clear space on every side equals the height of the mark.",
    style: {},
    surface: "bg-white",
    src: "/logo-white.png",
    tight: true,
  },
];

function VisualIdentity() {
  const { copy, toast } = useCopyToast();

  return (
    <>
      <PageHeader
        eyebrow="Visual Identity"
        title="Color, logo, and the signature shapes"
        subhead="Every value is click-to-copy. Watch the contrast badges: they enforce the green rule so you never ship green text on white."
      />

      {/* Color groups */}
      {COLOR_GROUPS.map((group) => (
        <section key={group.title} className="site-container py-8">
          <div className="mb-6 max-w-2xl">
            <h2 className="text-2xl font-bold">{group.title}</h2>
            {group.note && <p className="mt-2 text-sm text-muted-foreground">{group.note}</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {group.swatches.map((s) => (
              <Swatch key={s.hex} swatch={s} />
            ))}
          </div>
        </section>
      ))}

      {/* Gradients */}
      <section className="site-container py-8">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-bold">Gradients</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The signature is Green to Cyan on dark. Reserve gradients for the payoff line, one per
            section.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GRADIENTS.map((g) => (
            <button
              key={g.name}
              type="button"
              onClick={() => copy(g.css, `the ${g.name} gradient`)}
              aria-label={`Copy the ${g.name} gradient CSS`}
              className="group visual-container block overflow-hidden border border-border bg-card text-left transition-shadow hover:shadow-2xl hover:shadow-og-midnight/10"
            >
              <div className="relative h-28 w-full" style={{ backgroundImage: g.css }}>
                <span className="absolute inset-0 flex items-start justify-end p-2 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="rounded-md bg-black/40 p-1.5 text-white backdrop-blur">
                    <Copy size={16} />
                  </span>
                </span>
              </div>
              <div className="space-y-1 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{g.name}</span>
                  {g.status === "signature" && (
                    <span className="rounded-full bg-primary px-2 py-0.5 text-[11px] font-medium text-primary-foreground">
                      signature
                    </span>
                  )}
                </div>
                <code className="block truncate text-xs text-muted-foreground">{g.css}</code>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Green legibility — the contrast rule, demonstrated and measured */}
      <section className="site-container py-8">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-bold">Green legibility</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Green is never one value. Every ratio below is measured live against WCAG, so this table
            is the source of truth, not the prose. AA needs 4.5:1 for body text; 3:1 only counts for
            24px+, or 18.7px+ bold.
          </p>
        </div>

        <div className="visual-container overflow-hidden border border-border">
          {/* Horizontal scroll rather than a squeezed table on small screens. */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-sm">
              <thead>
                <tr className="bg-card">
                  <th scope="col" className="p-3 text-left font-semibold">
                    Green
                  </th>
                  {SURFACES.map((s) => (
                    <th key={s.hex} scope="col" className="p-3 text-left font-semibold">
                      On {s.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {GREENS.map((g) => (
                  <tr key={g.hex} className="border-t border-border align-top">
                    <th scope="row" className="p-3 text-left font-medium">
                      <span className="flex items-center gap-2">
                        <span
                          aria-hidden
                          className="h-3.5 w-3.5 shrink-0 rounded-[3px] border border-border"
                          style={{ backgroundColor: g.hex }}
                        />
                        {g.name}
                      </span>
                      <span className="mt-1 block font-mono text-xs text-muted-foreground">
                        {g.hex}
                      </span>
                      <span className="mt-1 block text-xs font-normal text-muted-foreground">
                        {g.role}
                      </span>
                    </th>
                    {SURFACES.map((s) => {
                      const ratio = contrast(g.hex, s.hex);
                      const ok = passesBodyText(ratio);
                      return (
                        <td key={s.hex} className="p-3">
                          {/* Live specimen: the actual pair, at actual body size. */}
                          <span
                            className="mb-2 flex items-center justify-center rounded-md border border-border px-3 py-2.5 text-[15px] font-bold"
                            style={{ backgroundColor: s.hex, color: g.hex }}
                          >
                            Subscriptions
                          </span>
                          <span className="flex flex-wrap items-center gap-1.5">
                            <span
                              className={cn(
                                "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium",
                                ok
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-destructive text-destructive-foreground",
                              )}
                            >
                              {ok ? "✓" : "✗"} {grade(ratio)}
                            </span>
                            <span className="font-mono text-xs text-muted-foreground">
                              {ratio.toFixed(2)}:1
                            </span>
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          Reach for <code className="font-mono text-foreground">text-primary</code> rather than a
          hardcoded green and the correct value applies itself: the UI accent on light, Groovy Green
          inside any <code className="font-mono text-foreground">.dark</code> island.
        </p>
      </section>

      {/* Logo */}
      <section className="site-container py-8">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-bold">Logo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            White wordmark with Groovy Green rings on Midnight. On white, the wordmark is Midnight
            (ring green pending an open audit decision).
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="visual-container flex items-center justify-center border border-border bg-og-midnight p-12">
            <img src="/logo-dark.png" alt="Ordergroove logo on dark" className="max-h-16" />
          </div>
          <div className="visual-container flex items-center justify-center border border-border bg-white p-12">
            <img src="/logo-white.png" alt="Ordergroove logo on light" className="max-h-16" />
          </div>
        </div>
      </section>

      {/* Logo misuse */}
      <section className="site-container py-8 pb-16">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-bold">What not to do</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Every tile below is the real wordmark rendered through the thing that breaks it. If a
            file in the wild looks like one of these, it needs rebuilding from the logo kit.
          </p>
        </div>
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MISUSE.map((m) => (
            // bg-card matters: on the page's #F5F5F8 the destructive caption
            // measures 4.50:1, a hair under AA. On white it clears at 4.89:1.
            <li
              key={m.label}
              className="visual-container overflow-hidden border border-border bg-card"
            >
              <div
                className={cn(
                  "relative flex h-40 items-center justify-center overflow-hidden",
                  m.surface,
                  m.tight ? "px-0" : "px-8",
                )}
              >
                <img
                  src={m.src}
                  alt=""
                  width={512}
                  height={88}
                  aria-hidden
                  className={cn("h-6 w-auto", m.tight && "w-full max-w-none object-cover")}
                  style={m.style}
                />
                {/* Decorative strike. The caption carries the meaning, so this is
                    never the only signal that the tile is a "don't". */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to top right, transparent calc(50% - 0.5px), var(--color-destructive) calc(50% - 0.5px), var(--color-destructive) calc(50% + 0.5px), transparent calc(50% + 0.5px))",
                  }}
                />
              </div>
              <div className="border-t border-border p-4">
                <p className="flex items-baseline gap-1.5 text-sm font-semibold text-destructive">
                  <span aria-hidden>✗</span>
                  {m.label}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{m.why}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
