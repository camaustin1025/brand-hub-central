import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { HUB_NAV, isGuestPath } from "@/data/hub";
import { SearchBox } from "./HubSearch";
import { jumpTo } from "@/lib/hub-navigation";
import { WipTag } from "@/components/brand/WorkInProgress";
import { cn } from "@/lib/utils";
import { useAccess } from "@/hooks/use-access";

export { SearchBox } from "./HubSearch";
export { jumpTo } from "@/lib/hub-navigation";

const NAV_ITEM_CLASS = "relative flex min-h-9 items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight [@media(pointer:coarse)]:min-h-11";
const NAV_ITEM_ACTIVE =
  "bg-white font-semibold text-og-midnight shadow-sm ring-1 ring-og-midnight/5 before:absolute before:-left-[11px] before:top-1/2 before:h-6 before:w-0.5 before:-translate-y-1/2 before:bg-og-green-light";
const NAV_ITEM_IDLE = "text-og-midnight hover:bg-og-midnight/[0.06]";

/* Group headers are disclosure buttons: 11px caps in Midnight with a chevron, set apart from the
   14px links below them by weight, case and a hairline above each group (not by a tinted block). */
const NAV_GROUP_BUTTON =
  "group/header flex min-h-9 w-full items-center justify-between gap-2 rounded-lg px-3 py-2 text-left text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-og-midnight transition-colors hover:bg-og-midnight/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight [@media(pointer:coarse)]:min-h-11";
const NAV_TITLE_LINK =
  "flex min-h-9 items-center rounded-lg px-3 py-2 text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-og-midnight transition-colors hover:bg-og-midnight/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight [@media(pointer:coarse)]:min-h-11";

/** Groups a reader folded away, remembered per browser. Storage can be missing (private windows), so every access is guarded. */
const COLLAPSED_KEY = "hub-nav-collapsed";
function readCollapsed(): string[] {
  try {
    const value = JSON.parse(window.localStorage.getItem(COLLAPSED_KEY) ?? "[]");
    return Array.isArray(value) ? value.filter((entry): entry is string => typeof entry === "string") : [];
  } catch {
    return [];
  }
}
function writeCollapsed(labels: string[]) {
  try {
    window.localStorage.setItem(COLLAPSED_KEY, JSON.stringify(labels));
  } catch {
    // Storage blocked: the rail still works, it just won't remember folded groups.
  }
}

/** Every control a keyboard user can reach in the rail, in order, skipping folded groups. */
function railControls(nav: HTMLElement) {
  return [...nav.querySelectorAll<HTMLElement>("a[href], button:not([disabled])")].filter((element) => element.getClientRects().length > 0);
}

export function Sidebar({
  activeId,
  open,
  onClose,
}: {
  activeId: string;
  open: boolean;
  onClose: () => void;
}) {
  const navigate = useNavigate();
  const navRef = useRef<HTMLElement>(null);
  const asideRef = useRef<HTMLElement>(null);
  // External internal sites (Product Hub) are staff-only; guests can't sign in to them.
  const isGuest = useAccess() === "guest";
  // Guests only see the sections that live on Home. Disabled and hidden (WIP) items never show.
  const nav = isGuest
    ? HUB_NAV.map((group) => ({ ...group, items: group.linkTitle ? [] : group.items.filter((item) => !item.disabled && !item.hiddenInNav && isGuestPath(item.path)) })).filter((group) => group.items.length > 0)
    : HUB_NAV.map((group) => ({ ...group, items: group.items.filter((item) => !item.hiddenInNav) })).filter((group) => group.items.length > 0);
  const activeGroup = nav.find((group) => group.items.some((item) => item.id === activeId))?.label;
  // The group you are in always opens, so the active page is never folded out of sight.
  const [collapsed, setCollapsed] = useState<string[]>(() => readCollapsed().filter((label) => label !== activeGroup));

  function toggleGroup(label: string, force?: boolean) {
    setCollapsed((current) => {
      const isOpen = !current.includes(label);
      const nextOpen = force ?? !isOpen;
      const next = nextOpen ? current.filter((entry) => entry !== label) : [...current, label];
      writeCollapsed(next);
      return next;
    });
  }

  // The drawer is off screen below 1024px when closed: take it out of the tab order and the accessibility tree.
  const [isDrawer, setIsDrawer] = useState(() => typeof window !== "undefined" && !window.matchMedia("(min-width: 1024px)").matches);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDrawer(!query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const aside = asideRef.current;
    if (!aside) return;
    if (isDrawer && !open) aside.setAttribute("inert", "");
    else aside.removeAttribute("inert");
  }, [isDrawer, open]);
  // Opening the drawer moves focus into it, starting at the current page.
  useEffect(() => {
    if (!open || !isDrawer || !navRef.current) return;
    const current = navRef.current.querySelector<HTMLElement>("[aria-current]") ?? railControls(navRef.current)[0];
    current?.focus({ preventScroll: true });
    current?.scrollIntoView({ block: "center" });
  }, [open, isDrawer]);

  function onNavKeyDown(event: KeyboardEvent<HTMLElement>) {
    if (!navRef.current) return;
    const target = event.target as HTMLElement;
    const controls = railControls(navRef.current);
    const index = controls.indexOf(target);
    if (index < 0) return;
    const header = target.dataset.navGroup;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = (index + (event.key === "ArrowDown" ? 1 : -1) + controls.length) % controls.length;
      controls[next].focus();
    } else if (event.key === "Home" || event.key === "End") {
      event.preventDefault();
      controls[event.key === "Home" ? 0 : controls.length - 1].focus();
    } else if (header && (event.key === "ArrowRight" || event.key === "ArrowLeft")) {
      event.preventDefault();
      toggleGroup(header, event.key === "ArrowRight");
    } else if (event.key === "ArrowLeft") {
      // From a link, Left goes back up to its group header.
      const owner = target.closest<HTMLElement>("[data-nav-section]")?.querySelector<HTMLElement>("[data-nav-group]");
      if (owner) {
        event.preventDefault();
        owner.focus();
      }
    }
  }

  function chooseSection(id: string) {
    if (document.getElementById(id)) {
      jumpTo(id, onClose);
    } else {
      navigate(`/#${id}`);
      onClose();
    }
  }

  return (
    <>
      {open && (
        <button
          className="fixed inset-0 top-16 z-30 bg-og-midnight/35 backdrop-blur-sm lg:hidden"
          aria-label="Close section menu"
          tabIndex={-1}
          onClick={onClose}
        />
      )}
      <aside
        ref={asideRef}
        id="hub-section-menu"
        className={cn(
          "fixed bottom-0 left-0 top-16 z-40 w-[284px] overflow-y-auto overscroll-contain border-r border-border bg-[#F8F8FA] transition-transform motion-reduce:transition-none lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Extra space at the foot so the admin "Manage guests" pill never covers the last link. */}
        <nav ref={navRef} className="px-4 pb-20 pt-4" aria-label="Brand hub sections" onKeyDown={onNavKeyDown}>
          <ul>
            {nav.map((group, groupIndex) => {
              const isOpen = !collapsed.includes(group.label);
              const listId = `nav-list-${group.items[0].id}`;
              const holdsActive = group.label === activeGroup;
              const divider = groupIndex > 0 && "mt-3 border-t border-og-midnight/10 pt-3";
              if (group.linkTitle) {
                return (
                  <li key={group.label} className={cn(divider)}>
                    <Link
                      to={group.items[0].path!}
                      onClick={onClose}
                      aria-current={activeId === group.items[0].id ? "page" : undefined}
                      className={cn(NAV_TITLE_LINK, activeId === group.items[0].id && "bg-white shadow-sm ring-1 ring-og-midnight/5")}
                    >
                      {group.label}
                    </Link>
                  </li>
                );
              }
              return (
                <li key={group.label} className={cn(divider)}>
                  <section aria-labelledby={`nav-${group.items[0].id}`} data-nav-section="">
                    <h2 id={`nav-${group.items[0].id}`}>
                      <button
                        type="button"
                        data-nav-group={group.label}
                        aria-expanded={isOpen}
                        aria-controls={listId}
                        onClick={() => toggleGroup(group.label)}
                        className={NAV_GROUP_BUTTON}
                      >
                        <span className="flex items-center gap-2">
                          {group.label}
                          {/* Folded, the group still says it holds the page you are on. */}
                          {holdsActive && !isOpen && (
                            <span className="size-1.5 rounded-full bg-og-green-light" aria-hidden="true" />
                          )}
                        </span>
                        <span className="flex items-center gap-1.5 text-og-midnight/60">
                          {!isOpen && <span className="text-[11px] font-semibold tracking-normal tabular-nums">{group.items.length + (group.externalLink && !isGuest ? 1 : 0)}</span>}
                          <ChevronDown
                            size={16}
                            strokeWidth={2.25}
                            aria-hidden="true"
                            className={cn("shrink-0 text-og-midnight transition-transform duration-200 motion-reduce:transition-none", !isOpen && "-rotate-90")}
                          />
                        </span>
                        {holdsActive && !isOpen && <span className="sr-only">, contains the current page</span>}
                      </button>
                    </h2>
                    <ul id={listId} hidden={!isOpen} className="ml-3 mt-1 space-y-0.5 border-l border-og-midnight/10 pl-2">
                      {group.externalLink && !isGuest && (
                        <li>
                          <a
                            href={group.externalLink.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(NAV_ITEM_CLASS, NAV_ITEM_IDLE, "group justify-between gap-2 font-semibold")}
                          >
                            {group.externalLink.label}
                            <span aria-hidden="true" className="grid h-5 w-5 place-items-center rounded bg-og-midnight transition-transform duration-200 group-hover:-translate-y-px group-hover:translate-x-px">
                              <ArrowUpRight size={12} strokeWidth={2.5} className="text-og-green" />
                            </span>
                            <span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </li>
                      )}
                      {group.items.map((item) => (
                        <li key={item.id}>
                          {item.disabled ? (
                            <span aria-disabled="true" className={cn(NAV_ITEM_CLASS, "gap-2 text-og-midnight/55 cursor-default")}>
                              <span className="flex-1">{item.label}</span>
                              {item.wip && <WipTag />}
                            </span>
                          ) : item.path ? (
                            <Link
                              to={item.path}
                              onClick={onClose}
                              aria-current={activeId === item.id ? "page" : undefined}
                              className={cn(NAV_ITEM_CLASS, "group gap-2", activeId === item.id ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE)}
                            >
                              <span className="flex-1">{item.label}</span>
                              {item.wip && <WipTag />}
                            </Link>
                          ) : (
                            <button
                              type="button"
                              onClick={() => chooseSection(item.id)}
                              aria-current={activeId === item.id ? "location" : undefined}
                              className={cn(NAV_ITEM_CLASS, "w-full justify-between gap-2 text-left", activeId === item.id ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE)}
                            >
                              {item.label}
                              {item.wip && <WipTag />}
                            </button>
                          )}
                        </li>
                      ))}
                    </ul>
                  </section>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
}

/** Masthead date of the last commit (or build), set by vite.config.ts. Noon keeps
 *  the calendar day from shifting in the reader's time zone. */
function LastUpdated({ linked }: { linked: boolean }) {
  const date = new Date(`${__LAST_UPDATED__}T12:00:00`);
  const pill = "hidden whitespace-nowrap rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55 xl:inline-flex";
  const label = (
    <time dateTime={__LAST_UPDATED__}>
      Updated {date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
    </time>
  );
  // Staff get the change log behind the date; guests can't open it, so theirs stays plain text.
  if (!linked) return <span className={pill}>{label}</span>;
  return (
    <Link
      to="/changelog"
      title="See what changed"
      className={cn(pill, "transition-colors hover:border-white/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-green")}
    >
      {label}
    </Link>
  );
}

/** Tracks whether the homepage's own search box is on screen (below the 64px masthead). */
function useHeroSearchVisible(enabled: boolean) {
  const [visible, setVisible] = useState(enabled);
  useEffect(() => {
    if (!enabled) return setVisible(false);
    const target = document.querySelector("[data-hero-search]");
    if (!target) return setVisible(false);
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { rootMargin: "-64px 0px 0px 0px" });
    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled]);
  return visible;
}

/** The hub chrome: fixed masthead, section sidebar, and search. Shared by the
 *  single-page hub and the standalone chapter pages so navigation never changes shape. */
export function HubShell({ activeId, children, focused = false, heroSearch = false }: {
  activeId: string;
  children: ReactNode;
  focused?: boolean;
  /** The page opens on its own search (the homepage), so the phone search bar above it would be a duplicate. */
  heroSearch?: boolean;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isGuest = useAccess() === "guest";
  const heroSearchVisible = useHeroSearchVisible(heroSearch);

  // Escape closes the phone menu and hands focus back to the button that opened it.
  useEffect(() => {
    if (!menuOpen) return;
    function onKey(event: globalThis.KeyboardEvent) {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-og-midnight text-white">
        <div className="flex h-full items-center gap-4 px-4 md:px-6">
          {!focused && <button
            ref={menuButtonRef}
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            className="grid size-11 place-items-center rounded-lg text-white/80 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-green lg:hidden"
            aria-label={menuOpen ? "Close section menu" : "Open section menu"}
            aria-expanded={menuOpen}
            aria-controls="hub-section-menu"
          >
            {menuOpen ? <X size={19} /> : <Menu size={19} />}
          </button>}
          <Link to="/" className="flex shrink-0 items-center" aria-label="Ordergroove brand hub home">
            <img src="/logo-dark.png" alt="Ordergroove" className="h-12 w-auto md:h-14" />
          </Link>
          <span className="hidden h-6 w-px bg-white/20 sm:block" />
          <span className="hidden truncate text-sm text-white/62 sm:block">Brand Hub</span>
          {/* One search on screen at a time: hide this one while the Home hero search is visible. */}
          <div className={cn("ml-auto hidden transition-opacity duration-200 md:block", heroSearchVisible && "invisible opacity-0")}>
            <SearchBox />
          </div>
          <LastUpdated linked={!isGuest} />
        </div>
      </header>

      <div className="h-16" />
      {!focused && <Sidebar activeId={activeId} open={menuOpen} onClose={() => setMenuOpen(false)} />}

      <main className={cn(!focused && "lg:ml-[284px]")}>
        {!focused && !heroSearch && <div className="bg-og-midnight px-4 py-3 md:hidden">
          <SearchBox compact />
        </div>}
        {children}
        {!focused && <footer className="border-t border-border px-6 py-8 md:px-10">
          <div className="mx-auto flex max-w-[1060px] flex-wrap items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>Internal use only · Maintained by Brand &amp; Content</p>
            {!isGuest && <Link to="/changelog" className="font-medium text-og-indigo underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-indigo">What’s changed</Link>}
          </div>
        </footer>}
      </main>
    </div>
  );
}
