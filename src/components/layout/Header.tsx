import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Search, X } from "lucide-react";
import { MaterialSymbol } from "@/components/brand/MaterialSymbol";
import { NAV } from "@/data/nav";

/** Flat primary nav, in the order the Gradient Marquee home lays out its doors. */
const NAV_LINKS = [
  { label: "Guidelines", to: "/foundation" as const },
  { label: "Downloads", to: "/downloads" as const },
  { label: "Toolkit", to: "/toolkit" as const },
];

const linkBase =
  "text-xs font-semibold uppercase tracking-[0.16em] text-og-midnight transition-colors hover:text-og-green-light data-[status=active]:text-og-green-light";

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-[60] border-b border-border bg-white">
      <div className="site-container flex h-[76px] items-center justify-between gap-6">
        <div className="flex items-center gap-[18px]">
          <Link to="/" className="flex items-center" aria-label="Ordergroove Brand Hub, home">
            <img src="/logo-white.png" alt="Ordergroove" className="h-[26px] w-auto" />
          </Link>
          <span aria-hidden className="hidden h-[22px] w-px bg-border sm:block" />
          <span className="hidden text-xs font-bold uppercase tracking-[0.16em] text-og-green-light sm:block">
            Brand Hub
          </span>
        </div>

        {/* Desktop nav — flat links + the sticky search affordance. */}
        <nav className="hidden items-center gap-[30px] lg:flex">
          {NAV_LINKS.map((l) => (
            <Link key={l.to} to={l.to} className={linkBase}>
              {l.label}
            </Link>
          ))}
          <Link to="/" hash="updates" className={`${linkBase} hidden xl:block`}>
            What's New
          </Link>
          {/* Search lives in the Home hero; this jumps there and focuses it. */}
          <Link
            to="/"
            hash="search"
            aria-label="Search the brand hub"
            className="flex border border-border p-2 text-og-midnight transition-colors hover:border-og-midnight"
          >
            <Search size={18} />
          </Link>
        </nav>

        <button
          className="rounded-full p-2 text-og-midnight transition-colors hover:bg-secondary lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </div>

      {/* System status strip — a quiet tonal band, dropped on small screens. */}
      <div className="hidden border-t border-og-hairline bg-og-surface md:block">
        <div className="site-container flex h-9 items-center justify-between gap-4">
          <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-og-green-light">
            <MaterialSymbol name="bolt" size={15} />
            Sys.status
          </span>
          <span className="text-[14px] font-medium text-og-indigo">
            Live and building. Some sections are still in draft.
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-og-soft">
            Maintained by Brand &amp; Content
          </span>
        </div>
      </div>

      {/* Mobile nav — the full grouped map, since the desktop bar is flattened. */}
      {open && (
        <nav className="border-t border-border bg-white lg:hidden">
          <div className="site-container flex flex-col gap-5 py-5">
            {NAV.map((group) => (
              <div key={group.mode} className="flex flex-col gap-2">
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-og-green-light">
                  {group.label}
                </span>
                {group.items.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="text-sm font-medium text-og-midnight transition-colors hover:text-og-green-light"
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
