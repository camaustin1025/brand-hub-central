import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowDown, ArrowRight, Check, ChevronRight, Clock, Link2 } from "lucide-react";
import { WipTag } from "@/components/brand/WorkInProgress";
import { useCopyText } from "@/hooks/use-copy-text";
import { cn } from "@/lib/utils";

export type Crumb = { label: string; to?: string };

/**
 * Midnight hero that anchors a chapter page: where you are (breadcrumb), when it last
 * changed, the title, what the page is for, and the page's main actions.
 * Optional children sit at the hero's foot (Foundation puts its lead line there).
 *
 * Layout keys off the hero's own width (container queries), not the viewport, because the
 * hub sidebar takes 284px from lg up. ChapterPage renders it for every chapter page.
 */
export function ChapterHero({
  crumbs,
  title,
  intro,
  updated,
  wip,
  actions,
  children,
}: {
  crumbs: Crumb[];
  title: string;
  intro?: string;
  /** ISO date (YYYY-MM-DD) this page's content last changed. */
  updated?: string;
  /** Shows the work-in-progress line; pass isWipSection(<nav id>) so it follows the nav flag. */
  wip?: boolean;
  actions?: ReactNode;
  children?: ReactNode;
}) {
  const date = updated ? new Date(`${updated}T12:00:00`) : null;
  return (
    <header className="dark bg-og-midnight px-6 pb-10 pt-8 text-white [container-type:inline-size] md:px-10 md:pb-12">
      <div className="mx-auto max-w-[1060px]">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
          <nav aria-label="Breadcrumb">
            <ol className="flex flex-wrap items-center gap-1.5">
              {crumbs.map((crumb, index) => {
                const last = index === crumbs.length - 1;
                return (
                  <li key={crumb.label} className="flex items-center gap-1.5">
                    {crumb.to && !last ? (
                      <Link
                        to={crumb.to}
                        className="rounded-sm font-semibold text-white underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
                      >
                        {crumb.label}
                      </Link>
                    ) : (
                      <span aria-current={last ? "page" : undefined} className={cn("font-semibold", last ? "text-og-green" : "text-white")}>
                        {crumb.label}
                      </span>
                    )}
                    {!last && <ChevronRight size={14} aria-hidden="true" className="text-white" />}
                  </li>
                );
              })}
            </ol>
          </nav>
          {date && (
            <p className="inline-flex items-center gap-1.5 text-white">
              <Clock size={14} aria-hidden="true" />
              Updated{" "}
              <time dateTime={updated}>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time>
            </p>
          )}
        </div>

        {/* The light page's WIP banner is Midnight, so inside the hero the same notice runs as a line. */}
        {wip && (
          <p className="mt-6 flex items-start gap-3 text-sm leading-5 text-white">
            <WipTag className="mt-px px-2 py-1 text-[11px]" />
            <span><strong className="font-bold text-white">Work in progress.</strong> This guidance is still being finalized and may change.</span>
          </p>
        )}

        <div className="mt-10 flex flex-col gap-6 md:mt-12 [@container(min-width:56rem)]:flex-row [@container(min-width:56rem)]:items-end [@container(min-width:56rem)]:justify-between">
          <div>
            <h1 className="text-[40px] font-extrabold leading-[1.02] tracking-[-0.03em] text-white [@container(min-width:40rem)]:text-[56px]">{title}</h1>
            {intro && <p className="measure mt-4 text-lg leading-[1.6] text-white">{intro}</p>}
          </div>
          {actions && <div className="flex flex-wrap gap-3 [@container(min-width:56rem)]:shrink-0">{actions}</div>}
        </div>

        {children && <div className="mt-8 md:mt-10">{children}</div>}
      </div>
    </header>
  );
}

export const PRIMARY_ACTION =
  "inline-flex min-h-11 items-center gap-2 rounded-md bg-og-green px-4 text-sm font-bold text-og-midnight transition-colors hover:bg-[#33FF9D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-og-midnight";

/**
 * Primary hero action: the one thing most visitors came for. `href` jumps within the page
 * (arrow down); `to` goes to another hub page (arrow right).
 */
export function HeroAction({ href, to, children }: { href?: string; to?: string; children: ReactNode }) {
  if (to) {
    return (
      <Link to={to} className={PRIMARY_ACTION}>
        {children} <ArrowRight size={16} aria-hidden="true" />
      </Link>
    );
  }
  return (
    <a href={href} className={PRIMARY_ACTION}>
      {children} <ArrowDown size={16} aria-hidden="true" />
    </a>
  );
}

/** Secondary hero action: copies this page's address, with a visible and announced confirmation. */
export function CopyPageLinkButton() {
  const { copy, copied, error } = useCopyText(typeof window === "undefined" ? "" : window.location.href.split("#")[0]);
  return (
    <>
      <button
        type="button"
        onClick={copy}
        className="inline-flex min-h-11 items-center gap-2 rounded-md border border-white/30 px-4 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-og-midnight"
      >
        {copied ? <Check size={16} aria-hidden="true" /> : <Link2 size={16} aria-hidden="true" />}
        {/* Short label so both hero actions share one row on a phone. */}
        {copied ? "Link copied" : "Copy link"}
      </button>
      <span role="status" className="sr-only">
        {error ? "Copy unavailable. Copy the address from the browser bar." : copied ? "Page link copied" : ""}
      </span>
    </>
  );
}
