import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { CORE, GRADIENTS } from "@/data/tokens";

export const Route = createFileRoute("/tokens")({
  component: Tokens,
});

function Tokens() {
  return (
    <>
      <PageHeader
        eyebrow="Design Tokens"
        title="The canonical values, ready for code"
        subhead="Marketing canon: Figtree, Groovy Green #00FF85 on dark and #009A50 on light, Midnight #17132F. Product reconciliation is a later decision."
      />

      <section className="mx-auto max-w-3xl space-y-10 px-6 pb-16">
        <div className="visual-container border border-border bg-card p-6">
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-lg font-bold">Downloadable token kits</h2>
            <DraftBadge>Generating after audit D1/D2</DraftBadge>
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            tokens.json and tokens.css will publish here once the two open green
            decisions land (the logo-on-white ring green, and the Green-300 ramp
            value). Building them now would bake in a value we're about to
            change.
          </p>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Core color</h2>
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
                    <td className="p-3 font-medium">{s.name}</td>
                    <td className="p-3 font-mono text-muted-foreground">{s.hex}</td>
                    <td className="p-3 font-mono text-muted-foreground">{s.rgb}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Type</h2>
          <div className="mt-4 space-y-2 rounded-xl border border-border bg-card p-5 text-sm">
            <p><span className="font-semibold">Family:</span> Figtree everywhere, weights 400 to 800.</p>
            <p><span className="font-semibold">Hierarchy:</span> eyebrow 12px ALL CAPS 0.16em, H1 40 to 44px, subhead 21px, body 15px.</p>
            <p><span className="font-semibold">Rule:</span> no trailing periods on titles or labels. Statements, not sentences.</p>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold">Gradients</h2>
          <div className="mt-4 space-y-2">
            {GRADIENTS.map((g) => (
              <div key={g.name} className="flex items-center gap-3 rounded-lg border border-border bg-card p-3">
                <span className="h-8 w-8 shrink-0 rounded-md" style={{ backgroundImage: g.css }} />
                <span className="text-sm font-medium">{g.name}</span>
                <code className="ml-auto truncate text-xs text-muted-foreground">{g.css}</code>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
