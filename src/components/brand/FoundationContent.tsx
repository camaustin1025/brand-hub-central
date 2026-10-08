import { DraftBadge } from "@/components/brand/DraftBadge";
import { LADDER, RIGHTS } from "@/data/hub";
import { cn } from "@/lib/utils";

/** Positioning, audience, Rights to Win, and the message ladder.
 *  Lives on /foundation; no longer inlined on the hub home page. */
export function FoundationContent() {
  return (
    <>
      <div className="grid gap-10 lg:grid-cols-[1fr_.9fr]">
        <div className="space-y-9">
          <div>
            <h3 className="text-2xl font-bold">The category we own</h3>
            <p className="measure mt-3 leading-7 text-muted-foreground">
              Our lead message is a category move, not a product pitch. <strong className="text-foreground">Autonomous Subscriptions</strong> is the category we are defining: a team of agents that help enterprise brands recover revenue, reduce churn, and act on subscriber data faster.
            </p>
            <p className="measure mt-3 text-sm leading-6 text-muted-foreground">
              Cleared for external use since June 17, 2026. “Autonomous Commerce” stays internal for now. “Relationship Commerce” is retired, never use it.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Central belief</h3>
            <p className="measure mt-3 leading-7 text-muted-foreground">
              Subscriptions aren't programs. They're relationships. Growth comes from flexibility, not lock-in, and the best retention is giving customers control, not friction.
            </p>
          </div>
          <div>
            <h3 className="text-2xl font-bold">Who we serve</h3>
            <p className="measure mt-3 leading-7 text-muted-foreground">
              Enterprise and mid-market B2C brands with repeat purchase patterns, typically $50M+ GMV. Buyers are VP or Director of eCommerce, VP or Head of Digital, and retention, loyalty, CRM, and subscription leaders.
            </p>
          </div>
        </div>
        <div className="rounded-lg bg-og-midnight p-7 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-og-green">Message ladder</p>
          <ol className="mt-6 space-y-0">
            {LADDER.map((item, index) => (
              <li key={item.rung} className="relative flex gap-4 pb-6 last:pb-0">
                {index < LADDER.length - 1 && <span className="absolute left-[15px] top-8 h-[calc(100%-24px)] w-px bg-white/15" />}
                <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-og-green text-sm font-extrabold text-og-midnight">{index + 1}</span>
                <div>
                  <h4 className="font-bold">{item.rung}</h4>
                  <p className="measure mt-1 text-sm leading-6 text-white/60">{item.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>

      <div className="mt-14">
        <div className="mb-5 flex items-end justify-between gap-4">
          <h3 className="text-2xl font-bold">Rights to Win</h3>
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">Locked order</span>
        </div>
        <div className="grid border-y border-border md:grid-cols-3">
          {RIGHTS.map((item, index) => (
            <div key={item.n} className={cn("py-6 md:px-6", index > 0 && "border-t border-border md:border-l md:border-t-0", index === 0 && "md:pl-0", index === RIGHTS.length - 1 && "md:pr-0")}>
              <span className="text-sm font-extrabold text-primary">{item.n}</span>
              <h4 className="mt-3 text-lg font-bold">{item.title}</h4>
              <p className="measure mt-2 text-sm leading-6 text-muted-foreground">{item.body}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 rounded-lg border border-border bg-white p-6">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="text-lg font-bold">Company boilerplate</h3>
          <DraftBadge>Pending leadership approval</DraftBadge>
        </div>
        <p className="measure mt-3 text-sm leading-6 text-muted-foreground">
          Ordergroove is the enterprise standard for subscriptions and recurring revenue, powering flexible subscriber experiences for 1,000+ leading brands across every channel.
        </p>
      </div>
    </>
  );
}
