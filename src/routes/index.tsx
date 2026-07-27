import { createFileRoute, Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { CopyToast } from "@/components/brand/CopyToast";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { OmniBar } from "@/components/home/OmniBar";
import { useCopyToast } from "@/hooks/use-copy-toast";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

/** The signature gradient marquee — Green → Cyan → Lemon, locked to 112°. */
const HERO_GRADIENT = "linear-gradient(112deg, #00FF85 0%, #00FAFF 52%, #EAFF00 100%)";

/** New-to-the-brand path: three steps that map to the three doors below. */
const START_STEPS = [
  {
    step: "Step 01",
    title: "Learn what we sound and look like",
    blurb: "Fifteen minutes in Foundation and Voice covers most of what you'll need.",
    path: "/foundation",
  },
  {
    step: "Step 02",
    title: "Grab what you need",
    blurb: "Logos, fonts, colors, and templates — all downloadable, all current.",
    path: "/downloads",
  },
  {
    step: "Step 03",
    title: "Check the work before it ships",
    blurb: "Run it past the brand skills, or request a review from Brand & Content.",
    path: "/ai-skills",
  },
] as const;

/** The three doors — Guidelines leads on a Midnight island, the other two on white. */
const DOORS = [
  {
    n: "01",
    title: "Guidelines",
    blurb: "Foundation, voice, visual identity, and the tokens behind them.",
    cta: "Read the rules",
    path: "/foundation",
    dark: true,
  },
  {
    n: "02",
    title: "Downloads",
    blurb: "Logo kit, font kit, token exports, and social graphics.",
    cta: "Grab assets",
    path: "/downloads",
    dark: false,
  },
  {
    n: "03",
    title: "Toolkit",
    blurb: "Deck templates, signatures, and the AI skills that check the work.",
    cta: "Open the toolkit",
    path: "/toolkit",
    dark: false,
  },
] as const;

/** Core color mini-matrix. Each tile copies its hex. */
const CORE_SWATCHES = [
  {
    name: "Midnight",
    hex: "#17132F",
    note: "#17132F · Primary background",
    tile: "bg-og-midnight",
    title: "text-white",
    sub: "text-white/72",
    span: "row-span-2",
  },
  {
    name: "Groovy Green",
    hex: "#00FF85",
    note: "#00FF85 · Dark bg",
    tile: "bg-og-green",
    title: "text-og-midnight",
    sub: "text-og-indigo",
    span: "",
  },
  {
    name: "Green",
    hex: "#009A50",
    note: "#009A50 · Light bg",
    tile: "bg-og-green-light",
    title: "text-white",
    sub: "text-white/85",
    span: "",
  },
  {
    name: "White",
    hex: "#FFFFFF",
    note: "#FFFFFF · Light surface",
    tile: "border border-og-hairline bg-white",
    title: "text-og-midnight",
    sub: "text-og-soft",
    span: "col-span-2",
  },
] as const;

/** Signature and approved gradients — cyan-to-lemon, always. */
const HOME_GRADIENTS = [
  { name: "Signature gradient", css: "linear-gradient(112deg, #00FF85, #00FAFF)" },
  { name: "Marquee gradient", css: "linear-gradient(112deg, #00FF85, #00FAFF, #EAFF00)" },
  { name: "Orange to Yellow gradient", css: "linear-gradient(112deg, #FF8500, #EAFF00)" },
] as const;

const SPECIMEN_ICONS = [
  "autorenew",
  "shopping_bag",
  "trending_up",
  "favorite",
  "bolt",
  "check_circle",
];

/** Most-downloaded assets. Thumbnails are placeholders until real previews land. */
const POPULAR = [
  { title: "Logo kit", meta: "SVG, PNG, EPS · 14 files", icon: "workspace_premium" },
  { title: "Figtree font kit", meta: "TTF, WOFF2 · 5 weights", icon: "text_fields" },
  { title: "Deck template", meta: "PPTX, Google Slides", icon: "slideshow" },
  { title: "Color tokens", meta: "CSS, JSON, ASE", icon: "palette" },
] as const;

const TEMPLATES = [
  {
    title: "Presentation deck",
    tag: "Ready",
    blurb: "80 layouts: covers, agendas, stats, customer logos, quote slides.",
    icon: "slideshow",
  },
  {
    title: "Email signature",
    tag: "Ready",
    blurb: "Copy-paste HTML with the right wordmark and spacing.",
    icon: "mail",
  },
  {
    title: "Social graphics",
    tag: "In progress",
    blurb: "LinkedIn and event templates. Being rebuilt on the new gradient.",
    icon: "image",
  },
] as const;

/** Recent changes. `path` sends each row to the page it changed. */
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

/** The recurring small-cap kicker. Defaults to the correct-contrast light green. */
function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "text-xs font-bold uppercase tracking-[0.16em] text-og-green-light",
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Section opener: a green kicker and a right-aligned aside over a Midnight rule. */
function SectionHead({ kicker, aside }: { kicker: string; aside?: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-og-midnight pb-3.5">
      <Kicker>{kicker}</Kicker>
      {aside}
    </div>
  );
}

/** A muted right-aligned section tag (hidden on small screens). */
function Aside({ children }: { children: ReactNode }) {
  return (
    <span className="hidden text-xs font-semibold uppercase tracking-[0.16em] text-og-soft md:block">
      {children}
    </span>
  );
}

/** The green "eyebrow → link" affordance at the bottom of a card. */
function CardLink({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.16em] text-og-green-light",
        className,
      )}
    >
      {children}
      <MaterialSymbol name="arrow_outward" size={15} />
    </span>
  );
}

function Index() {
  const { copy, toast } = useCopyToast();

  return (
    <div className="bg-white">
      {/* HERO — the full-bleed gradient marquee. */}
      <section
        className="relative overflow-hidden"
        style={{ backgroundImage: HERO_GRADIENT }}
      >
        <div className="site-container pb-32 pt-[72px]">
          <div className="flex items-center gap-4">
            <Kicker className="text-og-midnight">Ordergroove Brand Hub</Kicker>
            <span aria-hidden className="h-px flex-1 bg-og-midnight/25" />
            <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-og-midnight md:block">
              Internal · v2.0
            </span>
          </div>
          <h1 className="mt-10 max-w-[16ch] text-[clamp(56px,9vw,132px)] font-extrabold leading-[0.86] tracking-[-0.04em] text-og-midnight text-balance">
            The brand, in one place.
          </h1>
          <p className="mt-9 max-w-[46ch] text-xl font-medium leading-normal text-og-midnight text-pretty">
            Guidelines, assets, and tools for everyone at Ordergroove who ships something with the
            brand on it.
          </p>
        </div>
      </section>

      {/* Search overlaps the gradient; z-40 lifts it and the results panel clear. */}
      <div className="site-container relative z-40">
        <OmniBar />
      </div>

      {/* START HERE */}
      <section className="site-container pt-20">
        <SectionHead kicker="Start here" aside={<Aside>Path.01 — New to the brand</Aside>} />
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
          {START_STEPS.map((s) => (
            <Link
              key={s.step}
              to={s.path}
              className="flex min-h-[200px] flex-col border border-og-border p-[26px] transition-colors hover:border-og-midnight hover:bg-og-surface"
            >
              <Kicker className="tracking-[0.16em]">{s.step}</Kicker>
              <span className="mt-auto text-[26px] font-bold leading-[1.05] tracking-[-0.025em] text-og-midnight">
                {s.title}
              </span>
              <span className="mt-3 text-[14.5px] leading-normal text-og-indigo">{s.blurb}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* THE THREE DOORS */}
      <section id="guidelines" className="site-container pt-20">
        <SectionHead kicker="The three doors" aside={<Aside>Sec.02</Aside>} />
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
          {DOORS.map((d) =>
            d.dark ? (
              <Link
                key={d.n}
                to={d.path}
                className="flex min-h-[270px] flex-col bg-og-midnight p-[30px] transition-transform hover:-translate-y-1"
              >
                <span className="text-xs font-bold tracking-[0.16em] text-og-green">{d.n}</span>
                <span className="mt-auto text-4xl font-bold leading-none tracking-[-0.03em] text-white">
                  {d.title}
                </span>
                <span className="mt-3.5 text-[15px] leading-normal text-white/66">{d.blurb}</span>
                <CardLink className="mt-[22px] text-og-green">{d.cta}</CardLink>
              </Link>
            ) : (
              <Link
                key={d.n}
                to={d.path}
                className="flex min-h-[270px] flex-col border border-og-border bg-white p-[30px] transition-colors hover:border-og-midnight hover:bg-og-surface"
              >
                <span className="text-xs font-bold tracking-[0.16em] text-og-green-light">
                  {d.n}
                </span>
                <span className="mt-auto text-4xl font-bold leading-none tracking-[-0.03em] text-og-midnight">
                  {d.title}
                </span>
                <span className="mt-3.5 text-[15px] leading-normal text-og-indigo">{d.blurb}</span>
                <CardLink className="mt-[22px]">{d.cta}</CardLink>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* FOUNDATIONS — color + type, then gradients / icons / logo */}
      <section id="color" className="site-container pt-20">
        <SectionHead kicker="Foundations" aside={<Aside>Click any swatch to copy</Aside>} />

        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Core color */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <Kicker>Core Color</Kicker>
              <Aside>F.01</Aside>
            </div>
            <div className="grid grid-cols-[1.4fr_1fr_1fr] grid-rows-[repeat(2,110px)]">
              {CORE_SWATCHES.map((s) => (
                <button
                  key={s.hex}
                  type="button"
                  onClick={() => copy(s.hex)}
                  aria-label={`Copy ${s.name} hex ${s.hex}`}
                  className={cn(
                    "flex cursor-pointer flex-col justify-end p-[18px] text-left transition-[filter] hover:brightness-[0.97]",
                    s.tile,
                    s.span,
                  )}
                >
                  <span className={cn("text-[15px] font-bold", s.title)}>{s.name}</span>
                  <span className={cn("text-[13px]", s.sub)}>{s.note}</span>
                </button>
              ))}
            </div>
            <Link to="/tokens" className="self-start">
              <CardLink>All {CORE_SWATCHES.length + 10} color tokens</CardLink>
            </Link>
          </div>

          {/* Typography */}
          <div id="type" className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <Kicker>Typography</Kicker>
              <Aside>F.02</Aside>
            </div>
            <div className="flex flex-1 flex-col justify-between border border-og-border bg-white p-[26px]">
              <div>
                <div className="text-[82px] font-extrabold leading-[0.9] tracking-[-0.04em] text-og-midnight">
                  Figtree
                </div>
                <p className="mt-4 text-[15px] text-og-midnight">
                  Aa Bb Cc 0123 — <span className="font-extrabold">ExtraBold</span>{" "}
                  <span className="font-bold">Bold</span>{" "}
                  <span className="font-semibold">SemiBold</span>{" "}
                  <span className="font-medium">Medium</span> <span>Regular</span>
                </p>
              </div>
              <div className="flex flex-col items-start justify-between gap-5 pt-6 sm:flex-row sm:items-end">
                <p className="max-w-[32ch] text-[14.5px] leading-normal text-og-indigo text-pretty">
                  The only brand font, for everything from decks to product. Soleil is sunsetted;
                  never Helvetica or Arial.
                </p>
                <Link to="/downloads" className="shrink-0">
                  <CardLink>Font kit</CardLink>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Gradients */}
          <div className="flex flex-col border border-og-border p-6">
            <div className="flex items-center justify-between gap-3">
              <Kicker>Gradients</Kicker>
              <Aside>F.03</Aside>
            </div>
            <div className="mt-[18px] flex flex-col gap-2">
              {HOME_GRADIENTS.map((g) => (
                <button
                  key={g.name}
                  type="button"
                  onClick={() => copy(g.css, `the ${g.name}`)}
                  aria-label={`Copy the ${g.name} CSS`}
                  className="flex h-[46px] cursor-pointer items-center justify-end px-3.5 transition-[filter] hover:brightness-105"
                  style={{ backgroundImage: g.css }}
                >
                  <MaterialSymbol
                    name="content_copy"
                    size={16}
                    className="text-og-midnight opacity-70"
                  />
                </button>
              ))}
            </div>
            <p className="mt-4 flex-1 text-[14px] leading-normal text-og-indigo text-pretty">
              Cyan to lemon, always. Click a bar to copy its CSS.
            </p>
          </div>

          {/* Icons */}
          <div className="flex flex-col border border-og-border p-6">
            <div className="flex items-center justify-between gap-3">
              <Kicker>Icons</Kicker>
              <Aside>F.04</Aside>
            </div>
            <div className="mt-5 flex flex-wrap gap-[18px] text-og-midnight">
              {SPECIMEN_ICONS.map((name) => (
                <MaterialSymbol key={name} name={name} size={32} />
              ))}
            </div>
            <p className="mb-[18px] mt-5 flex-1 text-[14px] leading-normal text-og-indigo text-pretty">
              Material Symbols — weight 300, fill off, grade normal. Don't retune the axes.
            </p>
            <a
              href="https://fonts.google.com/icons?icon.set=Material+Symbols&icon.style=Outlined"
              target="_blank"
              rel="noreferrer"
              className="self-start"
            >
              <CardLink>Browse the set</CardLink>
            </a>
          </div>

          {/* Logo */}
          <div className="flex flex-col border border-og-border p-6">
            <div className="flex items-center justify-between gap-3">
              <Kicker>Logo</Kicker>
              <Aside>F.05</Aside>
            </div>
            <div className="mt-[18px] grid grid-cols-2 gap-2">
              <div className="flex h-[82px] items-center justify-center border border-og-hairline bg-white p-4">
                <img src="/logo-white.png" alt="Ordergroove wordmark, dark" className="h-[18px] w-auto" />
              </div>
              <div className="flex h-[82px] items-center justify-center bg-og-midnight p-4">
                <img src="/logo-dark.png" alt="Ordergroove wordmark, white" className="h-[18px] w-auto" />
              </div>
            </div>
            <p className="mb-[18px] mt-[18px] flex-1 text-[14px] leading-normal text-og-indigo text-pretty">
              Clear space equals the height of the mark. Never recolor, stretch, or add effects.
            </p>
            <Link to="/downloads" className="self-start">
              <CardLink>Logo kit</CardLink>
            </Link>
          </div>
        </div>
      </section>

      {/* MOST DOWNLOADED */}
      <section id="downloads" className="site-container pt-20">
        <SectionHead
          kicker="Most downloaded"
          aside={
            <Link
              to="/downloads"
              className="text-xs font-semibold uppercase tracking-[0.16em] text-og-midnight transition-colors hover:text-og-green-light"
            >
              All downloads →
            </Link>
          }
        />
        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR.map((a) => (
            <Link
              key={a.title}
              to="/downloads"
              className="flex flex-col border border-og-border transition-colors hover:border-og-midnight"
            >
              <span className="thumb-hatch flex h-[150px] items-center justify-center border-b border-og-border">
                <MaterialSymbol name={a.icon} size={32} className="text-og-soft/50" />
              </span>
              <span className="flex flex-col gap-1.5 p-[18px]">
                <span className="text-base font-bold tracking-[-0.01em] text-og-midnight">
                  {a.title}
                </span>
                <span className="text-[13px] text-og-soft">{a.meta}</span>
              </span>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-og-soft">
          Thumbnails pending — real asset previews to be dropped in
        </p>
      </section>

      {/* TEMPLATES & TOOLKIT */}
      <section id="templates" className="site-container pt-20">
        <SectionHead kicker="Templates & toolkit" aside={<Aside>Sec.04</Aside>} />
        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Link
              key={t.title}
              to="/toolkit"
              className="flex flex-col border border-og-border transition-colors hover:border-og-midnight"
            >
              <span className="thumb-hatch flex aspect-[16/9] items-center justify-center border-b border-og-border">
                <MaterialSymbol name={t.icon} size={36} className="text-og-soft/50" />
              </span>
              <span className="flex flex-col gap-2 p-[22px]">
                <span className="flex items-center gap-2.5">
                  <span className="text-[19px] font-bold tracking-[-0.015em] text-og-midnight">
                    {t.title}
                  </span>
                  <span className="shrink-0 whitespace-nowrap border border-og-border px-2 py-[3px] text-[10.5px] font-bold uppercase tracking-[0.12em] text-og-soft">
                    {t.tag}
                  </span>
                </span>
                <span className="text-[14px] leading-normal text-og-indigo">{t.blurb}</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ASSISTANT BAND — full-bleed Midnight */}
      <section id="assistant" className="relative mt-20 overflow-hidden bg-og-midnight">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-64 -top-72 h-[820px] w-[820px] rounded-full opacity-25 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, #00FAFF 0%, rgba(234,255,0,0.85) 45%, rgba(23,19,47,0) 72%)",
          }}
        />
        <div className="site-container relative flex flex-col items-start justify-between gap-12 py-[72px] lg:flex-row lg:items-center">
          <div className="max-w-[56ch]">
            <div className="flex items-center gap-3.5">
              <Kicker className="text-og-green">AI & Skills</Kicker>
              <span className="shrink-0 whitespace-nowrap border border-white/28 px-2.5 py-1 text-[10.5px] font-bold uppercase tracking-[0.12em] text-white/70">
                Coming soon
              </span>
            </div>
            <h2 className="mt-[22px] text-[52px] font-bold leading-none tracking-[-0.03em] text-white text-balance">
              Ask the brand, get an answer.
            </h2>
            <p className="mt-5 text-[17px] leading-relaxed text-white/72 text-pretty">
              The brand assistant will read from this hub and answer in plain language — which green
              on white, whether a headline sounds like us, what's wrong with a slide. The canon it
              draws from is being written now.
            </p>
          </div>
          <div className="flex shrink-0 flex-col gap-3">
            <Link
              to="/ai-skills"
              className="inline-flex items-center justify-center gap-2.5 bg-og-green px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-og-midnight transition-colors hover:bg-white"
            >
              <MaterialSymbol name="auto_awesome" size={17} />
              Read the AI guidance
            </Link>
            <Link
              to="/ai-skills"
              className="inline-flex items-center justify-center gap-2.5 border border-white/28 px-7 py-4 text-xs font-bold uppercase tracking-[0.16em] text-white transition-colors hover:border-og-green hover:text-og-green"
            >
              Join the pilot
            </Link>
          </div>
        </div>
      </section>

      {/* WHAT'S NEW + HELP */}
      <section
        id="updates"
        className="site-container grid grid-cols-1 items-start gap-5 pb-24 pt-20 lg:grid-cols-[1.5fr_1fr]"
      >
        <div>
          <SectionHead kicker="What's new" aside={<Aside>Last 30 days</Aside>} />
          {UPDATES.map((u) => (
            <Link
              key={u.title}
              to={u.path}
              className="grid grid-cols-[80px_1fr] items-baseline gap-x-5 gap-y-1 border-b border-og-hairline py-5 transition-colors hover:bg-og-surface sm:grid-cols-[96px_1fr_130px] sm:gap-6"
            >
              <span className="text-[12.5px] font-bold uppercase tracking-[0.12em] text-og-soft">
                {u.date}
              </span>
              <span className="col-start-2 sm:col-start-2">
                <span className="block text-[17px] font-semibold tracking-[-0.01em] text-og-midnight">
                  {u.title}
                </span>
                <span className="mt-1 block text-[14px] leading-normal text-og-indigo">
                  {u.blurb}
                </span>
              </span>
              <span className="col-start-2 text-xs font-bold uppercase tracking-[0.14em] text-og-green-light sm:col-start-3 sm:justify-self-end">
                {u.kind}
              </span>
            </Link>
          ))}
        </div>

        <div id="help" className="flex flex-col gap-5">
          <div className="flex flex-col bg-og-surface p-[26px]">
            <Kicker>Need a hand</Kicker>
            <span className="mt-4 text-[26px] font-bold leading-[1.05] tracking-[-0.025em] text-og-midnight">
              Request a brand review
            </span>
            <span className="mt-3 text-[14.5px] leading-normal text-og-indigo text-pretty">
              Send a deck, page, or campaign to Brand & Content and we'll mark it up within two
              working days.
            </span>
            <Link
              to="/ai-skills"
              className="mt-5 inline-flex items-center justify-center gap-2.5 bg-og-midnight px-6 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-og-green transition-colors hover:bg-og-indigo"
            >
              Start a request
              <MaterialSymbol name="arrow_forward" size={16} />
            </Link>
          </div>
          <div className="flex flex-col border border-og-border p-[26px]">
            <Kicker>Ask in Slack</Kicker>
            <span className="mt-3.5 text-xl font-bold tracking-[-0.02em] text-og-midnight">
              #brand-help
            </span>
            <span className="mt-2.5 text-[14.5px] leading-normal text-og-indigo">
              Quick questions, one-off asks, and "is this on brand?" gut checks.
            </span>
          </div>
          {/* Reserved slot — the new-hire course lands here once it's recorded. */}
          <div className="flex flex-col border border-dashed border-og-soft/40 p-[26px]">
            <Kicker className="text-og-soft">Reserved</Kicker>
            <span className="mt-3.5 text-xl font-bold tracking-[-0.02em] text-og-soft">
              Brand training &amp; onboarding
            </span>
            <span className="mt-2.5 text-[14.5px] leading-normal text-og-soft">
              A short course for new hires lives here once it's recorded.
            </span>
          </div>
        </div>
      </section>

      <CopyToast toast={toast} />
    </div>
  );
}
