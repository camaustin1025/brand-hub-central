import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, Download, X } from "lucide-react";
import { SearchBox, jumpTo } from "@/components/hub/HubShell";
import { Button } from "@/components/ui/button";
import styles from "./WorkingCanvasHero.module.css";

const ARTWORK = {
  logo: { title: "Ordergroove logo", detail: "The original wordmark for light backgrounds.", href: "/working-canvas/logo-light.svg", label: "Download SVG", section: "logo-gradients" },
  gradient: { title: "Brand gradient", detail: "The original gradient artwork, ready to use.", href: "/working-canvas/gradient-accent-3.png", label: "Download PNG", section: "logo-gradients" },
  type: { title: "Figtree", detail: "Our brand typeface. Regular weight shown in the download.", href: "/fonts/Figtree-Regular.ttf", label: "Download font", section: "typography" },
  icons: { title: "Brand icons", detail: "Payment, heart, and chart icons in the original SVG export.", href: "/working-canvas/icon-examples.svg", label: "Download SVG", section: "downloads" },
};
type ArtworkId = keyof typeof ARTWORK;

/** Selected Working Canvas composition, with details for the original source assets. */
export function WorkingCanvasHero() {
  const [hovered, setHovered] = useState<ArtworkId | null>(null);
  const [selected, setSelected] = useState<ArtworkId | null>(null);
  const artworkTrigger = useRef<HTMLButtonElement | null>(null);

  function artworkControl(id: ArtworkId) {
    return {
      type: "button" as const,
      "aria-label": `View ${ARTWORK[id].title} details`,
      "aria-haspopup": "dialog" as const,
      onPointerEnter: (event: React.PointerEvent) => {
        if (event.pointerType === "mouse") setHovered(id);
      },
      onFocus: () => setHovered(id),
      onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
        artworkTrigger.current = event.currentTarget;
        setHovered(null);
        setSelected(id);
      },
    };
  }

  function details(id: ArtworkId) {
    const asset = ARTWORK[id];
    return <>
      <p className={styles.assetDescription}>{asset.detail}</p>
      <div className={styles.assetActions}>
        <a href={asset.href} download><Download size={14} /> {asset.label}</a>
        <button type="button" onClick={() => { setSelected(null); setHovered(null); jumpTo(asset.section); }}>View guidance <ArrowRight size={14} /></button>
      </div>
    </>;
  }

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

      <div className={styles.artwork} onPointerLeave={() => setHovered(null)} onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setHovered(null);
      }} onKeyDown={(event) => { if (event.key === "Escape") setHovered(null); }}>
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
      {hovered && <div className={styles.assetPopover} data-artwork={hovered}>
        <p className={styles.assetTitle}>{ARTWORK[hovered].title}</p>
        {details(hovered)}
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
              {details(selected)}
            </>}
            <Dialog.Close className={styles.dialogClose} aria-label="Close asset details"><X size={20} /></Dialog.Close>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </section>
  );
}
