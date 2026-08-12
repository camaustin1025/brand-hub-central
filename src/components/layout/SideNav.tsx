import { useEffect, useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { NAV, type NavItem, type NavMode } from "@/data/nav";
import { PAGE_SECTIONS } from "@/data/sections";
import { useActiveSection } from "@/hooks/use-active-section";
import { cn } from "@/lib/utils";

/**
 * The side nav — the hub's single navigation rail.
 *
 * It replaces two things at once: the flat three-link header bar, which only
 * ever marked three of the seven routes active (so four routes had no active
 * state anywhere on screen), and the right-hand OnThisPage contents rail, which
 * put a second nav on the four guideline routes and left a 792px reading column
 * boxed between them. Merging them gives the body 944px at 1280 and 1200px from
 * 1536 up, and leaves exactly one element on the page claiming to be "current".
 *
 * The surface is Midnight on purpose. It is the one place the chrome commits to
 * an accent surface, which is what lets nav accents render in the real #00FF85
 * instead of the AA-corrected #008040 the white header was stuck with. See the
 * departure note in DESIGN.md — this is chrome, never content.
 */

/** Route rows: current page in a set of pages. */
const CURRENT_PAGE = "page" as const;
/** Section rows: current position *within* the page — the value ARIA has for it. */
const CURRENT_SECTION = "location" as const;

/* -------------------------------------------------------------------------- */

/**
 * The headings of the active route, nested under it. This is all that is left
 * of OnThisPage: same left-rule language, same scroll-spy, one indent deeper.
 */
function SectionList({
  sections,
  onNavigate,
}: {
  sections: readonly { id: string; label: string }[];
  onNavigate?: () => void;
}) {
  const active = useActiveSection(sections);

  return (
    <ul className="mb-1 ml-[30px] mt-0.5 flex flex-col border-l border-white/15">
      {sections.map((s) => (
        <li key={s.id} className="flex">
          <a
            href={`#${s.id}`}
            onClick={onNavigate}
            aria-current={active === s.id ? CURRENT_SECTION : undefined}
            className={cn(
              "-ml-px flex min-h-9 flex-1 items-center border-l-2 py-1 pl-3.5 text-label transition-colors",
              active === s.id
                ? "border-primary font-semibold text-white"
                : "border-transparent text-white/64 hover:border-white/40 hover:text-white",
            )}
          >
            {s.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

/** One route, expanded: glyph plus label, with its headings when it is current. */
function NavRow({
  item,
  current,
  onNavigate,
}: {
  item: NavItem;
  current: boolean;
  onNavigate?: () => void;
}) {
  const sections = PAGE_SECTIONS[item.path];

  return (
    <li>
      <Link
        to={item.path}
        onClick={onNavigate}
        aria-current={current ? CURRENT_PAGE : undefined}
        className={cn(
          "flex min-h-11 items-center gap-3 px-3 text-body transition-colors",
          current
            ? "bg-white/8 font-semibold text-og-green"
            : "text-white/80 hover:bg-white/6 hover:text-white",
        )}
      >
        <MaterialSymbol name={item.icon} size={20} className="shrink-0" />
        <span className="min-w-0 flex-1">{item.label}</span>
      </Link>
      {current && sections && <SectionList sections={sections} onNavigate={onNavigate} />}
    </li>
  );
}

/** One route, collapsed: the glyph is the only identifier, so it gets a tooltip. */
function RailRow({ item, current }: { item: NavItem; current: boolean }) {
  return (
    <li>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            to={item.path}
            aria-current={current ? CURRENT_PAGE : undefined}
            className={cn(
              "flex min-h-11 items-center justify-center border-l-2 transition-colors",
              current
                ? "border-primary bg-white/8 text-og-green"
                : "border-transparent text-white/70 hover:bg-white/6 hover:text-white",
            )}
          >
            <MaterialSymbol name={item.icon} size={22} label={item.label} />
          </Link>
        </TooltipTrigger>
        <TooltipContent side="right">{item.label}</TooltipContent>
      </Tooltip>
    </li>
  );
}

/**
 * A mode group. Expanded it is a Collapsible — plural, not an Accordion: with
 * seven routes total, seeing all three modes at once *is* the feature, so
 * forcing one-open would hide most of the map to save 90px.
 */
function NavGroup({
  group,
  pathname,
  onNavigate,
}: {
  group: NavMode;
  pathname: string;
  onNavigate?: () => void;
}) {
  const [open, setOpen] = useState(true);

  // A one-item group gets no header. "Assets" over a lone "Downloads" is the
  // same word twice — the header adds a level of hierarchy that carries no
  // information, and its disclosure would exist to hide a single row. The
  // `gap-3` between groups still reads the boundary; the label survives on the
  // footer and on the collapsed rail's `aria-label`, where it does real work.
  if (group.items.length === 1) {
    return (
      <ul className="flex flex-col">
        {group.items.map((item) => (
          <NavRow
            key={item.path}
            item={item}
            current={pathname === item.path}
            onNavigate={onNavigate}
          />
        ))}
      </ul>
    );
  }

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 px-3 text-eyebrow font-bold uppercase text-primary transition-colors hover:text-white">
        {group.label}
        <MaterialSymbol
          name="expand_more"
          size={18}
          className={cn("transition-transform", !open && "-rotate-90")}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ul className="flex flex-col">
          {group.items.map((item) => (
            <NavRow
              key={item.path}
              item={item}
              current={pathname === item.path}
              onNavigate={onNavigate}
            />
          ))}
        </ul>
      </CollapsibleContent>
    </Collapsible>
  );
}

/** The nav itself, shared verbatim by the desktop rail and the mobile drawer. */
function NavTree({ collapsed, onNavigate }: { collapsed?: boolean; onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  if (collapsed) {
    // No group headers and no section list: at 64px there is nothing to set
    // them in, and a truncated mode label reads as damage. Groups keep their
    // boundary as a hairline, which is all the collapsed rail needs to carry.
    return (
      <nav aria-label="Site" className="flex flex-col gap-1 py-3">
        {NAV.map((group, i) => (
          <ul
            key={group.mode}
            aria-label={group.label}
            className={cn("flex flex-col", i > 0 && "mt-1 border-t border-white/12 pt-1")}
          >
            {group.items.map((item) => (
              <RailRow key={item.path} item={item} current={pathname === item.path} />
            ))}
          </ul>
        ))}
      </nav>
    );
  }

  return (
    <nav aria-label="Site" className="flex flex-col gap-3 py-4">
      {NAV.map((group) => (
        <NavGroup key={group.mode} group={group} pathname={pathname} onNavigate={onNavigate} />
      ))}
    </nav>
  );
}


/**
 * The persistent rail, md and up.
 *
 * It used to appear only at xl, on the argument that a 256px rail costs more
 * content than it buys below 1280. That argument was measuring the wrong thing.
 * Between 768 and 1280 the page had no visible navigation at all — a borderless
 * hamburger on a white bar, next to a *bordered* search button, so the one
 * control that opened the site's map read as less interactive than the one
 * beside it. A nav you cannot see is not a nav, and retrieval wins ties.
 *
 * So the rail is always there from md up; below xl it is always the 64px icon
 * form. 64px is a price worth paying where 256px was not, and the glyph column
 * answers "is there navigation here" on its own.
 *
 * Pointing at it (or tabbing into it) opens the full panel *over* the content
 * rather than pushing it, so the labels are one gesture away and nothing
 * reflows. The reserved track never changes width — only the panel floating in
 * it does.
 */
export function SideRail() {
  // `pinned` is the resting state: forced below xl, the stored preference above
  // it. `hovered` opens the panel on top without touching the reserved track.
  const [narrow, setNarrow] = useState(false);
  const [userCollapsed, setUserCollapsed] = useState(false);
  const [hovered, setHovered] = useState(false);

  const pinned = narrow || userCollapsed;
  const collapsed = pinned && !hovered;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 80rem)");
    const sync = () => setNarrow(!mq.matches);
    sync();
    try {
      setUserCollapsed(localStorage.getItem("og-sidenav") === "icon");
    } catch {
      // Blocked storage: the rail still works, it just forgets the preference.
    }
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Only the resting state drives the CSS var, never the hover — the track has
  // to stay put or the whole page would reflow under the pointer.
  useEffect(() => {
    if (pinned) document.documentElement.dataset.sidenav = "icon";
    else delete document.documentElement.dataset.sidenav;
  }, [pinned]);

  function toggle() {
    const next = !userCollapsed;
    setUserCollapsed(next);
    try {
      localStorage.setItem("og-sidenav", next ? "icon" : "full");
    } catch {
      // See above.
    }
  }

  return (
    <TooltipProvider delayDuration={400}>
      <aside
        // The aside reserves the track; the panel inside it is what grows.
        className="sticky top-[var(--stick)] hidden h-[calc(100dvh-var(--stick))] w-[var(--sidenav)] shrink-0 md:block"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocusCapture={() => setHovered(true)}
        onBlurCapture={(e) => {
          if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHovered(false);
        }}
      >
        <div
          className={cn(
            "dark absolute inset-y-0 left-0 z-50 flex flex-col border-r border-white/12 bg-og-midnight transition-[width] duration-200",
            collapsed ? "w-[var(--sidenav-icon)]" : "w-[var(--sidenav-full)]",
          )}
        >
          {/* Only the tree scrolls. Scrolling the whole panel pushed the
              collapse control off the bottom on a short viewport, which is the
              one control that has to stay reachable — it is how you get the
              width back. */}
          <div className="min-h-0 flex-1 overflow-y-auto">
            <NavTree collapsed={collapsed} />
          </div>
          <div className="shrink-0 border-t border-white/12">
            {/* Hidden below xl: there the icon form is forced by width, so a
                control claiming to toggle it would be lying. */}
            {!narrow && (
              <button
                type="button"
                onClick={toggle}
                aria-expanded={!userCollapsed}
                aria-label={userCollapsed ? "Pin navigation open" : "Collapse navigation to icons"}
                className={cn(
                  "flex min-h-11 w-full cursor-pointer items-center gap-3 border-t border-white/12 px-3 text-eyebrow font-bold uppercase text-white/70 transition-colors hover:bg-white/6 hover:text-white",
                  collapsed && "justify-center px-0",
                )}
              >
                <MaterialSymbol
                  name={userCollapsed ? "right_panel_open" : "left_panel_close"}
                  size={20}
                />
                {!collapsed && (userCollapsed ? "Pin open" : "Collapse")}
              </button>
            )}
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}

/**
 * The same nav in a drawer, below xl. One component, two containers — the old
 * header kept a second hand-written copy of the grouped nav for mobile, which
 * is how the desktop bar drifted to three links while the drawer showed seven.
 */
export function NavDrawer() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      {/* SheetTrigger, not a bare button with onClick: Radix returns focus to
          its trigger on close, so escaping the drawer puts the caret back on
          the hamburger instead of dropping it on <body>.

          Bordered, like the search button beside it. Bare, it was the only
          chromeless glyph on the bar — the control that opens the entire site
          map reading as less interactive than the one next to it. And md, not
          xl: from 768 up the rail itself is visible, so the drawer is only for
          widths that genuinely have no room for one. */}
      <SheetTrigger
        aria-label="Open navigation"
        className="flex size-11 cursor-pointer items-center justify-center border border-border text-og-midnight transition-colors hover:border-og-midnight md:hidden"
      >
        <MaterialSymbol name="menu" size={22} />
      </SheetTrigger>
      {/* Opens below the masthead, on the same `--stick` offset the desktop
          rail uses. The header is z-[60] and the sheet is z-50, so sitting it
          under the chrome is both the honest z-order and the better behaviour:
          the lockup and search stay live while the drawer is open, and the
          hamburger you opened it with stays where you left it. */}
      <SheetContent
        side="left"
        // `text-white` is load-bearing: Sheet's own close button sets no colour
        // and would otherwise inherit Midnight ink onto a Midnight panel.
        className="dark top-[var(--stick)] h-[calc(100dvh-var(--stick))] w-[18rem] border-white/12 bg-og-midnight p-0 text-white"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Navigation</SheetTitle>
          <SheetDescription>Guidelines, assets, and toolkit pages.</SheetDescription>
        </SheetHeader>
        <div className="flex h-full flex-col">
          {/* pt-6 clears Sheet's absolutely-positioned close button, which sits
              at top-4/right-4 and otherwise lands on the first group's chevron. */}
          <div className="min-h-0 flex-1 overflow-y-auto pt-6">
            <NavTree onNavigate={() => setOpen(false)} />
          </div>
          <div className="shrink-0 border-t border-white/12">
            <StatusFoot />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
