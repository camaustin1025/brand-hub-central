import { useEffect, useRef, useState, type ReactNode } from "react";
import { ArrowRight, Check, Download, Link2, Copy } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { ASSETS, type Asset } from "@/data/assets";
import { cn } from "@/lib/utils";
import lab from "./ButtonLab.module.css";

/* ------------------------------------------------------------------ *
 * Button exploration deck. Not a shipping route. Every option renders
 * the same tiles, chapter header, and page actions the hub ships with,
 * so only the button treatment changes between options.
 * ------------------------------------------------------------------ */

type VariantId = "today" | "tight" | "pills" | "filled" | "links";

type Styles = {
  chip: string;
  heroPrimary: string;
  heroSecondary: string;
  action: string;
  small: string;
  filterOn: string;
  filterOff: string;
  chipsAsLinks?: boolean;
};

const FOCUS = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight focus-visible:ring-offset-2";
const FOCUS_DARK = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-og-midnight";
const BASE = "inline-flex shrink-0 items-center justify-center whitespace-nowrap font-semibold transition-colors duration-200";

// Midnight pill from the approved CTA rule: Midnight fill, white text, inverts on hover.
const MIDNIGHT_PILL = "rounded-full border border-og-midnight bg-og-midnight text-white hover:bg-white hover:text-og-midnight";
const OUTLINE_PILL = "rounded-full border border-og-midnight bg-white text-og-midnight hover:bg-og-midnight hover:text-white";

const COMPACT_CHIP = cn(BASE, FOCUS, lab.tap, "h-8 gap-1 px-2 text-xs sm:px-2.5", OUTLINE_PILL);
const COMPACT_SMALL = cn(BASE, FOCUS, lab.tap, "h-8 gap-1.5 px-3 text-[13px]");
const ACTION_40 = cn(BASE, FOCUS, "h-10 gap-2 px-5 text-sm");

const VARIANTS: { id: VariantId; name: string; summary: string; sizes: string; styles: Styles }[] = [
  {
    id: "today",
    name: "Today",
    summary: "What ships now. Every button is at least 44px tall, so the 12px download labels sit in tall, roomy pills. Chapter headers use a green button with 8px corners.",
    sizes: "Download chips 44px · Page actions 44 to 48px · Copy buttons 36px",
    styles: {
      chip: cn(BASE, "action-focus min-h-11 gap-1.5 rounded-full border border-og-midnight px-3 text-xs text-og-midnight hover:bg-og-midnight hover:text-white"),
      heroPrimary: cn(BASE, FOCUS_DARK, "min-h-11 gap-2 rounded-md bg-og-green px-4 text-sm font-bold text-og-midnight hover:bg-[#33FF9D]"),
      heroSecondary: cn(BASE, FOCUS_DARK, "min-h-11 gap-2 rounded-md border border-white/30 px-4 text-sm text-white hover:border-white/60 hover:bg-white/10"),
      action: cn(BASE, FOCUS, "h-12 gap-2 px-8 text-[15px]", MIDNIGHT_PILL),
      small: cn(BASE, FOCUS, "h-9 gap-2 rounded-md border border-border bg-white px-3.5 text-sm text-og-midnight hover:border-og-midnight"),
      filterOn: cn(BASE, FOCUS, "min-h-11 px-4 text-sm", MIDNIGHT_PILL),
      filterOff: cn(BASE, FOCUS, "min-h-11 px-4 text-sm", OUTLINE_PILL),
    },
  },
  {
    id: "tight",
    name: "Tighter, same styles",
    summary: "Shapes and colors stay exactly as they are. Only height and padding shrink.",
    sizes: "Download chips 32px · Page actions 40px · Copy buttons 32px",
    styles: {
      chip: COMPACT_CHIP,
      heroPrimary: cn(BASE, FOCUS_DARK, "h-10 gap-2 rounded-md bg-og-green px-4 text-sm font-bold text-og-midnight hover:bg-[#33FF9D]"),
      heroSecondary: cn(BASE, FOCUS_DARK, "h-10 gap-2 rounded-md border border-white/30 px-3.5 text-sm text-white hover:border-white/60 hover:bg-white/10"),
      action: cn(ACTION_40, MIDNIGHT_PILL),
      small: cn(COMPACT_SMALL, "rounded-md border border-border bg-white text-og-midnight hover:border-og-midnight"),
      filterOn: cn(COMPACT_SMALL, MIDNIGHT_PILL),
      filterOff: cn(COMPACT_SMALL, OUTLINE_PILL),
    },
  },
  {
    id: "pills",
    name: "Pills, chips outlined",
    summary: "Every button becomes a pill. The main action on each surface is filled: Midnight on white, white on Midnight. Download chips, Copy, and Copy link stay outlined, so a row of chips stays light.",
    sizes: "Download chips 32px · Page actions 40px · Copy buttons 32px",
    styles: {
      chip: COMPACT_CHIP,
      heroPrimary: cn(BASE, FOCUS_DARK, "h-10 gap-2 rounded-full border border-white bg-white px-5 text-sm text-og-midnight hover:bg-og-midnight hover:text-white"),
      heroSecondary: cn(BASE, FOCUS_DARK, "h-10 gap-2 rounded-full border border-white/40 px-4 text-sm text-white hover:border-white hover:bg-white/10"),
      action: cn(ACTION_40, MIDNIGHT_PILL),
      small: cn(COMPACT_SMALL, OUTLINE_PILL),
      filterOn: cn(COMPACT_SMALL, MIDNIGHT_PILL),
      filterOff: cn(COMPACT_SMALL, OUTLINE_PILL),
    },
  },
  {
    id: "filled",
    name: "Midnight pills everywhere",
    summary: "The approved rule, applied literally: every button is a filled Midnight pill, chips included. On a Midnight header both buttons become the same white-outlined pill, so neither one leads.",
    sizes: "Download chips 32px · Page actions 40px · Copy buttons 32px",
    styles: {
      chip: cn(BASE, FOCUS, lab.tap, "h-8 gap-1 px-2 text-xs sm:px-2.5", MIDNIGHT_PILL),
      heroPrimary: cn(BASE, FOCUS_DARK, "h-10 gap-2 rounded-full border border-white/60 bg-og-midnight px-5 text-sm text-white hover:border-white hover:bg-white hover:text-og-midnight"),
      heroSecondary: cn(BASE, FOCUS_DARK, "h-10 gap-2 rounded-full border border-white/60 bg-og-midnight px-5 text-sm text-white hover:border-white hover:bg-white hover:text-og-midnight"),
      action: cn(ACTION_40, MIDNIGHT_PILL),
      small: cn(COMPACT_SMALL, MIDNIGHT_PILL),
      filterOn: cn(COMPACT_SMALL, MIDNIGHT_PILL),
      filterOff: cn(COMPACT_SMALL, OUTLINE_PILL),
    },
  },
  {
    id: "links",
    name: "Download links, no chips",
    summary: "Same pills as the outlined option, but file downloads become plain links with a download icon. The smallest footprint on asset grids. Buttons are kept for actions. Pick a hover effect below, then hover the PNG and SVG links on the tiles.",
    sizes: "Download links 13px text · Page actions 40px · Copy buttons 32px",
    styles: {
      chip: cn("inline-flex items-center gap-1 rounded-sm py-1 text-[13px] font-semibold text-og-midnight underline-offset-4 decoration-2 hover:underline hover:decoration-og-green-light", FOCUS, lab.tapLink),
      heroPrimary: cn(BASE, FOCUS_DARK, "h-10 gap-2 rounded-full border border-white bg-white px-5 text-sm text-og-midnight hover:bg-og-midnight hover:text-white"),
      heroSecondary: cn(BASE, FOCUS_DARK, "h-10 gap-2 rounded-full border border-white/40 px-4 text-sm text-white hover:border-white hover:bg-white/10"),
      action: cn(ACTION_40, MIDNIGHT_PILL),
      small: cn(COMPACT_SMALL, OUTLINE_PILL),
      filterOn: cn(COMPACT_SMALL, MIDNIGHT_PILL),
      filterOff: cn(COMPACT_SMALL, OUTLINE_PILL),
      chipsAsLinks: true,
    },
  },
];

const LOGOS = ["logo-dark", "logo-light", "logomark-dark", "logomark-light"]
  .map((id) => ASSETS.find((asset) => asset.id === id))
  .filter((asset): asset is Asset => Boolean(asset));

type HoverFx = "nudge" | "marker" | "gradient" | "ring" | "pill";

const HOVER_FX: { id: HoverFx; name: string; detail: string }[] = [
  { id: "marker", name: "Green marker", detail: "A Groovy Green highlighter swipes in behind the format, and the arrow dips toward the tray." },
  { id: "pill", name: "Pill on hover", detail: "Plain text at rest. A Midnight pill grows in behind it on hover, so the link shows it's clickable only when you point at it." },
  { id: "ring", name: "Ring fill", detail: "The arrow sits in a thin ring that fills Midnight on hover, and the arrow turns Groovy Green and drops." },
  { id: "nudge", name: "Arrow nudge", detail: "The quietest one. The arrow bounces into the tray twice and a green underline draws in." },
  { id: "gradient", name: "Gradient underline", detail: "A thick Cyan to Lemon underline, the brand gradient, draws in under the format." },
];

/** The download glyph with its arrow split from the tray, so the arrow can move on its own. */
function DownloadGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <g className={lab.arrow}>
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </g>
    </svg>
  );
}

function DownloadLink({ asset, file, fx }: { asset: Asset; file: Asset["files"][number]; fx: HoverFx }) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);
  return (
    <a href={file.href} download aria-label={`Download ${asset.title} (${file.format})`}
      // The lab shows the click confirmation without saving a file each time.
      onClick={(event) => {
        event.preventDefault();
        setSaved(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setSaved(false), 1600);
      }}
      className={cn(lab.dl, lab[fx], saved && lab.saved, lab.tapLink, FOCUS)}>
      <span className={lab.icon}>{saved ? <Check size={14} strokeWidth={2.5} aria-hidden="true" /> : <DownloadGlyph />}</span>
      <span className={lab.label}>{file.format}</span>
    </a>
  );
}

function Downloads({ asset, styles, phone, fx }: { asset: Asset; styles: Styles; phone?: boolean; fx: HoverFx }) {
  if (styles.chipsAsLinks) {
    return (
      <div className={cn("flex flex-wrap gap-x-4 gap-y-1", fx === "ring" && "gap-x-3")}>
        {asset.files.map((file) => <DownloadLink key={file.href} asset={asset} file={file} fx={fx} />)}
      </div>
    );
  }
  // Today's phone layout squeezes paired logo chips into a two-column grid with 11px labels.
  const todayPhone = phone && styles.chip.includes("min-h-11");
  return (
    <div className={cn("flex flex-wrap gap-1.5", todayPhone && "grid grid-cols-2 gap-1")}>
      {asset.files.map((file) => (
        <a key={file.href} href={file.href} download aria-label={`Download ${asset.title} (${file.format})`}
          className={cn(styles.chip, phone && !todayPhone && "sm:px-2", todayPhone && "min-w-0 gap-1 px-1.5 text-[11px]")}>
          <Download size={13} className="shrink-0" aria-hidden="true" /> {file.format}
        </a>
      ))}
    </div>
  );
}

function Tiles({ styles, phone, fx }: { styles: Styles; phone?: boolean; fx: HoverFx }) {
  return (
    <div className={cn("grid gap-4", phone ? "grid-cols-2" : "grid-cols-2 md:grid-cols-4")}>
      {LOGOS.map((asset) => {
        const light = asset.previewBg === "light";
        const mark = asset.tags.includes("logomark");
        return (
          <article key={asset.id} className="visual-container overflow-hidden border border-border bg-white">
            <div className={cn("flex aspect-[16/10] items-center justify-center", light ? "border-b border-border bg-white" : "bg-og-midnight")}>
              <img src={asset.preview ?? ""} alt="" className={cn("max-h-[77%] w-[86%] object-contain", mark && "w-auto max-w-[66%]")} />
            </div>
            {/* The phone frame renders inside a desktop viewport, so it pins the phone padding. */}
            <div className={cn("space-y-3 p-3", !phone && "sm:p-4")}>
              <div>
                <h4 className="text-sm font-semibold leading-snug">{mark ? "Logomark" : "Full logo"}</h4>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">{light ? "Light backgrounds" : "Dark backgrounds"}</p>
              </div>
              <Downloads asset={asset} styles={styles} phone={phone} fx={fx} />
            </div>
          </article>
        );
      })}
    </div>
  );
}

function Panel({ title, note, children }: { title: string; note?: string; children: ReactNode }) {
  return (
    <section className="mt-10 first:mt-0">
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="text-lg font-bold text-og-midnight">{title}</h2>
        {note && <p className="text-sm text-foreground">{note}</p>}
      </div>
      {children}
    </section>
  );
}

export default function ButtonLab() {
  const [variantId, setVariantId] = useState<VariantId>("pills");
  const variant = VARIANTS.find((item) => item.id === variantId)!;
  const { styles } = variant;
  const [filter, setFilter] = useState<"dark" | "light">("dark");
  const [fx, setFx] = useState<HoverFx>("marker");
  const fxDetail = HOVER_FX.find((item) => item.id === fx)!;

  // Left and right arrows flick between options so the eye stays on one spot.
  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.target instanceof HTMLInputElement || event.metaKey || event.ctrlKey) return;
      if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
      const index = VARIANTS.findIndex((item) => item.id === variantId);
      const next = (index + (event.key === "ArrowRight" ? 1 : VARIANTS.length - 1)) % VARIANTS.length;
      setVariantId(VARIANTS[next].id);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [variantId]);

  return (
    <HubShell activeId="">
      <div className="px-6 pb-16 pt-10 md:px-10">
        <div className="mx-auto max-w-[1060px]">
          <h1 className="text-[40px] font-extrabold leading-[1.05] tracking-[-0.03em] text-og-midnight">Button options</h1>
          <p className="measure mt-3 text-lg leading-[1.55] text-og-midnight">
            Pick an option, then flick between them with the arrow keys. Every option uses the same tiles and actions from the hub. On phones and tablets, each compact button keeps a finger-sized tap area without looking bigger.
          </p>
        </div>
      </div>

      <div className="sticky top-16 z-20 border-y border-border bg-white/95 px-6 py-3 backdrop-blur md:px-10">
        <div className="mx-auto flex max-w-[1060px] flex-wrap gap-2" role="radiogroup" aria-label="Button option">
          {VARIANTS.map((item) => (
            <button key={item.id} type="button" role="radio" aria-checked={item.id === variantId} onClick={() => setVariantId(item.id)}
              className={cn(BASE, FOCUS, "h-9 gap-1.5 px-4 text-sm", item.id === variantId ? MIDNIGHT_PILL : "rounded-full border border-border bg-white text-og-midnight hover:border-og-midnight")}>
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* Remount per option so a switch shows the new style at once, not a color fade between two. */}
      <div key={variantId} className="px-6 py-10 md:px-10">
        <div className="mx-auto max-w-[1060px]">
          <div className="mb-10">
            <p className="measure text-base leading-[1.6] text-og-midnight">{variant.summary}</p>
            <p className="mt-2 text-sm font-semibold text-og-indigo">{variant.sizes}</p>
          </div>

          {styles.chipsAsLinks && (
            <div className="visual-container mb-10 border border-border bg-white p-5">
              <h2 className="text-base font-bold text-og-midnight">Hover effect</h2>
              <div className="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="Hover effect">
                {HOVER_FX.map((item) => (
                  <button key={item.id} type="button" role="radio" aria-checked={item.id === fx} onClick={() => setFx(item.id)}
                    className={cn(COMPACT_SMALL, item.id === fx ? MIDNIGHT_PILL : OUTLINE_PILL)}>
                    {item.name}
                  </button>
                ))}
              </div>
              <p className="measure mt-3 text-sm leading-6 text-og-midnight">
                {fxDetail.detail} Clicking a link here shows the saved check without downloading the file.
              </p>
            </div>
          )}

          <Panel title="Logo kit tiles" note="Homepage, Logos & fonts">
            <Tiles styles={styles} fx={fx} />
          </Panel>

          <Panel title="Logo kit tiles at phone width" note="Two tiles per row, as on a 375px phone">
            <div className={lab.phone}>
              <Tiles styles={styles} phone fx={fx} />
            </div>
          </Panel>

          <Panel title="Chapter page header" note="Zoom backgrounds, Icon library, Foundation">
            <div className="dark bg-og-midnight px-6 py-8 text-white md:px-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
                <div>
                  <p className="text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em]">Zoom backgrounds</p>
                  <p className="measure mt-3 text-base leading-[1.6]">Approved backgrounds for video calls. Download one, then add it in Zoom, Google Meet, or Microsoft Teams.</p>
                </div>
                <div className="flex flex-wrap gap-3 md:shrink-0">
                  <button type="button" className={styles.heroPrimary}><Download size={16} aria-hidden="true" /> Download all 6</button>
                  <button type="button" className={styles.heroSecondary}><Link2 size={16} aria-hidden="true" /> Copy link</button>
                </div>
              </div>
            </div>
          </Panel>

          <Panel title="Actions on white" note="LinkedIn graphics, homepage, Foundation, Icon library">
            <div className="visual-container space-y-6 border border-border bg-white p-6">
              <div className="flex flex-wrap items-center gap-3">
                <button type="button" className={styles.action}>Customize graphic <ArrowRight size={16} aria-hidden="true" /></button>
                <button type="button" className={styles.action}>Ping @cameron.austin in Slack <ArrowRight size={16} aria-hidden="true" /></button>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
                <p className="max-w-[46ch] text-sm leading-6 text-og-midnight">
                  Ordergroove is the Autonomous Subscriptions platform for enterprise brands.
                </p>
                <button type="button" className={styles.small}><Copy size={14} aria-hidden="true" /> Copy</button>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-border pt-6" role="radiogroup" aria-label="Icon background">
                {(["dark", "light"] as const).map((value) => (
                  <button key={value} type="button" role="radio" aria-checked={filter === value} onClick={() => setFilter(value)}
                    className={filter === value ? styles.filterOn : styles.filterOff}>
                    {value === "dark" ? "Dark backgrounds" : "Light backgrounds"}
                  </button>
                ))}
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </HubShell>
  );
}
