import { createFileRoute } from "@tanstack/react-router";
import { Copy } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Swatch } from "@/components/brand/Swatch";
import { CopyToast } from "@/components/brand/CopyToast";
import { COLOR_GROUPS, GRADIENTS } from "@/data/tokens";
import { useCopyToast } from "@/hooks/use-copy-toast";

export const Route = createFileRoute("/visual-identity")({
  component: VisualIdentity,
});

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
            The signature is Green to Cyan on dark. Reserve gradients for the
            payoff line, one per section.
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
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
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

      {/* Logo */}
      <section className="site-container py-8">
        <div className="mb-6 max-w-2xl">
          <h2 className="text-2xl font-bold">Logo</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            White wordmark with Groovy Green rings on Midnight. On white, the
            wordmark is Midnight (ring green pending an open audit decision).
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
    </>
  );
}
