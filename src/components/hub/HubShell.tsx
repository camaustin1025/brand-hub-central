import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Search, X } from "lucide-react";
import { HUB_NAV, type HubNavItem } from "@/data/hub";
import { publishedSocialTemplates } from "@/data/social-templates";
import { cn } from "@/lib/utils";

const ALL_NAV_ITEMS: HubNavItem[] = [
  ...HUB_NAV.flatMap((group) => group.items),
  ...publishedSocialTemplates().map((template) => ({
    id: `social-${template.id}`, label: `${template.category}: ${template.title}`, description: template.description,
    keywords: template.keywords, path: `/toolkit/social/${template.id}`,
  })),
];

const NAV_ITEM_CLASS = "relative rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-midnight/40";
const NAV_ITEM_ACTIVE =
  "bg-white text-og-midnight shadow-sm ring-1 ring-og-midnight/5 before:absolute before:-left-[11px] before:top-1/2 before:h-6 before:w-0.5 before:-translate-y-1/2 before:bg-og-green-light";
const NAV_ITEM_IDLE = "text-og-midnight hover:bg-white/70 hover:text-og-midnight";

export function jumpTo(id: string, closeMenu?: () => void) {
  const target = document.getElementById(id);
  if (!target) {
    // Not on the single-page hub (e.g. /foundation) — go home and land on the section.
    window.location.assign(`/#${id}`);
    return;
  }
  window.history.replaceState(null, "", `#${id}`);
  target.scrollIntoView({ behavior: "smooth", block: "start" });
  closeMenu?.();
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
          {HUB_NAV.map((group) => (
            <section key={group.label} aria-labelledby={`nav-${group.items[0].id}`} className="mb-6 last:mb-0">
              <h2 id={`nav-${group.items[0].id}`} className="rounded-lg bg-og-indigo/[0.06] px-3 py-2 text-[11px] font-bold uppercase leading-4 tracking-[0.12em] text-og-indigo">
                {group.label}
              </h2>
              <ul className="ml-3 mt-1.5 space-y-0.5 border-l border-og-midnight/10 pl-2">
                {group.items.map((item) => (
                  <li key={item.id}>
                    {item.path ? (
                      <Link
                        to={item.path}
                        onClick={onClose}
                        aria-current={activeId === item.id ? "page" : undefined}
                        className={cn(NAV_ITEM_CLASS, "block", activeId === item.id ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE)}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={() => chooseSection(item.id)}
                        aria-current={activeId === item.id ? "location" : undefined}
                        className={cn(NAV_ITEM_CLASS, "w-full text-left", activeId === item.id ? NAV_ITEM_ACTIVE : NAV_ITEM_IDLE)}
                      >
                        {item.label}
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

const SEARCH_STOP_WORDS = new Set([
  "a", "an", "and", "are", "brand", "can", "do", "for", "goes", "hub",
  "i", "in", "is", "me", "my", "of", "on", "the", "to", "use", "what",
  "where", "which", "with",
]);

export function SearchBox({ compact = false, hero = false }: { compact?: boolean; hero?: boolean }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        inputRef.current?.focus();
      }
      if (event.key === "Escape") {
        setQuery("");
        inputRef.current?.blur();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const results = useMemo(() => {
    const value = query.trim().toLowerCase();
    if (!value) return [];
    const terms = value
      .replace(/[^a-z0-9+#]+/g, " ")
      .split(" ")
      .filter((term) => term.length > 1 && !SEARCH_STOP_WORDS.has(term));

    return ALL_NAV_ITEMS
      .map((item) => {
        const haystack = `${item.label} ${item.description} ${item.keywords}`.toLowerCase();
        const score = terms.reduce((total, term) => total + (haystack.includes(term) ? 1 : 0), 0);
        return { item, score };
      })
      .filter(({ score }) => score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 7)
      .map(({ item }) => item);
  }, [query]);

  function choose(item: HubNavItem) {
    setQuery("");
    setFocused(false);
    inputRef.current?.blur();
    if (item.path) {
      navigate(item.path);
      return;
    }
    if (document.getElementById(item.id)) jumpTo(item.id);
    else navigate(`/#${item.id}`);
  }

  return (
    <div className={cn("relative", compact || hero ? "w-full" : "w-[310px]")}>
      <Search
        className={cn(
          "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2",
          hero ? "text-og-midnight/45" : "text-white/50"
        )}
        size={hero ? 19 : 16}
      />
      <input
        ref={inputRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => window.setTimeout(() => setFocused(false), 120)}
        placeholder={hero ? "Search brand rules and assets" : "Search the brand hub"}
        aria-label={hero ? "Search brand rules and assets" : "Search the brand hub"}
        className={cn(
          "w-full outline-none transition",
          hero
            ? "h-14 rounded-lg border border-white bg-white pl-11 pr-4 text-base font-medium text-og-midnight shadow-xl shadow-black/15 placeholder:font-normal placeholder:text-og-midnight focus:border-og-green focus:ring-4 focus:ring-og-green/15"
            : "h-9 rounded-lg border border-white/15 bg-white/10 pl-9 pr-12 text-sm text-white placeholder:text-white/45 focus:border-og-green/60 focus:bg-white/15 focus:ring-2 focus:ring-og-green/10"
        )}
      />
      {!compact && !hero && (
        <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded-[4px] border border-white/15 px-1.5 py-0.5 text-[10px] text-white/45">
          ⌘K
        </span>
      )}
      {focused && query && (
        <div className={cn(
          "absolute right-0 top-[calc(100%+10px)] z-50 w-full min-w-[310px] overflow-hidden rounded-lg border border-border bg-white p-1.5 text-og-midnight shadow-2xl shadow-og-midnight/20",
          hero && "left-0 right-auto"
        )}>
          {results.length > 0 ? (
            results.map((item) => (
              <button
                key={item.id}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(item)}
                className="group flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left hover:bg-og-gray-950"
              >
                <Search className="mt-0.5 shrink-0 text-og-gray-600 group-hover:text-og-green-light" size={15} />
                <span>
                  <span className="block text-sm font-semibold">{item.label}</span>
                  <span className="mt-0.5 block text-xs text-og-midnight">{item.description}</span>
                </span>
              </button>
            ))
          ) : (
            <p className="px-3 py-5 text-center text-sm text-og-midnight">
              No matching section. Try “logo,” “voice,” or “downloads.”
            </p>
          )}
        </div>
      )}
    </div>
  );
}

/** The hub chrome: fixed masthead, section sidebar, and search. Shared by the
 *  single-page hub and the standalone chapter pages so navigation never changes shape. */
export function HubShell({ activeId, children, focused = false }: { activeId: string; children: ReactNode; focused?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);

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
          <span className="hidden truncate text-sm text-white/62 sm:block">Brand Hub · Internal reference</span>
          <div className="ml-auto hidden md:block">
            <SearchBox />
          </div>
          <span className="hidden rounded-full border border-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white/55 xl:inline-flex">
            V1
          </span>
        </div>
      </header>

      <div className="h-16" />
      {!focused && <Sidebar activeId={activeId} open={menuOpen} onClose={() => setMenuOpen(false)} />}

      <main className={cn(!focused && "lg:ml-[284px]")}>
        {!focused && <div className="bg-og-midnight px-4 py-3 md:hidden">
          <SearchBox compact />
        </div>}
        {children}
      </main>
    </div>
  );
}
