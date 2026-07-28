import { useEffect, useState } from "react";
import { Kicker } from "@/components/brand/Kicker";
import { cn } from "@/lib/utils";

export type PageSection = { id: string; label: string };

/**
 * The contents rail for a reference page.
 *
 * Every guideline route used to set its body to `md:col-span-8` and leave
 * columns 9–12 permanently empty — a third of the viewport doing nothing on
 * the pages people scan hardest. The rail gives that column the job the
 * content already implies: these are Read-mode pages that get opened mid-task
 * to find one rule, so the fastest structure is a persistent map of the
 * headings with the current one marked.
 *
 * It sticks below the header chrome (`--stick`) and collapses out entirely
 * below `md`, where the single-column body is already its own outline.
 */
export function OnThisPage({
  sections,
  className,
}: {
  sections: readonly PageSection[];
  className?: string;
}) {
  const active = useActiveSection(sections);

  return (
    <nav
      aria-label="On this page"
      className={cn("col-span-12 hidden md:col-span-4 md:block", className)}
    >
      <div className="sticky top-[calc(var(--stick)+var(--step-block))]">
        <Kicker as="h2">On this page</Kicker>
        <ul className="mt-4 flex flex-col border-l border-og-border">
          {sections.map((s) => (
            <li key={s.id} className="flex">
              <a
                href={`#${s.id}`}
                aria-current={active === s.id ? "true" : undefined}
                className={cn(
                  "-ml-px flex min-h-11 flex-1 items-center border-l-2 py-1 pl-4 text-[14px] leading-snug transition-colors",
                  active === s.id
                    ? "border-primary font-semibold text-og-midnight"
                    : "border-transparent text-og-soft hover:border-og-border hover:text-og-midnight",
                )}
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

/**
 * Marks the heading nearest the top of the readable area. The bottom rootMargin
 * keeps only the upper band of the viewport eligible, so the last short section
 * on a page still wins once it scrolls into that band.
 */
function useActiveSection(sections: readonly PageSection[]) {
  const [active, setActive] = useState<string | null>(sections[0]?.id ?? null);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => n !== null);
    if (nodes.length === 0) return;

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
