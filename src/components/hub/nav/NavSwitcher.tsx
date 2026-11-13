/** Local review only (import.meta.env.DEV): a floating switch between the nav options and their light or dark theme. Never ships. */
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_OPTIONS, navThemes, type NavOption, type NavTheme } from "./options";
import { cn } from "@/lib/utils";

const PILL =
  "h-8 rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-green [@media(pointer:coarse)]:h-11";
const pillState = (on: boolean) => (on ? "bg-og-green text-og-midnight" : "text-white/75 hover:bg-white/10 hover:text-white");

export default function NavSwitcher({ current, theme }: { current: NavOption; theme: NavTheme }) {
  const navigate = useNavigate();
  const location = useLocation();
  function set(key: "nav" | "navTheme", value: string) {
    const params = new URLSearchParams(location.search);
    params.set(key, value);
    navigate({ pathname: location.pathname, search: `?${params}`, hash: location.hash }, { replace: true });
  }
  const themes = navThemes(current);
  return (
    <div
      data-nav-switcher=""
      className="fixed bottom-4 right-4 z-[60] flex flex-wrap items-center justify-end gap-1 rounded-[22px] bg-og-midnight p-1 pl-3 text-white shadow-[0_25px_50px_-12px_rgba(23,19,47,0.35)] ring-1 ring-white/15"
    >
      <div role="group" aria-label="Nav option (local preview only)" className="flex items-center gap-1">
        <span className="mr-1 hidden text-[10px] font-bold uppercase tracking-[0.14em] text-white/55 sm:inline">Nav</span>
        {NAV_OPTIONS.map((option) => (
          <button key={option.id} type="button" aria-pressed={current === option.id} onClick={() => set("nav", option.id)} className={cn(PILL, pillState(current === option.id))}>
            {option.label}
          </button>
        ))}
      </div>
      {/* Light and dark only where the option comes in both; the others are light-only today. */}
      <div role="group" aria-label="Nav theme (local preview only)" className="flex items-center gap-1 border-l border-white/15 pl-1">
        {(["light", "dark"] as const).map((value) => {
          const available = themes.includes(value);
          return (
            <button
              key={value}
              type="button"
              aria-pressed={theme === value}
              disabled={!available}
              title={available ? undefined : `${NAV_OPTIONS.find((o) => o.id === current)?.label} comes in light only`}
              onClick={() => set("navTheme", value)}
              className={cn(PILL, "capitalize disabled:cursor-not-allowed disabled:text-white/30 disabled:hover:bg-transparent", available && pillState(theme === value))}
            >
              {value}
            </button>
          );
        })}
      </div>
    </div>
  );
}
