import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { STATIC_HITS, assetHits, searchHits } from "@/data/search";
import { assetsQueryOptions } from "@/lib/assets-query";
import { cn } from "@/lib/utils";

type Mode = "search" | "ask";

const QUICK_LINKS = [
  { label: "Logo kit", hash: "downloads" },
  { label: "Font kit", hash: "downloads" },
  { label: "Color tokens", hash: "tokens" },
  { label: "Deck template", hash: "toolkit" },
] as const;

const PLACEHOLDER: Record<Mode, string> = {
  search: "Start typing to search assets, colors, rules and more.",
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
        // flex-1 below sm so the two chips split the stacked row evenly instead
        // of huddling at its left edge; auto width once they sit inline.
        "inline-flex min-h-11 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-full px-4 text-eyebrow font-bold uppercase transition-colors sm:flex-none",
        active ? "bg-og-green text-og-midnight" : "text-white/70 hover:text-white",
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
      navigate({ to: hits[0].path, hash: hits[0].hash });
    }
  }

  return (
    <>
      <div
        ref={wrap}
        // The hero's bottom padding adds this same value back, so the visible
        // gap above the bar stays a section step.
        //
        // An explicit calc, because the negative-margin shorthand cannot negate
        // a custom property unambiguously. Note the underscores: they are
        // Tailwind's escape for the spaces CSS calc requires around its
        // operators, and without them the rule is invalid CSS.
        //
        // Do not write an example of the wrong form in a comment here. Tailwind
        // scans this file as plain text, comments included, so a class-shaped
        // string becomes a real rule — that is exactly how this line was first
        // written, and the generated rule took the whole stylesheet down.
        className="relative mt-[calc(var(--omni-overlap)_*_-1)]"
        onBlur={(e) => {
          if (!wrap.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
        }}
      >
        {/*
          Midnight pill on the gradient. The 2px green focus ring rides the
          whole shell so tabbing into the input is unmissable, offset out so
          the gradient shows through the gap.

          Below sm the bar stacks: side by side, the two mode chips took the
          whole width of a 390px phone and left the input showing about nine
          characters. The chips move to their own row and the shell relaxes to
          a 28px radius, since a full pill can't hold two stacked rows.
        */}
        <div className="flex flex-col gap-2 rounded-hero bg-og-midnight p-3 shadow-[0_21px_46px_rgba(23,19,47,0.22),0_85px_85px_rgba(23,19,47,0.10)] focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-og-green sm:flex-row sm:items-center sm:gap-4 sm:rounded-full sm:py-3 sm:pl-7 sm:pr-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 pl-3 sm:pl-0">
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
              // white/55, not white/45: the placeholder is the only copy in the
              // bar until you type, and at 45% it measures 4.47:1 on Midnight —
              // under the 4.5:1 body text owes. 55% is 6.07:1.
              className="min-w-0 flex-1 border-none bg-transparent py-2 text-base text-white outline-none placeholder:text-white/55 sm:py-0"
            />
          </div>
          <div className="flex shrink-0 gap-1 border-t border-white/12 pt-1 sm:border-t-0 sm:pt-0">
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
              <div className="flex items-start gap-3 px-6 py-5">
                <MaterialSymbol name="auto_awesome" size={18} className="mt-0.5 text-primary" />
                <p className="text-body text-og-indigo">
                  The brand assistant isn't live yet. The canon it will answer from is written up on{" "}
                  <Link
                    to="/"
                    hash="ai-skills"
                    className="font-semibold text-primary hover:underline"
                  >
                    AI &amp; Skills
                  </Link>
                  .
                </p>
              </div>
            ) : hits.length === 0 ? (
              <p className="px-6 py-5 text-body text-og-indigo">
                Nothing matches "{query.trim()}" yet. Try a color name, a hex, or a page title.
              </p>
            ) : (
              <ul className="max-h-80 overflow-y-auto">
                {hits.map((h) => (
                  <li key={h.id}>
                    <Link
                      to={h.path}
                      hash={h.hash}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3.5 border-t border-og-hairline px-6 py-3.5 transition-colors first:border-t-0 hover:bg-og-surface"
                    >
                      <MaterialSymbol name={h.icon} size={19} className="text-primary" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-body font-semibold text-og-midnight">
                          {h.title}
                        </span>
                        <span className="block truncate text-label text-og-soft">{h.subtitle}</span>
                      </span>
                      <span className="shrink-0 text-eyebrow font-bold uppercase text-primary">
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

        The divider rules only exist on one line. When the row wrapped on a
        phone, the second line opened with a stranded tick mark, so below sm
        the links become a two-column grid and the ticks drop out entirely.
      */}
      <div className="mt-5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-4">
        <span className="block text-eyebrow font-bold uppercase text-primary">Quick jump</span>
        <div className="grid grid-cols-2 gap-x-4 sm:contents">
          {QUICK_LINKS.map((q, i) => (
            <span key={q.label} className="flex items-center gap-x-4">
              {i > 0 && <span aria-hidden className="hidden h-3 w-px bg-border sm:block" />}
              <Link
                to="/"
                hash={q.hash}
                className="flex min-h-11 items-center text-eyebrow font-bold uppercase text-og-midnight transition-colors hover:text-primary"
              >
                {q.label}
              </Link>
            </span>
          ))}
        </div>
      </div>
    </>
  );
}
