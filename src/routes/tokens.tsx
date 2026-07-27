import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { CopyToast } from "@/components/brand/CopyToast";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { CORE, GRADIENTS } from "@/data/tokens";
import { useCopyToast } from "@/hooks/use-copy-toast";

export const Route = createFileRoute("/tokens")({
  component: Tokens,
});

/** A single copyable cell: fills the table cell, copies its value, shows a copy
 *  glyph on hover/focus. Copies exactly what's displayed (WYSIWYG). */
function CopyCell({ value, onCopy }: { value: string; onCopy: (value: string) => void }) {
  return (
    <button
      type="button"
      onClick={() => onCopy(value)}
      aria-label={`Copy ${value}`}
      className="group flex w-full cursor-pointer items-center gap-2 p-3 text-left font-mono text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:bg-secondary focus-visible:text-foreground focus-visible:outline-none"
    >
      {value}
      <MaterialSymbol
        name="content_copy"
        size={14}
        className="opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
      />
    </button>
  );
}

function Tokens() {
  const { copy, toast } = useCopyToast();

  return (
    <>
      <PageHeader
        eyebrow="Design Tokens"
        title="The canonical values, ready for code"
        subhead="Marketing canon: Figtree, Groovy Green #00FF85 on dark and #009A50 on light, Midnight #17132F. Product reconciliation is a later decision."
      />

      {/* Prose sits in the same 8-column measure PageHeader's title block uses,
          so the masthead and the body share one left edge. */}
      <section className="site-container grid-12 pb-16 pt-12">
        <div className="col-span-12 space-y-10 md:col-span-8">
          <div className="visual-container border border-border bg-card p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-lg font-bold">Downloadable token kits</h2>
              <DraftBadge>Generating after audit D1/D2</DraftBadge>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              tokens.json and tokens.css will publish here once the two open green decisions land
              (the logo-on-white ring green, and the Green-300 ramp value). Building them now would
              bake in a value we're about to change.
            </p>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl font-bold">Core color</h2>
              <p className="text-sm text-muted-foreground">Click any value to copy it.</p>
            </div>
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead className="bg-card">
                  <tr>
                    <th className="p-3 text-left font-semibold">Token</th>
                    <th className="p-3 text-left font-semibold">Hex</th>
                    <th className="p-3 text-left font-semibold">RGB</th>
                  </tr>
                </thead>
                <tbody>
                  {CORE.swatches.map((s) => (
                    <tr key={s.hex} className="border-t border-border">
                      <td className="p-3 font-medium">
                        <span className="inline-flex items-center gap-2">
                          <span
                            aria-hidden
                            className="h-3.5 w-3.5 shrink-0 rounded-[3px] border border-border"
                            style={{ backgroundColor: s.hex }}
                          />
                          {s.name}
                        </span>
                      </td>
                      <td className="p-0">
                        <CopyCell value={s.hex} onCopy={copy} />
                      </td>
                      <td className="p-0">
                        <CopyCell value={s.rgb} onCopy={copy} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold">Type</h2>
            <div className="mt-4 space-y-2 rounded-xl border border-border bg-card p-5 text-sm">
              <p>
                <span className="font-semibold">Family:</span> Figtree everywhere, weights 400 to
                800.
              </p>
              <p>
                <span className="font-semibold">Hierarchy:</span> eyebrow 12px ALL CAPS 0.16em, H1
                40 to 44px, subhead 21px, body 15px.
              </p>
              <p>
                <span className="font-semibold">Rule:</span> no trailing periods on titles or
                labels. Statements, not sentences.
              </p>
            </div>
          </div>

          <div>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h2 className="text-2xl font-bold">Gradients</h2>
              <p className="text-sm text-muted-foreground">Click a row to copy its CSS.</p>
            </div>
            <div className="mt-4 space-y-2">
              {GRADIENTS.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => copy(g.css, `the ${g.name} gradient`)}
                  aria-label={`Copy the ${g.name} gradient CSS`}
                  className="group flex w-full cursor-pointer items-center gap-3 rounded-lg border border-border bg-card p-3 text-left transition-colors hover:border-og-midnight/20 hover:bg-secondary focus-visible:border-og-midnight/20 focus-visible:bg-secondary focus-visible:outline-none"
                >
                  <span
                    aria-hidden
                    className="h-8 w-8 shrink-0 rounded-md"
                    style={{ backgroundImage: g.css }}
                  />
                  <span className="shrink-0 text-sm font-medium">{g.name}</span>
                  <code className="ml-auto truncate text-xs text-muted-foreground">{g.css}</code>
                  <MaterialSymbol
                    name="content_copy"
                    size={16}
                    className="shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CopyToast toast={toast} />
    </>
  );
}
