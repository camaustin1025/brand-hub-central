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
] as const;

const PLACEHOLDER: Record<Mode, string> = {
  search: 'Search assets, colors, rules — "logo svg", "midnight hex"…',
  ask: 'Ask anything — "Which green goes on a white background?"',
};

/** Mode pill inside the Midnight bar: green when active, ghost-white when not. */
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
        "inline-flex cursor-pointer items-center gap-1.5 rounded-full px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] transition-colors",
        active
          ? "bg-og-green text-og-midnight"
          : "text-white/70 hover:text-white",
      )}
    >
      {icon && <MaterialSymbol name={icon} size={14} />}
      {children}
    </button>
  );
}

/**
 * The hero omni bar: one input, two modes, riding the gradient marquee.
 *
 * The shell is a Midnight pill that overlaps the gradient hero (the -mt lives
 * on the wrapper in index.tsx). Search is live in v1 — it runs against
 * data/search.ts: canon (pages, colors, gradients) plus the published asset
 * rows from the same query Downloads renders, so the two can't disagree.
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
    <>
      <div
        ref={wrap}
        className="relative -mt-[42px]"
        onBlur={(e) => {
          if (!wrap.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        {/* Midnight pill on the gradient. The 2px green focus ring rides the
            whole shell so tabbing into the input is unmissable, offset out so
            the gradient shows through the gap. */}
        <div className="flex items-center gap-3 rounded-full bg-og-midnight py-3 pl-7 pr-3 shadow-[0_21px_46px_rgba(23,19,47,0.22),0_85px_85px_rgba(23,19,47,0.10)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-og-green sm:gap-4">
          <MaterialSymbol
            name={mode === "search" ? "search" : "auto_awesome"}
            size={22}
            className="shrink-0 text-white/70"
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
            className="min-w-0 flex-1 border-none bg-transparent text-base text-white outline-none placeholder:text-white/45"
          />
          <div className="flex shrink-0 gap-1">
            <ModeChip active={mode === "search"} onClick={() => setMode("search")}>
              Search
            </ModeChip>
            <ModeChip active={mode === "ask"} onClick={() => setMode("ask")} icon="auto_awesome">
              Ask AI
            </ModeChip>
          </div>
        </div>

        {showPanel && (
          <div className="absolute inset-x-0 top-full z-50 mt-2.5 overflow-hidden border border-border bg-white shadow-[0_21px_46px_rgba(23,19,47,0.14),0_85px_85px_rgba(23,19,47,0.08)]">
            {mode === "ask" ? (
              <div className="flex items-start gap-3 p-[18px_22px]">
                <MaterialSymbol name="auto_awesome" size={18} className="mt-0.5 text-og-green-light" />
                <p className="text-[14.5px] leading-relaxed text-og-indigo">
                  The brand assistant isn't live yet. The canon it will answer from is written up on{" "}
                  <Link to="/ai-skills" className="font-semibold text-og-green-light hover:underline">
                    AI &amp; Skills
                  </Link>
                  .
                </p>
              </div>
            ) : hits.length === 0 ? (
              <p className="p-[18px_22px] text-[14.5px] text-og-indigo">
                Nothing matches "{query.trim()}" yet. Try a color name, a hex, or a page title.
              </p>
            ) : (
              <ul className="max-h-80 overflow-y-auto">
                {hits.map((h) => (
                  <li key={h.id}>
                    <Link
                      to={h.path}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3.5 border-t border-og-hairline px-[22px] py-3.5 transition-colors first:border-t-0 hover:bg-og-surface"
                    >
                      <MaterialSymbol name={h.icon} size={19} className="text-og-green-light" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[14.5px] font-semibold text-og-midnight">
                          {h.title}
                        </span>
                        <span className="block truncate text-[12.5px] text-og-soft">
                          {h.subtitle}
                        </span>
                      </span>
                      <span className="shrink-0 text-xs font-bold uppercase tracking-[0.16em] text-og-green-light">
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

      {/*
        Quick jump — the four things people come here for most, as a single
        rule-separated row. Sits on the white page below the gradient, so the
        links run Midnight and go green on hover.
      */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-xs font-bold uppercase tracking-[0.16em] text-og-green-light">
          Quick jump
        </span>
        {QUICK_LINKS.map((q, i) => (
          <span key={q.label} className="flex items-center gap-x-4">
            {i > 0 && <span aria-hidden className="h-3 w-px bg-border" />}
            <Link
              to={q.path}
              className="text-xs font-bold uppercase tracking-[0.16em] text-og-midnight transition-colors hover:text-og-green-light"
            >
              {q.label}
            </Link>
          </span>
        ))}
      </div>
    </>
  );
}
