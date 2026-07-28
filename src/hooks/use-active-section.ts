import { useEffect, useState } from "react";
import type { PageSection } from "@/data/sections";

/**
 * Marks the heading nearest the top of the readable area. The bottom rootMargin
 * keeps only the upper band of the viewport eligible, so the last short section
 * on a page still wins once it scrolls into that band.
 *
 * Lifted out of the old OnThisPage rail unchanged when that rail merged into
 * the side nav. It observes elements by id, so the caller does not need to be
 * anywhere near them in the tree — which is the whole reason the nav can now
 * scroll-spy a page it renders above.
 */
export function useActiveSection(sections: readonly PageSection[]) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

    setActive(sections[0]?.id ?? null);

    const seen = new Map<string, boolean>();
    const observer = new IntersectionObserver(
      (entries) => {
        for (const e of entries) seen.set(e.target.id, e.isIntersecting);
        const first = sections.find((s) => seen.get(s.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "-120px 0px -55% 0px" },
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, [sections]);

  return active;
}
