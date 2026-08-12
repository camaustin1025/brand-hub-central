import { createFileRoute, Link } from "@tanstack/react-router";
import { CardLink } from "@/components/brand/CardLink";
import { CopyToast } from "@/components/brand/CopyToast";
import { Kicker } from "@/components/brand/Kicker";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { Aside, SectionHead } from "@/components/brand/SectionHead";
import { Door, type DoorSpec } from "@/components/home/Door";
import { OmniBar } from "@/components/home/OmniBar";
import { ThumbCard } from "@/components/home/ThumbCard";
import { useCopyToast } from "@/hooks/use-copy-toast";
import { COLOR_GROUPS, gradient } from "@/data/tokens";
import { cn } from "@/lib/utils";

/** Every swatch the system ships, counted from the token data itself. */
const TOTAL_COLOR_TOKENS = COLOR_GROUPS.reduce((n, g) => n + g.swatches.length, 0);

export const Route = createFileRoute("/")({
  component: Index,
});

/**
 * The signature gradient marquee — Green → Cyan → Lemon, locked to 112°.
 * Read from the token file rather than retyped: this string used to live only
 * here, which made the first gradient a visitor sees the one gradient the hub
 * did not document.
 */
const HERO_GRADIENT = gradient("marquee").css;

/**
 * The three doors — one Midnight band of three.
 *
 * This ran 1-dark / 2-light, on the island argument: one accent card in three
 * rather than an accent module. The single question it kept provoking was "why
 * is that one different?", which is the tell that a distinction is decorative
 * — the dark card was standing for "this is the lead", a convention the page
 * never states anywhere.
 *
 * All three Midnight answers it and buys the thing the split was quietly
 * costing: `--primary` resolves to #00FF85 inside a `.dark` island, so on the
 * white page the other two doors were painting their kicker, link and diagram
 * in the AA-corrected #008040. Midnight is the only surface on which the real
 * brand green is legible, so an all-Midnight band is the only version of this
 * module where every door shows the brand's actual accent.
 *
 * `lead` now carries what colour used to: door 01 takes the notch, and with the
 * surface constant that notch is the only thing marking it.
 *
 * `diagram` names the verb the card's drawing has to carry, not a picture.
 */
const DOORS: DoorSpec[] = [
  {
    n: "01",
    title: "Guidelines",
    blurb: "Foundation, voice, visual identity, and the tokens behind them.",
    cta: "Read the rules",
    path: "/foundation",
    lead: true,
    diagram: "measure",
  },
  {
    n: "02",
    title: "Downloads",
    blurb: "Logo kit, font kit, token exports, and social graphics.",
    cta: "Grab assets",
    path: "/downloads",
    diagram: "retrieve",
  },
  {
    n: "03",
    title: "Toolkit",
    blurb: "Deck templates, signatures, and the AI skills that check the work.",
    cta: "Open the toolkit",
    path: "/toolkit",
    diagram: "assemble",
  },
];

/**
 * Core color matrix. Each tile copies its hex.
 *
 * `span` is responsive because the template is. Three columns on a phone gave
 * each tile about 107px, which wrapped "Groovy Green" onto two lines and its
 * hex note onto two more — the note being the one thing this module exists to
 * make checkable. Below `sm` it becomes two columns and three rows: Midnight
 * across the top, the two greens paired, White across the foot.
 */
const CORE_SWATCHES = [
  {
    name: "Midnight",
    hex: "#17132F",
    note: "#17132F · Primary background",
    tile: "bg-og-midnight",
    title: "text-white",
    sub: "text-white/72",
    span: "col-span-2 sm:col-span-1 sm:row-span-2",
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

/**
 * The three gradients Home previews, picked by id from the token file.
 *
 * These were three retyped CSS strings, and the middle one had already drifted
 * — its marquee ran even thirds where the hero it was meant to represent runs
 * 0/52/100. Naming the ids here keeps Home's editorial choice of *which three*
 * while leaving the stops to `data/tokens.ts`.
 */
const HOME_GRADIENTS = (["signature", "marquee", "warm"] as const).map(gradient);

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
    tag: "In progress",
    blurb: "80 layouts: covers, agendas, stats, customer logos, quote slides.",
    icon: "slideshow",
  },
  {
    title: "Email signature",
    tag: "In progress",
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
        {/* The omni bar rides up into the gradient, so the hero's bottom padding
            is what sits empty above it — add the overlap back and the *visible*
            gap between the standfirst and the search field lands on
            --step-section (96 desktop / 72 mobile) instead of on whatever the
            literal happened to be. It was 128/96, giving 86 and 54.

            The underscores are Tailwind's escape for the spaces CSS calc
            requires around + and -. Without them the rule is invalid and takes
            the whole stylesheet down with it. */}
        <div className="site-container pb-[calc(var(--step-section)_+_var(--omni-overlap))] pt-[var(--step-section)]">
          <div className="flex items-center gap-4">
            <Kicker className="text-og-midnight">Ordergroove Brand Hub</Kicker>
            <span aria-hidden className="h-px flex-1 bg-og-midnight/25" />
            <span className="hidden text-eyebrow font-bold uppercase text-og-midnight md:block">
              INTERNAL
            </span>
          </div>
          {/* 11cqi, not 9vw: the side rail owns 256px of the viewport, so vw
              stopped describing the box this type sits in. Measured against the
              main pane, 11cqi reproduces the old ramp almost exactly — 113px at
              1280 where 9vw gave 115, 130px at 1440 where it gave 130. */}
          <h1 className="mt-10 max-w-[16ch] text-marquee font-extrabold text-og-midnight text-balance">
            The brand, in one place.
          </h1>
          <p className="mt-9 max-w-[46ch] text-xl font-medium leading-normal text-og-midnight text-pretty">
            Guidelines, assets, and tools for everyone at Ordergroove who ships something with the
            brand on it.
          </p>
        </div>
      </section>

      {/* Search overlaps the gradient; z-40 lifts it and the results panel clear.
          `id` is the target the header's search button jumps to — and it needs
          the same scroll-margin every .section-step carries, or the one control
          the masthead points at arrives underneath the masthead. */}
      <div
        id="search"
        className="site-container relative z-40 scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <OmniBar />
      </div>

      {/* THE THREE DOORS — the first module under the hero.
          The index number sits on its own hairline so the interval below it
          reads as a bounded field rather than 90px of unexplained air; that
          field now holds the card's diagram, and the title / blurb / link group
          tightly at the foot as one unit. */}
      <section id="guidelines" className="site-container section-step">
        <SectionHead kicker="The three doors" aside={<Aside>Sec.01</Aside>} />
        {/* lg, not md: at 768 three tracks give each door 227px, and a 36px
            title plus a 240-wide diagram does not fit in it. No 2-column stage
            either — the third door would strand at half width. */}
        <div className="block-step grid grid-cols-1 gap-5 lg:grid-cols-3">
          {DOORS.map((d) => (
            <Door key={d.n} door={d} />
          ))}
        </div>
      </section>

      {/* FOUNDATIONS — color, then type, then gradients / icons / logo.
          Three stacked sub-modules of one section, so they sit a module step
          apart, not the full section step that separates Foundations from what
          comes before and after it. */}
      <section id="color" className="site-container section-step">
        <SectionHead kicker="Foundations" aside={<Aside>Click any swatch to copy</Aside>} />

        {/* Core color — full width.
            Halved against the type specimen, the palette was 542px of a 1104px
            field and the swatches read as a thumbnail of the palette rather
            than the palette. Across the full field Midnight gets the mass it
            has everywhere else in the system, and the two greens sit at a size
            where the contrast note under each is legible at a glance, which is
            the thing people come to this module to check. */}
        <div className="block-step flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <Kicker as="h3">Core Color</Kicker>
            <Aside>F.01</Aside>
          </div>
          {/* A floor, not fixed rows: the tiles keep their proportion as the
              field grows. No flex-1 any more — there is no sibling column left
              to end level with. Two columns and a taller floor below sm, where
              three tracks leave each tile too narrow to hold its own hex. */}
          <div className="visual-container grid min-h-[400px] grid-cols-2 grid-rows-3 overflow-hidden sm:min-h-[288px] sm:grid-cols-[1.4fr_1fr_1fr] sm:grid-rows-2">
            {CORE_SWATCHES.map((s) => (
              <button
                key={s.hex}
                type="button"
                onClick={() => copy(s.hex)}
                aria-label={`Copy ${s.name} hex ${s.hex}`}
                className={cn(
                  "flex cursor-pointer flex-col justify-end p-5 text-left transition-[filter] hover:brightness-[0.97]",
                  s.tile,
                  s.span,
                )}
              >
                <span className={cn("text-body font-bold", s.title)}>{s.name}</span>
                <span className={cn("text-label", s.sub)}>{s.note}</span>
              </button>
            ))}
          </div>
          {/* Counted off the token data, not off the four tiles above plus a
              magic 10 — that read "All 14 color tokens" against a palette of
              fifteen, and adding a swatch never moved it. /visual-identity is
              the page that renders every group; /tokens only tables the core. */}
          <Link to="/visual-identity" className="flex min-h-11 items-center self-start">
            <CardLink>All {TOTAL_COLOR_TOKENS} color tokens</CardLink>
          </Link>
        </div>

        {/* Typography — full width, below the palette.
            The specimen and the note read as two columns rather than one tall
            stack: at 1104px a left-aligned 82px word over a 32ch paragraph
            leaves most of the field empty, and a type specimen wants air around
            the sample, not a hole beside it. They collapse back to a stack at
            lg, which is where the two columns stop being wide enough to hold
            the 82px sample and the measure side by side. */}
        <div id="type" className="module-step flex flex-col gap-3.5">
          <div className="flex items-center justify-between">
            <Kicker as="h3">Typography</Kicker>
            <Aside>F.02</Aside>
          </div>
          <div className="visual-container grid gap-6 border border-og-border bg-white p-6 lg:grid-cols-[1fr_minmax(0,34ch)] lg:items-end lg:gap-10">
            <div>
              <div className="text-specimen font-extrabold text-og-midnight">
                Figtree
              </div>
              <p className="mt-4 text-body text-og-midnight">
                Aa Bb Cc 0123 — <span className="font-extrabold">ExtraBold</span>{" "}
                <span className="font-bold">Bold</span>{" "}
                <span className="font-semibold">SemiBold</span>{" "}
                <span className="font-medium">Medium</span> <span>Regular</span>
              </p>
            </div>
            <div className="flex flex-col items-start gap-4">
              <p className="text-body text-og-indigo text-pretty">
                The only brand font, for everything from decks to product. Soleil is sunsetted;
                never Helvetica or Arial.
              </p>
              <Link to="/downloads" className="flex min-h-11 items-center">
                <CardLink>Font kit</CardLink>
              </Link>
            </div>
          </div>
        </div>

        <div className="module-step grid grid-cols-1 gap-5 md:grid-cols-3">
          {/* Gradients */}
          <div className="visual-container flex flex-col border border-og-border p-6">
            <div className="flex items-center justify-between gap-3">
              <Kicker as="h3">Gradients</Kicker>
              <Aside>F.03</Aside>
            </div>
            <div className="mt-5 flex flex-col gap-2">
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
            <p className="mt-4 flex-1 text-label text-og-indigo text-pretty">
              Cyan to lemon, always. Click a bar to copy its CSS.
            </p>
          </div>

          {/* Icons */}
          <div className="visual-container flex flex-col border border-og-border p-6">
            <div className="flex items-center justify-between gap-3">
              <Kicker as="h3">Icons</Kicker>
              <Aside>F.04</Aside>
            </div>
            <div className="mt-5 flex flex-wrap gap-5 text-og-midnight">
              {SPECIMEN_ICONS.map((name) => (
                <MaterialSymbol key={name} name={name} size={32} />
              ))}
            </div>
            <p className="mb-5 mt-5 flex-1 text-label text-og-indigo text-pretty">
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
          <div className="visual-container flex flex-col border border-og-border p-6">
            <div className="flex items-center justify-between gap-3">
              <Kicker as="h3">Logo</Kicker>
              <Aside>F.05</Aside>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
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
            <p className="mb-5 mt-5 flex-1 text-label text-og-indigo text-pretty">
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
              className="flex min-h-11 items-center text-eyebrow font-semibold uppercase text-og-midnight transition-colors hover:text-primary"
            >
              All downloads →
            </Link>
          }
        />
        {/* The hatch panel already reads as a placeholder. The line that used to
            sit under this grid — "Thumbnails pending, real asset previews to be
            dropped in" — added the apology on top of it, on the home page, to
            every visitor. Cut: an unfinished thing looks better unremarked than
            annotated. */}
        <div className="block-step grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {POPULAR.map((a) => (
            <ThumbCard key={a.title} to="/downloads" icon={a.icon} title={a.title} meta={a.meta} />
          ))}
        </div>
      </section>

      {/* TEMPLATES & TOOLKIT — a module step, not a section step: it belongs to
          the grab-and-go band above it. */}
      <section
        id="templates"
        className="site-container module-step scroll-mt-[calc(var(--stick)+var(--step-block))]"
      >
        <SectionHead kicker="Templates & toolkit" aside={<Aside>Sec.02</Aside>} />
        {/* 1 → 3 at lg, with no 2-column stage: three items in two tracks strand
            the third at half width beside an equal-sized hole. Four-item grids
            (Most downloaded, above) divide evenly at both stages and do step. */}
        <div className="block-step grid grid-cols-1 gap-5 lg:grid-cols-3">
          {TEMPLATES.map((t) => (
            <ThumbCard
              key={t.title}
              to="/toolkit"
              icon={t.icon}
              title={t.title}
              meta={t.blurb}
              tag={t.tag}
            />
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
              <span className="shrink-0 whitespace-nowrap border border-white/28 px-2.5 py-1 text-micro font-bold uppercase text-white/70">
                Coming soon
              </span>
            </div>
            <h2 className="mt-6 text-band font-bold text-white text-balance">
              Ask the brand, get an answer.
            </h2>
            <p className="mt-5 text-lead text-white/72 text-pretty">
              The brand assistant will read from this hub and answer in plain language — which green
              on white, whether a headline sounds like us, what's wrong with a slide. The canon it
              draws from is being written now.
            </p>
          </div>
          <div className="flex w-full shrink-0 flex-col gap-3 sm:w-[320px]">
            <Link
              to="/ai-skills"
              className="inline-flex items-center justify-center gap-2.5 bg-og-green px-7 py-4 text-eyebrow font-bold uppercase text-og-midnight transition-colors hover:bg-white"
            >
              <MaterialSymbol name="auto_awesome" size={17} />
              Read the AI guidance
            </Link>
            <Link
              to="/ai-skills"
              className="inline-flex items-center justify-center gap-2.5 border border-white/28 px-7 py-4 text-eyebrow font-bold uppercase text-white transition-colors hover:border-og-green hover:text-og-green"
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
              <span className="text-label font-bold uppercase tracking-micro text-og-soft">
                {u.date}
              </span>
              <div className="col-start-2 sm:col-start-2">
                <h3 className="text-lead leading-head font-semibold tracking-[-0.01em] text-og-midnight">
                  {u.title}
                </h3>
                <span className="mt-1 block text-label text-og-indigo">
                  {u.blurb}
                </span>
              </div>
              <span className="col-start-2 text-eyebrow font-bold uppercase text-primary sm:col-start-3 sm:justify-self-end">
                {u.kind}
              </span>
            </Link>
          ))}
        </div>

        {/*
          One module of stacked rows, not floating cards. Separate bordered
          boxes made this column much taller than the updates list beside it,
          which left a hole in the bottom-left corner of the page. Joined on
          shared hairlines the column lands close to the list, and its own
          SectionHead starts it on the same rule the left column starts on.

          A third row used to sit here reserving space for a new-hire course
          that has not been recorded. It advertised an absence: a greyed-out
          heading and a sentence saying the thing is not here yet, in the module
          people open when they are already stuck. Two rows that work beat three
          where one is an IOU — and the column now lands 401px against the
          list's 425 rather than overhanging it by 102.
        */}
        <div id="help" className="scroll-mt-[calc(var(--stick)+var(--step-block))]">
          <SectionHead kicker="Need a hand" aside={<Aside>Help</Aside>} />
          <div className="visual-container block-step flex flex-col overflow-hidden border border-og-border">
            <div className="flex flex-col bg-og-surface p-6">
              <h3 className="text-card-title font-bold text-og-midnight">
                Request a brand review
              </h3>
              <span className="mt-3 text-body text-og-indigo text-pretty">
                Send a deck, page, or campaign to Brand & Content and we'll mark it up within two
                working days.
              </span>
              <Link
                to="/ai-skills"
                className="mt-5 inline-flex items-center justify-center gap-2.5 bg-og-midnight px-6 py-3.5 text-eyebrow font-bold uppercase text-og-green transition-colors hover:bg-og-indigo"
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
              <span className="mt-2 text-body text-og-indigo">
                Quick questions, one-off asks, and "is this on brand?" gut checks.
              </span>
            </div>
          </div>
        </div>
      </section>

      <CopyToast toast={toast} />
    </div>
  );
}
