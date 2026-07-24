import { createFileRoute, Link } from "@tanstack/react-router";
import { CopyToast } from "@/components/brand/CopyToast";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { OmniBar } from "@/components/home/OmniBar";
import { Button } from "@/components/ui/button";
import { EXPLORE } from "@/data/nav";
import { useCopyToast } from "@/hooks/use-copy-toast";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

/** The four core values, laid out as the mosaic the design calls for. */
const CORE_TILES = [
  {
    name: "Midnight",
    hex: "#17132F",
    note: "#17132F",
    badges: ["WCAG AAA", "Primary BG"],
    tile: "bg-og-midnight border border-white/10 hover:border-white/30",
    title: "text-white",
    sub: "text-white",
    icon: "text-white",
    span: "md:row-span-2",
  },
  {
    name: "Groovy Green",
    hex: "#00FF85",
    note: "#00FF85 · dark bg only",
    tile: "bg-og-green hover:brightness-105",
    title: "text-og-midnight",
    sub: "text-og-indigo",
    icon: "text-og-midnight",
  },
  {
    name: "Green",
    hex: "#009A50",
    note: "#009A50 · light bg",
    tile: "bg-og-green-light hover:brightness-105",
    title: "text-white",
    sub: "text-white",
    icon: "text-white",
  },
  {
    name: "White",
    hex: "#FFFFFF",
    note: "#FFFFFF · click any card to copy its hex",
    tile: "bg-white hover:brightness-97",
    title: "text-og-midnight",
    sub: "text-og-midnight",
    icon: "text-og-midnight",
    span: "md:col-span-2",
  },
] as const;

const SPECIMEN_ICONS = [
  "autorenew",
  "shopping_bag",
  "trending_up",
  "favorite",
  "bolt",
  "check_circle",
];

const HOME_GRADIENTS = [
  {
    name: "Signature",
    css: "linear-gradient(135deg, #00FF85, #00FAFF)",
    swatch: "bg-og-signature",
  },
  {
    name: "Orange to Yellow",
    css: "linear-gradient(135deg, #FF8500, #EAFF00)",
    swatch: "bg-og-warm",
  },
];

function Index() {
  const { copy, toast } = useCopyToast();

  return (
    <>
      {/* Hero — a Midnight island on the light canvas, with the paired-circle motif */}
      <section className="site-container pt-8">
        {/* Clipping lives on the decor layer, not the island, so the omni bar's
            results panel can overflow past the hero. */}
        <div className="dark relative rounded-[28px] bg-og-midnight px-6 py-16 text-foreground md:px-16 md:py-[88px]">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 overflow-hidden rounded-[28px]"
          >
            {/* Narrow screens keep only the quiet indigo circle: the gradient
                one sits behind the copy there and eats the contrast. */}
            <div className="absolute -bottom-24 -right-24 h-[320px] w-[320px] rounded-full bg-og-indigo/50 md:bottom-auto md:-right-32 md:top-1/2 md:h-[544px] md:w-[544px] md:-translate-y-1/2" />
            <div className="absolute right-24 top-1/2 hidden h-[416px] w-[416px] -translate-y-1/2 rounded-full bg-og-signature opacity-80 md:block" />
          </div>

          <div className="relative flex max-w-[640px] flex-col items-start">
            <p className="eyebrow mb-4">Ordergroove Brand Hub</p>
            <h1 className="text-[40px] font-extrabold md:text-[60px]">The brand, in one place</h1>
            <p className="mt-5 max-w-[520px] text-lg leading-relaxed text-white md:text-[19px]">
              Everything you need to build on-brand subscriptions work: the guidelines, the assets,
              and the tools that keep it consistent.
            </p>
            <OmniBar />
          </div>
        </div>
      </section>

      {/* Explore — one card per mode */}
      <section className="site-container pt-16 md:pt-[72px]">
        <h2 className="mb-7 text-center text-[28px] font-bold md:text-[32px]">
          Explore the Ordergroove brand
        </h2>
        <div className="grid gap-5 md:grid-cols-3">
          {EXPLORE.map((card) => (
            <div
              key={card.title}
              className="dark visual-container flex flex-col bg-og-midnight px-7 py-8 transition-shadow duration-200 hover:shadow-2xl hover:shadow-og-midnight/15"
            >
              <MaterialSymbol name={card.icon} size={32} className="text-primary" />
              <h3 className="mt-5 text-xl font-bold text-foreground">{card.title}</h3>
              <p className="mt-2 mb-6 flex-1 text-[14.5px] leading-relaxed text-foreground">
                {card.blurb}
              </p>
              <Button asChild size="sm" className="self-start px-5 text-[13.5px]">
                <Link to={card.path}>{card.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </section>

      {/* Core color — click any tile to copy its hex */}
      <section className="site-container pt-16 md:pt-[72px]">
        <p className="eyebrow mb-2">Core color</p>
        <h2 className="mb-6 text-[28px] font-bold md:text-[32px]">Copy any value</h2>
        <div className="visual-container grid gap-3 bg-og-indigo p-5 md:grid-cols-[2fr_1fr_1fr] md:grid-rows-[repeat(2,150px)]">
          {CORE_TILES.map((t) => (
            <button
              key={t.hex}
              type="button"
              onClick={() => copy(t.hex)}
              aria-label={`Copy ${t.name} hex ${t.hex}`}
              className={cn(
                "flex min-h-[112px] cursor-pointer flex-col justify-between rounded-xl p-5 text-left transition-all",
                t.tile,
                "span" in t ? t.span : undefined,
              )}
            >
              <span className="flex w-full items-start justify-between gap-3">
                <span>
                  <span className={cn("block font-semibold", t.title)}>{t.name}</span>
                  <span className={cn("mt-0.5 block text-[13px]", t.sub)}>{t.note}</span>
                </span>
                <MaterialSymbol name="content_copy" size={18} className={cn("shrink-0", t.icon)} />
              </span>
              {"badges" in t && (
                <span className="mt-4 flex flex-wrap gap-2">
                  {t.badges.map((b) => (
                    <span
                      key={b}
                      className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-white"
                    >
                      {b}
                    </span>
                  ))}
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Foundations — type, icons, gradients */}
      <section className="site-container pb-4 pt-6">
        <div className="grid gap-5 md:grid-cols-3">
          {/* Typography */}
          <div className="visual-container flex flex-col border border-border bg-card p-7">
            <p className="eyebrow">Typography</p>
            <div className="mt-4 text-[44px] font-extrabold leading-none tracking-[-0.02em]">
              Figtree
            </div>
            <p className="mt-2 text-[15px] text-muted-foreground">
              Aa Bb Cc 0123 — <span className="font-bold">Bold</span>{" "}
              <span className="font-semibold">SemiBold</span>{" "}
              <span className="font-medium">Medium</span> <span>Regular</span>
            </p>
            <p className="mt-2.5 mb-5 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
              The only brand font, for everything from decks to product.
            </p>
            <Button asChild size="sm" className="self-start px-5 text-[13px]">
              <Link to="/downloads">Download font</Link>
            </Button>
          </div>

          {/* Icons */}
          <div className="visual-container flex flex-col border border-border bg-card p-7">
            <p className="eyebrow">Icons</p>
            <div className="mt-5 flex flex-wrap gap-3.5 text-foreground">
              {SPECIMEN_ICONS.map((name) => (
                <MaterialSymbol key={name} name={name} size={30} />
              ))}
            </div>
            <p className="mt-4 mb-5 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
              Material Symbols — weight 300, fill off, grade normal.
            </p>
            <a
              href="https://fonts.google.com/icons?icon.set=Material+Symbols&icon.style=Outlined"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 self-start text-[13px] font-semibold text-primary hover:underline"
            >
              Browse the icon set
              <MaterialSymbol name="arrow_outward" size={15} />
            </a>
          </div>

          {/* Gradients */}
          <div className="visual-container flex flex-col border border-border bg-card p-7">
            <p className="eyebrow mb-4">Gradients</p>
            <div className="flex flex-col gap-2.5">
              {HOME_GRADIENTS.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => copy(g.css, `the ${g.name.toLowerCase()} gradient`)}
                  aria-label={`Copy the ${g.name} gradient CSS`}
                  className={cn(
                    "flex h-11 cursor-pointer items-center justify-end rounded-[10px] px-3 transition-all hover:brightness-105",
                    g.swatch,
                  )}
                >
                  <MaterialSymbol name="content_copy" size={16} className="text-og-midnight" />
                </button>
              ))}
            </div>
            <p className="mt-3.5 flex-1 text-[13.5px] leading-relaxed text-muted-foreground">
              Signature and approved gradients. Click a bar to copy its CSS.
            </p>
          </div>
        </div>
      </section>

      <CopyToast toast={toast} />
    </>
  );
}
