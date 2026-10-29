import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Download } from "lucide-react";
import { HubShell, jumpTo } from "@/components/hub/HubShell";
import { WorkingCanvasHero } from "@/components/hub/WorkingCanvasHero";
import { WipNotice } from "@/components/brand/WorkInProgress";
import { ColorTiers } from "@/components/brand/ColorTiers";
import { AssetTiles } from "@/components/brand/AssetTiles";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { GradientDetails } from "@/components/brand/GradientDetails";
import { IconGuidance } from "@/components/brand/IconGuidance";
import { buttonVariants } from "@/components/ui/button";
import { ASSETS, ASSET_CATEGORIES } from "@/data/assets";
import { HUB_NAV, isWipSection } from "@/data/hub";
import { employeeSectionId, isEmployeeSectionVisible } from "@/data/employee-launch";
import { CORE } from "@/data/tokens";
import { cn } from "@/lib/utils";


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
        <WorkingCanvasHero />

        <div id="quick-reference" className="scroll-mt-20">
        <HubSection
          id="downloads"
          eyebrow="Resources"
          title="Grab-and-go assets"
          intro="Download logos and backgrounds for your work."
        >
          <div className="mb-6 flex flex-wrap gap-2">
            {["messaging", "voice", "color", "downloads"].map((id) => {
              const item = HUB_NAV.flatMap((group) => group.items).find(
                (navItem) => navItem.id === id
              )!;
              const chipClass = buttonVariants({ size: "sm" });
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
          <div className="space-y-12">
            {ASSET_CATEGORIES.map((category) => {
              const assets = ASSETS.filter((asset) => asset.type === category.type && asset.href && !asset.employeeHold);
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

        </div>


        <HubSection
          id="color"
          eyebrow="Visual identity"
          title="Color palette"
          intro="Select any color to copy its hex value."
        >
          <ColorTiers />
        </HubSection>

        <HubSection
          id="typography"
          eyebrow="Visual identity"
          title="Typography"
          intro="Figtree is the only brand typeface. Use tight spacing for display text and open spacing for body copy."
        >
          <div className="mb-6">
            <a href="/fonts/Figtree-font-kit.zip" download className={buttonVariants({ size: "lg" })}>
              <Download size={16} aria-hidden="true" /> Download fonts
            </a>
          </div>
          <div className="mb-6 grid gap-px overflow-hidden rounded-lg bg-border sm:grid-cols-2">
            {[
              ["Family", "Figtree everywhere"],
              ["Weights", "400 to 800"],
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
          <h3 className="mb-5 mt-8 text-2xl font-bold">Standalone logomarks</h3>
          <div className="grid gap-6 sm:grid-cols-2">
            {ASSETS.filter((asset) => asset.tags.includes("logomark") && asset.href && !asset.employeeHold).map((asset) => (
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
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">Use the full wordmark whenever space allows. Place it on a plain Midnight or white background and check that it stays crisp and legible at the size people will see.</p>
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
          intro="Use Material Symbols Rounded for Ordergroove visuals. Match the treatment and color to the background."
        >
          <IconGuidance />
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
