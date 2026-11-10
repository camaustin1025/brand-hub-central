import type { ReactNode } from "react";
import { ArrowUpRight, ShieldCheck, ShieldX } from "lucide-react";
import {
  APPROVAL_STEPS,
  CONNECTORS,
  HOW_TO_POSTS,
  INFOSEC_CHANNEL,
  OG_AI_CHANNEL,
  ORG_PLUGINS,
  RUBBER_DUCKY_POST,
  SECURITY_CHANNEL,
  SECURITY_GUIDELINES,
  SECURITY_SUMMARY,
  SHARING_RULES,
  SKILL_GROUPS,
  SKILL_ONE_PAGERS,
  SKILL_STATUS,
  SLACK_CHANNELS,
  TRAINING,
  type SkillStatus,
} from "@/data/ai-resources";
import { cn } from "@/lib/utils";

/*
 * /ai-resources: where to start with Claude at Ordergroove, what you can share with AI
 * tools, the skills in the org library, and the channels, training, and connectors
 * around them. Content lives in src/data/ai-resources.ts.
 *
 * Rows key off this column's width (container queries), not the viewport, because the
 * hub sidebar takes 284px from lg up. Type and rhythm follow FoundationContent: 28px
 * section heads, 64px between sections, 24px boxes.
 */

const SECTION_HEAD = "scroll-mt-24 text-[28px] font-bold leading-tight";
const LEDE = "measure mt-3 leading-7 text-muted-foreground";
const LIST = "mt-6 divide-y divide-border rounded-lg border border-border bg-white";

function OutLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("action-focus inline-flex items-center gap-1.5 underline underline-offset-4", className)}
    >
      {children}
      <ArrowUpRight size={15} aria-hidden="true" className="shrink-0" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

function StatusBadge({ status }: { status: SkillStatus }) {
  return (
    <span
      className={cn(
        "inline-flex whitespace-nowrap rounded px-2 py-1 text-xs font-semibold",
        status === "org" && "bg-og-midnight text-white",
        status === "shared" && "bg-og-gray-900 text-og-midnight",
        status === "catalog" && "border border-border bg-white text-og-gray-300",
      )}
    >
      {SKILL_STATUS[status].label}
    </span>
  );
}

function StartHere() {
  const steps = [
    {
      title: `Join ${OG_AI_CHANNEL.label}`,
      body: "The main channel for AI resources, tips, best practices, and new skill launches.",
      link: { label: `Open ${OG_AI_CHANNEL.label}`, url: OG_AI_CHANNEL.url },
    },
    {
      title: "Read the security guidelines",
      body: "What you can and can’t put into AI tools. The key points are summarized below.",
      link: { label: "Open the guidelines", url: SECURITY_GUIDELINES.url },
    },
  ];
  return (
    <section aria-labelledby="ai-start-here">
      <h2 id="ai-start-here" className={SECTION_HEAD}>Start here</h2>
      <ol className={cn("mt-6 grid gap-4", `[@container(min-width:44rem)]:grid-cols-2`)}>
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 rounded-lg border border-border bg-white p-6">
            <span
              aria-hidden="true"
              className="flex size-9 shrink-0 items-center justify-center rounded-full bg-og-midnight text-base font-bold text-og-green"
            >
              {index + 1}
            </span>
            <div>
              <h3 className="text-lg font-bold leading-7">{step.title}</h3>
              <p className="mt-1 leading-7 text-muted-foreground">{step.body}</p>
              <OutLink href={step.link.url} className="mt-2 min-h-11 text-sm font-semibold">
                {step.link.label}
              </OutLink>
            </div>
          </li>
        ))}
      </ol>
      <div className={cn("mt-4 grid gap-6 rounded-lg bg-og-gray-950 p-6", `[@container(min-width:44rem)]:grid-cols-2`)}>
        <div>
          <h3 className="text-base font-bold">Give Claude a useful brief</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Include the audience, desired outcome, source material, and anything that must stay exactly as written. Separate supplied facts from ideas you want Claude to develop.</p>
        </div>
        <div>
          <h3 className="text-base font-bold">Review before you share</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">Check names, figures, customer logos, placeholders, and slide layouts against your source material. A skill applies the brand rules; you still review the content and final file.</p>
        </div>
      </div>
    </section>
  );
}

function Sharing() {
  const columns = [
    { title: "Never share", icon: ShieldX, items: SHARING_RULES.never },
    { title: "Team account only", icon: ShieldCheck, items: SHARING_RULES.teamOnly },
  ];
  return (
    <section aria-labelledby="ai-sharing">
      <h2 id="ai-sharing" className={SECTION_HEAD}>What you can share with AI tools</h2>
      <p className={LEDE}>
        The key points from the{" "}
        <OutLink href={SECURITY_GUIDELINES.url} className="text-foreground">{SECURITY_GUIDELINES.label}</OutLink>.
        Ofir posted a summary on Feb 3, 2026:{" "}
        <OutLink href={SECURITY_SUMMARY.url} className="text-foreground">{SECURITY_SUMMARY.label}</OutLink>.
      </p>
      <div className={cn("mt-6 grid gap-4", `[@container(min-width:44rem)]:grid-cols-2`)}>
        {columns.map(({ title, icon: Icon, items }) => (
          <div key={title} className="rounded-lg border border-border bg-white p-6">
            <h3 className="flex items-center gap-2 text-base font-bold">
              <Icon size={20} aria-hidden="true" className="shrink-0 text-og-midnight" />
              {title}
            </h3>
            <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
              {items.map((item) => <li key={item}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-4 rounded-lg bg-og-gray-950 p-5 text-sm leading-6">
        <strong className="font-bold">Best practice:</strong> sign in to Team accounts (Claude, ChatGPT, Gemini) with
        your OG Gmail. These accounts don’t train models on your data and delete it every 30 days.
      </p>
    </section>
  );
}

function SkillsLibrary() {
  return (
    <section aria-labelledby="ai-skills-library">
      <h2 id="ai-skills-library" className={SECTION_HEAD}>Claude skills in the org library</h2>
      <p className={LEDE}>Open a skill to add it in Claude. Each one is tagged with how it’s shared.</p>

      <dl className={cn("mt-6 grid gap-3 rounded-lg bg-og-gray-950 p-5 text-sm", `[@container(min-width:44rem)]:grid-cols-3`)}>
        {(Object.keys(SKILL_STATUS) as SkillStatus[]).map((status) => (
          <div key={status} className="flex items-start gap-3">
            <dt className="shrink-0"><StatusBadge status={status} /></dt>
            <dd className="leading-6 text-muted-foreground">{SKILL_STATUS[status].body}</dd>
          </div>
        ))}
      </dl>

      {SKILL_GROUPS.map((group) => (
        <div key={group.id} className="mt-10">
          <h3 className="text-xl font-bold">{group.label}</h3>
          <ul className={LIST}>
            {group.skills.map((s) => (
              <li
                key={s.name}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)] gap-x-4 gap-y-2 p-5",
                  `[@container(min-width:44rem)]:grid-cols-[17rem_minmax(0,1fr)_9.5rem] [@container(min-width:44rem)]:items-baseline`,
                )}
              >
                <OutLink href={s.url} className="col-start-1 row-start-1 break-words font-mono text-sm font-semibold text-foreground">
                  {s.name}
                </OutLink>
                <span className={cn("row-start-2 justify-self-start", `[@container(min-width:44rem)]:col-start-3 [@container(min-width:44rem)]:row-start-1 [@container(min-width:44rem)]:justify-self-end`)}>
                  <StatusBadge status={s.status} />
                </span>
                <p
                  className={cn(
                    "row-start-3 text-sm leading-6 text-muted-foreground",
                    `[@container(min-width:44rem)]:col-start-2 [@container(min-width:44rem)]:row-start-1`,
                  )}
                >
                  {s.body}
                  {s.extra && (
                    <>
                      {" "}
                      <OutLink href={s.extra.url} className="text-foreground">{s.extra.label}</OutLink>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
        </div>
      ))}

      <div className={cn("mt-10 grid gap-6", `[@container(min-width:44rem)]:grid-cols-2`)}>
        <div>
          <h3 className="text-xl font-bold">Org plugins</h3>
          <ul className={LIST}>
            {ORG_PLUGINS.map((plugin) => (
              <li key={plugin.name} className="p-5">
                <code className="break-words text-sm font-semibold">{plugin.name}</code>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">{plugin.body}</p>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-xl font-bold">Skill one-pagers</h3>
          <p className="mt-1 text-sm leading-6 text-muted-foreground">On the shared drive.</p>
          <ul className={cn(LIST, "mt-4")}>
            {SKILL_ONE_PAGERS.map((doc) => (
              <li key={doc.url} className="p-5">
                <OutLink href={doc.url} className="text-sm font-semibold">{doc.label}</OutLink>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function Training() {
  return (
    <section aria-labelledby="ai-training">
      <h2 id="ai-training" className={SECTION_HEAD}>Training and guides</h2>
      <ul className={LIST}>
        {TRAINING.map((item) => (
          <li key={item.url} className={cn("grid gap-y-1 p-5", `[@container(min-width:44rem)]:grid-cols-[17rem_minmax(0,1fr)] [@container(min-width:44rem)]:gap-x-6`)}>
            <div>
              <OutLink href={item.url} className="text-sm font-semibold">{item.label}</OutLink>
              <p className="text-xs text-og-gray-300">{item.owner}</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.body}
              {item.extra && (
                <>
                  {" "}See also{" "}
                  <OutLink href={item.extra.url} className="text-foreground">{item.extra.label}</OutLink>.
                </>
              )}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Slack() {
  return (
    <section aria-labelledby="ai-slack">
      <h2 id="ai-slack" className={SECTION_HEAD}>Slack channels</h2>
      <ul className={LIST}>
        {SLACK_CHANNELS.map((channel) => (
          <li key={channel.url} className={cn("grid gap-y-1 p-5", `[@container(min-width:44rem)]:grid-cols-[17rem_minmax(0,1fr)] [@container(min-width:44rem)]:gap-x-6`)}>
            <OutLink href={channel.url} className="self-start text-sm font-semibold">{channel.label}</OutLink>
            <p className="text-sm leading-6 text-muted-foreground">{channel.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-lg bg-og-gray-950 p-5 text-sm leading-6">
        <strong className="font-bold">Channel norm:</strong> when someone asks a question in Slack that Claude could
        answer, people may reply with <code className="font-semibold">:rubber_ducky:</code>, short for “did you use
        Claude?” It’s a gentle reminder, not a callout (
        <OutLink href={RUBBER_DUCKY_POST.url}>{RUBBER_DUCKY_POST.label}</OutLink>).
      </p>
    </section>
  );
}

function Connectors() {
  return (
    <section aria-labelledby="ai-connectors">
      <h2 id="ai-connectors" className={SECTION_HEAD}>Already connected</h2>
      <ul className={cn("mt-6 grid gap-4", `[@container(min-width:44rem)]:grid-cols-2`)}>
        {CONNECTORS.map((tool) => (
          <li key={tool.name} className="rounded-lg border border-border bg-white p-6">
            <h3 className="text-base font-bold">{tool.name}</h3>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">{tool.body}</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-10 text-xl font-bold">Get a new tool approved</h3>
      <p className={LEDE}>
        Get it approved before you connect it. Questions go to{" "}
        <OutLink href={SECURITY_CHANNEL.url} className="text-foreground">{SECURITY_CHANNEL.label}</OutLink>; reviews
        happen in{" "}
        <OutLink href={INFOSEC_CHANNEL.url} className="text-foreground">{INFOSEC_CHANNEL.label}</OutLink>.
      </p>
      <ol className={LIST}>
        {APPROVAL_STEPS.map((step, index) => (
          <li key={step.link.url} className="flex gap-4 p-5">
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-og-gray-900 text-sm font-bold text-og-midnight"
            >
              {index + 1}
            </span>
            <div>
              <OutLink href={step.link.url} className="text-sm font-semibold">{step.link.label}</OutLink>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {step.body}
                {step.extra && (
                  <>
                    {" "}Decisions are posted on the{" "}
                    <OutLink href={step.extra.url} className="text-foreground">{step.extra.label}</OutLink>.
                  </>
                )}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

function HowToPosts() {
  return (
    <section aria-labelledby="ai-how-to">
      <h2 id="ai-how-to" className={SECTION_HEAD}>Popular how-to posts in {OG_AI_CHANNEL.label}</h2>
      <ul className={LIST}>
        {HOW_TO_POSTS.map((post) => (
          <li key={post.url} className={cn("grid gap-y-1 p-5", `[@container(min-width:44rem)]:grid-cols-[17rem_minmax(0,1fr)] [@container(min-width:44rem)]:gap-x-6`)}>
            <div>
              <h3><OutLink href={post.url} className="text-sm font-semibold">{post.title}</OutLink></h3>
              <p className="text-xs text-og-gray-300">{post.byline}</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{post.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function AiResources() {
  return (
    <div className="flex flex-col gap-14 [container-type:inline-size] md:gap-16">
      <StartHere />
      <Sharing />
      <SkillsLibrary />
      <Training />
      <Slack />
      <Connectors />
      <HowToPosts />
    </div>
  );
}
