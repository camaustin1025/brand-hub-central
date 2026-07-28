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
              "-ml-px flex min-h-9 flex-1 items-center border-l-2 py-1 pl-3.5 text-[14px] leading-snug transition-colors",
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
          "flex min-h-11 items-center gap-3 px-3 text-[15px] leading-snug transition-colors",
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

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 px-3 text-xs font-bold uppercase tracking-[0.16em] text-primary transition-colors hover:text-white">
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
 * The status line the sticky strip under the header used to carry. It cost
 * 36px of sticky chrome on every scroll of every page to say one static
 * sentence; down here it says the same thing for free.
 */
function StatusFoot({ collapsed }: { collapsed?: boolean }) {
  if (collapsed) {
    return (
      <div className="flex justify-center py-3" title="Live and building">
        <span aria-hidden className="size-2 rounded-full bg-og-green" />
        <span className="sr-only">Live and building. Some sections are still in draft.</span>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1.5 px-3 py-4">
      <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-primary">
        <MaterialSymbol name="bolt" size={15} />
        Sys.status
      </span>
      <span className="text-[14px] leading-snug text-white/72">
        Live and building. Some sections are still in draft.
      </span>
    </div>
  );
}

/* -------------------------------------------------------------------------- */

/**
 * The persistent rail, xl and up.
 *
 * Below 1280 it is off-canvas rather than persistent, and that breakpoint is a
 * measurement, not a taste: at 1024 a 256px rail leaves 688px of content, which
 * is *less* than the 792px body the two-rail layout gave. It only starts paying
 * for itself once there is width to spare.
 */
export function SideRail() {
  const [collapsed, setCollapsed] = useState(false);

  // The width is already correct before first paint — RootShell's inline script
  // stamps data-sidenav from localStorage. This only syncs React's copy of it,
  // so the toggle button renders the right affordance.
  useEffect(() => {
    setCollapsed(document.documentElement.dataset.sidenav === "icon");
  }, []);

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    if (next) document.documentElement.dataset.sidenav = "icon";
    else delete document.documentElement.dataset.sidenav;
    try {
      localStorage.setItem("og-sidenav", next ? "icon" : "full");
    } catch {
      // Private mode or blocked storage: the rail still toggles, it just
      // forgets. Not worth failing navigation over.
    }
  }

  return (
    <TooltipProvider delayDuration={200}>
      <aside className="dark sticky top-[var(--stick)] hidden h-[calc(100dvh-var(--stick))] w-[var(--sidenav)] shrink-0 flex-col border-r border-white/12 bg-og-midnight transition-[width] duration-200 xl:flex">
        {/* Only the tree scrolls. Scrolling the whole aside pushed the collapse
            control off the bottom on a short viewport, which is the one control
            that has to stay reachable — it is how you get the width back. */}
        <div className="min-h-0 flex-1 overflow-y-auto">
          <NavTree collapsed={collapsed} />
        </div>
        <div className="shrink-0 border-t border-white/12">
          <StatusFoot collapsed={collapsed} />
          <button
            type="button"
            onClick={toggle}
            aria-expanded={!collapsed}
            aria-label={collapsed ? "Expand navigation" : "Collapse navigation to icons"}
            className={cn(
              "flex min-h-11 w-full cursor-pointer items-center gap-3 border-t border-white/12 px-3 text-xs font-bold uppercase tracking-[0.16em] text-white/70 transition-colors hover:bg-white/6 hover:text-white",
              collapsed && "justify-center px-0",
            )}
          >
            <MaterialSymbol name={collapsed ? "right_panel_open" : "left_panel_close"} size={20} />
            {!collapsed && "Collapse"}
          </button>
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
          the hamburger instead of dropping it on <body>. */}
      <SheetTrigger
        aria-label="Open navigation"
        className="flex size-11 cursor-pointer items-center justify-center text-og-midnight transition-colors hover:bg-secondary xl:hidden"
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
