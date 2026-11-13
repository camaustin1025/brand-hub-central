import { Fragment, type ReactNode } from "react";
import { ArrowUpRight, Globe } from "lucide-react";
import { HubShell } from "@/components/hub/HubShell";
import { ChapterPage } from "@/components/layout/ChapterPage";
import { Heading } from "@/components/layout/Heading";
import { DraftBadge } from "@/components/brand/DraftBadge";
import { TintedIcon } from "@/components/brand/TintedIcon";
import { ICON_COLORS } from "@/data/brand-resources";
import { buttonVariants } from "@/components/ui/button";
import { EMPLOYEE_RESOURCES_NAV_ID, isWipSection } from "@/data/hub";
import {
  BENEFIT_GROUPS,
  HOLIDAY_FLEX,
  HOLIDAYS,
  HOLIDAYS_YEAR,
  MISSION,
  PEOPLE_HUB,
  RIPPLING,
  VALUES,
  type Benefit,
  type BenefitLink,
  type Inline,
} from "@/data/working-at-og";
import { cn } from "@/lib/utils";

/** Groovy Green is the dark-surface green; the values sit on Midnight. */
const GROOVY_GREEN = ICON_COLORS.dark.find((color) => color.name === "Groovy Green")!;

const LINK = "action-focus rounded-sm font-semibold underline underline-offset-4";

const JUMP_LINKS = [
  { href: "#mission-values", label: "Mission & values" },
  { href: "#company-holidays", label: "Company holidays" },
  { href: "#rippling", label: "Rippling HR" },
  { href: "#perks-benefits", label: "Perks & benefits" },
];

function ResourceLink({ link }: { link: BenefitLink }) {
  if (!link.href) {
    return (
      <span className="inline-flex flex-wrap items-center gap-1.5">
        <span className="font-semibold">{link.label}</span>
        <DraftBadge>Link needed</DraftBadge>
      </span>
    );
  }
  return (
    <a className={LINK} href={link.href} target="_blank" rel="noopener noreferrer">
      {link.label}
      <ArrowUpRight size={13} className="ml-0.5 inline" aria-hidden="true" />
      <span className="sr-only"> (opens in a new tab)</span>
    </a>
  );
}

function Runs({ runs }: { runs: Inline[] }) {
  return (
    <>
      {runs.map((run, index) => {
        let node: ReactNode;
        if (typeof run === "string") node = run;
        else if ("link" in run) node = <ResourceLink link={run.link} />;
        else if ("tel" in run) node = <a className={cn(LINK, "whitespace-nowrap")} href={`tel:+1${run.tel.replace(/\D/g, "")}`}>{run.tel}</a>;
        else node = <strong className="font-semibold">{run.em}</strong>;
        return <Fragment key={index}>{node}</Fragment>;
      })}
    </>
  );
}

function BenefitRow({ benefit }: { benefit: Benefit }) {
  return (
    <li className="grid gap-3 p-6 md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_13rem] md:gap-8">
      <Heading as="h4" className="text-base font-semibold leading-6">{benefit.name}</Heading>
      <div className="space-y-3 text-sm leading-6 text-foreground">
        {benefit.details.map((paragraph, index) => (
          <p key={index} className="measure"><Runs runs={paragraph} /></p>
        ))}
        {benefit.list && (
          <div>
            {benefit.list.intro && <p className="measure">{benefit.list.intro}</p>}
            <ul className={cn("measure list-disc space-y-1.5 pl-5 marker:text-og-midnight/40", benefit.list.intro && "mt-1.5")}>
              {benefit.list.items.map((item, index) => <li key={index}><Runs runs={item} /></li>)}
            </ul>
          </div>
        )}
        {benefit.note && <p className="measure italic">{benefit.note}</p>}
        {benefit.links && (
          <ul className="flex flex-col gap-1.5">
            {benefit.links.map((link) => <li key={link.label}><ResourceLink link={link} /></li>)}
          </ul>
        )}
      </div>
      <p className="text-sm md:text-right">
        <span className="sr-only">Who it’s for: </span>
        <span className="inline-flex whitespace-nowrap rounded-full bg-og-midnight/[0.06] px-2.5 py-1 text-xs font-semibold text-og-midnight">{benefit.audience}</span>
      </p>
    </li>
  );
}

export default function WorkingAtOG() {
  return (
    <HubShell activeId={EMPLOYEE_RESOURCES_NAV_ID}>
      <ChapterPage
        navId={EMPLOYEE_RESOURCES_NAV_ID}
        wip={isWipSection(EMPLOYEE_RESOURCES_NAV_ID)}
        updated="2026-11-12"
        title="Employee resources"
        intro="Our mission and values, the company holiday calendar, and the perks and benefits that come with being on the team."
      >
        <nav aria-label="On this page" className="mb-12 flex flex-wrap gap-x-6 gap-y-3 text-sm">
          {JUMP_LINKS.map((link) => <a key={link.href} className="action-focus underline underline-offset-4" href={link.href}>{link.label}</a>)}
        </nav>

        <section id="mission-values" aria-labelledby="mission-values-heading" className="scroll-mt-24">
          <Heading as="h2" id="mission-values-heading" className="reference-section-title">Mission & values</Heading>
          {/* One Midnight panel: the mission is the headline, the values are how we live it. */}
          <div className="mission-panel dark mt-8">
            <p className="eyebrow">Our mission</p>
            <p className="mission-statement">{MISSION}</p>
            <Heading as="h3" className="mission-values-label" copyLink={false}>Our values</Heading>
            <ul className="values-list">
              {VALUES.map((value) => (
                <li key={value.title} className="value-row">
                  <div className="value-head">
                    <TintedIcon name={value.icon} color={GROOVY_GREEN} size={48} className="value-icon" />
                    <Heading as="h4" className="value-title" copyLink={false}>{value.title}</Heading>
                  </div>
                  <p className="value-body">{value.body.map((sentence) => <span key={sentence}>{sentence} </span>)}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="company-holidays" aria-labelledby="company-holidays-heading" className="mt-16 scroll-mt-24">
          <Heading as="h2" id="company-holidays-heading" className="reference-section-title">{HOLIDAYS_YEAR} company holidays</Heading>
          <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)] lg:items-start">
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-white">
              {HOLIDAYS.map((holiday) => (
                <li key={holiday.name} className="flex flex-col gap-1 px-6 py-4 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="font-semibold">{holiday.name}</span>
                  <span className="text-sm text-foreground sm:text-right">{holiday.date}</span>
                </li>
              ))}
            </ul>
            <aside aria-labelledby="holiday-flex-heading" className="rounded-lg border border-og-green/50 bg-og-green/10 p-6">
              <div className="flex items-center gap-2">
                <Globe size={18} aria-hidden="true" className="shrink-0 text-og-midnight" />
                <Heading as="h3" id="holiday-flex-heading" className="text-base font-semibold leading-6" copyLink={false}>{HOLIDAY_FLEX.title}</Heading>
              </div>
              <div className="mt-3 space-y-3 text-sm leading-6 text-foreground">
                {HOLIDAY_FLEX.body.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                <p className="font-semibold">{HOLIDAY_FLEX.rulesIntro}</p>
                <ul className="list-disc space-y-1 pl-5 marker:text-og-midnight/50">
                  {HOLIDAY_FLEX.rules.map((rule) => <li key={rule}>{rule}</li>)}
                </ul>
              </div>
            </aside>
          </div>
        </section>

        <section id="rippling" aria-labelledby="rippling-heading" className="mt-16 scroll-mt-24">
          <Heading as="h2" id="rippling-heading" className="reference-section-title">Rippling HR</Heading>
          <div className="mt-8 flex flex-col gap-6 rounded-lg border border-border bg-white p-6 md:flex-row md:items-center md:gap-8 md:p-8">
            <img src="/platform-icons/rippling.svg" alt="Rippling" width={56} height={56} className="size-14 shrink-0 rounded-lg" />
            <div className="flex-1">
              <Heading as="h3" className="reference-item-title" copyLink={false}>What is Rippling?</Heading>
              <p className="measure mt-1 text-sm leading-6 text-foreground">
                <a className={LINK} href={RIPPLING.url} target="_blank" rel="noopener noreferrer">Rippling<span className="sr-only"> (opens in a new tab)</span></a> is {RIPPLING.body}
              </p>
            </div>
            <a href={RIPPLING.url} target="_blank" rel="noopener noreferrer" className={cn(buttonVariants(), "self-start md:self-center")}>
              Open Rippling <ArrowUpRight size={15} aria-hidden="true" />
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>
        </section>

        <section id="perks-benefits" aria-labelledby="perks-benefits-heading" className="mt-16 scroll-mt-24">
          <Heading as="h2" id="perks-benefits-heading" className="reference-section-title">Perks & benefits</Heading>
          <p className="section-lede mt-0.5 leading-7 text-foreground">What each benefit covers, where to find the details, and who it’s for. More from the People team lives in the <ResourceLink link={PEOPLE_HUB} />.</p>
          {BENEFIT_GROUPS.map((group) => (
            <div key={group.id} className="mt-10">
              <Heading as="h3" id={group.id} className="reference-item-title scroll-mt-24">{group.title}</Heading>
              <div className="mt-4 overflow-hidden rounded-lg border border-border bg-white">
                <div aria-hidden="true" className="hidden border-b border-border bg-[#F8F8FA] px-6 py-3 text-xs font-semibold uppercase tracking-eyebrow md:grid md:grid-cols-[minmax(0,13rem)_minmax(0,1fr)_13rem] md:gap-8">
                  <span>Benefit</span><span>Details & resources</span><span className="text-right">Who it’s for</span>
                </div>
                <ul className="divide-y divide-border">
                  {group.benefits.map((benefit) => <BenefitRow key={benefit.name} benefit={benefit} />)}
                </ul>
              </div>
            </div>
          ))}
        </section>
      </ChapterPage>
    </HubShell>
  );
}
