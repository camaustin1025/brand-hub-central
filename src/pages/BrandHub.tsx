import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Copy, Download } from "lucide-react";
import { HubShell, SearchBox, jumpTo } from "@/components/hub/HubShell";
import { AssetCard } from "@/components/brand/AssetCard";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { Swatch } from "@/components/brand/Swatch";
import { ASSETS, ASSET_CATEGORIES } from "@/data/assets";
import { BRAND_SKILLS, HUB_NAV, TOOLKIT_ITEMS } from "@/data/hub";
import { employeeSectionId, isEmployeeSectionVisible } from "@/data/employee-launch";
import { COLOR_GROUPS, CORE, GRADIENTS } from "@/data/tokens";
import { cn } from "@/lib/utils";

const QUICK_REFERENCE = [
  ["Source of truth", "brand.md"],
  ["Category", "Autonomous Subscriptions"],
  ["Primary color", "Midnight #17132F"],
  ["Accent on dark", "Groovy Green #00FF85"],
  ["Accent on light", "Green #009A50"],
  ["Typeface", "Figtree, weights 400 to 800"],
  ["Voice", "Confident, precise, operator-minded"],
  ["Logo default", "White wordmark + green rings on Midnight"],
];

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
        <div className="mb-10 max-w-[var(--measure-header)]">
          <p className="eyebrow mb-3">{eyebrow}</p>
          <h2 className="text-3xl font-extrabold md:text-[42px]">{title}</h2>
          {intro && <p className="measure mt-4 text-lg leading-[1.6] text-muted-foreground">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

function MiniSwatch({ name, hex, usage }: { name: string; hex: string; usage?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    await navigator.clipboard.writeText(hex);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  }

  return (
    <button
      onClick={copy}
      className="action-focus group flex items-center gap-3 border-b border-border py-3 text-left last:border-0"
      aria-label={`Copy ${name} ${hex}`}
    >
      <span className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-inset ring-og-midnight/10" style={{ backgroundColor: hex }} />
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold">{name}</span>
          <span className="inline-flex items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-foreground">
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : hex}
          </span>
        </span>
        {usage && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{usage}</span>}
      </span>
    </button>
  );
}

function Hero() {
  return (
    <section id="overview" data-hub-section className="scroll-mt-20">
      <div className="dark relative mx-auto min-h-[420px] overflow-hidden rounded-lg bg-og-midnight text-foreground shadow-[0_24px_80px_rgba(23,19,47,0.16)] md:min-h-[560px]">
        <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:52px_52px]" />

        <div className="relative grid min-h-[420px] items-center gap-12 p-6 md:min-h-[560px] md:grid-cols-[1fr_1fr] md:p-14 lg:p-16">
          <div className="relative z-10 max-w-xl pl-4 md:pl-8 lg:pl-12">
            <p className="eyebrow mb-5">Ordergroove brand hub</p>
            <h1 className="text-5xl font-extrabold md:text-6xl lg:text-[68px]">
              The brand,
              <br />
              all in one place
            </h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/68">
              Guidelines, assets, and tools to help you create work that looks and sounds like Ordergroove.
            </p>
            <div className="relative z-20 mt-7 max-w-lg">
              <SearchBox hero />
              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/38">Try</span>
                <button onClick={() => jumpTo("color")} className="action-focus text-xs text-white/70 transition hover:text-og-green">Which green goes on white?</button>
                <Link to="/voice" className="action-focus text-xs text-white/70 transition hover:text-og-green">What words should I avoid?</Link>
                <button onClick={() => jumpTo("downloads")} className="action-focus text-xs text-white/70 transition hover:text-og-green">Find the logo kit</button>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => jumpTo("quick-reference")}
                className="action-focus inline-flex items-center gap-2 rounded-full bg-og-green px-5 py-3 text-sm font-bold text-og-midnight transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,255,133,.2)]"
              >
                View quick reference <ArrowDown size={16} />
              </button>
              <button
                onClick={() => jumpTo("downloads")}
                className="action-focus inline-flex items-center gap-2 rounded-full border border-white/60 px-5 py-3 text-sm font-semibold text-white transition hover:border-white hover:bg-white/5"
              >
                Browse assets <ArrowDown size={16} />
              </button>
            </div>
          </div>

          {/* The ownable Visual Container carries the hero: three rounded corners,
              one square corner, every panel facing the same way (Phase 0, s24). */}
          <div aria-hidden className="relative hidden h-[420px] md:block">
            <div
              className="absolute right-0 top-0 h-[146px] w-[54%] rounded-lg rounded-br-none"
              style={{ background: "linear-gradient(135deg, #E0FE00, #0BFE5F, #00FEFE)" }}
            />
            <div className="absolute left-0 top-[92px] w-[66%] rounded-lg rounded-br-none border border-white/12 bg-og-indigo p-5 shadow-2xl shadow-black/40">
              <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-og-green">Voice</p>
              <p className="mt-2.5 text-lg font-bold leading-snug text-white">Calm authority, earned from doing the work</p>
            </div>
            <div className="absolute bottom-0 right-0 w-[64%] rounded-lg rounded-br-none bg-white p-5 text-og-midnight shadow-2xl shadow-black/40">
              <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-og-green-light">Category</p>
              <p className="mt-2 text-[23px] font-extrabold leading-[1.06]">Autonomous Subscriptions</p>
              <div className="mt-3.5 flex gap-1.5">
                {CORE.swatches.map((swatch) => (
                  <span
                    key={swatch.hex}
                    /* White needs the ring or it disappears into the card. All four
                       carry it so the outline reads as a treatment, not a patch. */
                    className="h-7 w-7 rounded-md ring-1 ring-inset ring-og-midnight/15"
                    style={{ backgroundColor: swatch.hex }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function BrandHub() {
  const [activeId, setActiveId] = useState(() => employeeSectionId(window.location.hash.slice(1) || "overview"));

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
    const requestedId = window.location.hash.slice(1);
    const id = employeeSectionId(requestedId);
    if (!id) return;
    if (id !== requestedId) window.history.replaceState(null, "", `#${id}`);
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
    <HubShell activeId={activeId}>
        <Hero />

        <HubSection
          id="quick-reference"
          eyebrow="Start here"
          title="Quick reference"
          intro="The essentials at a glance. Use the sections below when you need the reasoning, examples, or downloadable files."
        >
          <div className="mb-6 flex flex-wrap gap-2">
            {["messaging", "voice", "color", "downloads"].map((id) => {
              const item = HUB_NAV.flatMap((group) => group.items).find(
                (navItem) => navItem.id === id
              )!;
              const chipClass =
                "action-focus inline-flex items-center gap-1.5 rounded-full border border-border bg-white px-3.5 py-2 text-sm font-semibold transition hover:border-primary hover:bg-secondary hover:text-foreground";
              return item.path ? (
                <Link key={id} to={item.path} className={chipClass}>
                  {item.label} <ArrowRight size={14} />
                </Link>
              ) : (
                <button key={id} onClick={() => jumpTo(id)} className={chipClass}>
                  {item.label} <ArrowRight size={14} />
                </button>
              );
            })}
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            {QUICK_REFERENCE.map(([label, value]) => (
              <div key={label} className="grid gap-1 border-b border-border px-5 py-4 last:border-0 sm:grid-cols-[210px_1fr] sm:gap-6">
                <span className="text-sm font-semibold">{label}</span>
                <span className="text-sm text-muted-foreground">{value}</span>
              </div>
            ))}
          </div>
        </HubSection>


        <HubSection
          id="color"
          eyebrow="Visual identity"
          title="Color palette"
          intro="Select any color to copy its hex value."
        >
          <h3 className="mb-5 text-2xl font-bold">Core colors</h3>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CORE.swatches.map((swatch) => <Swatch key={swatch.hex} swatch={swatch} />)}
          </div>
          <div className="mt-10">
            {COLOR_GROUPS.filter((group) => group.title === "Secondary").map((group) => (
              <div key={group.title} className="rounded-lg border border-border bg-white p-6">
                <h3 className="text-lg font-bold">{group.title}</h3>
                {group.note && <p className="measure mt-1 text-sm leading-6 text-muted-foreground">{group.note}</p>}
                <div className="mt-3 grid gap-x-10 sm:grid-cols-2">
                  {group.swatches.map((swatch) => <MiniSwatch key={swatch.hex} name={swatch.name} hex={swatch.hex} />)}
                </div>
              </div>
            ))}
          </div>
        </HubSection>

        <HubSection
          id="typography"
          eyebrow="Visual identity"
          title="One typeface, a clear hierarchy"
          intro="Figtree is the only brand typeface. Use tight spacing for display text and open spacing for body copy."
        >
          <div className="mb-6 grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-3">
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
          <div className="overflow-hidden rounded-lg border border-border bg-white">
            <div className="grid gap-8 border-b border-border p-7 md:grid-cols-[180px_1fr]">
              <div>
                <p className="eyebrow">Display</p>
                <p className="mt-2 text-sm text-muted-foreground">ExtraBold 800</p>
              </div>
              <p className="text-4xl font-extrabold tracking-tight md:text-5xl">Make it look like Ordergroove</p>
            </div>
            <div className="grid gap-8 border-b border-border p-7 md:grid-cols-[180px_1fr]">
              <div>
                <p className="eyebrow">Heading</p>
                <p className="mt-2 text-sm text-muted-foreground">Bold 700</p>
              </div>
              <p className="text-3xl font-bold tracking-tight">Clear words. Consistent design.</p>
            </div>
            <div className="grid gap-8 p-7 md:grid-cols-[180px_1fr]">
              <div>
                <p className="eyebrow">Body</p>
                <p className="mt-2 text-sm text-muted-foreground">Regular 400</p>
              </div>
              <p className="measure text-base leading-7 text-muted-foreground">Use clear, direct sentences. Keep the structure easy to follow and let evidence carry the message.</p>
            </div>
          </div>
        </HubSection>

        <HubSection
          id="logo-gradients"
          eyebrow="Visual identity"
          title="Logo and gradients"
          intro="Use the primary logo whenever space allows. Reserve gradients for key moments."
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <figure>
              <div className="dark flex min-h-52 items-center justify-center rounded-lg bg-og-midnight p-6">
                <img src="/logo-dark.png" alt="Ordergroove logo with white lettering and Groovy Green rings" className="w-full max-w-md" />
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">On Midnight:</strong> white wordmark with Groovy Green (#00FF85) rings.</figcaption>
            </figure>
            <figure>
              <div className="flex min-h-52 items-center justify-center rounded-lg border border-border bg-white p-6">
                <img src="/logo-white.png" alt="Ordergroove logo with Midnight lettering and #00CC6A green rings" className="w-full max-w-md" />
              </div>
              <figcaption className="mt-3 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">On white:</strong> Midnight wordmark with #00CC6A rings. Keep the supplied artwork unchanged.</figcaption>
            </figure>
          </div>
          <div className="mt-6 border-l-2 border-og-green-light pl-5">
            <h3 className="text-base font-semibold">A logo-only color exception</h3>
            <p className="measure mt-2 text-sm leading-6 text-muted-foreground">#00CC6A belongs only to the supplied light-background logo. Use #009A50 for other green accents on light surfaces. Do not recolor the logo to match buttons or text.</p>
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold">Give it room</h3>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Leave clear space on every side at least equal to the width of the interlocking-rings mark within the logo. Keep text, other graphics, and page edges outside that space.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">Keep it readable</h3>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Use the full wordmark whenever space allows. Place it on a plain Midnight or white background and check that it stays crisp and legible at the size people will see.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">Use the original file</h3>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Scale proportionally. Do not stretch, crop, rotate, recolor, outline, or add shadows or effects. Download the artwork below instead of taking a screenshot.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">Need another version?</h3>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Ask Marketing for a master file for large-format work, a standalone mark, or an approved single-color logo for print or other backgrounds.</p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="mb-5 text-2xl font-bold">Approved gradients</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {GRADIENTS.map((gradient) => (
                <div key={gradient.name} className="overflow-hidden rounded-lg border border-border bg-white">
                  <div className="h-28" style={{ backgroundImage: gradient.css }} />
                  <div className="flex items-center justify-between gap-4 p-4">
                    <div>
                      <p className="text-sm font-semibold">{gradient.name}</p>
                      <code className="mt-1 block max-w-[250px] truncate text-[11px] text-muted-foreground">{gradient.css}</code>
                    </div>
                    {gradient.status === "signature" && <span className="rounded-full bg-primary/10 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-foreground">Signature</span>}
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
          intro="Download logos and backgrounds for your work."
        >
          <div className="space-y-12">
            {ASSET_CATEGORIES.map((category) => {
              const assets = ASSETS.filter((asset) => asset.type === category.type && asset.href && !asset.employeeHold);
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
          title="Everyday brand tools"
          intro="Resources for day-to-day work."
        >
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 xl:grid-cols-3">
            {TOOLKIT_ITEMS.filter((item) => item.href && !item.status).map((item) => (
              <div key={item.title} className="flex min-h-56 flex-col bg-white p-6">
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold">{item.title}</h3>
                    {item.status && <DraftBadge>{item.status}</DraftBadge>}
                  </div>
                  <p className="measure mt-3 text-sm leading-6 text-muted-foreground">{item.body}</p>
                </div>
                {item.href ? (
                  <a href={item.href} download className="action-focus mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-foreground underline underline-offset-4 hover:decoration-2">
                    {item.cta} <Download size={15} />
                  </a>
                ) : null}
              </div>
            ))}
          </div>
        </HubSection>

        {isEmployeeSectionVisible("tokens") && <HubSection
          id="tokens"
          eyebrow="Brand systems"
          title="Canonical values, ready for code"
          intro="Use these approved marketing tokens. Product tokens are managed separately."
        >
          <div className="grid gap-8 lg:grid-cols-[1.1fr_.9fr]">
            <div className="overflow-hidden rounded-lg border border-border bg-white">
              <div className="grid grid-cols-[1fr_100px] bg-og-midnight px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white md:grid-cols-[1fr_120px_1fr]">
                <span>Token</span><span>Hex</span><span className="hidden md:block">RGB</span>
              </div>
              {CORE.swatches.map((swatch) => (
                <div key={swatch.hex} className="grid grid-cols-[1fr_100px] items-center border-t border-border px-5 py-4 text-sm md:grid-cols-[1fr_120px_1fr]">
                  <span className="flex items-center gap-2 font-semibold"><span className="h-4 w-4 rounded-[3px]" style={{ backgroundColor: swatch.hex }} />{swatch.name}</span>
                  <code className="text-xs text-muted-foreground">{swatch.hex}</code>
                  <code className="hidden text-xs text-muted-foreground md:block">{swatch.rgb}</code>
                </div>
              ))}
            </div>
            <div className="rounded-lg border border-border bg-white p-6">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold">Token kits</h3>
                <DraftBadge>Pending green approval</DraftBadge>
              </div>
              <p className="measure mt-3 text-sm leading-6 text-muted-foreground">We’ll publish both token kits after the remaining green values are approved.</p>
              <div className="mt-5 space-y-2">
                {["tokens.json", "tokens.css"].map((file) => (
                  <div key={file} className="flex items-center justify-between rounded-lg bg-og-gray-950 px-3 py-2.5">
                    <code className="text-sm font-semibold">{file}</code>
                    <span className="text-xs font-semibold text-muted-foreground">Pending green approval</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HubSection>}

        {isEmployeeSectionVisible("ai-skills") && <HubSection
          id="ai-skills"
          eyebrow="Brand systems"
          title="On-brand by default, not by review"
          intro="These tools load the rules automatically so the first draft starts closer to the standard."
        >
          <div className="grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
            {BRAND_SKILLS.map((skill) => (
              <div key={skill.name} className="bg-white p-6">
                <code className="text-sm font-bold text-primary">{skill.name}</code>
                <p className="measure mt-3 text-sm leading-6 text-muted-foreground">{skill.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 flex flex-col gap-5 rounded-lg bg-og-midnight p-7 text-white sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-xl font-bold">Brand guide for AI tools</h3>
                <span className="rounded-full bg-og-green/15 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-og-green">Available</span>
              </div>
              <p className="measure mt-2 text-sm leading-6 text-white/60">A plain-text map of the hub helps assistants and coding tools find the canonical brand resources.</p>
            </div>
            <a href="/llms.txt" className="inline-flex shrink-0 items-center gap-2 rounded-full border border-white/20 px-4 py-2.5 text-sm font-bold hover:border-og-green hover:text-og-green">
              Open llms.txt <ArrowUpRight size={15} />
            </a>
          </div>
        </HubSection>}

        <footer className="border-t border-border px-6 py-10 md:px-10">
          <div className="mx-auto flex max-w-[1060px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <img src="/logo-white.png" alt="Ordergroove" className="h-4 w-auto md:h-5" />
              <p className="mt-2 text-xs text-muted-foreground">Internal use only · Maintained by Brand & Content</p>
            </div>
            <button onClick={() => jumpTo("overview")} className="action-focus inline-flex items-center gap-2 text-sm font-semibold text-foreground underline underline-offset-4 hover:decoration-2">
              Back to the top <ArrowRight className="-rotate-90" size={14} />
            </button>
          </div>
        </footer>
    </HubShell>
  );
}
