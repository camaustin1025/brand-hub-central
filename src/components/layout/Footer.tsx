import { Link } from "@tanstack/react-router";

/**
 * The closing Midnight island. It runs on a 12-column field — 5 columns of
 * identity, then hairline-separated link stacks for the three brand-hub modes.
 * Green resolves to #00FF85 on this dark surface.
 */
const COLUMNS = [
  {
    heading: "Guidelines",
    span: "md:col-span-4",
    links: [
      { label: "Foundation & Messaging", to: "/foundation" as const },
      { label: "Voice & Language Rules", to: "/voice" as const },
      { label: "Visual Identity", to: "/visual-identity" as const },
      { label: "Design Tokens", to: "/tokens" as const },
    ],
  },
  {
    heading: "Assets",
    span: "md:col-span-2",
    links: [
      { label: "Downloads", to: "/downloads" as const },
      { label: "Templates", to: "/toolkit" as const },
    ],
  },
  {
    heading: "Toolkit",
    span: "md:col-span-3",
    links: [
      { label: "GTM & Employee Toolkit", to: "/toolkit" as const },
      { label: "AI & Skills", to: "/ai-skills" as const },
      { label: "Get help", to: "/ai-skills" as const },
    ],
  },
];

export function Footer() {
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
          <p className="max-w-[34ch] text-[15px] leading-relaxed text-white/72">
            The internal home for the Ordergroove brand. Guidelines, assets, and the tools to stay
            on brand.
          </p>
        </div>
        {COLUMNS.map((col) => (
          <div
            key={col.heading}
            className={`flex flex-col gap-3.5 md:border-l md:border-white/12 md:pl-7 ${col.span}`}
          >
            <h2 className="text-xs font-bold uppercase tracking-[0.16em] text-primary">
              {col.heading}
            </h2>
            {/* No gap: `min-h-11` is already the 44px touch target, so adding
                10px on top of it gave the footer 54px rows and made three
                short link lists read as a much bigger block than they are. */}
            <div className="flex flex-col">
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  to={l.to}
                  className="flex min-h-11 items-center text-[15px] text-white transition-colors hover:text-primary"
                >
                  {l.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="border-t border-white/12">
        <div className="site-container flex flex-col items-center justify-between gap-2 py-[22px] text-xs font-semibold uppercase tracking-[0.16em] text-white/80 sm:flex-row">
          <span>Ordergroove · Internal use only</span>
          <span>Maintained by Brand &amp; Content</span>
        </div>
      </div>
    </footer>
  );
}
