import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { NAV } from "@/data/nav";
import { CORE } from "@/data/tokens";
import { Swatch } from "@/components/brand/Swatch";
import { Button } from "@/components/ui/button";

const UPDATES = [
  { date: "Jul 23, 2026", note: "Brand hub scaffolding is live. Visual Identity and Downloads are taking shape." },
  { date: "Jul 22, 2026", note: "Phase 0 content audit complete. Conversion of cleared sections is underway." },
];

export default function Home() {
  return (
    <>
      {/* Hero — a dark, rounded module sitting on the light canvas */}
      <section className="container pt-8 md:pt-12">
        <div className="dark relative overflow-hidden rounded-[28px] bg-og-midnight px-8 py-20 text-foreground md:px-16 md:py-28">
          {/* Paired-circle motif */}
          <div aria-hidden className="pointer-events-none absolute inset-0">
            <div className="absolute -right-16 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2 rounded-full bg-og-indigo/50" />
            <div className="absolute right-24 top-1/2 h-[26rem] w-[26rem] -translate-y-1/2 rounded-full bg-og-signature opacity-80" />
          </div>

          <div className="relative max-w-2xl">
            <p className="eyebrow mb-4">Ordergroove Brand Hub</p>
            <h1 className="text-5xl font-extrabold md:text-6xl">The brand, in one place</h1>
            <p className="mt-5 max-w-xl text-lg text-muted-foreground md:text-xl">
              Everything you need to build on-brand subscriptions work: the
              guidelines, the assets, and the tools that keep it consistent.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/visual-identity">
                  Explore the identity <ArrowRight size={18} />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/downloads">Get the assets</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Explore cards */}
      <section className="container py-16 md:py-24">
        <div className="mb-8">
          <p className="eyebrow mb-2">Explore</p>
          <h2 className="text-3xl font-bold md:text-4xl">Start anywhere</h2>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {NAV.map((group) => (
            <div
              key={group.mode}
              className="visual-container flex flex-col border border-border bg-card p-7 transition-shadow hover:shadow-xl hover:shadow-og-midnight/5"
            >
              <p className="eyebrow mb-2">{group.label}</p>
              <ul className="flex-1 divide-y divide-border">
                {group.items.map((item) => (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className="group flex items-start gap-3 py-3.5"
                    >
                      <span className="flex-1">
                        <span className="block font-semibold text-foreground transition-colors group-hover:text-primary">
                          {item.label}
                        </span>
                        <span className="mt-0.5 block text-sm text-muted-foreground">
                          {item.blurb}
                        </span>
                      </span>
                      <ArrowRight
                        size={16}
                        className="mt-0.5 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-primary"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Color teaser + latest updates */}
      <section className="container grid gap-12 pb-20 md:grid-cols-2">
        <div>
          <p className="eyebrow mb-2">Core color</p>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">Copy any value</h2>
          <div className="grid grid-cols-2 gap-4">
            {CORE.swatches.slice(0, 2).map((s) => (
              <Swatch key={s.hex} swatch={s} />
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow mb-2">Latest updates</p>
          <h2 className="mb-6 text-3xl font-bold md:text-4xl">What changed</h2>
          <ul className="divide-y divide-border">
            {UPDATES.map((u) => (
              <li key={u.date} className="flex gap-4 py-4">
                <span className="w-28 shrink-0 text-sm font-medium text-muted-foreground">
                  {u.date}
                </span>
                <span className="text-sm">{u.note}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
