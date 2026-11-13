import { useEffect, type ReactNode } from "react";
import { ChapterHero, type Crumb } from "@/components/layout/ChapterHero";
import { HUB_NAV } from "@/data/hub";
import { cn } from "@/lib/utils";

/**
 * Brand hub › sidebar group › page, built from the sidebar's own labels so the trail
 * always matches the nav. A group that only holds itself (Design canvas) collapses.
 */
function trailFor(navId: string | undefined, title: string): Crumb[] {
  const group = navId ? HUB_NAV.find((entry) => entry.items.some((item) => item.id === navId)) : undefined;
  const item = group?.items.find((entry) => entry.id === navId);
  const crumbs: Crumb[] = [{ label: "Brand hub", to: "/" }];
  if (group && item && group.label !== item.label) crumbs.push({ label: group.label });
  crumbs.push({ label: item?.label ?? title });
  return crumbs;
}

/**
 * Page frame for a standalone brand chapter: a Midnight ChapterHero (breadcrumb, updated
 * date, title, intro, actions), then the content on the hub's 1060px column. The site footer names the owner.
 */
export function ChapterPage({
  navId,
  compactHeader = true,
  title,
  intro,
  wip,
  updated,
  primaryAction,
  heroFooter,
  width = "wide",
  children,
}: {
  /** The page's sidebar id; drives the breadcrumb. */
  navId?: string;
  compactHeader?: boolean;
  title: string;
  intro?: string;
  /** Pass isWipSection(<nav id>) so the notice follows the nav flag. */
  wip?: boolean;
  /** ISO date (YYYY-MM-DD) this page's content last changed. */
  updated?: string;
  /** One HeroAction for the thing most visitors came for. Copy link is always present. */
  primaryAction?: ReactNode;
  /** Optional block at the foot of the hero. */
  heroFooter?: ReactNode;
  /** "wide" (1060px) for galleries and tables. "reading" (57rem, 912px) for text-led
   *  chapters whose modules are sized to the reading measure. Both share the same left edge. */
  width?: "wide" | "reading";
  children: ReactNode;
}) {
  // Each chapter gets its own browser tab title, so tabs, history, and screen readers can tell pages apart.
  useEffect(() => {
    const previous = document.title;
    document.title = `${title} · Ordergroove Brand Hub`;
    return () => {
      document.title = previous;
    };
  }, [title]);

  return (
    <>
      <ChapterHero
        compact={compactHeader}
        crumbs={trailFor(navId, title)}
        title={title}
        intro={intro}
        updated={updated}
        wip={wip}
        actions={primaryAction}
      >
        {heroFooter}
      </ChapterHero>
      <div className="px-6 pb-16 pt-12 md:px-10 md:pb-20 md:pt-14">
        <div className={cn("mx-auto max-w-[1060px]", width === "reading" && "[&>*]:max-w-[57rem]")}>{children}</div>
      </div>
    </>
  );
}
