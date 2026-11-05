import { useEffect, useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { HubShell, jumpTo } from "@/components/hub/HubShell";
import { WorkingCanvasHero } from "@/components/hub/WorkingCanvasHero";
import { WipNotice } from "@/components/brand/WorkInProgress";
import { ColorTiers } from "@/components/brand/ColorTiers";
import { AssetTiles } from "@/components/brand/AssetTiles";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { GradientDetails } from "@/components/brand/GradientDetails";
import { ColorExamples, LayoutExample, LogoExamples } from "@/components/brand/BrandExamples";
import { IconGuidance } from "@/components/brand/IconGuidance";
import { buttonVariants } from "@/components/ui/button";
import { availableAssets, ASSET_CATEGORIES, findAssetFile } from "@/data/assets";
import { isWipSection } from "@/data/hub";
import { employeeSectionId, isEmployeeSectionVisible } from "@/data/employee-launch";
import { CORE } from "@/data/tokens";
import { cn } from "@/lib/utils";


/** Every bundled Figtree weight, each rendered in itself. */
const TYPE_WEIGHTS = [
  { name: "Regular", value: 400 },
  { name: "Medium", value: 500 },
  { name: "SemiBold", value: 600 },
  { name: "Bold", value: 700 },
  { name: "ExtraBold", value: 800 },
];

/**
 * Canon 5.3 web hierarchy, set at true size. Character limits come from the
 * hero pattern (6.4); the four-line body note is salvaged from the old hub.
 */
const TYPE_HIERARCHY = [
  {
    role: "Eyebrow",
    spec: "12px · SemiBold 600",
    note: "ALL CAPS, 0.16em letter-spacing",
    sample: "Brand guidelines",
    className: "eyebrow",
  },
  {
    role: "Headline",
    spec: "40 to 44px · ExtraBold 800",
    note: "Title Case, 60 characters or fewer",
    sample: "Make It Look Like Ordergroove",
    className: "text-[40px] font-extrabold leading-[1.08] tracking-tight [text-wrap:balance] md:text-[44px]",
  },
  {
    role: "Subhead",
    spec: "21px · Regular 400",
    note: "140 characters or fewer",
    sample: "Clear words. Consistent design",
    className: "text-[21px] leading-[1.45]",
  },
  {
    role: "Body",
    spec: "15px · Regular 400",
    note: "About four lines in display layouts",
    sample: "Use clear, direct sentences. Keep the structure easy to follow and let evidence carry the message.",
    className: "measure text-[15px] leading-[1.65]",
  },
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
  eyebrow?: string;
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
        {/* Section heads run the full column; ChapterPage matches this so a
            heading wraps the same way on Home and on every chapter page. */}
        <div className="mb-10">
          {isWipSection(id) && <WipNotice />}
          {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
          <h2 className="text-3xl font-extrabold md:text-[42px]">{title}</h2>
          {intro && <p className="mt-4 text-lg leading-[1.6] text-muted-foreground">{intro}</p>}
        </div>
        {children}
      </div>
    </section>
  );
}

export default function BrandHub() {
  const { hash } = useLocation();
  const fontKit = findAssetFile("font-kit", "ZIP");
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
    const requestedId = hash.slice(1);
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
        if (id.startsWith("asset-")) target.focus({ preventScroll: true });
      });
    }, 0);
  }, [hash]);

  return (
    <HubShell activeId={activeId}>
        <WorkingCanvasHero />

        <HubSection
          id="downloads"
          eyebrow="Downloads"
          title="Grab-and-go assets"
          intro="Logos, fonts, backgrounds, and icon examples, each in every format we have."
        >
          <div className="space-y-12">
            {ASSET_CATEGORIES.map((category) => {
              const assets = availableAssets().filter((asset) => asset.type === category.type);
              if (!assets.length) return null;
              return (
                <div key={category.type}>
                  <h3 className="mb-5 text-xl font-bold">{category.label}</h3>
                  <AssetTiles assets={assets} />
                </div>
              );
            })}
          </div>
        </HubSection>

        <HubSection
          id="color"
          eyebrow="Visual identity"
          title="Color palette"
          intro="Select any color to copy its hex value."
        >
          <ColorTiers />
          <ColorExamples />
        </HubSection>

        <HubSection
          id="typography"
          eyebrow="Visual identity"
          title="Typography"
          intro="One typeface in five weights. Use tight spacing for display text and open spacing for body copy."
        >
          {/* The family plate: the face on Midnight, every weight beside it. */}
          <div className="grid overflow-hidden rounded-lg border border-border bg-card md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
            <div className="dark flex flex-col justify-between gap-10 bg-og-midnight p-6 text-foreground md:p-8">
              <p aria-hidden="true" className="text-[6rem] font-extrabold leading-[0.85] tracking-[-0.04em] text-primary">
                Aa
              </p>
              <div>
                <h3 className="text-2xl">Figtree</h3>
                <p className="mt-2 text-sm leading-6 tracking-[0.005em] text-white">
                  Free from Google Fonts and available in Google Workspace. No substitute font needed.
                </p>
                {fontKit && <a href={fontKit.href} download className={cn(buttonVariants({ size: "lg" }), "mt-6")}>
                  <Download size={16} aria-hidden="true" /> Download fonts
                </a>}
              </div>
            </div>
            <ul aria-label="Figtree weights" className="divide-y divide-border">
              {TYPE_WEIGHTS.map((weight) => (
                <li key={weight.value} className="flex items-baseline justify-between gap-6 px-6 py-4 md:px-8 md:py-5">
                  <span className="text-[28px] leading-none tracking-tight md:text-[32px]" style={{ fontWeight: weight.value }}>
                    {weight.name}
                  </span>
                  <span className="text-sm font-semibold tabular-nums">{weight.value}</span>
                </li>
              ))}
            </ul>
          </div>

          <h3 className="mb-5 mt-12 text-2xl font-bold">Web hierarchy</h3>
          <div className="overflow-hidden rounded-lg border border-border bg-card">
            {TYPE_HIERARCHY.map((level) => (
              <div
                key={level.role}
                className="grid gap-x-10 gap-y-4 border-b border-border p-6 last:border-b-0 md:grid-cols-[248px_minmax(0,1fr)] md:items-center md:p-8"
              >
                <div className="text-sm leading-6">
                  <p className="font-semibold">{level.role}</p>
                  <p className="tabular-nums">{level.spec}</p>
                  <p>{level.note}</p>
                </div>
                <p className={level.className}>{level.sample}</p>
              </div>
            ))}
          </div>

          <h3 className="mb-5 mt-12 text-2xl font-bold">Usage rules</h3>
          <div className="grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <h4 className="text-base font-semibold">Style headlines as statements</h4>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Drop the trailing period on headlines, titles, labels, and subtitles. Set titles in Title Case and eyebrow labels in ALL CAPS.</p>
            </div>
            <div>
              <h4 className="text-base font-semibold">Use Figtree only</h4>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Never use Arial, Helvetica, Calibri, or Soleil, and check that nothing falls back to them. Cormorant is allowed on campaign cards only.</p>
            </div>
            <div>
              <h4 className="text-base font-semibold">Keep display layouts simple</h4>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Hold body copy to about four lines. Set secondary headlines in the same color as the primary.</p>
            </div>
            <div>
              <h4 className="text-base font-semibold">Skip emoji</h4>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Keep emoji out of designed materials.</p>
            </div>
          </div>
          <LayoutExample />
        </HubSection>

        <HubSection
          id="logo-gradients"
          eyebrow="Visual identity"
          title="Logo and gradients"
          intro="Use the primary logo whenever space allows. Reserve gradients for key moments."
        >
          <LogoExamples />
          <h3 className="mb-5 mt-8 text-2xl font-bold">Standalone logomarks</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {availableAssets().filter((asset) => asset.tags.includes("logomark")).map((asset) => (
              <figure key={asset.id}>
                <div className={cn("flex h-64 items-center justify-center rounded-lg", asset.previewBg === "light" ? "border border-border bg-white" : "bg-og-midnight")}>
                  <img src={asset.preview!} alt={asset.title} className="h-full max-w-full object-contain" />
                </div>
                <figcaption className="mt-3 text-sm leading-6 text-muted-foreground">{asset.description}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-8 grid gap-x-8 gap-y-6 sm:grid-cols-2">
            <div>
              <h3 className="text-base font-semibold">Give it room</h3>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Leave clear space on every side at least equal to the width of the interlocking-rings mark within the logo. Keep text, other graphics, and page edges outside that space.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">Keep it readable</h3>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Place it on a plain Midnight or white background. Check that it stays crisp at the size people will see it.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">Use the original file</h3>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Scale proportionally. Do not stretch, crop, rotate, recolor, outline, or add shadows or effects. Download the artwork from Grab-and-go assets instead of taking a screenshot.</p>
            </div>
            <div>
              <h3 className="text-base font-semibold">Need another version?</h3>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Ask Marketing for a master file for large-format work or an approved single-color logo for print or other backgrounds.</p>
            </div>
          </div>

          <div className="mt-12">
            <h3 className="mb-5 text-2xl font-bold">Brand gradient</h3>
            <GradientDetails />
          </div>
        </HubSection>

        <HubSection
          id="icons"
          title="Icons"
          intro="One icon family, three treatments. Match the treatment and color to the background."
        >
          <IconGuidance />
        </HubSection>

        {isEmployeeSectionVisible("tokens") && <HubSection
          id="tokens"
          eyebrow="Brand systems"
          title="Marketing color tokens"
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
              <p className="measure mt-3 text-sm leading-6 text-muted-foreground">Both kits publish once the remaining green values are approved.</p>
              <div className="mt-5 space-y-2">
                {["tokens.json", "tokens.css"].map((file) => (
                  <div key={file} className="flex items-center justify-between rounded-lg bg-og-gray-950 px-3 py-2.5">
                    <code className="text-sm font-semibold">{file}</code>
                    <span className="text-xs font-semibold text-muted-foreground">Pending</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </HubSection>}

        <footer className="border-t border-border px-6 py-10 md:px-10">
          <div className="mx-auto flex max-w-[1060px] flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <img src="/logo-white.png" alt="Ordergroove" className="h-4 w-auto md:h-5" />
              <p className="mt-2 text-xs text-muted-foreground">Internal use only · Maintained by Brand & Content</p>
            </div>
            <button onClick={() => jumpTo("overview")} className={buttonVariants({ size: "sm" })}>
              Back to the top <ArrowRight className="-rotate-90" size={14} />
            </button>
          </div>
        </footer>
    </HubShell>
  );
}
