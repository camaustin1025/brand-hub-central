import { useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Download, X } from "lucide-react";
import { SearchBox, jumpTo } from "@/components/hub/HubShell";
import { Button } from "@/components/ui/button";
import styles from "./WorkingCanvasHero.module.css";

const ARTWORK = {
  logo: { title: "Ordergroove logo", detail: "The original wordmark for light backgrounds.", href: "/working-canvas/logo-light.svg", format: "SVG", label: "Download SVG", section: "logo-gradients" },
  gradient: { title: "Brand gradient", detail: "The original gradient artwork, ready to use.", href: "/working-canvas/gradient-accent-3.png", format: "PNG", label: "Download PNG", section: "logo-gradients" },
  type: { title: "Figtree", detail: "Our brand typeface. Regular weight shown in the download.", href: "/fonts/Figtree-Regular.ttf", format: "TTF", label: "Download font", section: "typography" },
  icons: { title: "Brand icons", detail: "Payment, heart, and chart icons in the original SVG export.", href: "/working-canvas/icon-examples.svg", format: "SVG", label: "Download SVG", section: "downloads" },
};
type ArtworkId = keyof typeof ARTWORK;
/** The lit specimen's box, relative to the artwork container. */
type Spotlight = { id: ArtworkId; left: number; top: number; width: number; height: number };

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), Math.max(min, max));

/** Selected Working Canvas composition, with details for the original source assets. */
export function WorkingCanvasHero() {
  const [spotlight, setSpotlight] = useState<Spotlight | null>(null);
  const [pillPosition, setPillPosition] = useState<{ left: number; top: number } | null>(null);
  const [selected, setSelected] = useState<ArtworkId | null>(null);
  const artworkTrigger = useRef<HTMLButtonElement | null>(null);
  const artworkRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLDivElement>(null);

  function light(id: ArtworkId, element: HTMLElement) {
    const artwork = artworkRef.current!.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    setSpotlight({ id, left: rect.left - artwork.left, top: rect.top - artwork.top, width: rect.width, height: rect.height });
  }

  // Sit the pill beside the lit specimen, toward the open side of the desk, inside the band.
  useLayoutEffect(() => {
    const artwork = artworkRef.current;
    const pill = pillRef.current;
    if (!spotlight || !artwork || !pill) return setPillPosition(null);
    const deskHeight = (artwork.firstElementChild as HTMLElement).offsetHeight;
    const toRight = spotlight.left + spotlight.width / 2 < artwork.offsetWidth * 0.6;
    const left = toRight
      ? Math.min(spotlight.left + spotlight.width + 12, artwork.offsetWidth - pill.offsetWidth - 8)
      : Math.max(spotlight.left - pill.offsetWidth - 12, 8);
    const top = clamp(spotlight.top + spotlight.height / 2 - pill.offsetHeight / 2, 8, deskHeight - pill.offsetHeight - 8);
    setPillPosition({ left, top });
  }, [spotlight]);

  function artworkControl(id: ArtworkId) {
    return {
      type: "button" as const,
      "aria-label": `View ${ARTWORK[id].title} details`,
      "aria-haspopup": "dialog" as const,
      "data-lit": spotlight?.id === id ? "" : undefined,
      onPointerEnter: (event: React.PointerEvent<HTMLButtonElement>) => {
        if (event.pointerType === "mouse") light(id, event.currentTarget);
      },
      onFocus: (event: React.FocusEvent<HTMLButtonElement>) => light(id, event.currentTarget),
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        artworkTrigger.current = event.currentTarget;
        setSpotlight(null);
        setSelected(id);
      },
    };
  }

  function guidance(id: ArtworkId) {
    setSelected(null);
    setSpotlight(null);
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

      <div ref={artworkRef} className={styles.artwork} data-spotlight={spotlight ? "" : undefined} onPointerLeave={() => setSpotlight(null)} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setSpotlight(null);
      }} onKeyDown={(event) => { if (event.key === "Escape") setSpotlight(null); }}>
      <div className={styles.worktable}>
        <img className={styles.photograph} src="/working-canvas/desk-photo.png" alt="" />
        <button {...artworkControl("logo")} className={styles.logoCard}>
          <img src="/working-canvas/logo-light.svg" alt="" width="436" height="75" />
        </button>
        <button {...artworkControl("gradient")} className={styles.gradient}>
          <img src="/working-canvas/gradient-accent-3.png" alt="" width="1920" height="1458" />
        </button>
        <button {...artworkControl("type")} className={styles.typePaper}>
          <span className={styles.specimenLabel}>Our typeface</span>
          <span className={styles.typeName}>Figtree</span>
          <span className={styles.typeRegular}>Made for</span>
          <span className={styles.typeSemibold}>everyday work.</span>
          <span className={styles.typeWeights}>Regular / Semibold / Bold</span>
        </button>
        {/* Reveal each tile from the unchanged 320 × 80 export in its own crop. */}
        {[styles.paymentIcon, styles.heartIcon, styles.chartIcon].map((position) => (
          <button {...artworkControl("icons")} key={position} className={`${styles.iconCutout} ${position}`}>
            <img src="/working-canvas/icon-examples.svg" alt="" width="320" height="80" />
          </button>
        ))}
      </div>
      {spotlight && lit && <div ref={pillRef} className={styles.assetPill} style={pillPosition ?? { visibility: "hidden" }}>
        <strong>{lit.title}</strong>
        <a href={lit.href} download aria-label={`${lit.label}: ${lit.title}`}><Download size={14} /> {lit.format}</a>
        <button type="button" onClick={() => guidance(spotlight.id)}>Guidance <ArrowRight size={14} /></button>
      </div>}
      </div>

      <section className={`dark ${styles.searchDock}`} aria-label="Search resources">
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
