import { Link } from "@tanstack/react-router";
import { NAV } from "@/data/nav";

export function Footer() {
  return (
    <footer className="dark mt-24 bg-og-midnight text-foreground">
      <div className="site-container grid gap-10 py-12 md:grid-cols-[1.5fr_repeat(3,1fr)]">
        <div className="space-y-3">
          <img src="/logo-dark.png" alt="Ordergroove" className="h-6 w-auto" />
          <p className="max-w-xs text-sm text-white">
            The internal home for the Ordergroove brand. Guidelines, assets, and
            the tools to stay on brand.
          </p>
        </div>
        {NAV.map((group) => (
          <div key={group.mode} className="space-y-3">
            <span className="eyebrow">{group.label}</span>
            <ul className="space-y-2">
              {group.items.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className="text-sm text-white transition-colors hover:text-primary"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-border">
        <div className="site-container flex flex-col items-center justify-between gap-2 py-6 text-xs text-white sm:flex-row">
          <span>Ordergroove, internal use only. Maintained by Brand &amp; Content.</span>
          <span>Built in-house, not Frontify</span>
        </div>
      </div>
    </footer>
  );
}
