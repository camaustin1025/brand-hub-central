import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { STATIC_HITS, assetHits, searchHits } from "@/data/search";
import { assetsQueryOptions } from "@/lib/assets-query";
import { cn } from "@/lib/utils";

type Mode = "search" | "ask";

const QUICK_LINKS = [
  { label: "Logo kit", path: "/downloads" },
  { label: "Font kit", path: "/downloads" },
  { label: "Color tokens", path: "/tokens" },
  { label: "Deck template", path: "/toolkit" },
];

const PLACEHOLDER: Record<Mode, string> = {
  search: 'Search assets, colors, rules — "logo svg", "midnight hex"…',
  ask: 'Ask anything — "Which green goes on a white background?"',
};

function ModeChip({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1 rounded-full px-3.5 py-[7px] text-[12.5px] font-semibold transition-colors",
        active ? "bg-og-midnight text-og-green" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon && <MaterialSymbol name={icon} size={14} />}
      {children}
    </button>
  );
}

/**
 * The hero omni bar: one input, two modes.
 *
 * Search is live in v1. It runs against data/search.ts: canon (pages, colors,
 * gradients) from the bundle, plus the published asset rows from the same
 * query Downloads renders, so the two can't disagree.
 *
 * Ask routes to the brand assistant, which is not deployed yet — rather than
 * pretend, that mode says so and points at the page that explains the skills.
 */
export function OmniBar() {
  const [mode, setMode] = useState<Mode>("search");
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const wrap = useRef<HTMLDivElement>(null);
  const input = useRef<HTMLInputElement>(null);

  // The header's search icon links to /#search; land here and take the cursor.
  const hash = useRouterState({ select: (s) => s.location.hash });
  useEffect(() => {
    if (hash === "search") input.current?.focus();
  }, [hash]);

  // Non-suspense on purpose: pages, colors, and gradients stay searchable even
  // while the assets query is in flight, or if the table is unreachable.
  const { data: assetData } = useQuery(assetsQueryOptions);
  const index = useMemo(() => [...STATIC_HITS, ...assetHits(assetData?.assets ?? [])], [assetData]);

  const hits = useMemo(
    () => (mode === "search" ? searchHits(query, index) : []),
    [mode, query, index],
  );
  const showPanel = open && query.trim().length >= 2;

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Escape") {
      setOpen(false);
      return;
    }
    if (e.key === "Enter" && mode === "search" && hits[0]) {
      setOpen(false);
      navigate({ to: hits[0].path });
    }
  }

  return (
    <div className="mt-8 w-full max-w-[560px]">
      <div
        ref={wrap}
        className="light relative"
        onBlur={(e) => {
          if (!wrap.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        <div className="rounded-[18px] bg-card p-3 shadow-[0_21px_46px_rgba(0,0,0,0.05),0_85px_85px_rgba(0,0,0,0.04)] sm:py-2 sm:pl-5 sm:pr-2">
          {/* Narrow screens drop the mode chips below the field rather than
              squeezing the input down to a few characters. */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <MaterialSymbol
                name={mode === "search" ? "search" : "auto_awesome"}
                className="shrink-0 text-muted-foreground"
              />
              <input
                ref={input}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setOpen(true);
                }}
                onFocus={() => setOpen(true)}
                onKeyDown={onKeyDown}
                placeholder={PLACEHOLDER[mode]}
                aria-label={mode === "search" ? "Search the brand hub" : "Ask the brand assistant"}
                className="min-w-0 flex-1 border-none bg-transparent text-base text-foreground outline-none placeholder:text-muted-foreground/80"
              />
            </div>
            <div className="flex shrink-0 gap-1 self-start rounded-full bg-secondary p-[3px] sm:self-auto">
              <ModeChip active={mode === "search"} onClick={() => setMode("search")}>
                Search
              </ModeChip>
              <ModeChip active={mode === "ask"} onClick={() => setMode("ask")} icon="auto_awesome">
                Ask AI
              </ModeChip>
            </div>
          </div>
        </div>

        {showPanel && (
          <div className="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-[18px] border border-border bg-card shadow-[0_21px_46px_rgba(0,0,0,0.08)]">
            {mode === "ask" ? (
              <div className="flex items-start gap-3 p-4">
                <MaterialSymbol name="auto_awesome" size={18} className="mt-0.5 text-primary" />
                <p className="text-sm text-muted-foreground">
                  The brand assistant isn't live yet. In the meantime, the same canon it will answer
                  from is written up on{" "}
                  <Link to="/ai-skills" className="font-semibold text-primary hover:underline">
                    AI &amp; Skills
                  </Link>
                  .
                </p>
              </div>
            ) : hits.length === 0 ? (
              <p className="p-4 text-sm text-muted-foreground">
                Nothing matches "{query.trim()}" yet. Try a color name, a hex, or a page title.
              </p>
            ) : (
              <ul className="max-h-80 overflow-y-auto py-1">
                {hits.map((h) => (
                  <li key={h.id}>
                    <Link
                      to={h.path}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-secondary"
                    >
                      <MaterialSymbol name={h.icon} size={18} className="text-muted-foreground" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {h.title}
                        </span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {h.subtitle}
                        </span>
                      </span>
                      <span className="shrink-0 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {h.kind}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>

      {/* Quick links — the four things people come here for most */}
      <div className="mt-4 flex flex-wrap gap-2">
        {QUICK_LINKS.map((q) => (
          <Link
            key={q.label}
            to={q.path}
            className="rounded-full border border-white/30 px-4 py-[7px] text-[13px] font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            {q.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
