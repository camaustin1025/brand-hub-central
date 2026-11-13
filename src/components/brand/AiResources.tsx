import { Heading } from "@/components/layout/Heading";
import { Suspense, lazy, useEffect, useState, type ComponentType, type LazyExoticComponent, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Boxes, ChevronDown, FileText, MessageCircle, Search, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';
import { AI_DIRECTORY, RESOURCE_TYPES, countByType, filterResources, groupResources, type AiResource, type DirectoryEntry, type DirectorySection } from '@/data/ai-directory';
import { APPROVAL_STEPS, APPROVAL_CRITERIA, APPROVAL_DECISIONS, SECURITY_GUIDELINES, SECURITY_CHANNEL, INFOSEC_CHANNEL, SHARING_RULES } from '@/data/ai-resources';
import { cn } from '@/lib/utils';
import { DIRECTORY_LAYOUT, DIRECTORY_LAYOUTS, type DirectoryLayout } from './ai-directory-layout';
import s from './AiResources.module.css';

const ICONS = { 'Skills': Sparkles, 'Guides & training': BookOpen, 'Tools & plugins': Boxes, 'Assets': FileText, 'Help & channels': MessageCircle };
const LINK = 'action-focus rounded-sm font-semibold underline underline-offset-4 hover:text-foreground';
function External({ href, children, className = LINK }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>;
}

/** The anchor a row title had when every row heading built its own id, so old #links still land. */
function anchorFor(label: string) {
  return label.normalize('NFKD').toLowerCase().replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'resource';
}

function PlatformIcon({ resource: r }: { resource: AiResource }) {
  const platform = r.url?.includes('slack.com') ? 'slack'
    : r.url?.includes('google.com') ? 'google-drive'
    : r.title === 'Salesforce' ? 'salesforce'
    : r.url?.includes('claude.') || r.url?.includes('anthropic.') || r.source === 'Org plugin' || r.title.startsWith('Claude') ? 'claude' : null;
  const label = platform === 'google-drive' ? 'Google Drive' : platform === 'slack' ? 'Slack' : platform === 'salesforce' ? 'Salesforce' : 'Claude';
  return <span className={s.icon} title={platform ? label : r.source}>
    {platform ? <img src={`/platform-icons/${platform}.svg`} alt={label} width={20} height={20} /> : <Boxes size={20} className="text-violet-700" aria-hidden="true" />}
  </span>;
}

/** Sources that only name the platform, which the row icon already shows. */
const HIDDEN_SOURCES = ['Claude', 'Org plugin', 'Tool / connector', 'Slack', 'Shared drive', 'Anthropic'];

/** Where a row sits when the list runs two across: workflows take a whole row, everything else pairs up. */
type Placement = { row: number; col: 0 | 1 | 'full'; paired: boolean };
function place(entries: DirectoryEntry[]): Placement[] {
  const out: Placement[] = [];
  let row = 0, col: 0 | 1 = 0;
  entries.forEach((e, i) => {
    if (e.kind === 'workflow') {
      if (col === 1) { row++; col = 0; }
      out.push({ row, col: 'full', paired: false });
      row++;
      return;
    }
    const next = entries[i + 1];
    out.push({ row, col, paired: col === 0 && Boolean(next) && next.kind !== 'workflow' });
    if (col === 1) { col = 0; row++; } else col = 1;
  });
  return out;
}

function ResourceItem({ resource: r, placement, step, folded = false }: { resource: AiResource; placement?: Placement; step?: number; folded?: boolean }) {
  const [open, setOpen] = useState(false);
  const detailId = `resource-${r.id.replace(/[^a-z0-9-]/gi, '')}`;
  const action = r.type === 'Skills' ? 'Open skill' : r.type === 'Assets' ? 'Open file' : r.type === 'Help & channels' ? 'Open channel' : 'Open';
  const owner = HIDDEN_SOURCES.includes(r.source) ? '' : r.source.startsWith('Slack · ') ? r.source.slice(8) : r.source;
  // The description is always shown in full, so Details only appears when it adds a fact the row doesn't show.
  const hasDetails = Boolean(r.identifier || r.catalog || !r.url || r.team || owner || r.related);
  return <li className={cn(step ? s.step : s.item, open && s.itemOpen, folded && s.folded)} data-row={placement?.row} data-col={placement?.paired ? 0 : undefined}>
    <div className={s.row}>
      {step ? <span className={s.stepNumber} aria-hidden="true">{step}</span> : <PlatformIcon resource={r} />}
      <div className="min-w-0">
        <Heading as="h3" id={anchorFor(r.title)} copyLink={false} className={cn(s.title, 'scroll-mt-40')}>{step ? <span className="sr-only">Step {step}: </span> : null}{r.title}</Heading>
        <p className={s.description}>{r.body}</p>
      </div>
      <div className={s.actions}>
        {r.url && !r.catalog && (r.type === 'Skills'
          ? <a href={r.url} target="_blank" rel="noopener noreferrer" className={cn(s.openSkill, 'action-focus')}>Open skill<span className="sr-only">: {r.title} (opens in a new tab)</span></a>
          : <External href={r.url} className={cn(s.textAction, s.textActionStrong, 'action-focus')}>{action}<ArrowUpRight size={13} aria-hidden="true" /><span className="sr-only">: {r.title}</span></External>)}
        {hasDetails && <button type="button" className={cn(s.textAction, 'action-focus')} aria-expanded={open} aria-controls={detailId} onClick={() => setOpen(!open)}>
          {r.catalog ? 'Catalog access' : !r.url ? 'Access details' : open ? 'Less' : 'Details'}<span className="sr-only">: {r.title}</span>
          <ChevronDown size={14} aria-hidden="true" className={open ? 'rotate-180' : undefined} />
        </button>}
      </div>
      {open && hasDetails && <div id={detailId} className={s.details}>
        {r.identifier && <p><strong>{r.source === 'Org plugin' ? 'Plugin' : 'Skill'} name:</strong> <code className="select-all break-all">{r.identifier}</code></p>}
        {r.catalog && <p>Not shared org-wide. Search the Claude skill catalog for the skill name above. <External href={r.url!} className={cn(s.link, 'action-focus')}>View skill<span className="sr-only">: {r.title}</span></External>.</p>}
        {!r.url && <p>No direct link is listed here. Ask in <External href="https://ordergroove.slack.com/archives/C09HTBGS8JD" className={cn(s.link, 'action-focus')}>#og-ai</External> for access.</p>}
        {r.team && <p><strong>Team:</strong> {r.team}</p>}
        {owner && <p>{owner}</p>}
        {r.related && <p><External href={r.related.url} className={cn(s.link, 'action-focus')}>{r.related.label}</External></p>}
      </div>}
    </div>
  </li>;
}

/** A workflow collapses its steps into one row. A search that matches a step opens it, so matches are never hidden. */
function WorkflowItem({ entry: w, searching, placement, folded = false }: { entry: Extract<DirectoryEntry, { kind: 'workflow' }>; searching: boolean; placement: Placement; folded?: boolean }) {
  const [open, setOpen] = useState(false);
  const expanded = searching || open;
  const stepsId = `workflow-${w.id}-steps`;
  return <li className={cn(s.item, s.workflow, folded && s.folded)} data-row={placement.row}>
    <div className={s.row}>
      <PlatformIcon resource={w.steps[0]} />
      <div className="min-w-0">
        <Heading as="h3" id={anchorFor(`${w.title} · ${w.total} steps`)} copyLink={false} className={cn(s.title, 'scroll-mt-40')}>{w.title}<span className={s.titleMeta}> · {w.total} steps</span></Heading>
        <p className={s.description}>{w.body}</p>
      </div>
      <div className={s.actions}>
        {searching
          ? <p className="text-[13px] text-muted-foreground">{w.steps.length === w.total ? 'All steps match' : `${w.steps.length} of ${w.total} steps match`}</p>
          : <button type="button" className={cn(s.textAction, 'action-focus')} aria-expanded={expanded} aria-controls={stepsId} onClick={() => setOpen(!open)}>
              {expanded ? 'Hide steps' : `Show ${w.total} steps`}<ChevronDown size={14} className={expanded ? 'rotate-180' : undefined} aria-hidden="true" /><span className="sr-only">: {w.title}</span>
            </button>}
      </div>
    </div>
    {expanded && <ol id={stepsId} className={s.steps} aria-label={`${w.title} steps`}>
      {w.steps.map(r => <ResourceItem key={r.id} resource={r} step={w.steps.length === w.total ? w.steps.indexOf(r) + 1 : undefined} />)}
    </ol>}
  </li>;
}

const entryTitle = (e: DirectoryEntry) => (e.kind === 'resource' ? e.resource.title : `${e.title} · ${e.total} steps`);
/** On phones a group opens on its first few rows; the rest are one tap away. Wider screens show every row. */
const PHONE_FOLD = 3;

function GroupSection({ section, searching, filtered }: { section: DirectorySection; searching: boolean; filtered: boolean }) {
  const anchor = anchorFor(section.label);
  // A shared link to a row inside the fold opens the group, so the link still lands.
  const [expanded, setExpanded] = useState(() => typeof window !== 'undefined' && section.entries.some(e => window.location.hash === `#${anchorFor(entryTitle(e))}`));
  const folds = !filtered && !expanded && section.entries.length > PHONE_FOLD;
  const canFold = !filtered && section.entries.length > PHONE_FOLD;
  const placements = place(section.entries);
  const listId = `${anchor}-list`;
  return <section className={s.group} aria-labelledby={anchor}>
    <Heading as="h2" id={anchor} className={s.groupTitle}>{section.label}<span className={s.groupCount}><span className="sr-only">, </span>{section.count}<span className="sr-only"> {section.count === 1 ? 'resource' : 'resources'}</span></span></Heading>
    <ul id={listId} className={s.list}>
      {section.entries.map((e, i) => {
        const folded = folds && i >= PHONE_FOLD;
        return e.kind === 'resource'
          ? <ResourceItem key={e.resource.id} resource={e.resource} placement={placements[i]} folded={folded} />
          : <WorkflowItem key={e.id} entry={e} searching={searching} placement={placements[i]} folded={folded} />;
      })}
    </ul>
    {canFold && <button type="button" className={cn(s.textAction, s.foldToggle, 'action-focus')} aria-expanded={!folds} aria-controls={listId} onClick={() => setExpanded(!expanded)}>
      {folds ? `Show ${section.entries.length - PHONE_FOLD} more` : 'Show fewer'}<span className="sr-only">: {section.label}</span>
      <ChevronDown size={14} aria-hidden="true" className={folds ? undefined : 'rotate-180'} />
    </button>}
  </section>;
}

/*
 * Layout review (2026-11-13): Options A (library) and B (filtered table) load only in dev, or once
 * DIRECTORY_LAYOUT promotes one, so production ships the current directory and nothing else.
 */
const OPTIONS_ENABLED = import.meta.env.DEV || DIRECTORY_LAYOUT !== 'current';
const OPTION_DIRECTORIES: Partial<Record<DirectoryLayout, LazyExoticComponent<ComponentType>>> = OPTIONS_ENABLED
  ? { library: lazy(() => import('./ai-directory-options/LibraryDirectory')), table: lazy(() => import('./ai-directory-options/TableDirectory')) }
  : {};
const LayoutSwitcher = import.meta.env.DEV ? lazy(() => import('./ai-directory-options/LayoutSwitcher')) : null;

function useDirectoryLayout(): DirectoryLayout {
  const [params] = useSearchParams();
  if (!import.meta.env.DEV) return DIRECTORY_LAYOUT;
  const requested = params.get('layout') as DirectoryLayout | null;
  return requested && DIRECTORY_LAYOUTS.includes(requested) ? requested : DIRECTORY_LAYOUT;
}

export function AiResources() {
  const layout = useDirectoryLayout();
  const Option = OPTION_DIRECTORIES[layout];
  return <div className="ai-directory [container-type:inline-size]">
    {Option ? <Suspense fallback={<div className="min-h-[60vh]" aria-busy="true" />}><Option /></Suspense> : <CurrentDirectory />}
    <AiPolicySections />
    {LayoutSwitcher && <Suspense fallback={null}><LayoutSwitcher layout={layout} /></Suspense>}
  </div>;
}

/** The shipped directory: grouped lists with type chips and the team filter. */
function CurrentDirectory() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const query = params.get('q') ?? '';
  const type = params.get('type') ?? '';
  const team = params.get('team') ?? '';
  function update(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); next.delete('page'); setParams(next, { replace: true, preventScrollReset: true }); }
  function clear() { const next = new URLSearchParams(params); ['q', 'type', 'team'].forEach(key => next.delete(key)); next.delete('page'); setParams(next, { replace: true, preventScrollReset: true }); }
  const results = filterResources(AI_DIRECTORY, query, type, team);
  const sections = groupResources(results);
  // Chip counts ignore the type filter, so each chip says what you'd get by picking it.
  const counts = countByType(filterResources(AI_DIRECTORY, query, '', team));
  const total = RESOURCE_TYPES.reduce((sum, t) => sum + counts[t], 0);
  const searching = Boolean(query.trim());
  useEffect(() => {
    const legacy: Record<string, string> = { '#ai-training': 'Guides & training', '#ai-how-to': 'Guides & training', '#ai-slack': 'Help & channels' };
    const target = legacy[window.location.hash];
    if (target) { update('type', target); document.getElementById('ai-skills-library')?.scrollIntoView(); }
    else if (window.location.hash === '#ai-skills-library') document.getElementById('ai-skills-library')?.scrollIntoView();
  }, []);
  const teams = [...new Set(AI_DIRECTORY.flatMap(r => r.team ? [r.team] : []))];
  return <section aria-label="AI resource directory" id="ai-skills-library" className="scroll-mt-24">
      <div className="directory-toolbar">
        <div className="directory-search-row">
          <label className="relative flex-1"><span className="sr-only">Search AI resources</span><Search size={19} className="pointer-events-none absolute left-4 top-4 text-muted-foreground" aria-hidden="true" /><input type="search" value={query} onChange={e => update('q', e.target.value)} placeholder="Search AI resources" className="action-focus min-h-12 w-full rounded-md border border-border bg-white pl-12 pr-4 text-base placeholder:text-muted-foreground" /></label>
          <button type="button" className="action-focus tap-target h-8 shrink-0 rounded-full border border-og-midnight bg-white px-3 text-[13px] font-semibold md:hidden" aria-expanded={filtersOpen} aria-controls="directory-filters" onClick={() => setFiltersOpen(!filtersOpen)}>Filters{(type || team) && ' · on'}</button>
        </div>
        <div id="directory-filters" className={`${filtersOpen ? 'flex' : 'hidden'} directory-filter-row flex-col md:flex md:flex-row md:flex-wrap md:items-center`}>
          <div className="type-chips hidden md:flex" role="group" aria-label="Filter by resource type">
            {(['', ...RESOURCE_TYPES] as const).map(t => { const Icon = t ? ICONS[t] : null; const selected = type === t; return <button key={t} type="button" aria-pressed={selected} onClick={() => update('type', t)} className="type-chip action-focus tap-target">{Icon && <Icon size={14} aria-hidden="true" />}{t || 'All'}<span className="type-chip__count">{t ? counts[t] : total}</span></button>; })}
          </div>
          <label className="flex items-center gap-2 text-sm md:hidden">Type<select value={type} onChange={e => update('type', e.target.value)} className="action-focus min-h-11 min-w-0 flex-1 rounded-md border border-border bg-white px-2"><option value="">All resources ({total})</option>{RESOURCE_TYPES.map(t => <option key={t} value={t}>{t} ({counts[t]})</option>)}</select></label>
          <label className="team-filter"><span className="team-filter__label">Skills for</span><select value={team} onChange={e => update('team', e.target.value)}><option value="">All teams</option>{teams.map(t => <option key={t}>{t}</option>)}</select><ChevronDown size={14} aria-hidden="true" /></label>
        </div>
      </div>
      <div className="my-3 flex min-h-6 items-center justify-between gap-4 text-sm"><p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'resource' : 'resources'}{type && ` · ${type}`}{team && ` · Skills for ${team}`}</p>{(query || type || team) && <button className={`${LINK} min-h-11`} onClick={clear}>Clear filters</button>}</div>
      {sections.map(section => <GroupSection key={section.id} section={section} searching={searching} filtered={Boolean(searching || type || team)} />)}
      {!results.length && <div className="border-y border-border py-12 text-center"><Heading as="h3" className="text-lg font-bold">No matching resources</Heading><p className="mt-2 text-foreground">Try a different search or clear your filters.</p><button onClick={clear} className={`${LINK} mt-5 min-h-11`}>Clear filters</button></div>}
    </section>;
}

/** What you can share and Get a new tool approved: the same under every directory layout. */
function AiPolicySections() {
  return <>
    <section id="ai-sharing" className={cn('dark', s.panel)} aria-labelledby="what-you-can-share">
      <span id="ai-start-here" className="scroll-mt-24" />
      <Heading as="h2" id="what-you-can-share"><ShieldCheck aria-hidden="true" size={26} />What you can share</Heading>
      <p className={s.panelIntro}>Use your OG Gmail to sign in to Team accounts (Claude, ChatGPT, Gemini). Read the <External href={SECURITY_GUIDELINES.url}>{SECURITY_GUIDELINES.label}</External>.</p>
      <div className={s.panelCols}>
        <div className={s.colNever}>
          <Heading as="h3" id="never-share"><span className={cn(s.mark, s.markNever)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></span>Never share</Heading>
          <ul className={cn(s.rules, s.rulesNever)} aria-labelledby="never-share">{SHARING_RULES.never.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className={s.colTeam}>
          <Heading as="h3" id="team-account-only"><span className={cn(s.mark, s.markTeam)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span>Team account only</Heading>
          <ul className={s.rules} aria-labelledby="team-account-only">{SHARING_RULES.teamOnly.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </section>
    <section id="ai-connectors" className={s.approval} aria-labelledby="get-a-new-tool-approved">
      <Heading as="h2" id="get-a-new-tool-approved" className="reference-section-title">Get a new tool approved</Heading>
      <p className={s.approvalLede}>Get approval before connecting a tool. Questions: <External href={SECURITY_CHANNEL.url}>{SECURITY_CHANNEL.label}</External>. Reviews: <External href={INFOSEC_CHANNEL.url}>{INFOSEC_CHANNEL.label}</External>.</p>
      <ol className={s.approvalSteps}>{APPROVAL_STEPS.map((step, index) => <li key={step.link.url} className={s.approvalStep}><span aria-hidden="true" className={s.approvalNumber}>{index + 1}</span><div><External href={step.link.url}>{step.link.label}</External><p>{step.body}</p></div></li>)}</ol>
      <p className={s.approvalLinks}><External href={APPROVAL_CRITERIA.url}>{APPROVAL_CRITERIA.label}</External><External href={APPROVAL_DECISIONS.url}>{APPROVAL_DECISIONS.label}</External></p>
    </section>
  </>;
}
