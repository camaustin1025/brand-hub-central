import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/** Reset scroll to top on route change. */
export function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) {
      window.scrollTo(0, 0);
      return;
    }
    // Wait for content headings to register their anchors and route effects to settle.
    const timer = window.setTimeout(() => {
      let id: string;
      try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
      document.getElementById(id)?.scrollIntoView({ block: "start", behavior: "instant" });
    }, 0);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);
  return null;
}
