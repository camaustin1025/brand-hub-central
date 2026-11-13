import { useEffect, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { HUB_NAV, isGuestPath } from "@/data/hub";
import { SearchBox } from "./HubSearch";
import { jumpTo } from "@/lib/hub-navigation";
import { WipTag } from "@/components/brand/WorkInProgress";
import { cn } from "@/lib/utils";
import { useAccess } from "@/hooks/use-access";

export { SearchBox } from "./HubSearch";
export { jumpTo } from "@/lib/hub-navigation";

const NAV_ITEM_CLASS = "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight/40";
const NAV_ITEM_ACTIVE =
  "bg-white text-og-midnight shadow-sm ring-1 ring-og-midnight/5 before:absolute before:-left-[11px] before:top-1/2 before:h-6 before:w-0.5 before:-translate-y-1/2 before:bg-og-green-light";
const NAV_ITEM_IDLE = "text-og-midnight hover:bg-white/70 hover:text-og-midnight";

const NAV_TITLE_CLASS = "rounded-lg bg-og-indigo/[0.06] px-3 py-2 text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-og-indigo";
// A group title that is itself the link (Design canvas). Every other title is a
// static label, so hover flips this one to the masthead's Midnight to show it is clickable.
const NAV_TITLE_LINK = "group relative flex items-center justify-between transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight/40";
const NAV_TITLE_LINK_ACTIVE =
  "bg-white text-og-midnight shadow-sm ring-1 ring-og-midnight/5 before:absolute before:left-0 before:top-1/2 before:h-4 before:w-0.5 before:-translate-y-1/2 before:bg-og-green-light";
const NAV_TITLE_LINK_IDLE = "hover:bg-og-midnight hover:text-white";

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
  // External internal sites (Product Hub) are staff-only; guests can't sign in to them.
  const isGuest = useAccess() === "guest";
  // Guests only see the sections that live on Home.
  const nav = isGuest
    ? HUB_NAV.map((group) => ({ ...group, items: group.linkTitle ? [] : group.items.filter((item) => !item.disabled && isGuestPath(item.path)) })).filter((group) => group.items.length > 0)
    : HUB_NAV.map((group) => ({ ...group, items: group.items.filter((item) => !item.hiddenInNav) })).filter((group) => group.items.length > 0);

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
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed bottom-0 left-0 top-16 z-40 w-[284px] overflow-y-auto border-r border-border bg-[#F8F8FA] transition-transform lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <nav className="px-4 py-5" aria-label="Brand hub sections">
          {nav.map((group) => group.linkTitle ? (
            <div key={group.label} className="mb-6 last:mb-0">
              <Link
                to={group.items[0].path!}
                onClick={onClose}
                aria-current={activeId === group.items[0].id ? "page" : undefined}
                className={cn(NAV_TITLE_CLASS, NAV_TITLE_LINK, activeId === group.items[0].id ? NAV_TITLE_LINK_ACTIVE : NAV_TITLE_LINK_IDLE)}
              >
                {group.label}
              </Link>
            </div>
          ) : (
            <section key={group.label} aria-labelledby={`nav-${group.items[0].id}`} className="mb-6 last:mb-0">
              <h2 id={`nav-${group.items[0].id}`} className={NAV_TITLE_CLASS}>
                {group.label}
              </h2>
              <ul className="ml-3 mt-1.5 space-y-0.5 border-l border-og-midnight/10 pl-2">
                {group.externalLink && !isGuest && (
                  <li>
                    <a
                      href={group.externalLink.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(NAV_ITEM_CLASS, NAV_ITEM_IDLE, "group flex items-center justify-between gap-2 font-semibold")}
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
                      <span aria-disabled="true" className={cn(NAV_ITEM_CLASS, "flex items-center gap-2 text-og-midnight/55 cursor-default")}>
                        <span className="flex-1">{item.label}</span>
                        {item.wip && <WipTag />}
                      </span>
                    ) : item.path ? (
                      <Link
                        to={item.path}
                        onClick={onClose}
                        aria-current={activeId === item.id ? "page" : undefined}
                        className={cn(NAV_ITEM_CLASS, "group flex items-center gap-2", activeId === item.id ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE)}
                      >
                        <span className="flex-1">{item.label}</span>
                        {item.wip && <WipTag />}
                      </Link>
                    ) : (
                      <button
                        onClick={() => chooseSection(item.id)}
                        aria-current={activeId === item.id ? "location" : undefined}
                        className={cn(NAV_ITEM_CLASS, "flex w-full items-center justify-between gap-2 text-left", activeId === item.id ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE)}
                      >
                        {item.label}
                        {item.wip && <WipTag />}
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </section>
          ))}
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
  const isGuest = useAccess() === "guest";
  const heroSearchVisible = useHeroSearchVisible(heroSearch);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-white/10 bg-og-midnight text-white">
        <div className="flex h-full items-center gap-4 px-4 md:px-6">
          {!focused && <button
            onClick={() => setMenuOpen((value) => !value)}
            className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
            aria-label={menuOpen ? "Close section menu" : "Open section menu"}
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
