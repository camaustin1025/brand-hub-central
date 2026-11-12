import type { ReactNode } from "react";
import { ArrowDown, Download } from "lucide-react";
import { SearchBox } from "@/components/hub/HubShell";
import { CORE } from "@/data/tokens";

/* ------------------------------------------------------------------ *
 * Hero exploration deck. Not a shipping route — a side-by-side so we
 * can pick a direction for the hub hero. Each variant reuses the same
 * copy so only the visual system is being compared.
 * ------------------------------------------------------------------ */

const EYEBROW = "Ordergroove brand hub";
const HEADLINE = ["The brand,", "all in one place"];
const SUBHEAD =
  "The rules, language, assets, and tools you need to create confident, consistent subscriptions work.";

function Prompts() {
  return (
    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
      <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">Try</span>
      {["Which green goes on white?", "What words should I avoid?", "Find the logo kit"].map((prompt) => (
        <span key={prompt} className="text-xs text-white/58">
          {prompt}
        </span>
      ))}
    </div>
  );
}

function Ctas() {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <span className="inline-flex items-center gap-2 rounded-full bg-og-green px-5 py-3 text-sm font-bold text-og-midnight">
        Start with the essentials <ArrowDown size={16} />
      </span>
      <span className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white">
        Get the assets <Download size={16} />
      </span>
    </div>
  );
}

function Copy({ compact = false }: { compact?: boolean }) {
  return (
    <div className="relative z-10 max-w-xl">
      <p className="eyebrow mb-5">{EYEBROW}</p>
      <h1 className={compact ? "text-4xl font-extrabold md:text-5xl" : "text-5xl font-extrabold md:text-6xl lg:text-[68px]"}>
        {HEADLINE[0]}
        <br />
        {HEADLINE[1]}
      </h1>
      <p className="mt-6 max-w-lg text-lg leading-8 text-white">{SUBHEAD}</p>
      <div className="relative z-20 mt-7 max-w-lg">
        <SearchBox hero />
        <Prompts />
      </div>
      <Ctas />
    </div>
  );
}

/** Shared shell so every variant is judged at the same size and radius. */
function Frame({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`dark relative min-h-[560px] overflow-hidden rounded-lg bg-og-midnight text-foreground shadow-[0_24px_80px_rgba(23,19,47,0.16)] ${className}`}
    >
      {children}
    </div>
  );
}

function Grid({ opacity = "opacity-40", size = "52px" }: { opacity?: string; size?: string }) {
  return (
    <div
      aria-hidden
      className={`absolute inset-0 ${opacity} [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)]`}
      style={{ backgroundSize: `${size} ${size}` }}
    />
  );
}

/* ---------------------------------- A ---------------------------------- */
/* Paired circles, canon-correct: gradient circle over solid circle, hard
 * edges, cropped by the container. The device the 2022 guide actually
 * specifies, rebuilt instead of blurred. */

function VariantA() {
  return (
    <Frame>
      <Grid />
      <svg aria-hidden viewBox="0 0 620 620" className="absolute -bottom-[290px] -right-[150px] h-[620px] w-[620px]">
        <defs>
          <linearGradient id="a-pair" x1="0.1" y1="0" x2="0.9" y2="1">
            <stop offset="0%" stopColor="#00FF85" />
            <stop offset="100%" stopColor="#00FAFF" />
          </linearGradient>
        </defs>
        <circle cx="196" cy="330" r="186" fill="#2E2A47" />
        <circle cx="196" cy="330" r="185" fill="none" stroke="rgba(255,255,255,.12)" strokeWidth="2" />
        <circle cx="398" cy="292" r="186" fill="url(#a-pair)" />
      </svg>
      <svg aria-hidden viewBox="0 0 460 460" className="absolute -left-[150px] -top-[150px] h-[440px] w-[440px]">
        <circle cx="230" cy="230" r="170" fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="24" />
        <circle cx="356" cy="230" r="170" fill="none" stroke="rgba(0,255,133,.14)" strokeWidth="24" />
      </svg>
      <div className="relative grid min-h-[560px] items-center gap-12 p-8 md:grid-cols-[1.05fr_.95fr] md:p-14 lg:p-16">
        <Copy />
        <div aria-hidden className="relative hidden h-[360px] md:block">
          <div className="absolute right-0 top-4 w-[88%] rounded-lg border border-white/10 bg-white p-5 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-og-gray-800 pb-3">
              <img src="/logo-white.png" alt="" className="h-4 w-auto md:h-5" />
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-og-gray-400">Brand reference</span>
            </div>
            <div className="grid grid-cols-[1fr_auto] gap-4 pt-4 text-og-midnight">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-og-green-light">Category</p>
                <p className="mt-2 text-2xl font-extrabold leading-tight">Autonomous Subscriptions</p>
              </div>
              <div className="grid grid-cols-2 gap-1.5 self-start">
                {CORE.swatches.map((swatch) => (
                  <span key={swatch.hex} className="h-9 w-9 rounded-md" style={{ backgroundColor: swatch.hex }} />
                ))}
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 right-10 w-[78%] rounded-lg border border-white/15 bg-og-indigo p-5 shadow-2xl shadow-black/40">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-og-green">Voice</p>
            <p className="mt-3 text-xl font-bold leading-snug text-white">Calm authority, earned from doing the work</p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------------------- B ---------------------------------- */
/* The system is the visual. A precise drift of brand swatches replaces the
 * decorative blobs — the hero shows what the hub contains. */

const WALL = [
  "#00FF85", "#00FAFF", "#0BFE5F", "#EAFF00", "#FF61D3", "#8500FF",
  "#FF8500", "#009A50", "#D32E55", "#4F4A6A", "#787688", "#D8D7DF",
];

function VariantB() {
  return (
    <Frame>
      <Grid opacity="opacity-30" size="44px" />
      <div aria-hidden className="absolute -right-10 bottom-0 top-0 hidden w-[54%] md:block">
        <div className="grid h-full grid-cols-4 gap-3 p-6">
          {Array.from({ length: 24 }).map((_, index) => {
            const color = WALL[index % WALL.length];
            const row = Math.floor(index / 4);
            const col = index % 4;
            const heat = (row / 5) * 0.5 + (col / 3) * 0.5;
            const lit = heat > 0.72;
            return (
              <span
                key={index}
                className="flex items-end rounded-lg p-2"
                style={{ backgroundColor: color, opacity: 0.07 + heat * 0.9 }}
              >
                {lit && (
                  <span className="font-mono text-[9px] uppercase tracking-wider text-og-midnight/55">{color}</span>
                )}
              </span>
            );
          })}
        </div>
      </div>
      <div className="absolute inset-y-0 left-0 hidden w-[72%] bg-gradient-to-r from-og-midnight via-og-midnight to-transparent md:block" />
      <div className="relative flex min-h-[560px] items-center p-8 md:p-14 lg:p-16">
        <div>
          <Copy />
          <div className="mt-8 flex flex-wrap gap-2">
            {["48 tokens", "9 sections", "1 source of truth"].map((stat) => (
              <span
                key={stat}
                className="rounded-full border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-white/55"
              >
                {stat}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------------------- C ---------------------------------- */
/* Logomark as architecture. The interlocking rings blown up past the crop
 * and rendered as near-invisible structure, with one arc lit in green. */

function VariantC() {
  return (
    <Frame>
      <svg aria-hidden viewBox="0 0 800 800" className="absolute -right-[86px] top-1/2 h-[780px] w-[780px] -translate-y-1/2">
        <circle cx="300" cy="400" r="238" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="58" />
        <circle cx="504" cy="400" r="238" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="58" />
        <path d="M 504 162 A 238 238 0 0 1 504 638" fill="none" stroke="#00FF85" strokeWidth="58" opacity="0.42" />
        <path d="M 300 638 A 238 238 0 0 1 300 162" fill="none" stroke="#00FAFF" strokeWidth="58" opacity="0.16" />
      </svg>
      <div className="absolute inset-y-0 left-0 w-[68%] bg-gradient-to-r from-og-midnight via-og-midnight/95 to-transparent" />
      <div className="relative flex min-h-[560px] items-center p-8 md:p-14 lg:p-16">
        <Copy />
      </div>
    </Frame>
  );
}

/* ---------------------------------- D ---------------------------------- */
/* The ownable container shape does the work. Three rounded corners, one
 * square, same corner facing the same way — the device becomes the layout
 * instead of sitting behind it. */

function VariantD() {
  return (
    <Frame>
      <Grid opacity="opacity-25" />
      <div className="relative grid min-h-[560px] items-center gap-12 p-8 md:grid-cols-[1fr_1fr] md:p-14 lg:p-16">
        <Copy />
        <div aria-hidden className="relative hidden h-[400px] md:block">
          <div
            className="absolute right-0 top-0 h-[176px] w-[56%] rounded-lg rounded-br-none"
            style={{ background: "linear-gradient(135deg, #E0FE00, #0BFE5F, #00FEFE)" }}
          />
          <div className="absolute left-0 top-[124px] w-[62%] rounded-lg rounded-br-none border border-white/12 bg-og-indigo p-6 shadow-2xl shadow-black/40">
            <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-og-green">Voice</p>
            <p className="mt-3 text-xl font-bold leading-snug text-white">Calm authority, earned from doing the work</p>
          </div>
          <div className="absolute bottom-0 right-0 w-[64%] rounded-lg rounded-br-none bg-white p-6 text-og-midnight shadow-2xl shadow-black/40">
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-og-green-light">Category</p>
            <p className="mt-2 text-[26px] font-extrabold leading-[1.05]">Autonomous Subscriptions</p>
            <div className="mt-4 flex gap-1.5">
              {CORE.swatches.map((swatch) => (
                <span
                  key={swatch.hex}
                  className="h-7 w-7 rounded-md ring-1 ring-inset ring-og-midnight/15"
                  style={{ backgroundColor: swatch.hex }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Frame>
  );
}

/* ---------------------------------- E ---------------------------------- */
/* Utility-first. Internal users arrive with a question, not to admire a
 * hero. Search becomes the subject; the brand shows up as one gradient
 * rule and the answer chips underneath. */

const FACTS: [string, string, string][] = [
  ["Category", "Autonomous Subscriptions", ""],
  ["Green on dark", "#00FF85", "#00FF85"],
  ["Green on light", "#009A50", "#009A50"],
  ["Typeface", "Figtree 400–800", ""],
];

function VariantE() {
  return (
    <Frame>
      <Grid opacity="opacity-30" size="64px" />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, #0BFE5F, #00FEFE, transparent)" }}
      />
      <div className="relative mx-auto flex min-h-[560px] max-w-3xl flex-col items-center justify-center px-8 py-14 text-center">
        <p className="eyebrow mb-5">{EYEBROW}</p>
        <h1 className="text-5xl font-extrabold md:text-[64px]">
          {HEADLINE[0]}
          <br />
          {HEADLINE[1]}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-white">{SUBHEAD}</p>
        <div className="relative z-20 mt-8 w-full max-w-2xl">
          <SearchBox hero />
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
            <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">Try</span>
            {["Which green goes on white?", "What words should I avoid?", "Find the logo kit"].map((prompt) => (
              <span key={prompt} className="text-xs text-white/58">
                {prompt}
              </span>
            ))}
          </div>
        </div>
        <Ctas />
        <div className="mt-10 grid w-full grid-cols-2 gap-3 md:grid-cols-4">
          {FACTS.map(([label, value, chip]) => (
            <div key={label} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-left">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-white/40">{label}</p>
              <p className="mt-1.5 flex items-center gap-2 text-sm font-bold text-white">
                {chip && <span className="h-3.5 w-3.5 shrink-0 rounded" style={{ backgroundColor: chip }} />}
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  );
}

/* ------------------------------- the deck ------------------------------- */

const VARIANTS: {
  id: string;
  name: string;
  idea: string;
  onBrand: string;
  risk: string;
  render: () => ReactNode;
}[] = [
  {
    id: "a",
    name: "A · Paired rings",
    idea: "The circle device rebuilt to canon: gradient circle over solid circle, hard edges, cropped by the frame. A second pair as outline rings top-right for rhythm.",
    onBrand: "Section 23 says circles always come in pairs, modeled on the logomark. Today's hero breaks that rule twice: single blobs, and blurred into a glow.",
    risk: "Loud. The gradient circle competes with the CTA if it creeps any further right.",
    render: () => <VariantA />,
  },
  {
    id: "b",
    name: "B · Token wall",
    idea: "The background is the product. A precise drift of brand swatches, densest at the corner, fading under a Midnight scrim so the copy stays clean.",
    onBrand: "Signals system, not poster. For an internal audience the honest promise is coverage: this is what the hub holds.",
    risk: "Reads flat without the density ramp. Needs the full palette to stay accurate as tokens change.",
    render: () => <VariantB />,
  },
  {
    id: "c",
    name: "C · Logomark as architecture",
    idea: "The interlocking rings scaled past the crop and used as structure at 5% white, with one arc lit in Groovy Green and one in Cyan.",
    onBrand: "Ownable without being decorative. It is the logomark, so it can never drift off-brand.",
    risk: "Quiet. Nothing on the right half, so the hero leans entirely on the headline and search.",
    render: () => <VariantC />,
  },
  {
    id: "d",
    name: "D · Container mosaic",
    idea: "The asymmetric container (three rounded corners, one square, all facing the same way) becomes the layout. One panel is pure brand gradient with no content.",
    onBrand: "Uses the shape the guide calls ownable, and demonstrates the same-corner rule while stating it.",
    risk: "The square corner is subtle at this size. Easy to read as a normal card stack if the notch is missed.",
    render: () => <VariantD />,
  },
  {
    id: "e",
    name: "E · Search first",
    idea: "No decorative column. Centered headline, oversized search, and four live brand facts as the payoff row. One gradient hairline is the only ornament.",
    onBrand: "Restraint is on-brand for an operator audience. Answers the actual job: people arrive with a question.",
    risk: "Least memorable in a meeting. Hard to screenshot as a brand moment for the Frontify review.",
    render: () => <VariantE />,
  },
];

export default function HeroLab() {
  return (
    <div className="min-h-screen bg-[#F5F5F8] pb-24 text-og-midnight">
      <header className="border-b border-border bg-white px-6 py-8 md:px-12">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-og-green-light">Hero exploration</p>
        <h1 className="mt-2 text-3xl font-extrabold md:text-4xl">Five directions for the hub hero</h1>
        <p className="mt-3 max-w-2xl text-base leading-7 text-foreground">
          Same copy in every frame so only the visual system is being compared. The current hero is the baseline
          problem: two blurred single circles, which breaks the pairs rule and reads as generic gradient glow.
        </p>
      </header>

      <div className="mx-auto max-w-[1180px] space-y-16 px-6 pt-12 md:px-10">
        {VARIANTS.map((variant) => (
          <section key={variant.id} id={`hero-${variant.id}`}>
            <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-extrabold">{variant.name}</h2>
                <p className="mt-2 text-[15px] leading-7 text-foreground">{variant.idea}</p>
              </div>
              <a
                href={`#hero-${variant.id}`}
                className="rounded-full border border-border px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-og-gray-400"
              >
                #{variant.id}
              </a>
            </div>
            {variant.render()}
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              <div className="rounded-lg border border-border bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-og-green-light">Why it holds up</p>
                <p className="mt-2 text-sm leading-6 text-foreground">{variant.onBrand}</p>
              </div>
              <div className="rounded-lg border border-border bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-og-gray-400">Watch out</p>
                <p className="mt-2 text-sm leading-6 text-foreground">{variant.risk}</p>
              </div>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
