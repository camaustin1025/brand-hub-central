import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Search } from "lucide-react";
import { WipTag } from "@/components/brand/WorkInProgress";
import { searchHub, type HubSearchItem } from "@/lib/hub-search";
import { jumpTo } from "@/lib/hub-navigation";
import { cn } from "@/lib/utils";

export function SearchBox({ compact = false, hero = false }: { compact?: boolean; hero?: boolean }) {
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const navigate = useNavigate();
  const id = useId();
  const results = useMemo(() => searchHub(query), [query]);
  const open = focused && query.trim().length > 0;

  useEffect(() => {
    function shortcut(event: globalThis.KeyboardEvent) {
      // Only the visible masthead/mobile search owns the global shortcut.
      if (!hero && (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k" && inputRef.current?.getClientRects().length) {
        event.preventDefault();
        inputRef.current.focus();
      }
    }
    window.addEventListener("keydown", shortcut);
    return () => window.removeEventListener("keydown", shortcut);
  }, [hero]);

  function choose(item: HubSearchItem) {
    setQuery("");
    setFocused(false);
    if (item.path) navigate(item.path);
    else if (document.getElementById(item.id)) jumpTo(item.id);
    else navigate("/#" + item.id);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      event.stopPropagation();
      setQuery("");
      inputRef.current?.focus();
      setFocused(false);
    }
  }

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      const next = index + (event.key === "ArrowDown" ? 1 : -1);
      if (next < 0 || next >= results.length) inputRef.current?.focus();
      else resultRefs.current[next]?.focus();
    }
  }

  return (
    <div role="search" aria-label={hero ? "Find brand resources" : "Search brand resources"}
      onFocusCapture={() => setFocused(true)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false); }}
      onKeyDown={onKeyDown}
      className={cn("relative", compact || hero ? "w-full" : "w-[310px]")}>
      <Search aria-hidden="true" className={cn("pointer-events-none absolute left-3 top-[50%] -translate-y-1/2", hero ? "text-og-midnight/60" : "text-white/70")} size={hero ? 19 : 16} />
      <input ref={inputRef} value={query} onChange={(event) => { setQuery(event.target.value); setFocused(true); }}
        onKeyDown={(event) => {
          if ((event.key === "ArrowDown" || event.key === "ArrowUp") && results.length && open) {
            event.preventDefault();
            resultRefs.current[event.key === "ArrowDown" ? 0 : results.length - 1]?.focus();
          } else if (event.key === "Enter" && results.length && open) {
            event.preventDefault();
            choose(results[0]);
          }
        }}
        placeholder={hero ? "Search brand rules and assets" : "Search the brand hub"}
        aria-label={hero ? "Search brand rules and assets" : "Search the brand hub"}
        aria-controls={open ? id + "-results" : undefined}
        aria-describedby={id + "-hint"}
        className={cn("w-full outline-none transition-colors", hero
          ? "h-14 rounded-lg border border-white bg-white pl-11 pr-4 text-base font-medium text-og-midnight shadow-xl shadow-black/15 placeholder:font-normal placeholder:text-og-midnight focus:border-og-green focus:ring-4 focus:ring-og-green/15"
          : "h-9 rounded-lg border border-white/30 bg-white/10 pl-9 pr-12 text-sm text-white placeholder:text-white/70 focus:border-og-green/60 focus:bg-white/15 focus:ring-2 focus:ring-og-green/40")} />
      <span id={id + "-hint"} className="sr-only">Search guides, downloadable assets, and templates. Use Tab or the arrow keys to reach a result. Escape closes the results.</span>
      {!compact && !hero && <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-white/30 px-1.5 py-0.5 text-[10px] text-white/70" aria-hidden="true">⌘K</span>}
      <span role="status" className="sr-only">{open ? results.length ? results.length + " matching resources" : "No matching resources" : ""}</span>
      {open && (
        <div id={id + "-results"} role="region" aria-label="Search results"
          className="absolute inset-x-0 top-[calc(100%+10px)] z-50 max-h-[min(28rem,60dvh)] overflow-y-auto rounded-lg border border-border bg-white p-1.5 text-og-midnight shadow-2xl shadow-og-midnight/20">
          {results.length ? results.map((item, index) => (
            <button key={item.id} type="button" ref={(element) => { resultRefs.current[index] = element; }}
              onClick={() => choose(item)} onKeyDown={(event) => move(event, index)}
              className="action-focus group flex w-full items-start gap-3 rounded-md px-3 py-3 text-left hover:bg-og-gray-950 focus-visible:bg-og-gray-950 focus-visible:ring-inset">
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.1em]">{item.kind}{item.wip && <WipTag />}</span>
                <span className="mt-1 block text-sm font-semibold leading-5">{item.label}</span>
                <span className="mt-1 block text-xs leading-5">{item.description}</span>
              </span>
              <ArrowRight size={15} className="mt-5 shrink-0" aria-hidden="true" />
            </button>
          )) : <p className="px-3 py-5 text-sm leading-6">No matching resources. Try “logo,” “Figtree,” “SVG,” or “Zoom.”</p>}
        </div>
      )}
    </div>
  );
}
