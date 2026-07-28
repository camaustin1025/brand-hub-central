import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/layout/PageHeader";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { OnThisPage, type PageSection } from "@/components/layout/OnThisPage";
import { ModuleHead } from "@/components/brand/SectionHead";

export const Route = createFileRoute("/foundation")({
  component: Foundation,
});

const SECTIONS: PageSection[] = [
  { id: "category", label: "The category we own" },
  { id: "belief", label: "Central belief" },
  { id: "audience", label: "Who we serve" },
  { id: "rights", label: "Rights to Win" },
  { id: "ladder", label: "The message ladder" },
  { id: "boilerplate", label: "Company boilerplate" },
];

const RIGHTS = [
  {
    n: "01",
    title: "Everychannel Infrastructure",
    body: "Subscriptions that work across every channel: in-store, digital, wholesale, and emerging surfaces. Scan to Subscribe is a proof point here.",
  },
  {
    n: "02",
    title: "The Groove Network",
    body: "The data moat: 1,000+ brands, $110B+ in transaction signals, 75M+ subscriber profiles. The most diversified data network in the category.",
  },
  {
    n: "03",
    title: "Testing Velocity",
    body: "Continuous experimentation at a pace no team could match alone. Agents appear by name only inside this pillar.",
  },
];

const LADDER = [
  {
    rung: "Category",
    body: "Autonomous Subscriptions, the shift in how subscription commerce works.",
  },
  {
    rung: "Rights to Win",
    body: "Everychannel Infrastructure, The Groove Network, Testing Velocity, in that locked order.",
  },
  { rung: "Products", body: "The agents, Workflows, GraphQL, the MCP server." },
  { rung: "Proof points", body: "Capabilities, stats, customer results. Deep-dive content only." },
];

function Foundation() {
  return (
    <>
      <PageHeader
        eyebrow="Foundation & Messaging"
        title="Who we are and what we lead with"
        subhead="Ordergroove is the enterprise standard for subscriptions and recurring revenue. Always ladder down from the category, never up from features."
      />

      {/* Prose sits in the same 8-column measure PageHeader's title block uses,
          so the masthead and the body share one left edge. */}
      <section className="site-container grid-12 section-step section-end">
        <div className="col-span-12 space-y-[var(--step-module)] md:col-span-8">
          <div>
            <ModuleHead id="category" title="The category we own" />
            <p className="block-step text-muted-foreground">
              Our lead message is a category move, not a product pitch.
              <strong className="text-foreground"> Autonomous Subscriptions</strong> is the category
              we are defining: a team of AI agents that help enterprise brands recover revenue,
              reduce churn, and act on subscriber data faster.
            </p>
            <p className="mt-3 text-sm text-muted-foreground">
              Cleared for external use since June 17, 2026. "Autonomous Commerce" stays internal for
              now. "Relationship Commerce" is retired, never use it.
            </p>
          </div>

          <div>
            <ModuleHead id="belief" title="Central belief" />
            <p className="block-step text-muted-foreground">
              Subscriptions aren't programs. They're relationships. Growth comes from flexibility,
              not lock-in, and the best retention is giving customers control, not friction.
            </p>
          </div>

          <div>
            <ModuleHead id="audience" title="Who we serve" />
            <p className="block-step text-muted-foreground">
              Enterprise and mid-market B2C brands with repeat purchase patterns (CPG, beauty,
              wellness, pet, food, retail, omnichannel), typically $50M+ GMV. Buyers are VP/Director
              of eCommerce, VP/Head of Digital, and retention, loyalty, CRM, and subscription
              leaders.
            </p>
          </div>

          <div>
            <ModuleHead
              id="rights"
              title="Rights to Win"
              aside={<span className="text-sm text-muted-foreground">locked order</span>}
            />
            <div className="block-step space-y-4">
              {RIGHTS.map((r) => (
                <div key={r.n} className="visual-container border border-border bg-card p-5">
                  <div className="flex gap-4">
                    <span className="text-2xl font-extrabold text-primary">{r.n}</span>
                    <div>
                      <h3 className="font-semibold">{r.title}</h3>
                      <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <ModuleHead
              id="ladder"
              title="The message ladder"
              note="Every asset starts at the top and steps down only as far as the format requires."
            />
            <ol className="block-step space-y-3">
              {LADDER.map((l, i) => (
                <li key={l.rung} className="flex gap-4">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {i + 1}
                  </span>
                  <div>
                    <span className="font-semibold">{l.rung}</span>
                    <span className="text-muted-foreground"> — {l.body}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div>
            <ModuleHead
              id="boilerplate"
              title="Company boilerplate"
              aside={<DraftBadge>Pending leadership approval</DraftBadge>}
            />
            <p className="visual-container block-step border border-border bg-card p-6 text-sm text-muted-foreground">
              Ordergroove is the enterprise standard for subscriptions and recurring revenue,
              powering flexible subscriber experiences for 1,000+ leading brands across every
              channel.
            </p>
          </div>
        </div>

        <OnThisPage sections={SECTIONS} />
      </section>
    </>
  );
}
