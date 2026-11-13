import { useEffect, useRef, useState, type ReactNode } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import styles from "./DownloadLink.module.css";

/** The download glyph with its arrow split from the tray, so the arrow can move on its own. */
function DownloadGlyph() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <g className={styles.arrow}>
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" x2="12" y1="15" y2="3" />
      </g>
    </svg>
  );
}

/**
 * A file download shown as a link, not a button: the format name with a download
 * arrow, and the green marker on hover. Use it wherever a file sits next to its
 * preview (asset tiles, gradient details); keep buttons for page actions.
 */
export function DownloadLink({ href, filename, label, children, className }: {
  href: string;
  /** Saved file name. Needed for generated (blob) files, which have no name of their own. */
  filename?: string;
  /** Accessible name, e.g. "Download Logo for dark backgrounds (PNG)". */
  label: string;
  children: ReactNode;
  className?: string;
}) {
  const [saved, setSaved] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout>>();
  useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <a href={href} download={filename ?? true} aria-label={label} data-download
      onClick={() => {
        setSaved(true);
        clearTimeout(timer.current);
        timer.current = setTimeout(() => setSaved(false), 1600);
      }}
      className={cn(styles.link, saved && styles.saved, className)}>
      <span className={styles.icon}>{saved ? <Check size={14} strokeWidth={2.5} aria-hidden="true" /> : <DownloadGlyph />}</span>
      <span>{children}</span>
    </a>
  );
}
