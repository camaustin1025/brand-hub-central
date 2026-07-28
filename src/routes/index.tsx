import { createFileRoute, Link } from "@tanstack/react-router";
import { CardLink } from "@/components/brand/CardLink";
import { CopyToast } from "@/components/brand/CopyToast";
import { Kicker } from "@/components/brand/Kicker";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { Aside, SectionHead } from "@/components/brand/SectionHead";
import { OmniBar } from "@/components/home/OmniBar";
import { useCopyToast } from "@/hooks/use-copy-toast";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  component: Index,
});

/** The signature gradient marquee — Green → Cyan → Lemon, locked to 112°. */
const HERO_GRADIENT = "linear-gradient(112deg, #00FF85 0%, #00FAFF 52%, #EAFF00 100%)";

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
    // Midnight, not white: white on #009A50 is only 3.66:1, Midnight is 4.90:1.
    title: "text-og-midnight",
    sub: "text-og-midnight",
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

function Index() {
  const { copy, toast } = useCopyToast();

  return (
    <div className="bg-white">
      {/* HERO — the full-bleed gradient marquee. */}
      <section className="relative overflow-hidden" style={{ backgroundImage: HERO_GRADIENT }}>
        {/* The bar overlaps the gradient by 42px, so the hero's own bottom
            padding is what sits empty above it. 128px of that on a phone is a
            dead screenful between the standfirst and the search field. */}
        <div className="site-container pb-24 pt-[72px] md:pb-32">
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

      {/* Search overlaps the gradient; z-40 lifts it and the results panel clear.
          `id` is the target the header's search button jumps to. */}
      <div id="search" className="site-container relative z-40">
        <OmniBar />
      </div>

      {/* THE THREE DOORS — the first module under the hero.
          The index number sits on its own hairline so the interval below it
          reads as a bounded field rather than 90px of unexplained air, and the
          title / blurb / link group tightly at the foot as one unit. */}
      <section id="guidelines" className="site-container section-step">
        <SectionHead kicker="The three doors" aside={<Aside>Sec.01</Aside>} />
        <div className="block-step grid grid-cols-1 gap-5 md:grid-cols-3">
          {DOORS.map((d) =>
            d.dark ? (
              // `dark` flips --primary to #00FF85 for everything inside.
              <Link
                key={d.n}
                to={d.path}
                className="dark flex min-h-[264px] flex-col bg-og-midnight p-7 transition-transform hover:-translate-y-1"
              >
                <span className="border-b border-white/20 pb-4 text-xs font-bold tracking-[0.16em] text-primary">
                  {d.n}
                </span>
                <h3 className="mt-auto pt-10 text-4xl font-bold leading-none tracking-[-0.03em] text-white">
                  {d.title}
                </h3>
                <span className="mt-3 text-[15px] leading-normal text-white/66">{d.blurb}</span>
                <CardLink className="mt-5">{d.cta}</CardLink>
              </Link>
            ) : (
              <Link
                key={d.n}
                to={d.path}
                className="flex min-h-[264px] flex-col border border-og-border bg-white p-7 transition-colors hover:border-og-midnight hover:bg-og-surface"
              >
                <span className="border-b border-og-border pb-4 text-xs font-bold tracking-[0.16em] text-primary">
                  {d.n}
                </span>
                <h3 className="mt-auto pt-10 text-4xl font-bold leading-none tracking-[-0.03em] text-og-midnight">
                  {d.title}
                </h3>
                <span className="mt-3 text-[15px] leading-normal text-og-indigo">{d.blurb}</span>
                <CardLink className="mt-5">{d.cta}</CardLink>
              </Link>
            ),
          )}
        </div>
      </section>

      {/* FOUNDATIONS — color + type, then gradients / icons / logo.
          The two rows are sub-modules of one section, so they sit a module step
          apart, not the full section step that separates Foundations from what
          comes before and after it. */}
      <section id="color" className="site-container section-step">
        <SectionHead kicker="Foundations" aside={<Aside>Click any swatch to copy</Aside>} />

        <div className="block-step grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Core color */}
          <div className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <Kicker as="h3">Core Color</Kicker>
              <Aside>F.01</Aside>
            </div>
            {/* flex-1 + a floor rather than two fixed 110px rows: the swatch
                block and the type specimen beside it are one band, so they
                should end on the same line at every width. */}
            <div className="grid min-h-[224px] flex-1 grid-cols-[1.4fr_1fr_1fr] grid-rows-2">
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
                  <span className={cn("text-[14px]", s.sub)}>{s.note}</span>
                </button>
              ))}
            </div>
            <Link to="/tokens" className="flex min-h-11 items-center self-start">
              <CardLink>All {CORE_SWATCHES.length + 10} color tokens</CardLink>
            </Link>
          </div>

          {/* Typography */}
          <div id="type" className="flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <Kicker as="h3">Typography</Kicker>
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
                <p className="max-w-[32ch] text-[15px] leading-normal text-og-indigo text-pretty">
                  The only brand font, for everything from decks to product. Soleil is sunsetted;
                  never Helvetica or Arial.
                </p>
                <Link to="/downloads" className="flex min-h-11 shrink-0 items-center">
                  <CardLink>Font kit</CardLink>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="module-step grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Gradients */}
          <div className="flex flex-col border border-og-border p-6">
            <div className="flex items-center justify-between gap-3">
              <Kicker as="h3">Gradients</Kicker>
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
              <Kicker as="h3">Icons</Kicker>
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
              className="flex min-h-11 items-center self-start"
            >
              <CardLink>Browse the set</CardLink>
            </a>
          </div>

          {/* Logo */}
          <div className="flex flex-col border border-og-border p-6">
            <div className="flex items-center justify-between gap-3">
              <Kicker as="h3">Logo</Kicker>
              <Aside>F.05</Aside>
            </div>
            <div className="mt-[18px] grid grid-cols-2 gap-2">
              <div className="flex h-[82px] items-center justify-center border border-og-hairline bg-white p-4">
                <img
                  src="/logo-white.png"
                  alt="Ordergroove wordmark, dark"
                  width={512}
                  height={88}
                  className="h-[18px] w-auto"
                />
              </div>
              <div className="flex h-[82px] items-center justify-center bg-og-midnight p-4">
                <img
                  src="/logo-dark.png"
                  alt="Ordergroove wordmark, white"
                  width={512}
                  height={88}
                  className="h-[18px] w-auto"
                />
              </div>
            </div>
            <p className="mb-[18px] mt-[18px] flex-1 text-[14px] leading-normal text-og-indigo text-pretty">
              Clear space equals the height of the mark. Never recolor, stretch, or add effects.
            </p>
            <Link to="/downloads" className="flex min-h-11 items-center self-start">
              <CardLink>Logo kit</CardLink>
            </Link>
          </div>
        </div>
      </section>

      {/* GRAB-AND-GO — "Most downloaded" and "Templates & toolkit" are the same
          idea (things you take away), so they are one band: a section step
          before the pair, a module step between them. */}
      <section id="downloads" className="site-container section-step">
        <SectionHead
          kicker="Most downloaded"
          aside={
            <Link
              to="/downloads"
              className="flex min-h-11 items-center text-xs font-semibold uppercase tracking-[0.16em] text-og-midnight transition-colors hover:text-primary"
            >
              All downloads →
            </Link>
          }
        />
        <div className="block-step grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR.map((a) => (
            <Link
              key={a.title}
              to="/downloads"
              className="flex flex-col border border-og-border transition-colors hover:border-og-midnight"
            >
              <span className="thumb-hatch flex h-[150px] items-center justify-center border-b border-og-border">
                <MaterialSymbol name={a.icon} size={32} className="text-og-soft" />
              </span>
              <div className="flex flex-col gap-1.5 p-[18px]">
                <h3 className="text-base font-bold tracking-[-0.01em] text-og-midnight">
                  {a.title}
                </h3>
                <span className="text-[14px] text-og-soft">{a.meta}</span>
              </div>
            </Link>
          ))}
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.16em] text-og-soft">
          Thumbnails pending — real asset previews to be dropped in
        </p>
      </section>

      {/* TEMPLATES & TOOLKIT — a module step, not a section step: it belongs to
          the grab-and-go band above it. */}
      <section
        id="templates"
        className="site-container module-step scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <SectionHead kicker="Templates & toolkit" aside={<Aside>Sec.02</Aside>} />
        <div className="block-step grid grid-cols-1 gap-5 md:grid-cols-3">
          {TEMPLATES.map((t) => (
            <Link
              key={t.title}
              to="/toolkit"
              className="flex flex-col border border-og-border transition-colors hover:border-og-midnight"
            >
              <span className="thumb-hatch flex aspect-[16/9] items-center justify-center border-b border-og-border">
                <MaterialSymbol name={t.icon} size={36} className="text-og-soft" />
              </span>
              <div className="flex flex-col gap-2 p-[22px]">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-xl font-bold tracking-[-0.015em] text-og-midnight">
                    {t.title}
                  </h3>
                  <span className="shrink-0 whitespace-nowrap border border-og-border px-2 py-[3px] text-[11px] font-bold uppercase tracking-[0.12em] text-og-soft">
                    {t.tag}
                  </span>
                </div>
                <span className="text-[14px] leading-normal text-og-indigo">{t.blurb}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ASSISTANT BAND — full-bleed Midnight. `dark` resolves green to #00FF85. */}
      <section
        id="assistant"
        className="dark relative mt-[var(--step-section)] overflow-hidden bg-og-midnight scroll-mt-[var(--stick)]"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-64 -top-72 h-[820px] w-[820px] rounded-full opacity-25 mix-blend-screen"
          style={{
            background:
              "radial-gradient(circle, #00FAFF 0%, rgba(234,255,0,0.85) 45%, rgba(23,19,47,0) 72%)",
          }}
        />
        {/* Two defined masses, not a paragraph and two floating pills: the
            action column gets a fixed width so the gap between them reads as
            composition rather than leftover space. */}
        <div className="site-container relative flex flex-col items-start justify-between gap-12 py-[var(--step-section)] lg:flex-row lg:items-center">
          <div className="max-w-[56ch]">
            <div className="flex items-center gap-3.5">
              <Kicker>AI &amp; Skills</Kicker>
              <span className="shrink-0 whitespace-nowrap border border-white/28 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white/70">
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
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-[320px]">
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
        className="site-container section-step section-end grid grid-cols-1 items-start gap-x-5 gap-y-10 lg:grid-cols-[1.5fr_1fr]"
      >
        <div>
          <SectionHead kicker="What's new" aside={<Aside>Last 30 days</Aside>} />
          {UPDATES.map((u) => (
            <Link
              key={u.title}
              to={u.path}
              className="grid grid-cols-[80px_1fr] items-baseline gap-x-5 gap-y-1 border-b border-og-hairline py-6 transition-colors hover:bg-og-surface sm:grid-cols-[96px_1fr_130px] sm:gap-6"
            >
              <span className="text-[14px] font-bold uppercase tracking-[0.12em] text-og-soft">
                {u.date}
              </span>
              <div className="col-start-2 sm:col-start-2">
                <h3 className="text-[17px] font-semibold tracking-[-0.01em] text-og-midnight">
                  {u.title}
                </h3>
                <span className="mt-1 block text-[14px] leading-normal text-og-indigo">
                  {u.blurb}
                </span>
              </div>
              <span className="col-start-2 text-xs font-bold uppercase tracking-[0.14em] text-primary sm:col-start-3 sm:justify-self-end">
                {u.kind}
              </span>
            </Link>
          ))}
        </div>

        {/*
          One module of stacked rows, not three floating cards. Three separate
          bordered boxes made this column ~260px taller than the updates list
          beside it, which left a hole in the bottom-left corner of the page and
          read as unfinished. Joined on shared hairlines the column lands close
          to the list, and its own SectionHead starts it on the same rule the
          left column starts on.
        */}
        <div id="help" className="scroll-mt-[calc(var(--stick)+var(--step-block))]">
          <SectionHead kicker="Need a hand" aside={<Aside>Help</Aside>} />
          <div className="block-step flex flex-col border border-og-border">
            <div className="flex flex-col bg-og-surface p-6">
              <h3 className="text-[26px] font-bold leading-[1.05] tracking-[-0.025em] text-og-midnight">
                Request a brand review
              </h3>
              <span className="mt-3 text-[15px] leading-normal text-og-indigo text-pretty">
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
            <div className="flex flex-col border-t border-og-border p-6 py-5">
              <Kicker>Ask in Slack</Kicker>
              <h3 className="mt-2.5 text-xl font-bold tracking-[-0.02em] text-og-midnight">
                #brand-help
              </h3>
              <span className="mt-2 text-[15px] leading-normal text-og-indigo">
                Quick questions, one-off asks, and "is this on brand?" gut checks.
              </span>
            </div>
            {/* Reserved slot — the new-hire course lands here once it's recorded.
                The dashed edge that used to mark it can't survive inside a
                shared-hairline stack, so the muted ink carries the state. */}
            <div className="flex flex-col border-t border-dashed border-og-border p-6 py-5">
              <Kicker className="text-og-soft">Reserved</Kicker>
              <h3 className="mt-2.5 text-xl font-bold tracking-[-0.02em] text-og-soft">
                Brand training &amp; onboarding
              </h3>
              <span className="mt-2 text-[15px] leading-normal text-og-soft">
                A short course for new hires lives here once it's recorded.
              </span>
            </div>
          </div>
        </div>
      </section>

      <CopyToast toast={toast} />
    </div>
  );
}
