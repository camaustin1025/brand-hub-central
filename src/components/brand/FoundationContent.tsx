import { Heading } from "@/components/layout/Heading";
import { TintedIcon } from "@/components/brand/TintedIcon";
import { BUYING_GROUPS, LADDER, RIGHTS } from "@/data/hub";
import { cn } from "@/lib/utils";

/*
 * Positioning, audience, the message ladder, and Rights to Win, in the order
 * the copy is written. Lives on /foundation.
 *
 * Layout keys off this column's width, not the viewport: the hub sidebar takes
 * 284px from lg up, so a viewport breakpoint misjudges the room.
 *
 * One grid for every row module. The definition panel, the ladder, and Rights
 * to Win all sit 32px inside their frame, then split into a 16rem label column
 * and a content column at 48rem. Every label starts at the same x and every
 * description starts at the same x, so the three modules read as one table.
 * Below 48rem a row stacks: label, then content.
 *
 * The page uses ChapterPage's "reading" width (57rem, 912px): 32px inset x2 +
 * 16rem label + 32px gap + the ~554px measure. Wider, and every panel and row
 * carries empty space to the right of its text.
 *
 * Type, six sizes: 42 page title, 28 section head, 24 definition and numerals,
 * 18 item titles and the page intro, 16 body, 12 eyebrow. Bold is for headings;
 * the taglines keep semibold because they are the pillar messages.
 * Line length targets (Bringhurst, WCAG 1.4.8): body 45-75 characters, ~66
 * ideal; phones 30-45; display text 30-50; never past 80.
 * Rhythm: 64px between the page head and every section (56 on phones), 12px
 * head to lede, 24px lede to module. Padding: 24px boxes, 32px panels and rows.
 */
const SECTION_HEAD = "text-[28px] font-bold leading-tight";
const LEDE = "measure mt-3 leading-7 text-foreground";
const ROW_GRID =
  "[@container(min-width:48rem)]:grid [@container(min-width:48rem)]:grid-cols-[16rem_minmax(0,1fr)] [@container(min-width:48rem)]:gap-x-8";

const ICP_SEGMENTS = [
  {
    name: "Non-Shopify", priority: "Primary focus", revenue: "All revenue segments",
    description: "BigCommerce · SFCC · Magento · commercetools · Custom platforms",
    detail: "Partner motion: platform + agency ecosystems. Complexity is a recurring enterprise fit signal.",
  },
  {
    name: "Shopify Enterprise", priority: "Primary focus", revenue: "$100M+ company revenue",
    description: "Shopify brands at enterprise scale",
    detail: "Partner motion: Shopify + agencies. Territory discussed: North America + UK.",
  },
  {
    name: "Shopify Mid-Market", priority: "Selective fit", revenue: "$10M–$100M company revenue",
    description: "Growing Shopify brands",
    detail: "Ease and speed of implementation matter. Leadership sees a growth path into ICP 2.",
  },
  {
    name: "Shopify SMB", priority: "Opportunistic", revenue: "Under $10M company revenue",
    description: "Smaller Shopify brands",
    detail: "Pursue when the opportunity fits. Outside the core enterprise GTM focus.",
  },
];

export function FoundationContent() {
  return (
    // --measure 54ch (~554px, ~77 Figtree characters at 16px; Figtree averages
    // 7.2px a character). The site default 50ch caps near 71, which split the
    // 71-character first ladder step into two 36-character lines. Measured
    // 2026-11-06: 55ch and 56ch push the first pillar to an 80/81-character line
    // (past the 75 target and at the WCAG 1.4.8 ceiling). .measure wraps
    // "pretty" (see src/index.css), so lines fill to this measure instead of
    // being evened out short of it.
    <div className="flex flex-col gap-14 pt-4 [--measure:54ch] [container-type:inline-size] md:gap-16 md:pt-6">
      <section aria-labelledby="foundation-category">
        <Heading as="h2" id="foundation-category" className={SECTION_HEAD}>The category we own</Heading>
        <p className={LEDE}>
          Our lead message is a category move, not a product pitch. Autonomous Subscriptions is the category we are defining:
        </p>
        {/* The page's key statement, set as a term and its definition: the
            category name holds the label column, the definition the content
            column, so the panel's width carries meaning instead of empty space. */}
        <dl className={cn("mt-6 rounded-lg bg-og-midnight p-6 md:p-8 [@container(min-width:48rem)]:items-baseline", ROW_GRID)}>
          <dt className="text-2xl font-bold leading-tight tracking-tight text-og-green md:text-[28px]">Autonomous Subscriptions</dt>
          <dd className="mt-3 max-w-[34rem] text-lg font-semibold leading-snug tracking-tight text-white text-balance md:text-2xl [@container(min-width:48rem)]:mt-0">
            Subscription infrastructure that runs itself. Built for every channel, trained on the largest enterprise subscription network, and able to test and grow faster than any team could alone.
          </dd>
        </dl>
      </section>

      <section aria-labelledby="foundation-audience">
        <Heading as="h2" id="foundation-audience" className={SECTION_HEAD}>Who we serve</Heading>
        <p className={LEDE}>
          Our direct-to-consumer ideal customer profiles (ICPs) are defined by commerce platform and company revenue. Non-Shopify and Shopify Enterprise are our primary focus.
        </p>
        <ol className="mt-6 grid gap-4 [@container(min-width:44rem)]:grid-cols-2">
          {ICP_SEGMENTS.map((segment, index) => (
            <li key={segment.name} className={cn("flex flex-col rounded-lg border p-6", index < 2 ? "border-og-midnight bg-og-midnight text-white" : "border-border bg-white")}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-bold uppercase tracking-wide">
                <span className={index < 2 ? "text-og-green" : "text-muted-foreground"}>ICP {index + 1}</span>
                <span>{segment.priority}</span>
              </div>
              <Heading as="h3" className="mt-4 text-2xl font-bold leading-tight">{segment.name}</Heading>
              <p className={cn("mt-2 font-semibold leading-7", index < 2 && "text-og-green")}>{segment.revenue}</p>
              <p className="mt-3 leading-7">{segment.description}</p>
              <p className={cn("mt-5 border-t pt-4 leading-7", index < 2 ? "border-white/20" : "border-border text-foreground")}>{segment.detail}</p>
            </li>
          ))}
        </ol>
        <div className="mt-4 rounded-lg border border-border bg-white p-6">
          <Heading as="h3" className="text-sm font-bold">GTM focus across the two priority segments</Heading>
          <div aria-hidden="true" className="mt-4 flex h-3 overflow-hidden rounded-full">
            <div className="w-2/3 bg-og-midnight" />
            <div className="w-1/3 bg-og-green" />
          </div>
          <p className="mt-3 text-sm leading-6">Approximately 2/3 ICP 1 · Non-Shopify and 1/3 ICP 2 · Shopify Enterprise.</p>
        </div>
        <Heading as="h3" className="mt-8 text-2xl font-bold">Our buying groups</Heading>
        <p className={LEDE}>Across these segments, we sell to two buying groups:</p>
        <ul className="mt-6 grid gap-4 [@container(min-width:44rem)]:grid-cols-2">
          {BUYING_GROUPS.map((item) => (
            // Subgrid shares the icon / title / roles / priorities rows across
            // both boxes, so the divider lines up even when one list runs longer.
            <li key={item.group} className="row-span-4 grid grid-rows-subgrid gap-0 rounded-lg border border-border bg-white p-6">
              <TintedIcon name={item.icon} className="mb-4" />
              <Heading as="h3" className="text-lg font-bold leading-7">{item.group}</Heading>
              <p className="measure mb-5 mt-2 leading-7 text-foreground">{item.roles}</p>
              <div className="border-t border-border pt-4">
                <p className="measure leading-7 text-foreground">{item.cares}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="foundation-ladder">
        <Heading as="h2" id="foundation-ladder" className={SECTION_HEAD}>Message ladder</Heading>
        <ol className="mt-6 rounded-lg bg-og-midnight p-6 text-white md:p-8">
          {LADDER.map((item, index) => (
            <li key={item.rung} className={cn("relative pb-6 last:pb-0", ROW_GRID)}>
              {index < LADDER.length - 1 && <span aria-hidden="true" className="absolute bottom-0 left-[15px] top-8 hidden w-px bg-white/15 [@container(min-width:30rem)]:block" />}
              <div className="flex items-center gap-4 self-start">
                <span aria-hidden="true" className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-og-green text-sm font-extrabold text-og-midnight">{index + 1}</span>
                <Heading as="h3" className="text-lg font-bold leading-7 tracking-normal">{item.rung}</Heading>
              </div>
              {/* Phones: full width under the title, connector hidden, which buys
                  ~10 characters a line. Stacked with room: indented past the circle
                  and connector. Wide: its own column; pt-0.5 matches the title,
                  which centers on the 32px circle. */}
              <p className="measure mt-2 leading-7 text-white [@container(min-width:30rem)_and_(max-width:47.99rem)]:pl-12 [@container(min-width:48rem)]:mt-0 [@container(min-width:48rem)]:pt-0.5">{item.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="foundation-rights">
        <Heading as="h2" id="foundation-rights" className={SECTION_HEAD}>Rights to Win</Heading>
        <ol className="mt-6 border-t border-border">
          {RIGHTS.map((item) => (
            <li key={item.n} className={cn("border-b border-border py-6 md:px-8", ROW_GRID)}>
              <div className="flex items-baseline gap-4 self-start">
                {/* Same 32px slot as the ladder's step circles, so numerals and
                    circles share a center line. 24px keeps the green above 3:1. */}
                <span className="w-8 shrink-0 text-center text-2xl font-extrabold leading-7 tabular-nums text-primary">{item.n}</span>
                <Heading as="h3" className="text-lg font-bold leading-7">{item.title}</Heading>
              </div>
              {/* Wide: pt-1 matches the title, which sits on the 24px numeral's baseline. */}
              <div className="mt-3 [@container(min-width:48rem)]:mt-0 [@container(min-width:48rem)]:pt-1">
                <p className="measure font-semibold leading-7 text-foreground">{item.tagline}</p>
                <p className="measure mt-1 leading-7 text-foreground">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="foundation-boilerplate" className="rounded-lg border border-border bg-white p-6">
        <Heading as="h2" id="foundation-boilerplate" className="scroll-mt-24 text-lg font-bold">Company boilerplate</Heading>
        <p className="mt-3 leading-7 text-foreground">
          <a href="http://ordergroove.com/?utm_source=pr&utm_medium=press&utm_campaign=0926q3_goop_email_press_all&utm_content=demo&" className="font-bold text-foreground underline underline-offset-4">Ordergroove</a>{" "}
          is the enterprise standard for subscriptions and recurring revenue in the autonomous commerce era. Agent-friendly by architecture and trained on the largest subscription data set in enterprise commerce, Ordergroove powers the world’s most iconic brands, including L’Oréal, PetSmart, Keurig, Manscaped, Liquid I.V., Mattel, and Fiji Water. Across every channel, from storefront to retail to the next AI interface, Ordergroove turns one-time buyers into lasting relationships. Learn more at ordergroove.com.
        </p>
      </section>
    </div>
  );
}
