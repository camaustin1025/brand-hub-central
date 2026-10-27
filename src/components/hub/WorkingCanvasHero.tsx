import { Link } from "react-router-dom";
import { SearchBox, jumpTo } from "@/components/hub/HubShell";
import { Button } from "@/components/ui/button";
import styles from "./WorkingCanvasHero.module.css";

/** Selected Working Canvas composition. Artwork is decorative; controls reuse the hub. */
export function WorkingCanvasHero() {
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

      <div className={styles.worktable} aria-hidden="true">
        <img className={styles.photograph} src="/working-canvas/desk-photo.png" alt="" />
        <div className={styles.logoCard}>
          <img src="/working-canvas/logo-light.svg" alt="" width="436" height="75" />
        </div>
        <div className={styles.gradient}>
          <img src="/working-canvas/gradient-accent-3.png" alt="" width="1920" height="1458" />
        </div>
        <div className={styles.typePaper}>
          <span className={styles.specimenLabel}>Our typeface</span>
          <span className={styles.typeName}>Figtree</span>
          <span className={styles.typeRegular}>Made for</span>
          <span className={styles.typeSemibold}>everyday work.</span>
          <span className={styles.typeWeights}>Regular / Semibold / Bold</span>
        </div>
        {/* Reveal each tile from the unchanged 320 × 80 export in its own crop. */}
        {[styles.paymentIcon, styles.heartIcon, styles.chartIcon].map((position) => (
          <span key={position} className={`${styles.iconCutout} ${position}`}>
            <img src="/working-canvas/icon-examples.svg" alt="" width="320" height="80" />
          </span>
        ))}
      </div>

      <section className={`dark ${styles.searchDock}`} aria-label="Search resources">
        <div className={styles.searchBox}><SearchBox hero /></div>
        <div className={styles.samples}>
          <button className="action-focus" onClick={() => jumpTo("color")}>Which green goes on white?</button>
          <Link className="action-focus" to="/voice">What words should I avoid?</Link>
          <button className="action-focus" onClick={() => jumpTo("downloads")}>Find the logo kit</button>
        </div>
      </section>
    </section>
  );
}
