/** Local review only (import.meta.env.DEV): a floating switch between the nav options. Never ships. */
import { useLocation, useNavigate } from "react-router-dom";
import { NAV_OPTIONS, type NavOption } from "./options";
import { cn } from "@/lib/utils";

export default function NavSwitcher({ current }: { current: NavOption }) {
  const navigate = useNavigate();
  const location = useLocation();
  function choose(option: NavOption) {
    const params = new URLSearchParams(location.search);
    params.set("nav", option);
    navigate({ pathname: location.pathname, search: `?${params}`, hash: location.hash }, { replace: true });
  }
  return (
    <div
      role="group"
      aria-label="Nav option (local preview only)"
      data-nav-switcher=""
      className="fixed bottom-4 right-4 z-[60] flex items-center gap-1 rounded-full bg-og-midnight p-1 pl-3 text-white shadow-[0_25px_50px_-12px_rgba(23,19,47,0.35)] ring-1 ring-white/15"
    >
      <span className="mr-1 hidden text-[10px] sm:inline font-bold uppercase tracking-[0.14em] text-white/55">Nav</span>
      {NAV_OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          aria-pressed={current === option.id}
          onClick={() => choose(option.id)}
          className={cn(
            "h-8 rounded-full px-3 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-og-green [@media(pointer:coarse)]:h-11",
            current === option.id ? "bg-og-green text-og-midnight" : "text-white/75 hover:bg-white/10 hover:text-white"
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
