import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Download, X } from "lucide-react";
import { SearchBox, jumpTo } from "@/components/hub/HubShell";
import { Button } from "@/components/ui/button";
import { BACKGROUND_GRADIENT, BACKGROUND_GRADIENT_CSS } from "@/data/tokens";
import styles from "./WorkingCanvasHero.module.css";

const ARTWORK = {
  logo: { title: "Ordergroove logo", detail: "The original wordmark for light backgrounds.", href: "/working-canvas/logo-light.svg", format: "SVG", label: "Download SVG", section: "logo-gradients" },
  gradient: { title: "Brand gradient", detail: "The Cyan to Lemon background gradient, ready to use.", href: BACKGROUND_GRADIENT.image, format: "PNG", label: "Download PNG", section: "logo-gradients" },
  type: { title: "Figtree", detail: "Our brand typeface. Regular weight shown in the download.", href: "/fonts/Figtree-Regular.ttf", format: "TTF", label: "Download font", section: "typography" },
  icons: { title: "Brand icons", detail: "Payment, heart, and chart icons in the original SVG export.", href: "/working-canvas/icon-examples.svg", format: "SVG", label: "Download SVG", section: "downloads" },
};
type ArtworkId = keyof typeof ARTWORK;
type ArtworkAnchor = "logo" | "gradient" | "type" | "payment" | "heart" | "chart";
type Spotlight = { id: ArtworkId; anchor: ArtworkAnchor; element: HTMLElement };
const POPUP_SIDE: Record<ArtworkAnchor, "above" | "below"> = {
  logo: "above", gradient: "below", type: "below", payment: "below", heart: "below", chart: "above",
};

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/** Selected Working Canvas composition, with details for the original source assets. */
export function WorkingCanvasHero() {
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const [pillPosition, setPillPosition] = useState<{ left: number; top: number } | null>(null);
  const [selected, setSelected] = useState<ArtworkId | null>(null);
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

  function light(id: ArtworkId, anchor: ArtworkAnchor, element: HTMLElement) {
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
      const desiredLeft = spotlight.anchor === "logo"
        ? target.right - canvas.left - pill.offsetWidth - 12
        : spotlight.anchor === "payment"
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

  const lit = spotlight ? ARTWORK[spotlight.id] : null;

  return (
    <section id="overview" data-hub-section className={styles.hero}>
      <div className={styles.intro}>
        <p className={styles.eyebrow}>Ordergroove resources</p>
        <h1 className={styles.title}>
          <span>Your starting point</span>{" "}<span>for everyday work</span>
        </h1>
        <p className={styles.subhead}>Find brand guidelines, useful tools, and employee resources to help you get things done.</p>
        <div className={styles.actions}>
          <Button className={styles.action} onClick={() => jumpTo("quick-reference")}>View quick reference</Button>
          <Button className={styles.action} onClick={() => jumpTo("downloads")}>Browse assets</Button>
        </div>
      </div>

      <div ref={artworkRef} className={styles.artwork} data-spotlight={spotlight ? "" : undefined} onPointerEnter={keepSpotlight} onPointerLeave={leaveArtwork} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) clearSpotlight();
      }} onKeyDown={(event) => { if (event.key === "Escape") clearSpotlight(); }}>
      <div className={styles.worktable}>
        <a className={styles.palette} href="#color" aria-label="Jump to color palette" onPointerEnter={clearSpotlight} onFocus={clearSpotlight} onClick={(event) => { event.preventDefault(); jumpTo("color"); }}>
          <i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" /><i aria-hidden="true" />
        </a>
        <button {...artworkControl("logo")} className={styles.logoCard}>
          <img src="/working-canvas/logo-light.svg" alt="" width="436" height="75" />
        </button>
        <button {...artworkControl("gradient")} className={styles.gradient} style={{ backgroundImage: BACKGROUND_GRADIENT_CSS }} />
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
            <img src="/working-canvas/icon-examples.svg" alt="" width="320" height="80" />
          </button>
        ))}
      </div>
      {spotlight && lit && <div ref={pillRef} className={styles.assetPill} data-side={POPUP_SIDE[spotlight.anchor]} data-anchor={spotlight.anchor} onPointerEnter={keepSpotlight} style={pillPosition ?? { visibility: "hidden" }}>
        <strong>{lit.title}</strong>
        <a href={lit.href} download aria-label={`${lit.label}: ${lit.title}`}><Download size={14} /> {lit.format}</a>
        <button type="button" onClick={() => guidance(spotlight.id)}>Guidance <ArrowRight size={14} /></button>
      </div>}
      </div>

      <section className={`dark ${styles.searchDock}`} style={{ backgroundImage: BACKGROUND_GRADIENT_CSS }} aria-label="Search resources">
        <h2 className={styles.searchTitle}>Find what you need</h2>
        <div className={styles.searchBox}><SearchBox hero /></div>
        <div className={styles.samples}>
          <button className="action-focus" onClick={() => jumpTo("color")}>Which green goes on white? <ArrowRight size={16} /></button>
          <Link className="action-focus" to="/voice">What words should I avoid? <ArrowRight size={16} /></Link>
          <button className="action-focus" onClick={() => jumpTo("downloads")}>Find the logo kit <ArrowRight size={16} /></button>
        </div>
      </section>
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
                <a href={ARTWORK[selected].href} download><Download size={14} /> {ARTWORK[selected].label}</a>
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
