import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { AssetCard } from "@/components/brand/AssetCard";
import { CardLink } from "@/components/brand/CardLink";
import { CopyToast } from "@/components/brand/CopyToast";
import { Kicker } from "@/components/brand/Kicker";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { SectionHead } from "@/components/brand/SectionHead";
import { Door, type DoorSpec } from "@/components/home/Door";
import { OmniBar } from "@/components/home/OmniBar";
import { CORE, gradient } from "@/data/tokens";
import { useCopyToast } from "@/hooks/use-copy-toast";
import { assetsQueryOptions } from "@/lib/assets-query";

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(assetsQueryOptions),
  component: Index,
});

const HERO_GRADIENT = gradient("marquee").css;

const DOORS: DoorSpec[] = [
  {
    n: "01",
    title: "Guidelines",
    blurb: "Positioning, voice, logo, color, and the rules behind the brand.",
    cta: "Read the rules",
    path: "/foundation",
    lead: true,
    diagram: "measure",
  },
  {
    n: "02",
    title: "Downloads",
    blurb: "Logo kit, font kit, token exports, backgrounds, and social graphics.",
    cta: "Grab assets",
    path: "/downloads",
    diagram: "retrieve",
  },
  {
    n: "03",
    title: "Tools",
    blurb: "Decks, employee resources, and brand skills for creating new work.",
    cta: "Open the toolkit",
    path: "/toolkit",
    diagram: "assemble",
  },
];

const RIGHTS_TO_WIN = ["Everychannel Infrastructure", "The Groove Network", "Testing Velocity"];

const VOICE_RULES = [
  "Lead with the category and outcome",
  "Use subscriptions in every hero subhead",
  "Write with calm, direct authority",
];

const UPDATES = [
  {
    date: "Jul 22",
    title: "Gradient rules rewritten",
    blurb: "Cyan-to-lemon only. Direction locked to 112 degrees.",
    kind: "Guideline",
    path: "/visual-identity",
  },
  {
    date: "Jul 15",
    title: "Deck template v2.0",
    blurb: "All 80 layouts moved onto Figtree and the new footer bar.",
    kind: "Template",
    path: "/toolkit",
  },
  {
    date: "Jul 09",
    title: "Design tokens published",
    blurb: "88 custom properties, exported as CSS and JSON.",
    kind: "Tokens",
    path: "/tokens",
  },
  {
    date: "Jun 28",
    title: "Soleil formally sunsetted",
    blurb: "Figtree replaces it everywhere. Legacy files flagged for rebuild.",
    kind: "Typography",
    path: "/downloads",
  },
] as const;

function Index() {
  const { data } = useSuspenseQuery(assetsQueryOptions);
  const featuredAssets = data.assets.filter((asset) => asset.href !== null).slice(0, 3);
  const { copy, toast } = useCopyToast();

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
            Find the answer fast, grab what you need, or go deeper into the full guidelines.
          </p>
        </div>
      </section>

      <div
        id="search"
        data-hub-section
        className="site-container relative z-40 scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <OmniBar />
      </div>

      <section
        id="start-here"
        data-hub-section
        className="site-container section-step scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <SectionHead
          kicker="Start here"
          aside={<span className="text-label text-og-soft">Choose what you need</span>}
        />
        <div className="block-step grid grid-cols-1 gap-5 lg:grid-cols-3">
          {DOORS.map((door) => (
            <Door key={door.n} door={door} />
          ))}
        </div>
      </section>

      <section
        id="brand-essentials"
        data-hub-section
        className="site-container section-step scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <SectionHead
          kicker="Brand essentials"
          aside={<span className="text-label text-og-soft">The rules people reach for most</span>}
        />
        <div className="block-step grid gap-5 lg:grid-cols-12">
          <Link
            to="/foundation"
            className="group visual-container flex min-h-[360px] flex-col border border-border bg-card p-7 transition hover:-translate-y-1 lg:col-span-7"
          >
            <div className="flex items-start justify-between gap-6 border-b border-og-hairline pb-5">
              <Kicker as="p">Positioning</Kicker>
              <MaterialSymbol name="arrow_outward" size={20} className="text-primary" />
            </div>
            <div className="my-auto py-9">
              <p className="max-w-[14ch] text-4xl font-extrabold leading-[0.98] tracking-[-0.035em] text-og-midnight sm:text-5xl">
                Lead with Autonomous Subscriptions.
              </p>
              <p className="mt-5 max-w-[54ch] text-body text-og-soft">
                Ordergroove is the enterprise standard for subscriptions and recurring revenue. The
                category leads, then our three Rights to Win support it.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 border-t border-og-hairline pt-5">
              {RIGHTS_TO_WIN.map((right, index) => (
                <span
                  key={right}
                  className="inline-flex items-center gap-2 rounded-full border border-border px-3 py-2 text-label font-semibold text-og-midnight"
                >
                  <span className="text-primary">0{index + 1}</span>
                  {right}
                </span>
              ))}
            </div>
          </Link>

          <Link
            to="/voice"
            className="dark group visual-container flex min-h-[360px] flex-col bg-og-midnight p-7 transition hover:-translate-y-1 lg:col-span-5"
          >
            <div className="flex items-start justify-between gap-6 border-b border-white/15 pb-5">
              <Kicker as="p">Voice</Kicker>
              <MaterialSymbol name="arrow_outward" size={20} className="text-primary" />
            </div>
            <div className="my-auto py-8">
              <p className="max-w-[13ch] text-4xl font-extrabold leading-[0.98] tracking-[-0.035em] text-white">
                Calm authority, earned.
              </p>
              <p className="mt-4 max-w-[38ch] text-body text-white/68">
                Confident, precise, operator-minded, direct, and evidence-led.
              </p>
            </div>
            <ul className="border-t border-white/15 pt-3">
              {VOICE_RULES.map((rule) => (
                <li
                  key={rule}
                  className="flex min-h-10 items-center gap-2 text-label text-white/78"
                >
                  <MaterialSymbol name="check" size={16} className="text-primary" />
                  {rule}
                </li>
              ))}
            </ul>
          </Link>
        </div>
      </section>

      <section
        id="visual-foundations"
        data-hub-section
        className="site-container section-step scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <SectionHead
          kicker="Visual foundations"
          aside={<span className="text-label text-og-soft">Click a color to copy</span>}
        />
        <div className="block-step grid gap-5 lg:grid-cols-12">
          <div className="visual-container overflow-hidden border border-border bg-card lg:col-span-7">
            <div className="flex items-center justify-between gap-5 border-b border-og-hairline px-6 py-5">
              <div>
                <Kicker as="h3">Core color</Kicker>
                <p className="mt-2 text-label text-og-soft">
                  The green changes with the background. Midnight replaces black.
                </p>
              </div>
              <Link to="/visual-identity" className="min-h-11 shrink-0 items-center sm:flex">
                <CardLink>Full guide</CardLink>
              </Link>
            </div>
            <div className="grid min-h-[260px] grid-cols-2 sm:grid-cols-4">
              {CORE.swatches.map((swatch) => {
                const darkText = swatch.hex !== "#17132F";
                return (
                  <button
                    key={swatch.hex}
                    type="button"
                    onClick={() => copy(swatch.hex, swatch.name)}
                    aria-label={`Copy ${swatch.name} ${swatch.hex}`}
                    className="group flex min-h-32 flex-col justify-end p-5 text-left transition-[filter] hover:brightness-[0.96]"
                    style={{ backgroundColor: swatch.hex }}
                  >
                    <span
                      className={`text-body font-bold ${darkText ? "text-og-midnight" : "text-white"}`}
                    >
                      {swatch.name}
                    </span>
                    <span
                      className={`mt-1 font-mono text-label ${darkText ? "text-og-midnight/70" : "text-white/70"}`}
                    >
                      {swatch.hex}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <Link
            to="/tokens"
            className="group visual-container flex min-h-[360px] flex-col border border-border bg-white p-7 transition hover:-translate-y-1 lg:col-span-5"
          >
            <div className="flex items-start justify-between gap-6 border-b border-og-hairline pb-5">
              <Kicker as="p">Typography &amp; tokens</Kicker>
              <MaterialSymbol name="arrow_outward" size={20} className="text-primary" />
            </div>
            <div className="my-auto py-8">
              <p className="text-[clamp(4.25rem,8cqi,6.75rem)] font-extrabold leading-[0.8] tracking-[-0.055em] text-og-midnight">
                Aa
              </p>
              <p className="mt-7 text-3xl font-extrabold tracking-[-0.03em] text-og-midnight">
                Figtree only.
              </p>
              <p className="mt-3 max-w-[36ch] text-body text-og-soft">
                Five approved weights, plus canonical CSS and JSON values ready for code.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-og-hairline pt-5 text-label text-og-midnight">
              <span className="font-normal">Regular</span>
              <span className="font-medium">Medium</span>
              <span className="font-semibold">SemiBold</span>
              <span className="font-bold">Bold</span>
              <span className="font-extrabold">ExtraBold</span>
            </div>
          </Link>
        </div>
        <CopyToast value={toast} />
      </section>

      <section
        id="ready-to-use"
        data-hub-section
        className="site-container section-step scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <SectionHead
          kicker="Ready to use"
          aside={
            <Link to="/downloads" className="flex min-h-11 items-center">
              <CardLink>Browse all downloads</CardLink>
            </Link>
          }
        />
        {featuredAssets.length > 0 ? (
          <div className="block-step grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} />
            ))}
          </div>
        ) : (
          <div className="block-step grid gap-5 sm:grid-cols-2">
            <Link
              to="/downloads"
              className="visual-container flex min-h-44 flex-col justify-between border border-border bg-card p-6 transition hover:-translate-y-1"
            >
              <MaterialSymbol name="download" size={28} className="text-primary" />
              <div>
                <h3 className="text-xl font-bold text-og-midnight">Brand downloads</h3>
                <p className="mt-2 text-body text-og-soft">
                  Logo, font, token, background, and social asset libraries.
                </p>
              </div>
            </Link>
            <Link
              to="/toolkit"
              className="visual-container flex min-h-44 flex-col justify-between border border-border bg-card p-6 transition hover:-translate-y-1"
            >
              <MaterialSymbol name="handyman" size={28} className="text-primary" />
              <div>
                <h3 className="text-xl font-bold text-og-midnight">GTM &amp; employee toolkit</h3>
                <p className="mt-2 text-body text-og-soft">
                  Decks, documents, signatures, and employee resources.
                </p>
              </div>
            </Link>
          </div>
        )}
      </section>

      <section
        id="updates"
        data-hub-section
        className="site-container section-step section-end scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <SectionHead
          kicker="What's new"
          aside={<span className="text-label text-og-soft">Latest changes</span>}
        />
        <div className="block-step border-t border-og-hairline">
          {UPDATES.map((update) => (
            <Link
              key={`${update.date}-${update.title}`}
              to={update.path}
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
