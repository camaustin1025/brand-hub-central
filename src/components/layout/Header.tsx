import { Link, useRouterState } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { NavDrawer } from "@/components/layout/SideNav";
import { NAV } from "@/data/nav";
import { cn } from "@/lib/utils";

/**
 * The masthead: identity, the group tabs, and the search affordance, on the
 * same Midnight surface the side nav commits to — the chrome reads as one
 * continuous frame instead of a white bar meeting a dark rail, and the
 * accents render in the real #00FF85 here for the same reason they do there.
 *
 * The tabs are group-level (Guidelines / Assets / Toolkit), one per mode in
 * `data/nav.ts`. That is what makes them safe where the old three-link bar was
 * not: the old links were a hand-maintained subset that marked three of seven
 * routes active, while a group tab is active whenever any of its member routes
 * is — every route lights exactly one tab. Page- and section-level navigation
 * stays the side nav's job.
 */
export function Header() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <header className="dark sticky top-0 z-[60] h-[var(--stick)] border-b border-white/12 bg-og-midnight">
      <div className="site-container flex h-full items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <NavDrawer />
          <Link
            to="/"
            className="flex min-h-11 items-center"
            aria-label="Ordergroove Brand Hub, home"
          >
            <img
              src="/logo-dark.png"
              alt="Ordergroove"
              width={512}
              height={88}
              className="h-[26px] w-auto"
            />
          </Link>
          <span aria-hidden className="hidden h-[22px] w-px bg-white/16 sm:block" />
          <span className="hidden text-eyebrow font-bold uppercase text-primary sm:block">
            Brand Hub
          </span>
        </div>

        <div className="flex h-full items-center gap-8">
          <nav aria-label="Primary" className="hidden h-full items-stretch gap-7 md:flex">
            {NAV.map((g) => {
              const active = g.items.some((i) => i.path === pathname);
              return (
                <Link
                  key={g.mode}
                  to={g.items[0].path}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center border-b-2 pt-[2px] text-label transition-colors",
                    active
                      ? "border-primary font-bold text-white"
                      : "border-transparent font-semibold text-white/64 hover:text-white",
                  )}
                >
                  {g.label}
                </Link>
              );
            })}
            <Link
              to="/"
              hash="updates"
              activeOptions={{ includeHash: true }}
              className="flex items-center gap-2 border-b-2 border-transparent pt-[2px] text-label font-semibold text-white/64 transition-colors hover:text-white"
            >
              What's New
              <span aria-hidden className="size-1.5 rounded-full bg-primary" />
            </Link>
          </nav>
          {/* Search lives in the Home hero; this jumps there and focuses it. */}
          <Link
            to="/"
            hash="search"
            aria-label="Search the brand hub"
            className="flex size-11 items-center justify-center border border-white/24 text-white transition-colors hover:border-primary"
          >
            <Search size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
