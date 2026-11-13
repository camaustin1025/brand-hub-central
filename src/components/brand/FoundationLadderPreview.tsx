import { Heading } from "@/components/layout/Heading";
import { PlatformHierarchy } from "@/components/brand/PlatformHierarchy";
import type { ReactNode } from "react";
import { Ban, Check, Copy, Filter, ShieldCheck, Target, TrendingUp } from "lucide-react";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { TintedIcon } from "@/components/brand/TintedIcon";
import { ICON_COLORS } from "@/data/brand-resources";
import { RIGHTS } from "@/data/hub";
import { useCopyText } from "@/hooks/use-copy-text";
import { cn } from "@/lib/utils";

/*
 * Layout preview for /foundation, built on the message ladder: the page's
 * sections are the ladder's rungs, in ladder order, then the audience.
 * Renders on /foundation; /foundation-preview redirects there.
 *
 * Each section is a designed module in the spirit of the Typography plate on
 * Home: the content demonstrates itself (the category set as a specimen, the
 * lines people copy set at their real length) instead of describing itself.
 *
 * Layout keys off this column's width via container queries, not the
 * viewport, because the hub sidebar takes 284px from lg up.
 *
 * Paragraphs use the shared foreground. Small supporting labels use the
 * shared muted-foreground token, matching the rest of the hub.
 */
const SUPPORTING = "text-muted-foreground";

/* ---------------------------------------------------------------- shared */

export function CopyButton({ value, label, tone = "light" }: { value: string; label: string; tone?: "light" | "dark" }) {
  const { copy, copied, error } = useCopyText(value);
  return (
    <>
      <button
        type="button"
        onClick={copy}
        aria-label={`Copy ${label}`}
        className={cn(
          "tap-target inline-flex h-8 shrink-0 items-center gap-1.5 self-start rounded-full border px-3 text-[13px] font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 [&_svg]:size-3.5",
          tone === "dark"
            ? "border-white/40 text-white hover:border-white hover:bg-white/10 focus-visible:ring-white focus-visible:ring-offset-og-midnight"
            : "border-og-midnight bg-white text-og-midnight hover:bg-og-midnight hover:text-white focus-visible:ring-og-midnight focus-visible:ring-offset-white",
        )}
      >
        {copied ? <Check size={15} aria-hidden="true" /> : <Copy size={15} aria-hidden="true" />}
        {copied ? "Copied" : "Copy"}
      </button>
      <span role="status" className="sr-only">
        {error ? `Copy unavailable. Select the ${label} to copy it.` : copied ? `${label} copied` : ""}
      </span>
    </>
  );
}

function SectionHead({ id, title, lede, badge }: { id: string; title: string; lede?: ReactNode; badge?: string }) {
  return (
    <div>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <Heading as="h2" id={id} className="reference-section-title">{title}</Heading>
        {badge && <DraftBadge>{badge}</DraftBadge>}
      </div>
      {lede && <p className="section-lede mt-0.5 leading-7 text-foreground">{lede}</p>}
    </div>
  );
}

/* ------------------------------------------------------------ 1. ladder */

const RUNGS = [
  { rung: "Category", words: ["Autonomous Subscriptions"], href: "#category" },
  { rung: "Rights to Win", words: ["Everychannel Infrastructure", "The Groove Network", "Testing Velocity"], href: "#rights" },
  { rung: "Products", words: ["Agents", "Workflows", "Open Platform"], href: "#products" },
  { rung: "Proof points", words: ["Capabilities, stats, customer results"], note: "Deep-dive content only" },
];

/** The ladder as the page's map: each rung shows its real words and jumps to its section. */
function LadderStrip() {
  return (
    <div aria-label="Message ladder" className="foundation-ladder grid gap-0 overflow-hidden rounded-lg border border-border bg-white sm:grid-cols-2 xl:grid-cols-4">
      {RUNGS.map((item) => <div key={item.rung} className="border-b border-border p-5 last:border-b-0">
        <p className="text-sm font-semibold text-muted-foreground">{item.rung}</p>
        <ul className="mt-2 space-y-1 text-[15px] leading-6">{item.words.map((word) => <li key={word}>{word}</li>)}</ul>
        {item.note && <p className="mt-2 text-sm leading-6 text-muted-foreground">{item.note}</p>}
      </div>)}
    </div>
  );
}

/* ---------------------------------------------------------- 2. category */

/** Twin of the Figtree plate: the category set as a specimen, its spec beside it. */
function CategoryPlate() {
  return (
    <section id="category" aria-labelledby="category-title" className="scroll-mt-24">
      <SectionHead id="category-title" title="The category we own" lede="Autonomous Subscriptions is a new category, and we’re the ones defining it." />
      <div className="mt-6 grid overflow-hidden rounded-lg border border-border [@container(min-width:44rem)]:grid-cols-2">
        <div className="flex flex-col justify-between gap-10 bg-og-midnight p-6 md:p-8">
          {/* Sized so "Subscriptions" (about 7.5em wide in Figtree ExtraBold) fills its half of the plate. */}
          <p className="text-[34px] font-extrabold leading-[0.95] tracking-[-0.03em] text-og-green [@container(min-width:44rem)]:text-[38px] [@container(min-width:56rem)]:text-[48px] [@container(min-width:64rem)]:text-[58px]">
            Autonomous
            <br />
            Subscriptions
          </p>
          <CopyButton tone="dark" value="Autonomous Subscriptions" label="category name" />
        </div>
        <dl className="divide-y divide-border bg-white">
          <div className="grid gap-2 p-6 md:px-8">
            <dt className={cn("pt-0.5 text-sm font-semibold", SUPPORTING)}>Definition</dt>
            <dd className="measure text-base leading-7 text-og-midnight">
              Subscription infrastructure that runs itself. Built for every channel, trained on the largest enterprise subscription network, and able to test and grow faster than any team could alone.
            </dd>
          </div>
          <div className="grid gap-2 p-6 md:px-8">
            <dt className={cn("pt-0.5 text-sm font-semibold", SUPPORTING)}>Lead with</dt>
            <dd className="leading-7">The category and the outcome. The technology supports.</dd>
          </div>
        </dl>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ 3. say it */

const PITCH_10 =
  "Ordergroove is the subscription platform that helps you grow autonomously. Built for every channel, trained on the largest enterprise subscription network, and always testing, so results never wait on your team.";

const PITCH_30 = [
  "Ordergroove is the subscription platform that helps you grow autonomously.",
  "Most brands launch subscriptions strong and then stall. They’re stuck on one channel, they run on guesswork, and every improvement waits in a dev queue.",
  "Ordergroove works across every channel, online, in-store, or LLMs. It learns from the largest enterprise subscription network, and it’s always testing. So your subscriber base keeps compounding, and results never wait on your team.",
];

const BOILERPLATE =
  "Ordergroove is the enterprise standard for subscriptions and recurring revenue in the autonomous commerce era. Agent-friendly by architecture and trained on the largest subscription data set in enterprise commerce, Ordergroove powers the world’s most iconic brands, including L’Oréal, PetSmart, Keurig, Manscaped, Liquid I.V., Mattel, and Fiji Water. Across every channel, from storefront to retail to the next AI interface, Ordergroove turns one-time buyers into lasting relationships. Learn more at ordergroove.com.";

const SAY_IT = [
  { id: "pitch-10", name: "10-second pitch", use: "Event intros and booth conversations", paragraphs: [PITCH_10], size: "text-base leading-7" },
  { id: "pitch-30", name: "30-second pitch", use: "Calls, meetings, and panels", paragraphs: PITCH_30, size: "text-base leading-7" },
  { id: "boilerplate", name: "Company boilerplate", use: "Press releases, event listings, and speaker bios", paragraphs: [BOILERPLATE], size: "text-base leading-7" },
];

/** Twin of the Web hierarchy table: spec on the left, the words at their real length on the right. */
function SayItShelf() {
  return (
    <section id="say-it" aria-labelledby="say-it-title" className="scroll-mt-24">
      <SectionHead id="say-it-title" title="Pitches & boilerplate" lede="Three approved ways to describe Ordergroove, from a 10-second intro to the full boilerplate." />
      <ol className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        {SAY_IT.map((item) => (
          <li key={item.id} id={item.id} className="scroll-mt-24 grid gap-5 border-b border-border p-6 last:border-b-0 md:p-8 [@container(min-width:44rem)]:grid-cols-[13rem_minmax(0,1fr)] [@container(min-width:44rem)]:gap-10">
            <div className="flex flex-col gap-3">
              <div>
                <Heading as="h3" className="reference-item-title">{item.name}</Heading>
                <p className={cn("mt-1 text-sm leading-6", SUPPORTING)}>{item.use}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <CopyButton value={item.paragraphs.join("\n\n")} label={item.name} />
              </div>
            </div>
            <div className={cn("space-y-3 text-foreground [text-wrap:pretty]", item.size)}>
              {item.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

/* ------------------------------------------------------ 4. rights to win */

/** Canon copy split into what it is / why it matters. The split is a draft for Lauren. */
const RIGHTS_FRAME: Record<string, { what: string; why: string }> = {
  "1": {
    what: "One platform for storefronts, retail, voice, and agent endpoints you haven’t built yet.",
    why: "Integrate once and capture every channel, without re-architecting for each one.",
  },
  "2": {
    what: "The most diversified subscription data in enterprise commerce: 1,000+ brands, $110B+ in transaction signals, 75M+ subscriber profiles.",
    why: "Every reach, retry, recovery, and retention test is refined by that data.",
  },
  "3": {
    what: "Ordergroove agents propose variants. You deploy at 1%, 5%, or 10%.",
    why: "Every winner compounds, 24/7, alongside your team.",
  },
};

function RightsTable() {
  return (
    <section id="rights" aria-labelledby="rights-title" className="scroll-mt-24">
      <SectionHead id="rights-title" title="Rights to Win" lede="The three reasons brands choose Ordergroove, and why each one matters to a buyer." />
      <div className="mt-6 overflow-hidden rounded-lg border border-border bg-white">
        <div aria-hidden="true" className={cn("hidden border-b border-border bg-og-midnight/[0.03] px-8 py-3 text-sm font-semibold [@container(min-width:52rem)]:grid [@container(min-width:52rem)]:grid-cols-[15rem_minmax(0,1fr)_minmax(0,1fr)] [@container(min-width:52rem)]:gap-8", SUPPORTING)}>
          <span>Right to win</span>
          <span>What it is</span>
          <span>Why it matters</span>
        </div>
        <ol>
          {RIGHTS.map((item) => {
            const frame = RIGHTS_FRAME[item.n];
            return (
              <li key={item.n} className="grid gap-4 border-b border-border p-6 last:border-b-0 md:px-8 [@container(min-width:52rem)]:grid-cols-[15rem_minmax(0,1fr)_minmax(0,1fr)] [@container(min-width:52rem)]:gap-8">
                <div className="flex gap-4">
                  {/* The ol already numbers the rows for screen readers. 24px keeps #009A50 above 3:1. */}
                  <span aria-hidden="true" className="w-6 shrink-0 text-2xl font-extrabold leading-7 tabular-nums text-primary">{item.n}</span>
                  <div>
                    <Heading as="h3" className="reference-item-title">{item.title}</Heading>
                    <p className="mt-1 text-[15px] font-semibold leading-6 text-og-midnight">{item.tagline}</p>
                  </div>
                </div>
                <div className="pl-10 [@container(min-width:52rem)]:pl-0">
                  <p className={cn("text-sm font-semibold [@container(min-width:52rem)]:sr-only", SUPPORTING)}>What it is</p>
                  <p className="mt-1 leading-7 [@container(min-width:52rem)]:mt-0">{frame.what}</p>
                </div>
                <div className="pl-10 [@container(min-width:52rem)]:pl-0">
                  <p className={cn("text-sm font-semibold [@container(min-width:52rem)]:sr-only", SUPPORTING)}>Why it matters</p>
                  <p className="mt-1 leading-7 [@container(min-width:52rem)]:mt-0">{frame.why}</p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- 5. products */

function ProductStack() {
  return (
    <section id="products" aria-labelledby="products-title" className="scroll-mt-24">
      <SectionHead id="products-title" title="Products" lede="Subscription infrastructure, agent-to-agent ready." />
      <PlatformHierarchy />
    </section>
  );
}

/* ----------------------------------------------------- 6. who we serve */

type IcpTone = "primary" | "selective" | "opportunistic";

type Icp = {
  n: number;
  name: string;
  tone: IcpTone;
  tier: string;
  share?: string;
  description: string;
  rows: { label: string; value: string }[];
  callout: { label: string; value: string; tone: "value" | "rule" };
  /** Optional note pinned to the card's foot. ICP 4 has none. */
  footer?: { icon: "references" | "gate"; label: string; text: string };
};

/*
 * Every field is checked against the ICP Context Docs (Obsidian: Work/Projects/ICP Context Docs,
 * draft 1, data through Jul 29 2026), reviewed 2026-11-10. Tiers, revenue bands, and the
 * effort split are leadership's (Aug 5 brief). Win rates are internal: fine on this internal
 * hub, not for external use. Competitor names stay out per canon.
 */
const ICPS: Icp[] = [
  {
    n: 1, name: "Non-Shopify", tone: "primary", tier: "Primary focus", share: "About 2/3 of GTM effort",
    description: "Consumer brands and omnichannel retailers on any non-Shopify platform, at any size. Platform and complexity predict fit better than revenue does.",
    rows: [
      { label: "Platforms", value: "BigCommerce, Salesforce Commerce Cloud, Magento or Adobe Commerce, commercetools, SAP or Oracle, homegrown stacks" },
      { label: "Company revenue", value: "All revenue segments" },
      { label: "Partner motion", value: "Salesforce, BigCommerce, commercetools, and SCAYLE, plus the agencies and systems integrators that implement them" },
      { label: "Territory", value: "North America, 300 to 500 target accounts" },
    ],
    callout: { label: "Strategic value", value: "Platform-agnostic and built for complexity. Win rates on Magento (50%), SFCC (42.5%), commercetools (37.5%), and BigCommerce (35%) all beat Shopify Plus (25%).", tone: "value" },
    footer: { icon: "references", label: "Proven references", text: "Pet Valu (commercetools), Clarins (SFCC), Tractor Supply (homegrown, via API), Thorne" },
  },
  {
    n: 2, name: "Shopify Enterprise", tone: "primary", tier: "Primary focus", share: "About 1/3 of GTM effort",
    description: "Consumer brands with $100M+ company revenue on Shopify. Most already run subscriptions on another app and are deciding whether switching is worth the risk.",
    rows: [
      { label: "Platforms", value: "Shopify or Shopify Plus" },
      { label: "Company revenue", value: "$100M+" },
      { label: "Partner motion", value: "Shopify’s enterprise team plus Shopify Plus agencies (Anatta, Domaine, Corra, Tryzens in the UK)" },
      { label: "Territory", value: "North America and UK" },
    ],
    callout: { label: "Strategic value", value: "They have outgrown their subscription app. We win by quantifying the leak before the renewal and proving the migration.", tone: "value" },
    footer: { icon: "references", label: "Proven references", text: "Keurig, BARK, Manscaped" },
  },
  {
    n: 3, name: "Shopify Mid-Market", tone: "selective", tier: "Selective fit",
    description: "Growing Shopify brands. Ease and speed of implementation matter.",
    rows: [
      { label: "Company revenue", value: "$10M–$100M" },
      { label: "Motion", value: "Inbound only, reviewed case by case. No outbound." },
      { label: "Growth path", value: "Into ICP 2" },
    ],
    callout: { label: "Fit rule", value: "About $1M+ in subscription GMV today, or a funded launch with a $500K+ business case", tone: "value" },
    footer: { icon: "gate", label: "Qualify early", text: "Under about $1M in subscription GMV, the $35K floor won’t pay off. Say so and set a revenue trigger to come back." },
  },
  {
    n: 4, name: "Shopify SMB", tone: "opportunistic", tier: "Opportunistic",
    description: "Smaller Shopify brands, outside the core enterprise GTM focus.",
    rows: [
      { label: "Company revenue", value: "Under $10M" },
      { label: "Leadership stance", value: "“We will not be signing SMBs” (Aug 5 brief)" },
    ],
    callout: { label: "Rule", value: "No outbound. Take inbound only with about $1M+ in subscription revenue and a named pain. Otherwise say no early and nurture to the next renewal.", tone: "rule" },
  },
];

/* Tier color is carried by the tag and icons; text stays Midnight on every tint. */
const ICP_TONE: Record<IcpTone, { card: string; tag: string; dot: string }> = {
  primary: { card: "bg-white", tag: "bg-primary/10", dot: "bg-primary" },
  selective: { card: "bg-white", tag: "bg-og-midnight/[0.06]", dot: "bg-og-midnight/50" },
  opportunistic: { card: "bg-[#FAFAFC]", tag: "bg-og-radish/10", dot: "bg-og-radish" },
};

const FOOTER_ICON = {
  references: { Icon: ShieldCheck, color: "text-primary" },
  gate: { Icon: Filter, color: "text-muted-foreground" },
} as const;

/**
 * One card per ICP, in ICP order: tier tag and GTM share, name and summary, spec rows,
 * one highlighted callout (strategic value, fit rule, or the ICP 4 rule), then a footer
 * note pinned to the bottom so the footers line up across each row.
 */
function IcpCards() {
  return (
    <ol className="foundation-icps mt-6 grid gap-4 [@container(min-width:44rem)]:grid-cols-2">
      {ICPS.map((icp) => {
        const tone = ICP_TONE[icp.tone];
        const footer = icp.footer ? FOOTER_ICON[icp.footer.icon] : null;
        // Strategic value trends up; a fit rule targets; the ICP 4 rule blocks.
        const CalloutIcon = icp.callout.tone === "rule" ? Ban : icp.callout.label === "Fit rule" ? Target : TrendingUp;
        return (
          <li key={icp.n} className={cn("flex flex-col rounded-lg border border-border p-6", tone.card)}>
            <div className="flex min-h-7 flex-wrap items-center justify-between gap-x-3 gap-y-2">
              <span className={cn("inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-xs font-bold text-og-midnight", tone.tag)}>
                <span aria-hidden="true" className={cn("h-1.5 w-1.5 rounded-full", tone.dot)} />
                ICP {icp.n} · {icp.tier}
              </span>
              {icp.share && <span className="text-sm font-semibold text-primary">{icp.share}</span>}
            </div>
            <Heading as="h3" className={cn("mt-4 reference-item-title", icp.tone === "opportunistic" && "text-og-midnight/80")}>{icp.name}</Heading>
            <p className="mt-1.5 leading-7 text-foreground">{icp.description}</p>
            <dl className="mt-5 divide-y divide-border border-y border-border">
              {icp.rows.map((row) => (
                // Phones: label over value, so long values keep the card's full width.
                <div key={row.label} className="grid gap-x-4 gap-y-0.5 py-3 [@container(min-width:30rem)]:grid-cols-[7.5rem_minmax(0,1fr)]">
                  <dt className={cn("text-sm leading-6", SUPPORTING)}>{row.label}</dt>
                  <dd className="text-[15px] font-semibold leading-6 text-og-midnight">{row.value}</dd>
                </div>
              ))}
            </dl>
            <div className={cn("mt-4 flex gap-3 rounded-md px-4 py-3", icp.callout.tone === "rule" ? "bg-og-radish/[0.08]" : "bg-primary/[0.08]")}>
              <CalloutIcon size={18} aria-hidden="true" className={cn("mt-0.5 shrink-0", icp.callout.tone === "rule" ? "text-og-radish" : "text-primary")} />
              <div>
                <p className={cn("text-xs font-bold", SUPPORTING)}>{icp.callout.label}</p>
                <p className="mt-0.5 text-[15px] font-semibold leading-6 text-og-midnight">{icp.callout.value}</p>
              </div>
            </div>
            {icp.footer && footer && (
              <div className="mt-auto pt-4">
                <p className="flex items-start gap-2.5 rounded-md bg-og-midnight/[0.04] px-3.5 py-2.5 text-sm leading-6 text-og-midnight">
                  <footer.Icon size={17} aria-hidden="true" className={cn("mt-[3px] shrink-0", footer.color)} />
                  <span><span className="font-bold">{icp.footer.label}:</span> {icp.footer.text}</span>
                </p>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

/*
 * Each group takes one light-surface icon color from the icon library, used three ways:
 * the tinted icon, a 12% tint behind its column head, and its "cares about" chips.
 * Text stays Midnight on every tint, so contrast never depends on the accent.
 */
const ICON_LIGHT = (name: string) => ICON_COLORS.light.find((color) => color.name === name)!;

const GROUPS = [
  {
    name: "Business leaders",
    icon: "work",
    color: ICON_LIGHT("Brand Green"),
    titles: ["VP or Director of eCommerce", "VP or Head of Digital", "Retention, loyalty, CRM, and subscription leaders"],
    cares: ["Revenue", "Churn", "Speed to market"],
  },
  {
    name: "Technology leaders",
    icon: "language",
    color: ICON_LIGHT("Flamingo Pink"),
    titles: ["CTO, CIO, VP of Engineering", "eCommerce platform leaders", "Enterprise architecture leaders"],
    cares: ["Integration", "Scalability", "Data access", "Readiness for an agentic stack", "Total cost of ownership vs. building"],
  },
] as const;

/** Two buying groups compared row by row; subgrid keeps Titles and Cares aligned across both. */
function BuyingGroups() {
  return (
    <section id="personas" aria-labelledby="personas-title" className="scroll-mt-24">
      <SectionHead id="personas-title" title="Personas" lede="In every ICP, we focus on two key personas: business leaders and technology leaders." />
      <div className="mt-6 grid overflow-hidden rounded-lg border border-border bg-white [@container(min-width:44rem)]:grid-cols-[7.5rem_minmax(0,1fr)_minmax(0,1fr)] [@container(min-width:44rem)]:grid-rows-[auto_auto_auto]">
        <div aria-hidden="true" className={cn("hidden text-sm font-semibold [@container(min-width:44rem)]:row-span-3 [@container(min-width:44rem)]:grid [@container(min-width:44rem)]:grid-rows-subgrid", SUPPORTING)}>
          <span className="border-b border-border" />
          <span className="border-b border-border px-5 py-5">Titles</span>
          <span className="px-5 py-5">Cares about</span>
        </div>
        {GROUPS.map((group) => (
          <section key={group.name} aria-label={group.name} className="border-t border-border first-of-type:border-t-0 [@container(min-width:44rem)]:row-span-3 [@container(min-width:44rem)]:grid [@container(min-width:44rem)]:grid-rows-subgrid [@container(min-width:44rem)]:border-l [@container(min-width:44rem)]:border-t-0">
            <Heading as="h4" className="flex items-center gap-3 border-b border-border px-6 py-4 text-lg font-semibold">
              <TintedIcon name={group.icon} color={group.color} size={24} />
              {group.name}
            </Heading>
            <div className="border-b border-border px-6 py-5">
              <p className={cn("mb-2 text-sm font-semibold [@container(min-width:44rem)]:sr-only", SUPPORTING)}>Titles</p>
              <ul className="space-y-1.5 leading-6">
                {group.titles.map((title) => <li key={title}>{title}</li>)}
              </ul>
            </div>
            <div className="px-6 py-5">
              <p className={cn("mb-2 text-sm font-semibold [@container(min-width:44rem)]:sr-only", SUPPORTING)}>Cares about</p>
              <ul className="space-y-1.5">
                {group.cares.map((item) => (
                  <li key={item} className="text-base leading-6 text-og-midnight">{item}</li>
                ))}
              </ul>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function WhoWeServe() {
  return (
    <section id="audience" aria-labelledby="audience-title" className="scroll-mt-24">
      <SectionHead
        id="audience-title"
        title="Who we serve"
        lede="Our core audience: four ideal customer profiles (ICPs), led by Non-Shopify and Shopify Enterprise."
      />
      <IcpCards />
    </section>
  );
}

/* ------------------------------------------------------------------ page */

export function FoundationLadderPreview() {
  return (
    <div className="foundation-reference flex flex-col gap-12 [container-type:inline-size]">
      <CategoryPlate />
      <LadderStrip />
      <SayItShelf />
      <RightsTable />
      <ProductStack />
      <WhoWeServe />
      <BuyingGroups />
    </div>
  );
}
