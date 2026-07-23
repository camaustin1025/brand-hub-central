import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ChevronDown, Menu, Search, X } from "lucide-react";
import { NAV, type NavItem } from "@/data/nav";

const linkBase =
  "text-sm font-medium text-foreground/80 transition-colors hover:text-primary data-[status=active]:text-primary";

/** Desktop dropdown for a nav group with more than one destination. */
function NavGroup({ label, items }: { label: string; items: NavItem[] }) {
  return (
    <div className="group relative">
      <button className="inline-flex items-center gap-1 text-sm font-medium text-foreground/80 transition-colors group-hover:text-primary">
        {label}
        <ChevronDown size={15} className="transition-transform group-hover:rotate-180" />
      </button>
      {/* pt-3 is the hover bridge to the panel */}
      <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
        <div className="w-72 rounded-2xl border border-border bg-white p-2 shadow-xl shadow-og-midnight/5">
          {items.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="block rounded-xl px-3 py-2.5 transition-colors hover:bg-secondary"
            >
              <span className="block text-sm font-semibold text-foreground">{item.label}</span>
              <span className="block text-xs text-muted-foreground">{item.blurb}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [guidelines, assets, more] = NAV;

  // Solid white per the Home design; the bar and logo keep the larger scale
  // set in Lovable rather than the design's 88px bar / 30px logo.
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-white">
      <div className="site-container flex h-24 items-center justify-between gap-4">
        <Link to="/" className="flex items-center" aria-label="Ordergroove Brand Hub, home">
          <img src="/logo-white.png" alt="Ordergroove" className="h-12 w-auto" />
        </Link>

        {/* Desktop nav — simplified to three groups + search */}
        <nav className="hidden items-center gap-8 lg:flex">
          <NavGroup label={guidelines.label} items={guidelines.items} />
          <Link to={assets.items[0].path} className={linkBase}>
            {assets.items[0].label}
          </Link>
          <NavGroup label="More" items={more.items} />
        </nav>

        <div className="flex items-center gap-1">
          {/* Search lives in the Home hero; this jumps there and focuses it. */}
          <Link
            to="/"
            hash="search"
            className="rounded-full p-2 text-foreground/70 transition-colors hover:bg-secondary hover:text-foreground"
            aria-label="Search the brand hub"
          >
            <Search size={18} />
          </Link>
          <button
            className="rounded-full p-2 text-foreground/70 hover:bg-secondary lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-border bg-white lg:hidden">
          <div className="site-container flex flex-col gap-5 py-5">
            {NAV.map((group) => (
              <div key={group.mode} className="flex flex-col gap-2">
                <span className="eyebrow">{group.label}</span>
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={linkBase}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
