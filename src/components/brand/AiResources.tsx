import type { ReactNode } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";
import {
  APPROVAL_STEPS,
  CONNECTORS,
  HOW_TO_POSTS,
  INFOSEC_CHANNEL,
  OFFER_BUILDER_ONE_PAGER,
  OG_AI_CHANNEL,
  ORG_PLUGINS,
  RUBBER_DUCKY_POST,
  SEARCH_ONLY_LABEL,
  SECURITY_CHANNEL,
  SECURITY_GUIDELINES,
  SECURITY_SUMMARY,
  SHARING_RULES,
  SKILL_GROUPS,
  SLACK_CHANNELS,
  TRAINING,
} from "@/data/ai-resources";
import { cn } from "@/lib/utils";

/*
 * /ai-resources: where to start with Claude at Ordergroove (including what you can
 * share), the skills in the org library, and the training, channels, and connectors
 * around them. Content lives in src/data/ai-resources.ts.
 *
 * One list pattern carries the page: a bordered list of rows, name on the left and
 * description on the right from 44rem of column width (container queries, because the
 * hub sidebar takes 284px from lg up), stacked below that. A row with a link is one
 * hit target: the title's link stretches over the row, and any second link in the row
 * sits above that overlay. Every link leaves the hub, so none carries an arrow; screen
 * readers still hear "opens in a new tab".
 */

const SECTION_HEAD = "scroll-mt-24 text-[28px] font-bold leading-tight";
const LEDE = "measure mt-3 leading-7 text-muted-foreground";
const LIST = "mt-6 divide-y divide-border overflow-hidden rounded-lg border border-border bg-white";
const ROW_GRID =
  "grid gap-y-1 p-5 [@container(min-width:44rem)]:grid-cols-[17rem_minmax(0,1fr)] [@container(min-width:44rem)]:gap-x-6";
const LINKED_ROW = "group relative transition-colors hover:bg-og-midnight/[0.03]";
/** The title link of a linked row: its ::after covers the row, and draws the focus ring. */
const STRETCHED =
  "underline-offset-4 group-hover:underline focus-visible:outline-none after:absolute after:inset-0 focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-foreground";

function NewTab() {
  return <span className="sr-only">(opens in a new tab)</span>;
}

/** A link inside a sentence. Sits above a row's stretched link when it shares the row. */
function TextLink({ href, children, className }: { href: string; children: ReactNode; className?: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn("action-focus relative z-10 rounded-sm text-foreground underline underline-offset-4", className)}
    >
      {children}
      <NewTab />
    </a>
  );
}

function RowTitle({ href, children, className }: { href?: string; children: ReactNode; className?: string }) {
  if (!href) return <span className={cn("text-sm font-semibold", className)}>{children}</span>;
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={cn("text-sm font-semibold", STRETCHED, className)}>
      {children}
      <NewTab />
    </a>
  );
}

function SearchOnlyTag() {
  return (
    <span className="inline-flex whitespace-nowrap rounded border border-border bg-white px-2 py-0.5 align-middle text-xs font-semibold text-og-gray-300">
      {SEARCH_ONLY_LABEL}
    </span>
  );
}

function Step({ n, title, id, children }: { n: number; title: string; id?: string; children: ReactNode }) {
  return (
    <li className="flex gap-4 p-5">
      <span
        aria-hidden="true"
        className="flex size-9 shrink-0 items-center justify-center rounded-full bg-og-midnight text-base font-bold text-og-green"
      >
        {n}
      </span>
      <div className="min-w-0 flex-1">
        <h3 id={id} className="scroll-mt-24 text-lg font-bold leading-7">{title}</h3>
        {children}
      </div>
    </li>
  );
}

function StartHere() {
  const sharing = [
    { title: "Never share", icon: ShieldX, items: SHARING_RULES.never },
    { title: "Team account only", icon: ShieldCheck, items: SHARING_RULES.teamOnly },
  ];
  return (
    <section aria-labelledby="ai-start-here">
      <h2 id="ai-start-here" className={SECTION_HEAD}>Start here</h2>
      <ol className={LIST}>
        <Step n={1} title={`Join ${OG_AI_CHANNEL.label}`}>
          <p className="measure mt-1 leading-7 text-muted-foreground">
            The main channel for AI resources, tips, best practices, and new skill launches.
          </p>
          <TextLink href={OG_AI_CHANNEL.url} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold">
            Open {OG_AI_CHANNEL.label}
          </TextLink>
        </Step>

        <Step n={2} title="Know what you can share" id="ai-sharing">
          <p className="measure mt-1 leading-7 text-muted-foreground">
            The key points from the <TextLink href={SECURITY_GUIDELINES.url}>{SECURITY_GUIDELINES.label}</TextLink>. Ofir
            posted <TextLink href={SECURITY_SUMMARY.url}>{SECURITY_SUMMARY.label}</TextLink> on Feb 3, 2026.
          </p>
          <div className="mt-5 grid gap-6 [@container(min-width:44rem)]:grid-cols-2">
            {sharing.map(({ title, icon: Icon, items }) => (
              <div key={title}>
                <h4 className="flex items-center gap-2 text-base font-bold">
                  <Icon size={20} aria-hidden="true" className="shrink-0 text-og-midnight" />
                  {title}
                </h4>
                <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm leading-6 text-muted-foreground">
                  {items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
          <p className="measure mt-5 text-sm leading-6">
            <strong className="font-bold">Best practice:</strong> sign in to Team accounts (Claude, ChatGPT, Gemini) with
            your OG Gmail. These accounts don’t train models on your data and delete it every 30 days.
          </p>
        </Step>

        <Step n={3} title="Give Claude a useful brief">
          <p className="measure mt-1 leading-7 text-muted-foreground">
            Include the audience, desired outcome, source material, and anything that must stay exactly as written.
            Separate supplied facts from ideas you want Claude to develop.
          </p>
        </Step>

        <Step n={4} title="Review before you share">
          <p className="measure mt-1 leading-7 text-muted-foreground">
            Check names, figures, customer logos, placeholders, and slide layouts against your source material. A skill
            applies the brand rules; you still review the content and final file.
          </p>
        </Step>
      </ol>
    </section>
  );
}

function SkillsLibrary() {
  return (
    <section aria-labelledby="ai-skills-library">
      <h2 id="ai-skills-library" className={SECTION_HEAD}>Claude skills in the org library</h2>
      <p className={LEDE}>
        Open a skill to add it in Claude. Skills tagged <SearchOnlyTag /> haven’t been shared org-wide yet, so find them by
        searching the skill catalog.
      </p>

      {SKILL_GROUPS.map((group) => (
        <div key={group.id} className="mt-10">
          <h3 className="text-xl font-bold">{group.label}</h3>
          <ul className={LIST}>
            {group.skills.map((s) => (
              <li key={s.name} className={cn(ROW_GRID, LINKED_ROW)}>
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1.5 self-start">
                  <RowTitle href={s.url} className="break-words font-mono">{s.name}</RowTitle>
                  {s.status === "catalog" && <SearchOnlyTag />}
                </div>
                <p className="text-sm leading-6 text-muted-foreground">
                  {s.body}
                  {s.extra && (
                    <>
                      {" "}
                      <TextLink href={s.extra.url}>{s.extra.label}</TextLink>
                    </>
                  )}
                </p>
              </li>
            ))}
          </ul>
          {group.id === "brand" && (
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Also on the shared drive: <TextLink href={OFFER_BUILDER_ONE_PAGER.url}>{OFFER_BUILDER_ONE_PAGER.label}</TextLink>.
            </p>
          )}
        </div>
      ))}

      <div className="mt-10">
        <h3 className="text-xl font-bold">Org plugins</h3>
        <ul className={LIST}>
          {ORG_PLUGINS.map((plugin) => (
            <li key={plugin.name} className={ROW_GRID}>
              <RowTitle className="break-words font-mono">{plugin.name}</RowTitle>
              <p className="text-sm leading-6 text-muted-foreground">{plugin.body}</p>
            </li>
          ))}
        </ul>
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
          <li key={item.url} className={cn(ROW_GRID, LINKED_ROW)}>
            <div>
              <RowTitle href={item.url}>{item.label}</RowTitle>
              <p className="text-xs text-og-gray-300">{item.owner}</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground">
              {item.body}
              {item.extra && (
                <>
                  {" "}See also <TextLink href={item.extra.url}>{item.extra.label}</TextLink>.
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
          <li key={channel.url} className={cn(ROW_GRID, LINKED_ROW)}>
            <RowTitle href={channel.url} className="self-start">{channel.label}</RowTitle>
            <p className="text-sm leading-6 text-muted-foreground">{channel.body}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 rounded-lg bg-og-gray-950 p-5 text-sm leading-6">
        <strong className="font-bold">Channel norm:</strong> when someone asks a question in Slack that Claude could
        answer, people may reply with <code className="font-semibold">:rubber_ducky:</code>, short for “did you use
        Claude?” It’s a gentle reminder, not a callout (<TextLink href={RUBBER_DUCKY_POST.url}>{RUBBER_DUCKY_POST.label}</TextLink>).
      </p>
    </section>
  );
}

function Connectors() {
  return (
    <section aria-labelledby="ai-connectors">
      <h2 id="ai-connectors" className={SECTION_HEAD}>Already connected</h2>
      <ul className={LIST}>
        {CONNECTORS.map((tool) => (
          <li key={tool.name} className={ROW_GRID}>
            <RowTitle>{tool.name}</RowTitle>
            <p className="text-sm leading-6 text-muted-foreground">{tool.body}</p>
          </li>
        ))}
      </ul>

      <h3 className="mt-10 text-xl font-bold">Get a new tool approved</h3>
      <p className={LEDE}>
        Get it approved before you connect it. Questions go to{" "}
        <TextLink href={SECURITY_CHANNEL.url}>{SECURITY_CHANNEL.label}</TextLink>; reviews happen in{" "}
        <TextLink href={INFOSEC_CHANNEL.url}>{INFOSEC_CHANNEL.label}</TextLink>.
      </p>
      <ol className={LIST}>
        {APPROVAL_STEPS.map((step, index) => (
          <li key={step.link.url} className={cn("flex gap-4 p-5", LINKED_ROW)}>
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-og-gray-900 text-sm font-bold text-og-midnight"
            >
              {index + 1}
            </span>
            <div>
              <RowTitle href={step.link.url}>{step.link.label}</RowTitle>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {step.body}
                {step.extra && (
                  <>
                    {" "}Decisions are posted on the <TextLink href={step.extra.url}>{step.extra.label}</TextLink>.
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
          <li key={post.url} className={cn(ROW_GRID, LINKED_ROW)}>
            <div>
              <RowTitle href={post.url}>{post.title}</RowTitle>
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
      <SkillsLibrary />
      <Training />
      <Slack />
      <Connectors />
      <HowToPosts />
    </div>
  );
}
