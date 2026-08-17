import { createFileRoute, Link } from "@tanstack/react-router";
import { Kicker } from "@/components/brand/Kicker";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { SectionHead } from "@/components/brand/SectionHead";
import { SinglePageChapter } from "@/components/hub/SinglePageContext";
import { OmniBar } from "@/components/home/OmniBar";
import { CORE, gradient } from "@/data/tokens";
import { assetsQueryOptions } from "@/lib/assets-query";
import { Foundation } from "@/routes/foundation";
import { Voice } from "@/routes/voice";
import { VisualIdentity } from "@/routes/visual-identity";
import { Tokens } from "@/routes/tokens";
import { Downloads } from "@/routes/downloads";
import { Toolkit } from "@/routes/toolkit";
import { AISkills } from "@/routes/ai-skills";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(assetsQueryOptions),
  component: Index,
});

const HERO_GRADIENT = gradient("marquee").css;

const QUICK_REFERENCE = [
  { label: "Source of truth", value: "brand.md + brand-style-guide.md", hash: "positioning" },
  { label: "Category", value: "Autonomous Subscriptions", hash: "positioning" },
  { label: "Primary background", value: "Midnight #17132F", hash: "logo-color" },
  { label: "Accent on dark", value: "Groovy Green #00FF85", hash: "logo-color" },
  { label: "Accent on light", value: "Green #009A50", hash: "logo-color" },
  { label: "Typeface", value: "Figtree, weights 400 to 800", hash: "tokens" },
  { label: "Voice", value: "Confident, precise, operator-minded", hash: "voice" },
  { label: "Logo default", value: "White wordmark + green rings on Midnight", hash: "logo-color" },
] as const;

const UPDATES = [
  {
    date: "Jul 22",
    title: "Gradient rules rewritten",
    blurb: "Cyan-to-lemon only. Direction locked to 112 degrees.",
    kind: "Guideline",
    hash: "logo-color",
  },
  {
    date: "Jul 15",
    title: "Deck template v2.0",
    blurb: "All 80 layouts moved onto Figtree and the new footer bar.",
    kind: "Template",
    hash: "toolkit",
  },
  {
    date: "Jul 09",
    title: "Design tokens published",
    blurb: "88 custom properties, exported as CSS and JSON.",
    kind: "Tokens",
    hash: "tokens",
  },
  {
    date: "Jun 28",
    title: "Soleil formally sunsetted",
    blurb: "Figtree replaces it everywhere. Legacy files flagged for rebuild.",
    kind: "Typography",
    hash: "downloads",
  },
] as const;

function Index() {
  return (
    <div className="bg-background">
      <section
        id="overview"
        data-hub-section
        className="relative scroll-mt-[var(--stick)] overflow-hidden"
        style={{ backgroundImage: HERO_GRADIENT }}
      >
        <div className="site-container pb-[calc(var(--step-section)_+_var(--omni-overlap))] pt-[var(--step-section)]">
          <div className="flex items-center gap-4">
            <Kicker className="text-og-midnight">Ordergroove Brand Hub</Kicker>
            <span aria-hidden className="h-px flex-1 bg-og-midnight/25" />
            <span className="hidden text-eyebrow font-bold uppercase text-og-midnight md:block">
              Internal reference
            </span>
          </div>
          <h1 className="mt-10 max-w-[16ch] text-marquee font-extrabold text-og-midnight text-balance">
            The brand, in one place.
          </h1>
          <p className="mt-9 max-w-[46ch] text-xl font-medium leading-normal text-og-midnight text-pretty">
            Guidelines, assets, and tools for everyone at Ordergroove who ships something with the
            brand on it.
          </p>
        </div>
      </section>

      <div
        id="search"
        className="site-container relative z-40 scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <OmniBar />
      </div>

      <section
        id="quick-reference"
        data-hub-section
        className="site-container section-step section-end"
      >
        <SectionHead
          kicker="Quick reference"
          aside={<span className="text-label text-og-soft">The essentials at a glance</span>}
        />
        <div className="module-set block-step grid-cols-1 sm:grid-cols-2">
          {QUICK_REFERENCE.map((item) => (
            <Link
              key={item.label}
              to="/"
              hash={item.hash}
              className="group flex min-h-20 items-center justify-between gap-5 bg-card px-5 py-4 transition-colors hover:bg-og-surface"
            >
              <span>
                <span className="block text-label font-semibold text-og-midnight">
                  {item.label}
                </span>
                <span className="mt-1 block text-body text-og-soft">{item.value}</span>
              </span>
              <MaterialSymbol
                name="arrow_forward"
                size={18}
                className="shrink-0 text-primary transition-transform group-hover:translate-x-1"
              />
            </Link>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3 text-label text-og-soft">
          <span className="font-semibold text-og-midnight">Core palette</span>
          {CORE.swatches.map((swatch) => (
            <Link
              key={swatch.hex}
              to="/"
              hash="logo-color"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-border bg-card px-3 transition-colors hover:border-primary"
            >
              <span
                aria-hidden
                className="size-4 rounded-full border border-og-midnight/10"
                style={{ backgroundColor: swatch.hex }}
              />
              {swatch.hex}
            </Link>
          ))}
        </div>
      </section>

      <SinglePageChapter id="positioning">
        <Foundation />
      </SinglePageChapter>

      <SinglePageChapter id="voice">
        <Voice />
      </SinglePageChapter>

      <SinglePageChapter id="logo-color">
        <VisualIdentity />
      </SinglePageChapter>

      <SinglePageChapter id="tokens">
        <Tokens />
      </SinglePageChapter>

      <SinglePageChapter id="downloads">
        <Downloads />
      </SinglePageChapter>

      <SinglePageChapter id="toolkit">
        <Toolkit />
      </SinglePageChapter>

      <SinglePageChapter id="ai-skills">
        <AISkills />
      </SinglePageChapter>

      <section
        id="updates"
        data-hub-section
        className="site-container section-step section-end scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <SectionHead
          kicker="What's New"
          aside={<span className="text-label text-og-soft">Latest changes</span>}
        />
        <div className="block-step border-t border-og-hairline">
          {UPDATES.map((update) => (
            <Link
              key={`${update.date}-${update.title}`}
              to="/"
              hash={update.hash}
              className="group grid gap-3 border-b border-og-hairline py-5 transition-colors hover:bg-white/45 sm:grid-cols-[72px_1fr_auto] sm:items-center sm:px-3"
            >
              <span className="text-label font-semibold text-og-soft">{update.date}</span>
              <span>
                <span className="block text-body font-bold text-og-midnight">{update.title}</span>
                <span className="mt-1 block text-label text-og-soft">{update.blurb}</span>
              </span>
              <span className="inline-flex items-center gap-2 text-eyebrow font-bold uppercase text-primary">
                {update.kind}
                <MaterialSymbol
                  name="arrow_forward"
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
