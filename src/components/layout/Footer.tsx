import { Link, useRouterState } from "@tanstack/react-router";
import { NAV, type NavMode } from "@/data/nav";
import { ROUTE_TO_HUB_ANCHOR } from "@/data/hub";

/**
 * The closing Midnight island. It runs on a 12-column field — 3 columns of
 * identity, then hairline-separated link stacks for the three brand-hub modes.
 * Green resolves to #00FF85 on this dark surface.
 *
 * The stacks come from `data/nav.ts`; they are not a second hand-written copy
 * of it. The copy is exactly how this footer drifted. It had grown a
 * "Templates" link filed under Assets that opened /toolkit, and a "Get help"
 * link sitting directly beneath the "AI & Skills" link that went to the same
 * page — one label promising an asset and delivering a tool, and two labels for
 * one destination inside one stack. Derived, the footer can only ever disagree
 * with the side nav about layout.
 *
 * Only the spans are the footer's own: 4 / 2 / 3, sized to the longest label in
 * each stack so none of them wrap.
 */
const SPAN: Record<NavMode["mode"], string> = {
  Read: "md:col-span-4",
  Grab: "md:col-span-2",
  Build: "md:col-span-3",
};

export function Footer() {
  const onHome = useRouterState({ select: (state) => state.location.pathname === "/" });

  return (
    <footer className="dark bg-og-midnight text-og-ink">
      {/* 3 / 4 / 2 / 3. The identity block used to take 5 of 12 columns for a
          34ch paragraph, which left it half empty while the link stacks were
          squeezed into 2 columns each and wrapped. */}
      <div className="site-container grid grid-cols-1 gap-y-10 py-14 md:grid-cols-12 md:gap-y-0">
        <div className="flex flex-col gap-3.5 md:col-span-3 md:pr-10">
          <img
            src="/logo-dark.png"
            alt="Ordergroove"
            width={512}
            height={88}
            className="h-6 w-auto self-start"
          />
          <p className="max-w-[34ch] text-body text-white/72">
            The internal home for the Ordergroove brand. Guidelines, assets, and the tools to stay
            on brand.
          </p>
        </div>
        {NAV.map((group) => (
          <div
            key={group.mode}
            className={`flex flex-col gap-3.5 md:border-l md:border-white/12 md:pl-7 ${SPAN[group.mode]}`}
          >
            <h2 className="text-eyebrow font-bold uppercase text-primary">{group.label}</h2>
            {/* No gap: `min-h-11` is already the 44px touch target, so adding
                10px on top of it gave the footer 54px rows and made three
                short link lists read as a much bigger block than they are. */}
            <div className="flex flex-col">
              {group.items.map((item) => (
                <Link
                  key={item.path}
                  to={onHome ? "/" : item.path}
                  hash={onHome ? ROUTE_TO_HUB_ANCHOR[item.path] : undefined}
                  className="flex min-h-11 items-center text-body text-white transition-colors hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/12">
        <div className="site-container flex flex-col items-center justify-between gap-2 py-6 text-eyebrow font-semibold uppercase text-white/80 sm:flex-row">
          <span>Ordergroove · Internal use only</span>
          <span>Maintained by Brand &amp; Content</span>
        </div>
      </div>
    </footer>
  );
}
