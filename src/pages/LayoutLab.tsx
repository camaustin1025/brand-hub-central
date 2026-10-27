import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Copy, Download, MousePointer2 } from "lucide-react";
import { HubShell, SearchBox } from "@/components/hub/HubShell";
import { AssetCard } from "@/components/brand/AssetCard";
import { Swatch } from "@/components/brand/Swatch";
import { ASSETS } from "@/data/assets";
import { CORE, SECONDARY, type Swatch as SwatchData } from "@/data/tokens";
import { cn } from "@/lib/utils";
import hero from "@/components/hub/WorkingCanvasHero.module.css";
import lab from "./LayoutLab.module.css";

/* ------------------------------------------------------------------ *
 * Layout exploration deck for three home-page elements: the hero desk
 * popups, the logo kit grid, and the color palette. Not a shipping
 * route. Every option reads the same data the hub ships with, so only
 * the layout is being compared.
 * ------------------------------------------------------------------ */

const ARTWORK = {
  logo: { title: "Ordergroove logo", detail: "The original wordmark for light backgrounds.", href: "/working-canvas/logo-light.svg", format: "SVG", label: "Download SVG" },
  gradient: { title: "Brand gradient", detail: "The original gradient artwork, ready to use.", href: "/working-canvas/gradient-accent-3.png", format: "PNG", label: "Download PNG" },
  type: { title: "Figtree", detail: "Our brand typeface. Regular weight shown in the download.", href: "/fonts/Figtree-Regular.ttf", format: "TTF", label: "Download font" },
  icons: { title: "Brand icons", detail: "Payment, heart, and chart icons in the original SVG export.", href: "/working-canvas/icon-examples.svg", format: "SVG", label: "Download SVG" },
};
type ArtworkId = keyof typeof ARTWORK;
type HeroVariant = "current" | "anchored" | "spotlight" | "rail";
type Target = { id: ArtworkId; left: number; top: number; width: number; height: number };
type Placement = { x: number; y: number; side: "left" | "right"; arrow: number };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/* ----------------------------- Lab chrome ----------------------------- */

const GROUPS = [
  { id: "lab-hero", label: "Hero popups" },
  { id: "lab-grid", label: "Asset grid" },
  { id: "lab-color", label: "Colors" },
];

/** Same gutters and column as the hub's HubSection. */
function Wrap({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className={cn("px-6 md:px-10", className)}>
      <div className="mx-auto max-w-[1060px]">{children}</div>
    </div>
  );
}

function Group({ id, title, problem, children }: { id: string; title: string; problem: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 border-t border-border py-16">
      <Wrap>
        <h2 className="text-3xl font-extrabold md:text-[42px]">{title}</h2>
        <p className="measure mt-4 text-lg leading-[1.6] text-muted-foreground">{problem}</p>
      </Wrap>
      {children}
    </section>
  );
}

function Option({ code, name, why, cost, bleed = false, children }: {
  code: string;
  name: string;
  why: string;
  cost: string;
  bleed?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="mt-14">
      <Wrap className="mb-6">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-og-midnight px-3 py-1 text-sm font-bold text-white">{code}</span>
          <h3 className="text-2xl font-bold">{name}</h3>
        </div>
        <dl className="mt-3 grid gap-x-10 gap-y-1 text-sm leading-6 sm:grid-cols-2">
          <div><dt className="inline font-semibold">Gains: </dt><dd className="inline text-muted-foreground">{why}</dd></div>
          <div><dt className="inline font-semibold">Costs: </dt><dd className="inline text-muted-foreground">{cost}</dd></div>
        </dl>
      </Wrap>
      {bleed ? children : <Wrap>{children}</Wrap>}
    </div>
  );
}

function Current({ bleed = false, children }: { bleed?: boolean; children: ReactNode }) {
  return (
    <details className="group mt-12">
      {/* <summary> must be the first child of <details>, so it carries the gutters itself. */}
      <summary className="cursor-pointer list-none px-6 focus-visible:outline-none md:px-10 [&::-webkit-details-marker]:hidden [&:focus-visible_.pill]:ring-2 [&:focus-visible_.pill]:ring-og-midnight [&:focus-visible_.pill]:ring-offset-2">
        <span className="mx-auto block max-w-[1060px]">
          <span className="pill inline-flex rounded-full border border-og-midnight px-4 py-2 text-sm font-semibold hover:bg-og-midnight hover:text-white">
            <span className="group-open:hidden">Show the original version</span>
            <span className="hidden group-open:inline">Hide the original version</span>
          </span>
        </span>
      </summary>
      <div className="mt-6">{bleed ? children : <Wrap>{children}</Wrap>}</div>
    </details>
  );
}

/* ------------------------------ Shared ------------------------------- */

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  async function copy(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      return; // Clipboard blocked (permissions or insecure context); leave the hex visible.
    }
    setCopied(value);
    window.setTimeout(() => setCopied(null), 1200);
  }
  return { copied, copy };
}

/** Pick Midnight or white, whichever has the higher WCAG contrast on `hex`. */
function inkOn(hex: string) {
  const channel = (offset: number) => {
    const c = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const luminance = 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
  const onMidnight = (luminance + 0.05) / 0.0585; // Midnight #17132F relative luminance is ~0.0085
  const onWhite = 1.05 / (luminance + 0.05);
  return onMidnight >= onWhite ? "#17132F" : "#FFFFFF";
}

/* --------------------------- 1. Hero popups --------------------------- */

/** The pre-lab secondary row, kept here so the "original version" toggle still renders it. */
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
      className="action-focus group flex items-center gap-3 border-b border-border py-3 text-left"
      aria-label={`Copy ${name} ${hex}`}
    >
      <span className="h-10 w-10 shrink-0 rounded-lg ring-1 ring-inset ring-og-midnight/10" style={{ backgroundColor: hex }} />
      <span className="min-w-0">
        <span className="flex items-center gap-4">
          <span className="w-[122px] text-sm font-semibold">{name}</span>
          <span className="inline-flex shrink-0 items-center gap-1 font-mono text-xs text-muted-foreground group-hover:text-foreground">
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? "Copied" : hex}
          </span>
        </span>
        {usage && <span className="mt-0.5 block truncate text-xs text-muted-foreground">{usage}</span>}
      </span>
    </button>
  );
}


function DeskBand({ variant }: { variant: HeroVariant }) {
  const [target, setTarget] = useState<Target | null>(null);
  const [railId, setRailId] = useState<ArtworkId | null>(null);
  const [placement, setPlacement] = useState<Placement | null>(null);
  const deskRef = useRef<HTMLDivElement>(null);
  const floatRef = useRef<HTMLDivElement>(null);

  function show(id: ArtworkId, element: HTMLElement) {
    const desk = deskRef.current!.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    setTarget({ id, left: rect.left - desk.left, top: rect.top - desk.top, width: rect.width, height: rect.height });
    setRailId(id);
  }

  // Place the card or pill beside the specimen, inside the desk band, pointing back at it.
  useLayoutEffect(() => {
    const desk = deskRef.current;
    const float = floatRef.current;
    if (!target || !desk || !float) return setPlacement(null);
    const bandHeight = (desk.firstElementChild as HTMLElement).offsetHeight;
    const width = float.offsetWidth;
    const height = float.offsetHeight;
    const centerX = target.left + target.width / 2;
    const centerY = clamp(target.top + target.height / 2, 0, bandHeight);
    const toRight = centerX < desk.offsetWidth * 0.6;
    const x = toRight
      ? Math.min(target.left + target.width + 12, desk.offsetWidth - width - 8)
      : Math.max(target.left - width - 12, 8);
    const y = clamp(centerY - height / 2, 8, bandHeight - height - 8);
    setPlacement({ x, y, side: toRight ? "right" : "left", arrow: clamp(centerY - y, 14, height - 14) });
  }, [target, variant]);

  function control(id: ArtworkId) {
    return {
      type: "button" as const,
      "aria-label": `View ${ARTWORK[id].title} details`,
      "data-lit": target?.id === id && variant !== "current" ? "" : undefined,
      onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => {
        if (event.pointerType === "mouse") show(id, event.currentTarget);
      },
      onFocus: (event: React.FocusEvent<HTMLButtonElement>) => show(id, event.currentTarget),
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => show(id, event.currentTarget),
    };
  }

  const active = target ? ARTWORK[target.id] : null;
  const veil = !target ? undefined : variant === "spotlight" ? "on" : variant === "rail" ? "soft" : undefined;
  const hide = () => setTarget(null);
  const placed = placement ? { left: placement.x, top: placement.y, ["--arrow-y" as string]: `${placement.arrow}px` } : { visibility: "hidden" as const };

  return (
    <div className="border-t border-border bg-white">
      <div
        ref={deskRef}
        className={lab.desk}
        data-veil={veil ?? (variant === "spotlight" || variant === "rail" ? "off" : undefined)}
        onPointerLeave={hide}
        onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) hide(); }}
        onKeyDown={(event) => { if (event.key === "Escape") hide(); }}
      >
        <div className={hero.worktable}>
          <img className={hero.photograph} src="/working-canvas/desk-photo.png" alt="" />
          <button {...control("logo")} className={hero.logoCard}>
            <img src="/working-canvas/logo-light.svg" alt="" width="436" height="75" />
          </button>
          <button {...control("gradient")} className={hero.gradient}>
            <img src="/working-canvas/gradient-accent-3.png" alt="" width="1920" height="1458" />
          </button>
          <button {...control("type")} className={hero.typePaper}>
            <span className={hero.specimenLabel}>Our typeface</span>
            <span className={hero.typeName}>Figtree</span>
            <span className={hero.typeRegular}>Made for</span>
            <span className={hero.typeSemibold}>everyday work.</span>
            <span className={hero.typeWeights}>Regular / Semibold / Bold</span>
          </button>
          {[hero.paymentIcon, hero.heartIcon, hero.chartIcon].map((position) => (
            <button {...control("icons")} key={position} className={`${hero.iconCutout} ${position}`}>
              <img src="/working-canvas/icon-examples.svg" alt="" width="320" height="80" />
            </button>
          ))}
        </div>

        {variant === "current" && target && (
          <div className={lab.legacyPopover} data-artwork={target.id}>
            <p className={hero.assetTitle}>{active!.title}</p>
            <p className={hero.assetDescription}>{active!.detail}</p>
            <div className={hero.assetActions}>
              <a href={active!.href} download><Download size={14} /> {active!.label}</a>
              <button type="button">View guidance <ArrowRight size={14} /></button>
            </div>
          </div>
        )}

        {variant === "anchored" && target && (
          <div ref={floatRef} className={lab.card} data-side={placement?.side} style={placed}>
            <p className={lab.cardTitle}>{active!.title}</p>
            <p className={lab.cardDetail}>{active!.detail}</p>
            <div className={lab.cardActions}>
              <a href={active!.href} download><Download size={14} /> {active!.format}</a>
              <button type="button">Guidance <ArrowRight size={14} /></button>
            </div>
          </div>
        )}

        {variant === "spotlight" && target && (
          <div ref={floatRef} className={lab.pill} style={placed}>
            <strong>{active!.title}</strong>
            <a href={active!.href} download><Download size={14} /> {active!.format}</a>
            <button type="button" aria-label={`${active!.title} guidance`}>Guidance <ArrowRight size={14} /></button>
          </div>
        )}
      </div>

      {variant === "rail" && <Rail id={railId} />}

      <section className={`dark ${hero.searchDock}`} aria-label="Search resources">
        <h2 className={hero.searchTitle}>Find what you need</h2>
        <div className={hero.searchBox}><SearchBox hero /></div>
      </section>
    </div>
  );
}

function RailThumb({ id }: { id: ArtworkId }) {
  if (id === "type") return <span className="text-2xl font-bold tracking-tight">Aa</span>;
  if (id === "icons") {
    return (
      <span className="relative block h-11 w-11 overflow-hidden rounded-full">
        <img src="/working-canvas/icon-examples.svg" alt="" className="absolute left-[-66px] top-0 h-11 !max-h-none !max-w-none" />
      </span>
    );
  }
  return <img src={id === "logo" ? "/ordergroove-logomark-light-bgs.png" : ARTWORK.gradient.href} alt="" />;
}

function Rail({ id }: { id: ArtworkId | null }) {
  const item = id ? ARTWORK[id] : null;
  return (
    <div className={lab.rail} aria-live="polite">
      {item ? (
        <>
          <span className={lab.railThumb}><RailThumb id={id!} /></span>
          <div className="min-w-0">
            <p className={lab.railTitle}>{item.title}</p>
            <p className={lab.railDetail}>{item.detail}</p>
          </div>
          <div className={lab.railActions}>
            <a href={item.href} download className="inline-flex h-10 items-center gap-2 rounded-full border border-og-midnight bg-og-midnight px-5 text-sm font-semibold text-white hover:bg-white hover:text-og-midnight">
              <Download size={15} /> {item.label}
            </a>
            <button type="button">View guidance <ArrowRight size={14} /></button>
          </div>
        </>
      ) : (
        <p className={lab.railEmpty}><MousePointer2 size={16} /> Point at anything on the desk to download the original file.</p>
      )}
    </div>
  );
}

/* --------------------------- 2. Asset grid ---------------------------- */

const LOGOS = ASSETS.filter((asset) => asset.type === "logo" && asset.href && !asset.employeeHold);
const isMark = (asset: (typeof LOGOS)[number]) => asset.tags.includes("logomark");
const surface = (asset: (typeof LOGOS)[number]) => (asset.previewBg === "light" ? "light" : "dark");

function DownloadChip({ href, label, title }: { href: string; label: string; title: string }) {
  return (
    <a
      href={href}
      download
      aria-label={`Download ${title}`}
      className="action-focus inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border border-og-midnight px-3 text-xs font-bold text-og-midnight transition-colors hover:bg-og-midnight hover:text-white"
    >
      <Download size={13} /> {label}
    </a>
  );
}

function Preview({ asset, className, logoWidth = "w-[78%]", markHeight = "h-24" }: {
  asset: (typeof LOGOS)[number];
  className?: string;
  logoWidth?: string;
  markHeight?: string;
}) {
  return (
    <div className={cn("flex items-center justify-center", surface(asset) === "light" ? "bg-white" : "bg-og-midnight", className)}>
      <img src={asset.preview!} alt="" className={cn("object-contain", isMark(asset) ? markHeight : logoWidth)} />
    </div>
  );
}

function CompactTiles() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {LOGOS.map((asset) => (
        <div key={asset.id} className="flex flex-col overflow-hidden rounded-lg border border-border bg-white">
          <Preview asset={asset} className={cn("aspect-[16/10]", surface(asset) === "light" && "border-b border-border")} />
          {/* Tiles run ~150px wide below xl, so the chip drops under the label until there is room beside it. */}
          <div className="flex flex-col items-start gap-2 p-3 xl:flex-row xl:items-center xl:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-semibold leading-tight">{isMark(asset) ? "Logomark" : "Full logo"}</p>
              <p className="mt-0.5 text-xs text-muted-foreground">{surface(asset) === "light" ? "Light backgrounds" : "Dark backgrounds"}</p>
            </div>
            <DownloadChip href={asset.href!} label={asset.formats[0]} title={asset.title} />
          </div>
        </div>
      ))}
    </div>
  );
}

function PairedTiles() {
  const pairs = [
    { name: "Full logo", note: "Use whenever space allows.", items: LOGOS.filter((asset) => !isMark(asset)) },
    { name: "Logomark", note: "Use the supplied artwork unchanged.", items: LOGOS.filter(isMark) },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {pairs.map((pair) => (
        <div key={pair.name} className="overflow-hidden rounded-lg border border-border bg-white">
          <div className="grid grid-cols-2 border-b border-border">
            {pair.items.map((asset) => (
              <Preview key={asset.id} asset={asset} className="h-32" markHeight="h-[72px]" />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div>
              <p className="font-semibold">{pair.name}</p>
              <p className="text-sm text-muted-foreground">{pair.note}</p>
            </div>
            <div className="flex gap-2">
              {pair.items.map((asset) => (
                <DownloadChip key={asset.id} href={asset.href!} label={surface(asset) === "light" ? "Light bg" : "Dark bg"} title={asset.title} />
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DownloadList() {
  return (
    <div className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
      {LOGOS.map((asset) => (
        <div key={asset.id} className="grid grid-cols-[88px_minmax(0,1fr)_auto] items-center gap-4 p-3 sm:grid-cols-[112px_minmax(0,1fr)_auto]">
          <Preview asset={asset} className={cn("h-14 rounded-md", surface(asset) === "light" && "ring-1 ring-inset ring-border")} logoWidth="w-[86%]" markHeight="h-10" />
          <div className="min-w-0">
            <p className="text-sm font-semibold">{asset.title}</p>
            <p className="truncate text-sm text-muted-foreground">{asset.description}</p>
          </div>
          <DownloadChip href={asset.href!} label={asset.formats[0]} title={asset.title} />
        </div>
      ))}
    </div>
  );
}

/* ----------------------------- 3. Colors ------------------------------ */

const swatch = (name: string) => [...CORE.swatches, ...SECONDARY.swatches].find((item) => item.name === name)!;

function CopyChip({ item, className, size = "md" }: { item: SwatchData; className?: string; size?: "sm" | "md" }) {
  const { copied, copy } = useCopy();
  const ink = inkOn(item.hex);
  return (
    <button
      onClick={() => copy(item.hex)}
      aria-label={`Copy ${item.name} ${item.hex}`}
      className={cn(
        "action-focus group relative flex flex-col justify-end rounded-lg p-3 text-left",
        item.hex === "#FFFFFF" && "ring-1 ring-inset ring-og-midnight/15",
        className
      )}
      style={{ backgroundColor: item.hex, color: ink }}
    >
      <span className="absolute right-2.5 top-2.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </span>
      <span className={cn("font-semibold leading-tight", size === "sm" ? "text-xs" : "text-sm")}>{item.name}</span>
      <span className={cn("mt-0.5 font-mono opacity-80", size === "sm" ? "text-[11px]" : "text-xs")}>{copied ? "Copied" : item.hex}</span>
    </button>
  );
}

function ContextPanels() {
  const panels = [
    {
      label: "On Midnight",
      ground: swatch("Midnight"),
      accent: swatch("Groovy Green"),
      text: swatch("White"),
      pop: SECONDARY.swatches.filter((item) => item.onDark),
    },
    {
      label: "On white",
      ground: swatch("White"),
      accent: swatch("Green (light-bg)"),
      text: swatch("Midnight"),
      pop: SECONDARY.swatches.filter((item) => item.onLight),
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {panels.map((panel) => (
        <div
          key={panel.label}
          className={cn("rounded-lg p-6", panel.ground.hex === "#FFFFFF" && "border border-border")}
          style={{ backgroundColor: panel.ground.hex, color: panel.text.hex }}
        >
          <div className="flex items-baseline justify-between gap-4">
            <p className="text-lg font-bold">{panel.label}</p>
            <p className="font-mono text-xs opacity-70">{panel.ground.hex}</p>
          </div>
          <p className="mt-5 text-3xl font-extrabold tracking-tight">
            Make it look like <span style={{ color: panel.accent.hex }}>Ordergroove</span>
          </p>
          <div className="mt-6 grid grid-cols-2 gap-2">
            <CopyChip item={panel.accent} className="h-20" />
            <CopyChip item={panel.text} className="h-20" />
          </div>
          <p className="mb-2 mt-5 text-xs font-semibold opacity-70">Decorative pop</p>
          <div className="grid grid-cols-3 gap-2">
            {panel.pop.map((item) => <CopyChip key={item.hex} item={item} size="sm" className="h-16 p-2.5" />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function ColorBand() {
  return (
    <div>
      <div className="overflow-hidden rounded-lg ring-1 ring-inset ring-og-midnight/10">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {CORE.swatches.map((item) => <CopyChip key={item.hex} item={item} className="h-36 rounded-none p-4" />)}
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6">
          {SECONDARY.swatches.map((item) => <CopyChip key={item.hex} item={item} size="sm" className="h-20 rounded-none" />)}
        </div>
      </div>
      <div className="mt-4 grid gap-x-4 gap-y-3 text-sm leading-6 text-muted-foreground md:grid-cols-4">
        {CORE.swatches.map((item) => <p key={item.hex}><strong className="text-foreground">{item.name}:</strong> {item.usage}</p>)}
      </div>
      <p className="mt-3 text-sm leading-6 text-muted-foreground"><strong className="text-foreground">Secondary:</strong> {SECONDARY.note}</p>
    </div>
  );
}

function PickerDetail() {
  const [selected, setSelected] = useState(CORE.swatches[2]);
  const { copied, copy } = useCopy();
  const option = (item: SwatchData, large: boolean) => (
    <button
      key={item.hex}
      onClick={() => setSelected(item)}
      aria-pressed={selected.hex === item.hex}
      aria-label={item.name}
      className={cn(
        "action-focus rounded-lg transition-transform active:scale-[0.98]",
        large ? "h-20" : "h-12",
        item.hex === "#FFFFFF" && "ring-1 ring-inset ring-og-midnight/15",
        selected.hex === item.hex && "ring-2 ring-og-midnight ring-offset-2"
      )}
      style={{ backgroundColor: item.hex }}
    />
  );
  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_340px]">
      <div className="rounded-lg border border-border bg-white p-5">
        <p className="mb-2 text-sm font-semibold">Core</p>
        <div className="grid grid-cols-4 gap-3">{CORE.swatches.map((item) => option(item, true))}</div>
        <p className="mb-2 mt-5 text-sm font-semibold">Secondary <span className="font-normal text-muted-foreground">decorative pop only</span></p>
        <div className="grid grid-cols-6 gap-3">{SECONDARY.swatches.map((item) => option(item, false))}</div>
      </div>
      <div className="overflow-hidden rounded-lg border border-border bg-white">
        <div className={cn("flex h-28 items-end p-4", selected.hex === "#FFFFFF" && "border-b border-border")} style={{ backgroundColor: selected.hex, color: inkOn(selected.hex) }}>
          <p className="text-xl font-bold">{selected.name}</p>
        </div>
        <div className="space-y-3 p-4">
          <div className="flex gap-2">
            {[selected.hex, `rgb(${selected.rgb})`].map((value) => (
              <button key={value} onClick={() => copy(value)} className="action-focus inline-flex h-8 items-center gap-1.5 rounded-full border border-border px-3 font-mono text-xs hover:border-og-midnight">
                {copied === value ? <Check size={12} /> : <Copy size={12} />} {copied === value ? "Copied" : value}
              </button>
            ))}
          </div>
          <p className="text-sm leading-6 text-muted-foreground">{selected.usage}</p>
          <div className="flex gap-2 text-xs font-semibold">
            <span className={cn("rounded-full px-2.5 py-1", selected.onDark ? "bg-og-midnight text-og-green" : "bg-og-gray-950 text-og-gray-400 line-through")}>On dark</span>
            <span className={cn("rounded-full border px-2.5 py-1", selected.onLight ? "border-og-midnight" : "border-border text-og-gray-400 line-through")}>On light</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------- Page -------------------------------- */

export default function LayoutLab() {
  return (
    <HubShell activeId="">
      <Wrap className="pb-12 pt-14">
        <h1 className="text-4xl font-extrabold md:text-5xl">Home page layout lab</h1>
        <p className="measure mt-4 text-lg leading-[1.6] text-muted-foreground">
          Three options for each element, built with the hub's real assets and data. Hover, click, and copy to try them.
        </p>
        <nav className="mt-6 flex flex-wrap gap-2" aria-label="Lab sections">
          {GROUPS.map((group) => (
            <a key={group.id} href={`#${group.id}`} className="action-focus inline-flex h-9 items-center gap-2 rounded-full bg-og-midnight px-4 text-sm font-semibold text-white">
              {group.label} <ArrowRight size={14} />
            </a>
          ))}
        </nav>
      </Wrap>

      <Group id="lab-hero" title="Hero popups" problem="Today the card opens in a fixed corner, away from the item you point at, and covers other artwork. Nothing hints that the desk is interactive.">
        <Option code="H1" name="Anchored card" bleed
          why="The card opens right beside the item with a pointer, so the link between item and card is obvious."
          cost="Still covers a neighbor on the crowded right side. Needs the placement logic shown here.">
          <DeskBand variant="anchored" />
        </Option>
        <Option code="H2" name="Spotlight pill" bleed
          why="Everything else fades, the item lifts, and one dark pill offers the download. Fastest path to the file."
          cost="Drops the one-line description. The fade is a stronger effect on a calm page.">
          <DeskBand variant="spotlight" />
        </Option>
        <Option code="H3" name="Caption rail" bleed
          why="Details live in a strip under the desk, so nothing covers the artwork. Works the same for tap and hover."
          cost="Adds about 80px between the desk and search. The rail is empty until someone points at the desk.">
          <DeskBand variant="rail" />
        </Option>
        <Current bleed><DeskBand variant="current" /></Current>
      </Group>

      <Group id="lab-grid" title="Asset grid" problem="Each logo card is about 520 × 300px, so four PNGs fill more than a screen. Four full-width black buttons outweigh the logos themselves.">
        <Option code="G1" name="Compact tiles"
          why="All four logos fit in one row at about a third of the height. The download stays one click away."
          cost="Previews are smaller, and the long descriptions are dropped.">
          <CompactTiles />
        </Option>
        <Option code="G2" name="Paired tiles"
          why="Each logo shows its dark and light version side by side, which teaches the pairing at a glance."
          cost="Only works while every asset has a dark and light twin.">
          <PairedTiles />
        </Option>
        <Option code="G3" name="Download list"
          why="Thumbnail, name, and description on one row. Scales cleanly as more downloads are added."
          cost="Least visual of the three. Logos read as thumbnails, not showcases.">
          <DownloadList />
        </Option>
        <Current>
          <div className="grid gap-5 sm:grid-cols-2">
            {LOGOS.map((asset) => <AssetCard key={asset.id} asset={asset} showDescription={false} />)}
          </div>
        </Current>
      </Group>

      <Group id="lab-color" title="Colors" problem="The key rule, which green goes where, is buried in small usage text. Secondary colors sit in a box that leaves its right half empty.">
        <Option code="C1" name="Context panels"
          why="Colors are grouped by the background they sit on, so 'which green goes on white?' answers itself."
          cost="Some colors appear twice. RGB values move to the tokens section.">
          <ContextPanels />
        </Option>
        <Option code="C2" name="Color band"
          why="All 10 colors in one strip, with name and hex printed on each. About half the current height."
          cost="Usage rules sit below the strip, apart from their colors.">
          <ColorBand />
        </Option>
        <Option code="C3" name="Picker and detail"
          why="Small chips to scan, one detail card to read. Copy hex or RGB from the same place."
          cost="Only one color's usage shows at a time, so rules are less scannable.">
          <PickerDetail />
        </Option>
        <Current>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {CORE.swatches.map((item) => <Swatch key={item.hex} swatch={item} />)}
          </div>
          <div className="mt-10 rounded-lg border border-border bg-white p-6">
            <h3 className="text-lg font-bold">{SECONDARY.title}</h3>
            <p className="measure mt-1 text-sm leading-6 text-muted-foreground">{SECONDARY.note}</p>
            <div className="mt-3 grid gap-x-8 sm:grid-cols-2 lg:max-w-[680px]">
              {SECONDARY.swatches.map((item) => <MiniSwatch key={item.hex} name={item.name} hex={item.hex} />)}
            </div>
          </div>
        </Current>
      </Group>
    </HubShell>
  );
}
