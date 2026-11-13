import { Heading } from "@/components/layout/Heading";
import { PageHeader } from "@/components/layout/PageHeader";
import { Swatch } from "@/components/brand/Swatch";
import { COLOR_GROUPS, GRADIENTS } from "@/data/tokens";

export default function VisualIdentity() {
  return (
    <>
      <PageHeader
        eyebrow="Visual Identity"
        title="Color, logo, and the signature shapes"
        subhead="Every value is click-to-copy. Watch the contrast badges: they enforce the green rule so you never ship green text on white."
      />

      {/* Color groups */}
      {COLOR_GROUPS.map((group) => (
        <section key={group.title} className="container py-8">
          <div className="mb-6 max-w-2xl">
            <Heading as="h2" className="text-2xl font-bold">{group.title}</Heading>
            {group.note && (
              <p className="mt-2 text-sm text-foreground">{group.note}</p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {group.swatches.map((s) => (
              <Swatch key={s.hex} swatch={s} />
            ))}
          </div>
        </section>
      ))}

      {/* Gradients */}
      <section className="container py-8">
        <div className="mb-6 max-w-2xl">
          <Heading as="h2" className="text-2xl font-bold">Gradients</Heading>
          <p className="mt-2 text-sm text-foreground">
            Cyan to Lemon is the only brand gradient. Use one per section.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GRADIENTS.map((g) => (
            <div
              key={g.name}
              className="visual-container overflow-hidden border border-border bg-card"
            >
              <div className="h-28 w-full" style={{ backgroundImage: g.css }} />
              <div className="space-y-1 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold">{g.name}</span>
                  {g.status === "signature" && (
                    <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[11px] font-medium text-primary">
                      signature
                    </span>
                  )}
                </div>
                <code className="block truncate text-xs text-muted-foreground">
                  {g.css}
                </code>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Logo */}
      <section className="container py-8">
        <div className="mb-6 max-w-2xl">
          <Heading as="h2" className="text-2xl font-bold">Logo</Heading>
          <p className="mt-2 text-sm text-foreground">
            White wordmark with Groovy Green rings on Midnight. On white, the
            wordmark is Midnight (ring green pending an open audit decision).
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="visual-container flex items-center justify-center border border-border bg-og-midnight p-12">
            <img src="/logo-dark.png" alt="Ordergroove logo on dark" className="max-h-16 md:max-h-20 lg:max-h-24" />
          </div>
          <div className="visual-container flex items-center justify-center border border-border bg-white p-12">
            <img src="/logo-white.png" alt="Ordergroove logo on light" className="max-h-16 md:max-h-20 lg:max-h-24" />
          </div>
        </div>
      </section>
    </>
  );
}
