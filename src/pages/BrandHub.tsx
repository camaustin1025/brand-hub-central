import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Copy,
  Download,
  Menu,
  Search,
  X,
} from "lucide-react";
import { AssetCard } from "@/components/brand/AssetCard";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { Swatch } from "@/components/brand/Swatch";
import { ASSETS, ASSET_CATEGORIES } from "@/data/assets";
import {
  BRAND_SKILLS,
  HUB_NAV,
  LADDER,
  RIGHTS,
  TERMS,
  TOOLKIT_ITEMS,
  VOICE_RULES,
  type HubNavItem,
} from "@/data/hub";
import { COLOR_GROUPS, CORE, GRADIENTS } from "@/data/tokens";
import { cn } from "@/lib/utils";

const ALL_NAV_ITEMS = HUB_NAV.flatMap((group) => group.items);

const QUICK_REFERENCE = [
  ["Source of truth", "brand.md + brand-style-guide.md"],
  ["Category", "Autonomous Subscriptions"],
  ["Primary color", "Midnight #17132F"],
  ["Accent on dark", "Groovy Green #00FF85"],
  ["Accent on light", "Green #009A50"],
  ["Typeface", "Figtree, weights 400 to 800"],
  ["Voice", "Confident, precise, operator-minded"],
  ["Logo default", "White wordmark + green rings on Midnight"],
];

function jumpTo(id: string, closeMenu?: () => void) {
  const target = document.getElementById(id);
  if (!target) return;
  window.history.replaceState(null, "", `#${id}`);
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  closeMenu?.();
}

function HubSection({
  id,
  eyebrow,
  title,
  intro,
  children,
  className,
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      data-hub-section
      className={cn("scroll-mt-20 border-t border-border px-6 py-16 md:px-10 md:py-20", className)}
    >
      <div className="mx-auto max-w-[1060px]">
        <div className="mb-10 max-w-3xl">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="text-3xl font-extrabold md:text-[42px]">{title}</h2>
          {intro && <p className="mt-4 text-lg leading-8 text-muted-foreground">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function Sidebar({
  activeId,
  open,
  onClose,
}: {
  activeId: string;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {open && (
        <button
          className="fixed inset-0 top-16 z-30 bg-og-midnight/35 backdrop-blur-sm lg:hidden"
          aria-label="Close section menu"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-40 w-[284px] overflow-y-auto border-r border-border bg-[#F8F8FA] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="px-4 py-5" aria-label="Brand hub sections">
          {HUB_NAV.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="px-3 pb-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-og-gray-400">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => jumpTo(item.id, onClose)}
                      className={cn(
                        "relative w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
                        activeId === item.id
                          ? "bg-white text-og-midnight shadow-sm ring-1 ring-og-midnight/5 before:absolute before:-left-4 before:top-1/2 before:h-6 before:w-0.5 before:-translate-y-1/2 before:bg-og-green-light"
                          : "text-og-gray-400 hover:bg-white/70 hover:text-og-midnight"
                      )}
                    >
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}

const SEARCH_STOP_WORDS = new Set([
  "a", "an", "and", "are", "brand", "can", "do", "for", "goes", "hub",
  "i", "in", "is", "me", "my", "of", "on", "the", "to", "use", "what",
  "where", "which", "with",
]);

function SearchBox({ compact = false, hero = false }: { compact?: boolean; hero?: boolean }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    const terms = value
      .replace(/[^a-z0-9+#]+/g, " ")
      .split(" ")
      .filter((term) => term.length > 1 && !SEARCH_STOP_WORDS.has(term));

    return ALL_NAV_ITEMS
      .map((item) => {
        const haystack = `${item.label} ${item.description} ${item.keywords}`.toLowerCase();
        const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 7)
      .map(({ item }) => item);
  }, [query]);

  function choose(item: HubNavItem) {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    jumpTo(item.id);
  }

  return (
    <div className={cn("relative", compact || hero ? "w-full" : "w-[310px]")}>
      <Search
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
          hero ? "text-og-midnight/45" : "text-white/50"
        )}
        size={hero ? 19 : 16}
      />
      <input
        ref={inputRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        placeholder={hero ? "Ask a brand question or find an asset" : "Search the brand hub"}
        aria-label={hero ? "Smart search the brand hub" : "Search the brand hub"}
        className={cn(
          "w-full outline-none transition",
          hero
            ? "h-14 rounded-xl border border-white bg-white pl-11 pr-4 text-base font-medium text-og-midnight shadow-xl shadow-black/15 placeholder:font-normal placeholder:text-og-gray-400 focus:border-og-green focus:ring-4 focus:ring-og-green/15"
            : "h-9 rounded-lg border border-white/15 bg-white/10 pl-9 pr-12 text-sm text-white placeholder:text-white/45 focus:border-og-green/60 focus:bg-white/15 focus:ring-2 focus:ring-og-green/10"
        )}
      />
      {!compact && !hero && (
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/15 px-1.5 py-0.5 text-[10px] text-white/45">
          ⌘K
        </span>
      )}
      {focused && query && (
        <div className={cn(
          "absolute right-0 top-[calc(100%+10px)] z-50 w-full min-w-[310px] overflow-hidden rounded-xl border border-border bg-white p-1.5 text-og-midnight shadow-2xl shadow-og-midnight/20",
          hero && "left-0 right-auto"
        )}>
          {results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(item)}
                className="group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-og-gray-950"
              >
                <Search className="mt-0.5 shrink-0 text-og-gray-600 group-hover:text-og-green-light" size={15} />
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-og-gray-400">{item.description}</span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-5 text-center text-sm text-og-gray-400">
              No matching section. Try “logo,” “voice,” or “downloads.”
            </p>
          )}
        </div>
      )}
    </div>
  );
}

function MiniSwatch({ name, hex, usage }: { name: string; hex: string; usage: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      onClick={copy}
      className="group flex items-center gap-3 border-b border-border py-3 text-left last:border-0"
      aria-label={`Copy ${name} ${hex}`}
    >
      <span className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-inset ring-og-midnight/10" style={{ backgroundColor: hex }} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{name}</span>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-primary">
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : hex}
          </span>
        </span>
        <span className="mt-0.5 block truncate text-xs text-muted-foreground">{usage}</span>
      </span>
    </button>
  );
}

function Hero() {
  return (
    <section id="overview" data-hub-section className="scroll-mt-20 px-6 py-8 md:px-10 md:py-12">
      <div className="dark relative mx-auto min-h-[560px] max-w-[1060px] overflow-hidden rounded-[28px] bg-og-midnight text-foreground shadow-[0_24px_80px_rgba(23,19,47,0.16)]">
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:52px_52px]" />
        <div className="absolute -bottom-36 -left-28 h-[390px] w-[390px] rounded-full bg-og-green/55 blur-[1px]" />
        <div className="absolute -bottom-28 left-24 h-[330px] w-[330px] rounded-full bg-og-cyan/45 blur-3xl" />

        <div className="relative grid min-h-[560px] items-center gap-12 p-8 md:grid-cols-[1.05fr_.95fr] md:p-14 lg:p-16">
          <div className="relative z-10 max-w-xl">
            <p className="eyebrow mb-5">Ordergroove brand hub</p>
            <h1 className="text-5xl font-extrabold md:text-6xl lg:text-[68px]">
              The brand,
              <br />
              all in one place
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/68">
              The rules, language, assets, and tools you need to create confident, consistent subscriptions work.
            </p>
            <div className="relative z-20 mt-7 max-w-lg">
              <SearchBox hero />
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">Try</span>
                <button onClick={() => jumpTo("color")} className="text-xs text-white/58 transition hover:text-og-green">Which green goes on white?</button>
                <button onClick={() => jumpTo("voice")} className="text-xs text-white/58 transition hover:text-og-green">What words should I avoid?</button>
                <button onClick={() => jumpTo("downloads")} className="text-xs text-white/58 transition hover:text-og-green">Find the logo kit</button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => jumpTo("quick-reference")}
                className="inline-flex items-center gap-2 rounded-full bg-og-green px-5 py-3 text-sm font-bold text-og-midnight transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,255,133,.2)]"
              >
                Start with the essentials <ArrowDown size={16} />
              </button>
              <button
                onClick={() => jumpTo("downloads")}
                className="inline-flex items-center gap-2 rounded-full border border-white/25 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/50 hover:bg-white/5"
              >
                Get the assets <Download size={16} />
              </button>
            </div>
          </div>

          <div aria-hidden className="relative hidden h-[390px] md:block">
            <div className="absolute right-0 top-0 w-[86%] rounded-2xl border border-white/10 bg-white p-4 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-og-gray-800 pb-3">
                <img src="/logo-white.png" alt="" className="h-4 w-auto" />
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

            <div className="absolute bottom-14 left-0 w-[74%] rounded-xl border border-white/15 bg-og-indigo p-5 shadow-2xl shadow-black/30">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-og-green">Voice</p>
              <p className="mt-3 text-xl font-bold leading-snug text-white">Calm authority, earned from doing the work</p>
              <div className="mt-4 h-px bg-white/10" />
              <p className="mt-3 text-xs text-white/55">Confident · precise · operator-minded</p>
            </div>

            <div className="absolute bottom-0 right-0 w-[68%] rounded-xl border border-white/10 bg-[#201A40] p-4 shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-widest text-white/45">Core token</span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-og-green">Copy</span>
              </div>
              <code className="mt-3 block text-xs text-white/75">
                <span className="text-og-green">--color-midnight</span>: #17132F;
              </code>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BrandHub() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeId, setActiveId] = useState(() => window.location.hash.slice(1) || "overview");

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>("[data-hub-section]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveId(visible.target.id);
      },
      { rootMargin: "-18% 0px -66% 0px", threshold: [0, 0.1, 0.3] }
    );
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const id = window.location.hash.slice(1);
    if (!id) return;
    window.setTimeout(() => {
      const target = document.getElementById(id);
      if (!target) return;
      const root = document.documentElement;
      const previousBehavior = root.style.scrollBehavior;
      root.style.scrollBehavior = "auto";
      window.scrollTo(0, Math.max(0, target.offsetTop - 64));
      window.requestAnimationFrame(() => {
        root.style.scrollBehavior = previousBehavior;
      });
    }, 0);
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-og-midnight text-white">
        <div className="flex h-full items-center gap-4 px-4 md:px-6">
          <button
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label={menuOpen ? "Close section menu" : "Open section menu"}
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>
          <button onClick={() => jumpTo("overview")} className="flex shrink-0 items-center" aria-label="Ordergroove brand hub home">
            <img src="/logo-dark.png" alt="Ordergroove" className="h-5 w-auto" />
          </button>
          <span className="hidden h-6 w-px bg-white/20 sm:block" />
          <span className="hidden truncate text-sm text-white/62 sm:block">Brand Hub · Internal reference</span>
          <div className="ml-auto hidden md:block">
            <SearchBox />
          </div>
          <span className="hidden rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55 xl:inline-flex">
            V1
          </span>
        </div>
      </header>

      <div className="h-16" />
      <Sidebar activeId={activeId} open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main className="lg:ml-[284px]">
        <div className="bg-og-midnight px-4 py-3 md:hidden">
          <SearchBox compact />
        </div>

        <Hero />

        <HubSection
          id="quick-reference"
          eyebrow="Start here"
          title="Quick reference"
          intro="The essentials at a glance. Use the sections below when you need the reasoning, examples, or downloadable files."
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            {QUICK_REFERENCE.map(([label, value]) => (
              <div key={label} className="grid gap-1 border-b border-border px-5 py-4 last:border-0 sm:grid-cols-[210px_1fr] sm:gap-6">
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-sm text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-5 flex flex-wrap gap-2">
            {["messaging", "voice", "color", "downloads"].map((id) => {
              const item = ALL_NAV_ITEMS.find((navItem) => navItem.id === id)!;
              return (
                <button
                  key={id}
                  onClick={() => jumpTo(id)}
                  className="inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-semibold transition hover:border-primary/40 hover:text-primary"
                >
                  {item.label} <ArrowRight size={14} />
                </button>
              );
            })}
          </div>
        </HubSection>

        <HubSection
          id="messaging"
          eyebrow="Brand foundation"
          title="Who we are and what we lead with"
          intro="Ordergroove is the enterprise standard for subscriptions and recurring revenue. Always ladder down from the category, never up from features."
        >
          <div className="grid gap-10 lg:grid-cols-[1fr_.9fr]">
            <div className="space-y-9">
              <div>
                <h3 className="text-2xl font-bold">The category we own</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Our lead message is a category move, not a product pitch. <strong className="text-foreground">Autonomous Subscriptions</strong> is the category we are defining: a team of agents that help enterprise brands recover revenue, reduce churn, and act on subscriber data faster.
                </p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Cleared for external use since June 17, 2026. “Autonomous Commerce” stays internal for now. “Relationship Commerce” is retired, never use it.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Central belief</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Subscriptions aren't programs. They're relationships. Growth comes from flexibility, not lock-in, and the best retention is giving customers control, not friction.
                </p>
              </div>
              <div>
                <h3 className="text-2xl font-bold">Who we serve</h3>
                <p className="mt-3 leading-7 text-muted-foreground">
                  Enterprise and mid-market B2C brands with repeat purchase patterns, typically $50M+ GMV. Buyers are VP or Director of eCommerce, VP or Head of Digital, and retention, loyalty, CRM, and subscription leaders.
                </p>
              </div>
            </div>
            <div className="rounded-2xl bg-og-midnight p-7 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-og-green">Message ladder</p>
              <ol className="mt-6 space-y-0">
                {LADDER.map((item, index) => (
                  <li key={item.rung} className="relative flex gap-4 pb-6 last:pb-0">
                    {index < LADDER.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-white/15" />}
                    <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-og-green text-sm font-extrabold text-og-midnight">{index + 1}</span>
                    <div>
                      <h4 className="font-bold">{item.rung}</h4>
                      <p className="mt-1 text-sm leading-6 text-white/60">{item.body}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="mt-14">
            <div className="mb-5 flex items-end justify-between gap-4">
              <h3 className="text-2xl font-bold">Rights to Win</h3>
              <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Locked order</span>
            </div>
            <div className="grid border-y border-border md:grid-cols-3">
              {RIGHTS.map((item, index) => (
                <div key={item.n} className={cn("py-6 md:px-6", index > 0 && "border-t border-border md:border-l md:border-t-0", index === 0 && "md:pl-0", index === RIGHTS.length - 1 && "md:pr-0")}>
                  <span className="text-sm font-extrabold text-primary">{item.n}</span>
                  <h4 className="mt-3 text-lg font-bold">{item.title}</h4>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-border bg-white p-6">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-bold">Company boilerplate</h3>
              <DraftBadge>Pending leadership approval</DraftBadge>
            </div>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Ordergroove is the enterprise standard for subscriptions and recurring revenue, powering flexible subscriber experiences for 1,000+ leading brands across every channel.
            </p>
          </div>
        </HubSection>

        <HubSection
          id="voice"
          eyebrow="Brand foundation"
          title="How we sound and the lines we don't cross"
          intro="Ordergroove sounds like the confident operator in the room who doesn't need to shout. Calm authority, earned from 15+ years of doing the work."
        >
          <div className="grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-2">
            <div className="bg-white p-6">
              <p className="eyebrow mb-2">We are</p>
              <p className="text-lg font-semibold">Confident, precise, operator-minded, direct, evidence-led</p>
            </div>
            <div className="bg-white p-6">
              <p className="mb-2 text-xs font-semibold uppercase tracking-eyebrow text-og-radish">We are not</p>
              <p className="text-lg font-semibold">Hype-driven, breathless, salesy, academic, cute for cuteness's sake</p>
            </div>
          </div>

          <div className="mt-14">
            <h3 className="text-2xl font-bold">The pass/fail rules</h3>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">These are binary checks. If a draft violates any of them, it fails review.</p>
            <ol className="mt-6 grid gap-x-10 border-t border-border lg:grid-cols-2">
              {VOICE_RULES.map((rule, index) => (
                <li key={rule} className="flex gap-3 border-b border-border py-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-og-radish/10 text-xs font-extrabold text-og-radish">{index + 1}</span>
                  <span className="text-sm leading-6">{rule}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-14">
            <h3 className="text-2xl font-bold">Use this, not that</h3>
            <div className="mt-5 overflow-hidden rounded-2xl border border-border bg-white">
              <div className="grid grid-cols-2 bg-og-midnight px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white">
                <span className="text-og-green">Use</span>
                <span className="text-white/55">Avoid</span>
              </div>
              {TERMS.map(([use, avoid]) => (
                <div key={use} className="grid grid-cols-2 gap-4 border-t border-border px-5 py-3 text-sm first:border-0">
                  <span className="font-semibold">{use}</span>
                  <span className="text-muted-foreground">{avoid}</span>
                </div>
              ))}
            </div>
          </div>
        </HubSection>

        <HubSection
          id="color"
          eyebrow="Visual identity"
          title="Color palette"
          intro="Every value is click-to-copy. The contrast badges encode the green rule so the right value is easier to choose."
        >
          <h3 className="mb-5 text-2xl font-bold">Core colors</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CORE.swatches.map((swatch) => <Swatch key={swatch.hex} swatch={swatch} />)}
          </div>
          <div className="mt-10 grid gap-5 lg:grid-cols-2">
            {COLOR_GROUPS.slice(1).map((group) => (
              <div key={group.title} className="rounded-2xl border border-border bg-white p-5">
                <h3 className="text-lg font-bold">{group.title}</h3>
                {group.note && <p className="mt-1 text-sm leading-6 text-muted-foreground">{group.note}</p>}
                <div className="mt-3">
                  {group.swatches.map((swatch) => <MiniSwatch key={swatch.hex} name={swatch.name} hex={swatch.hex} usage={swatch.usage} />)}
                </div>
              </div>
            ))}
          </div>
        </HubSection>

        <HubSection
          id="typography"
          eyebrow="Visual identity"
          title="One typeface, a clear hierarchy"
          intro="Figtree is the only brand typeface. Tight display type creates confidence, while open body copy keeps guidance easy to scan."
        >
          <div className="overflow-hidden rounded-2xl border border-border bg-white">
            <div className="grid gap-8 border-b border-border p-7 md:grid-cols-[180px_1fr]">
              <div>
                <p className="eyebrow">Display</p>
                <p className="mt-2 text-sm text-muted-foreground">ExtraBold 800</p>
              </div>
              <p className="text-4xl font-extrabold tracking-tight md:text-5xl">Subscriptions, set in motion</p>
            </div>
            <div className="grid gap-8 border-b border-border p-7 md:grid-cols-[180px_1fr]">
              <div>
                <p className="eyebrow">Heading</p>
                <p className="mt-2 text-sm text-muted-foreground">Bold 700</p>
              </div>
              <p className="text-3xl font-bold tracking-tight">Built for the way brands grow</p>
            </div>
            <div className="grid gap-8 p-7 md:grid-cols-[180px_1fr]">
              <div>
                <p className="eyebrow">Body</p>
                <p className="mt-2 text-sm text-muted-foreground">Regular 400</p>
              </div>
              <p className="max-w-2xl text-base leading-7 text-muted-foreground">Use clear, direct sentences. Keep the structure easy to follow and let evidence carry the message.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-px overflow-hidden rounded-2xl bg-border sm:grid-cols-3">
            {[
              ["Family", "Figtree everywhere"],
              ["Weights", "400 to 800"],
              ["Title rule", "No trailing periods"],
            ].map(([label, value]) => (
              <div key={label} className="bg-white p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
                <p className="mt-2 font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </HubSection>

        <HubSection
          id="logo-gradients"
          eyebrow="Visual identity"
          title="Logo and gradients"
          intro="Use the primary lockup whenever space allows. Gradients are payoff moments, not background decoration for every section."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <div className="dark flex min-h-52 items-center justify-center rounded-2xl bg-og-midnight p-10">
              <img src="/logo-dark.png" alt="Ordergroove logo for dark backgrounds" className="max-h-12 max-w-[75%]" />
            </div>
            <div className="flex min-h-52 items-center justify-center rounded-2xl border border-border bg-white p-10">
              <img src="/logo-white.png" alt="Ordergroove logo for light backgrounds" className="max-h-12 max-w-[75%]" />
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">White wordmark with Groovy Green rings on Midnight. On white, use the Midnight lockup. The ring color on white remains under audit.</p>

          <div className="mt-12">
            <h3 className="mb-5 text-2xl font-bold">Approved gradients</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {GRADIENTS.map((gradient) => (
                <div key={gradient.name} className="overflow-hidden rounded-2xl border border-border bg-white">
                  <div className="h-28" style={{ backgroundImage: gradient.css }} />
                  <div className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm font-semibold">{gradient.name}</p>
                      <code className="mt-1 block max-w-[250px] truncate text-[11px] text-muted-foreground">{gradient.css}</code>
                    </div>
                    {gradient.status === "signature" && <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-primary">Signature</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </HubSection>

        <HubSection
          id="downloads"
          eyebrow="Resources"
          title="Grab-and-go assets"
          intro="Logos, fonts, token kits, backgrounds, and social graphics. Available files download directly from this page."
        >
          <div className="space-y-12">
            {ASSET_CATEGORIES.map((category) => {
              const assets = ASSETS.filter((asset) => asset.type === category.type);
              if (!assets.length) return null;
              return (
                <div key={category.type}>
                  <h3 className="mb-5 text-xl font-bold">{category.label}</h3>
                  <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                    {assets.map((asset) => <AssetCard key={asset.id} asset={asset} />)}
                  </div>
                </div>
              );
            })}
          </div>
        </HubSection>

        <HubSection
          id="toolkit"
          eyebrow="Resources"
          title="The everyday, on-brand"
          intro="Decks, docs, signatures, and social graphics, plus the skills that generate them. Links are being re-homed after the old hub went dark."
        >
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
            {TOOLKIT_ITEMS.map((item) => (
              <div key={item.title} className="flex min-h-56 flex-col bg-white p-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    {item.status && <DraftBadge>{item.status}</DraftBadge>}
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
                {item.href ? (
                  <a href={item.href} download className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
                    {item.cta} <Download size={15} />
                  </a>
                ) : (
                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground">
                    {item.cta} <ArrowUpRight size={15} />
                  </span>
                )}
              </div>
            ))}
          </div>
        </HubSection>

        <HubSection
          id="tokens"
          eyebrow="Brand systems"
          title="Canonical values, ready for code"
          intro="Marketing canon: Figtree, Groovy Green #00FF85 on dark and #009A50 on light, Midnight #17132F. Product reconciliation is a separate decision."
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <div className="overflow-hidden rounded-2xl border border-border bg-white">
              <div className="grid grid-cols-[1fr_100px] bg-og-midnight px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white md:grid-cols-[1fr_120px_1fr]">
                <span>Token</span><span>Hex</span><span className="hidden md:block">RGB</span>
              </div>
              {CORE.swatches.map((swatch) => (
                <div key={swatch.hex} className="grid grid-cols-[1fr_100px] items-center border-t border-border px-5 py-4 text-sm md:grid-cols-[1fr_120px_1fr]">
                  <span className="flex items-center gap-2 font-semibold"><span className="h-4 w-4 rounded" style={{ backgroundColor: swatch.hex }} />{swatch.name}</span>
                  <code className="text-xs text-muted-foreground">{swatch.hex}</code>
                  <code className="hidden text-xs text-muted-foreground md:block">{swatch.rgb}</code>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-border bg-white p-6">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold">Token kits</h3>
                <DraftBadge>Generating after audit D1/D2</DraftBadge>
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">tokens.json and tokens.css will publish after the two open green decisions land. This avoids baking an unresolved value into code.</p>
              <div className="mt-5 space-y-2">
                {["tokens.json", "tokens.css"].map((file) => (
                  <div key={file} className="flex items-center justify-between rounded-lg bg-og-gray-950 px-3 py-2.5">
                    <code className="text-sm font-semibold">{file}</code>
                    <span className="text-xs font-semibold text-muted-foreground">Held for audit</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HubSection>

        <HubSection
          id="ai-skills"
          eyebrow="Brand systems"
          title="On-brand by default, not by review"
          intro="These tools load the rules automatically so the first draft starts closer to the standard."
        >
          <div className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-2">
            {BRAND_SKILLS.map((skill) => (
              <div key={skill.name} className="bg-white p-6">
                <code className="text-sm font-bold text-primary">{skill.name}</code>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">{skill.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-5 rounded-2xl bg-og-midnight p-7 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold">Agent-readable brand guide</h3>
                <span className="rounded-full bg-og-green/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-og-green">Available</span>
              </div>
              <p className="mt-2 text-sm leading-6 text-white/60">A plain-text map of the hub helps assistants and coding tools find the canonical brand resources.</p>
            </div>
            <a href="/llms.txt" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-bold hover:border-og-green hover:text-og-green">
              Open llms.txt <ArrowUpRight size={15} />
            </a>
          </div>
        </HubSection>

        <footer className="border-t border-border px-6 py-10 md:px-10">
          <div className="mx-auto flex max-w-[1060px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <img src="/logo-white.png" alt="Ordergroove" className="h-4 w-auto" />
              <p className="mt-2 text-xs text-muted-foreground">Internal use only · Maintained by Brand & Content</p>
            </div>
            <button onClick={() => jumpTo("overview")} className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline">
              Back to the top <ArrowRight className="-rotate-90" size={14} />
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
}
