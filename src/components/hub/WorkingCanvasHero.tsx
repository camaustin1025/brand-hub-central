import { Heading } from "@/components/layout/Heading";
import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Download, X } from "lucide-react";
import { SearchBox, jumpTo } from "@/components/hub/HubShell";
import { HomeTasks } from "@/components/hub/HomeTasks";
import { getAsset, findAssetFile } from "@/data/assets";
import { BACKGROUND_GRADIENT_CSS } from "@/data/tokens";
import { DESIGN_CANVAS_PATH, ZOOM_BACKGROUNDS_PATH } from "@/data/hub";
import { useAccess } from "@/hooks/use-access";
import styles from "./WorkingCanvasHero.module.css";

const ARTWORK = {
  logo: { title: "Ordergroove logo", detail: getAsset("logo-light").description, ...findAssetFile("logo-light", "SVG"), label: "Download SVG", section: getAsset("logo-light").section },
  type: { title: "Figtree", detail: "Our brand typeface. This file is Regular only; the font kit has all five weights.", ...findAssetFile("font-kit", "TTF"), label: "Download font", section: getAsset("font-kit").section },
  icons: { title: "Brand icons", detail: getAsset("icon-examples").description, ...findAssetFile("icon-examples", "SVG"), label: "Download SVG", section: getAsset("icon-examples").section },
};
type ArtworkId = keyof typeof ARTWORK;
type ArtworkAnchor = "logo" | "type" | "payment" | "heart" | "chart" | "social" | "zoom";
type LinkSpotlight = "social" | "zoom";
type Spotlight = { id: ArtworkId | LinkSpotlight; anchor: ArtworkAnchor; element: HTMLElement };
/** Pieces whose popup is a single link to another hub page. */
const LINK_POPUPS: Record<LinkSpotlight, { label: string; to: string }> = {
  social: { label: "Social assets", to: DESIGN_CANVAS_PATH },
  zoom: { label: "Zoom backgrounds", to: ZOOM_BACKGROUNDS_PATH },
};
const POPUP_SIDE: Record<ArtworkAnchor, "above" | "below"> = {
  logo: "below", type: "below", payment: "below", heart: "below", chart: "above", social: "below", zoom: "below",
};


/** Tools on the outer orbit, each linked to the hub page that covers it. */
const TOOLS = [
  { id: "slack", label: "Slack channels", to: "/ai-resources#ai-slack" },
  { id: "google-slides", label: "Ordergroove slides skill", to: "/ai-resources?q=ordergroove-slides#ai-skills-library" },
  { id: "claude", label: "AI resources and Claude skills", to: "/ai-resources" },
  { id: "zoom", label: "Zoom backgrounds", to: ZOOM_BACKGROUNDS_PATH },
  { id: "linkedin", label: "LinkedIn graphics", to: DESIGN_CANVAS_PATH },
] as const;

/** The desktop composition is drawn on a fixed 1100 × 300 stage and scaled to fit. */
const STAGE_WIDTH = 1100;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/** Selected Working Canvas composition, with details for the original source assets. */
export function WorkingCanvasHero() {
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const [pillPosition, setPillPosition] = useState<{ left: number; top: number } | null>(null);
  const [selected, setSelected] = useState<ArtworkId | null>(null);
  const [scale, setScale] = useState(1);
  const isGuest = useAccess() === "guest";
  const artworkTrigger = useRef<HTMLButtonElement | null>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function keepSpotlight() {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }

  function clearSpotlight() {
    keepSpotlight();
    setSpotlight(null);
  }

  function light(id: Spotlight["id"], anchor: ArtworkAnchor, element: HTMLElement) {
    keepSpotlight();
    setSpotlight({ id, anchor, element });
  }

  function leaveArtwork() {
    keepSpotlight();
    if (artworkRef.current?.contains(document.activeElement)) return;
    closeTimer.current = setTimeout(() => setSpotlight(null), 180);
  }

  useEffect(() => () => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
  }, []);

  // Scale the fixed stage to the content column so the orbits keep their proportions.
  useLayoutEffect(() => {
    const artwork = artworkRef.current;
    if (!artwork) return;
    const fit = () => setScale(Math.min(1, artwork.clientWidth / STAGE_WIDTH));
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(artwork);
    return () => observer.disconnect();
  }, []);

  // Anchor each popup to its own specimen, following the approved above/below map.
  // Let lower popups extend beyond the artwork band; clamp only to the visible page.
  useLayoutEffect(() => {
    const artwork = artworkRef.current;
    const pill = pillRef.current;
    if (!spotlight || !artwork || !pill) return setPillPosition(null);
    const position = () => {
      const canvas = artwork.getBoundingClientRect();
      const target = spotlight.element.getBoundingClientRect();
      const contentLeft = artwork.closest("main")?.getBoundingClientRect().left ?? 0;
      const desiredLeft = spotlight.anchor === "payment"
          ? target.left - canvas.left
          : spotlight.anchor === "chart"
            ? target.left - canvas.left - 16
            : target.left - canvas.left + (target.width - pill.offsetWidth) / 2;
      const left = clamp(desiredLeft, contentLeft + 12 - canvas.left, document.documentElement.clientWidth - canvas.left - pill.offsetWidth - 12);
      let top = POPUP_SIDE[spotlight.anchor] === "above"
        ? target.top - canvas.top - pill.offsetHeight - 12
        : target.bottom - canvas.top + 12;
      if (POPUP_SIDE[spotlight.anchor] === "above") {
        // In a narrow content column the popup cannot extend sideways. Lift it
        // clear of neighboring controls instead of covering their hover targets.
        const neighbors = artwork.querySelectorAll<HTMLElement>("[data-artwork]");
        for (const neighbor of neighbors) {
          if (neighbor === spotlight.element) continue;
          const rect = neighbor.getBoundingClientRect();
          if (canvas.left + left < rect.right && canvas.left + left + pill.offsetWidth > rect.left
            && canvas.top + top < rect.bottom && canvas.top + top + pill.offsetHeight > rect.top) {
            top = Math.min(top, rect.top - canvas.top - pill.offsetHeight - 12);
          }
        }
      }
      setPillPosition((previous) => previous?.left === left && previous.top === top ? previous : { left, top });
    };
    position();
    const observer = new ResizeObserver(position);
    observer.observe(artwork);
    observer.observe(pill);
    window.addEventListener("resize", position);
    return () => { observer.disconnect(); window.removeEventListener("resize", position); };
  }, [spotlight]);

  function artworkControl(id: ArtworkId, anchor: ArtworkAnchor = id as ArtworkAnchor) {
    return {
      type: "button" as const,
      disabled: !ARTWORK[id].href,
      "aria-label": `View ${ARTWORK[id].title} details`,
      "aria-haspopup": "dialog" as const,
      "data-lit": spotlight?.anchor === anchor ? "" : undefined,
      "data-artwork": anchor,
      onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => {
        if (event.pointerType === "mouse") light(id, anchor, event.currentTarget);
      },
      onFocus: (event: React.FocusEvent<HTMLButtonElement>) => light(id, anchor, event.currentTarget),
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        artworkTrigger.current = event.currentTarget;
        clearSpotlight();
        setSelected(id);
      },
    };
  }

  function guidance(id: ArtworkId) {
    setSelected(null);
    clearSpotlight();
    jumpTo(ARTWORK[id].section);
  }

  const linkPopup = spotlight && spotlight.id in LINK_POPUPS ? LINK_POPUPS[spotlight.id as LinkSpotlight] : null;
  const lit = spotlight && !linkPopup ? ARTWORK[spotlight.id as ArtworkId] : null;
  // The LinkedIn graphic and its LinkedIn tile share one popup, anchored to the graphic.
  const socialRef = useRef<HTMLAnchorElement>(null);
  const linkHover = (id: LinkSpotlight) => ({
    onPointerEnter: (event: React.PointerEvent<HTMLElement>) => { if (event.pointerType === "mouse") light(id, id, event.currentTarget); },
    onFocus: (event: React.FocusEvent<HTMLElement>) => light(id, id, event.currentTarget),
  });
  const socialHover = {
    onPointerEnter: (event: React.PointerEvent) => { if (event.pointerType === "mouse" && socialRef.current) light("social", "social", socialRef.current); },
    onFocus: () => { if (socialRef.current) light("social", "social", socialRef.current); },
  };
  // The LinkedIn preview's avatar is an empty gray circle; lay a person silhouette
  // exactly over it (circle sits at 462-665 x 81-283 in the 720 x 376 export).
  const socialArt = (
    <span className={styles.socialArt}>
      <img src="/social/new-employee-split-dark-preview.png" alt="" width="720" height="376" />
      <svg className={styles.avatar} viewBox="0 0 100 100" aria-hidden="true">
        <clipPath id="hero-avatar-clip"><circle cx="50" cy="50" r="50" /></clipPath>
        <g clipPath="url(#hero-avatar-clip)">
          <circle cx="50" cy="39" r="18" />
          <ellipse cx="50" cy="96" rx="35" ry="31" />
        </g>
      </svg>
    </span>
  );

  return (
    <section id="overview" data-hub-section className={styles.hero}>
      <div className={styles.intro}>
        <Heading as="h1" copyLink={false} className={styles.title}>
          Stay in the{" "}
          <span className={styles.groove} style={{ "--groove-fill": BACKGROUND_GRADIENT_CSS } as React.CSSProperties}>groove</span>
        </Heading>
        <p className={styles.subhead}>Your first stop for the resources, tools and know-how to do great work.</p>
      </div>

      <div ref={artworkRef} className={styles.artwork} data-spotlight={spotlight ? "" : undefined} onPointerEnter={keepSpotlight} onPointerLeave={leaveArtwork} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) clearSpotlight();
      }} onKeyDown={(event) => { if (event.key === "Escape") clearSpotlight(); }}>
      <div className={styles.worktable} style={{ "--s": scale } as CSSProperties}>
        <div className={styles.stage}>
          {/* Brand pieces sit on the inner orbit, everyday tools on the outer one. */}
          <svg className={styles.orbits} viewBox="0 0 1100 300" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="550" cy="150" rx="200" ry="72" />
            <ellipse className={styles.outerOrbit} cx="550" cy="150" rx="340" ry="124" />
          </svg>
          <svg className={styles.orbitsPhone} viewBox="0 0 400 340" preserveAspectRatio="none" aria-hidden="true">
            <ellipse cx="200" cy="170" rx="128" ry="62" />
            <ellipse className={styles.outerOrbit} cx="200" cy="170" rx="182" ry="136" />
          </svg>
          <a className={styles.swatches} href="#color" aria-label="Jump to color palette" onPointerEnter={clearSpotlight} onFocus={clearSpotlight} onClick={(event) => { event.preventDefault(); jumpTo("color"); }}>
            <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
          </a>
          <button {...artworkControl("logo")} className={styles.logoCard}>
            <img src={ARTWORK.logo.href} alt="" width="436" height="75" />
          </button>
          <button {...artworkControl("type")} className={styles.typePaper}>
            <span className={styles.specimenLabel}>Our typeface</span>
            <span className={styles.typeName}>Figtree</span>
            <span className={styles.typeRegular}>Made for</span>
            <span className={styles.typeSemibold}>everyday work.</span>
            <span className={styles.typeWeights}>Regular / Semibold / Bold</span>
          </button>
          {/* Reveal each tile from the unchanged 320 × 80 export in its own crop. */}
          {(["payment", "heart", "chart"] as const).map((anchor) => (
            <button {...artworkControl("icons", anchor)} key={anchor} className={`${styles.iconCutout} ${styles[`${anchor}Icon`]}`}>
              <img src={ARTWORK.icons.href} alt="" width="320" height="80" />
            </button>
          ))}
          {TOOLS.map((tool) => {
            const className = `${styles.appTile} ${styles[`${tool.id.replace("-", "")}Tile`]}`;
            const icon = <img src={`/platform-icons/${tool.id}.svg`} alt="" width="28" height="28" />;
            return isGuest
              ? <span key={tool.id} className={className} aria-hidden="true">{icon}</span>
              : <Link key={tool.id} to={tool.to} className={className} aria-label={tool.label} {...(tool.id === "linkedin" ? socialHover : tool.id === "zoom" ? linkHover("zoom") : { onPointerEnter: clearSpotlight, onFocus: clearSpotlight })}>{icon}</Link>;
          })}
          {isGuest
            ? <span className={styles.socialCard} aria-hidden="true">{socialArt}</span>
            : <Link ref={socialRef} to={DESIGN_CANVAS_PATH} className={styles.socialCard} aria-label="LinkedIn graphics" {...socialHover}>
                {socialArt}
              </Link>}
        </div>
      </div>
      {spotlight && (lit || linkPopup) && <div ref={pillRef} className={styles.assetPill} data-side={POPUP_SIDE[spotlight.anchor]} data-anchor={spotlight.anchor} data-single={spotlight.id === "icons" || linkPopup ? "" : undefined} onPointerEnter={keepSpotlight} style={pillPosition ?? { visibility: "hidden" }}>
        {linkPopup ? (
          <Link to={linkPopup.to}>{linkPopup.label} <ArrowRight size={12} /></Link>
        ) : spotlight.id === "icons" ? <>
          {/* Hero icons point to the Icons section on this page. */}
          <a href="#icons" onClick={(event) => { event.preventDefault(); clearSpotlight(); jumpTo("icons"); }}>Brand icons <ArrowRight size={12} /></a>
        </> : lit && <>
          <strong>{lit.title}</strong>
          {lit.href && <a href={lit.href} download aria-label={`${lit.label}: ${lit.title}`}><Download size={12} /> {lit.format}</a>}
        </>}
      </div>}
      </div>

      <section className={`dark ${styles.searchDock}`} aria-label="Search resources">
        <Heading as="h2" copyLink={false} className={styles.searchTitle}>Find what you need</Heading>
        <div className={styles.searchBox} data-hero-search><SearchBox hero /></div>
      </section>

      <HomeTasks className={styles.tasks} />

      <Dialog.Root open={selected !== null} onOpenChange={(open) => { if (!open) setSelected(null); }}>
        <Dialog.Portal>
          <Dialog.Overlay className={styles.dialogOverlay} />
          <Dialog.Content className={styles.dialogContent} aria-describedby={undefined} onCloseAutoFocus={(event) => {
            event.preventDefault();
            artworkTrigger.current?.focus({ preventScroll: true });
          }}>
            {selected && <>
              <Dialog.Title className={styles.assetTitle}>{ARTWORK[selected].title}</Dialog.Title>
              <p className={styles.assetDescription}>{ARTWORK[selected].detail}</p>
              <div className={styles.assetActions}>
                {ARTWORK[selected].href && <a href={ARTWORK[selected].href} download><Download size={14} /> {ARTWORK[selected].label}</a>}
                <button type="button" onClick={() => guidance(selected)}>View guidance <ArrowRight size={14} /></button>
              </div>
            </>}
            <Dialog.Close className={styles.dialogClose} aria-label="Close asset details"><X size={20} /></Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
