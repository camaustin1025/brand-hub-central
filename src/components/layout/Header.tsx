import { Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { NavDrawer } from "@/components/layout/SideNav";

/**
 * The masthead: identity, the search affordance, and the drawer trigger below
 * xl. Nothing else.
 *
 * It used to carry three flat nav links and a tonal Sys.status strip. The links
 * were a hand-maintained subset of `data/nav.ts` — they marked three of seven
 * routes active and left the other four with no active state anywhere — and are
 * now the side nav's job. The status strip said one static sentence and cost
 * 36px of sticky height on every scroll of every page to say it; it moved to
 * the side nav's foot, which is why --stick drops 112px → 76px.
 */
export function Header() {
  return (
    <header className="sticky top-0 z-[60] h-[var(--stick)] border-b border-border bg-white">
      <div className="site-container flex h-full items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <NavDrawer />
          <Link
            to="/"
            className="flex min-h-11 items-center"
            aria-label="Ordergroove Brand Hub, home"
          >
            <img
              src="/logo-white.png"
              alt="Ordergroove"
              width={512}
              height={88}
              className="h-[26px] w-auto"
            />
          </Link>
          <span aria-hidden className="hidden h-[22px] w-px bg-border sm:block" />
          <span className="hidden text-eyebrow font-bold uppercase text-primary sm:block">
            Brand Hub
          </span>
        </div>

        <div className="flex items-center gap-8">
          <Link
            to="/"
            hash="updates"
            activeOptions={{ includeHash: true }}
            className="hidden min-h-11 items-center text-eyebrow font-semibold uppercase text-og-midnight transition-colors hover:text-primary sm:flex"
          >
            What's New
          </Link>
          {/* Search lives in the Home hero; this jumps there and focuses it. */}
          <Link
            to="/"
            hash="search"
            aria-label="Search the brand hub"
            className="flex size-11 items-center justify-center border border-border text-og-midnight transition-colors hover:border-og-midnight"
          >
            <Search size={18} />
          </Link>
        </div>
      </div>
    </header>
  );
}
