/**
 * The AI Resources directory's building blocks: URL-backed filters, the search and filter toolbar,
 * the result count, and the grouped resource lists. AiCategoriesDirectory composes them with the
 * category card.
 */
import { Heading } from "@/components/layout/Heading";
import { useEffect, useState, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Boxes, ChevronDown, FileText, MessageCircle, Search, Sparkles } from 'lucide-react';
import { AI_DIRECTORY, RESOURCE_TYPES, countByType, filterResources, groupResources, type AiResource, type DirectoryEntry, type DirectorySection } from '@/data/ai-directory';
import { cn } from '@/lib/utils';
import s from './AiResources.module.css';

export const TYPE_ICONS = { 'Skills': Sparkles, 'Guides & training': BookOpen, 'Assets': FileText, 'Help & channels': MessageCircle };
export const LINK = 'action-focus rounded-sm font-semibold underline underline-offset-4 hover:text-foreground';
export function External({ href, children, className = LINK }: { href: string; children: ReactNode; className?: string }) {
  return <a className={className} href={href} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>;
}

/** The anchor a row title had when every row heading built its own id, so old #links still land. */
export function anchorFor(label: string) {
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

/**
 * Optional row styling, set by the directory that composes these rows.
 * description: a class added to each description. inlineDetails: a class for a Details toggle that sits
 * at the end of the description instead of under the row's link. markLinked: the row a #link points at
 * carries the rail's highlighter on its title.
 */
export type RowStyle = { description?: string; inlineDetails?: string; markLinked?: boolean };
const isLinked = (label: string) => typeof window !== 'undefined' && window.location.hash === `#${anchorFor(label)}`;

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

function ResourceItem({ resource: r, placement, step, folded = false, rowStyle }: { resource: AiResource; placement?: Placement; step?: number; folded?: boolean; rowStyle?: RowStyle }) {
  const [open, setOpen] = useState(false);
  const [linked] = useState(() => Boolean(rowStyle?.markLinked) && isLinked(r.title));
  const detailId = `resource-${r.id.replace(/[^a-z0-9-]/gi, '')}`;
  const action = r.type === 'Skills' ? 'Open skill' : r.type === 'Assets' ? 'Open file' : r.type === 'Help & channels' ? 'Open channel' : 'Open';
  const owner = HIDDEN_SOURCES.includes(r.source) ? '' : r.source.startsWith('Slack · ') ? r.source.slice(8) : r.source;
  // The description is always shown in full, so Details only appears when it adds a fact the row doesn't show.
  const hasDetails = Boolean(r.identifier || r.catalog || !r.url || r.team || owner || r.related);
  // Inline only for a plain Details toggle; Catalog access and Access details stay as the row's way in.
  const inlineDetails = Boolean(rowStyle?.inlineDetails && hasDetails && r.url && !r.catalog);
  const detailsToggle = hasDetails && <button type="button" className={cn(s.textAction, inlineDetails && rowStyle?.inlineDetails, 'action-focus')} aria-expanded={open} aria-controls={detailId} onClick={() => setOpen(!open)}>
    {r.catalog ? 'Catalog access' : !r.url ? 'Access details' : open ? 'Less' : 'Details'}<span className="sr-only">: {r.title}</span>
    <ChevronDown size={14} aria-hidden="true" className={open ? 'rotate-180' : undefined} />
  </button>;
  return <li className={cn(step ? s.step : s.item, open && s.itemOpen, folded && s.folded)} data-row={placement?.row} data-col={placement?.paired ? 0 : undefined}>
    <div className={s.row}>
      {step ? <span className={s.stepNumber} aria-hidden="true">{step}</span> : <PlatformIcon resource={r} />}
      <div className="min-w-0">
        <Heading as="h3" id={anchorFor(r.title)} copyLink={false} className={cn(s.title, 'scroll-mt-40')}>{step ? <span className="sr-only">Step {step}: </span> : null}{linked ? <span className="nav-highlight">{r.title}</span> : r.title}</Heading>
        <p className={cn(s.description, rowStyle?.description)}>{r.body}{inlineDetails && <> {detailsToggle}</>}</p>
      </div>
      <div className={s.actions}>
        {/* Every direct link is the same 32px outline pill (Open skill, Open file, Open channel, Open). */}
        {r.url && !r.catalog && <a href={r.url} target="_blank" rel="noopener noreferrer" className={cn(s.openPill, 'action-focus')}>{action}<span className="sr-only">: {r.title} (opens in a new tab)</span></a>}
        {!inlineDetails && detailsToggle}
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

/** A workflow collapses its steps into one row. A search that matches a step opens it, so matches are never hidden; so does a shared link to a step. */
function WorkflowItem({ entry: w, searching, placement, folded = false, rowStyle }: { entry: Extract<DirectoryEntry, { kind: 'workflow' }>; searching: boolean; placement: Placement; folded?: boolean; rowStyle?: RowStyle }) {
  const [open, setOpen] = useState(() => w.steps.some(r => isLinked(r.title)));
  const [linked] = useState(() => Boolean(rowStyle?.markLinked) && isLinked(`${w.title} · ${w.total} steps`));
  const expanded = searching || open;
  const stepsId = `workflow-${w.id}-steps`;
  return <li className={cn(s.item, s.workflow, folded && s.folded)} data-row={placement.row}>
    <div className={s.row}>
      <PlatformIcon resource={w.steps[0]} />
      <div className="min-w-0">
        <Heading as="h3" id={anchorFor(`${w.title} · ${w.total} steps`)} copyLink={false} className={cn(s.title, 'scroll-mt-40')}>{linked ? <span className="nav-highlight">{w.title}</span> : w.title}<span className={s.titleMeta}> · {w.total} steps</span></Heading>
        <p className={cn(s.description, rowStyle?.description)}>{w.body}</p>
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
      {w.steps.map(r => <ResourceItem key={r.id} resource={r} step={w.steps.length === w.total ? w.steps.indexOf(r) + 1 : undefined} rowStyle={rowStyle} />)}
    </ol>}
  </li>;
}

const entryTitle = (e: DirectoryEntry) => (e.kind === 'resource' ? e.resource.title : `${e.title} · ${e.total} steps`);
const stepTitles = (e: DirectoryEntry) => (e.kind === 'workflow' ? e.steps.map(r => r.title) : []);
/** On phones a group opens on its first few rows; the rest are one tap away. Wider screens show every row. */
const PHONE_FOLD = 3;

function GroupSection({ section, searching, filtered, rowStyle }: { section: DirectorySection; searching: boolean; filtered: boolean; rowStyle?: RowStyle }) {
  const anchor = anchorFor(section.label);
  // A shared link to a row (or a workflow step) inside the fold opens the group, so the link still lands.
  const [expanded, setExpanded] = useState(() => section.entries.some(e => [entryTitle(e), ...stepTitles(e)].some(isLinked)));
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
          ? <ResourceItem key={e.resource.id} resource={e.resource} placement={placements[i]} folded={folded} rowStyle={rowStyle} />
          : <WorkflowItem key={e.id} entry={e} searching={searching} placement={placements[i]} folded={folded} rowStyle={rowStyle} />;
      })}
    </ul>
    {canFold && <button type="button" className={cn(s.textAction, s.foldToggle, 'action-focus')} aria-expanded={!folds} aria-controls={listId} onClick={() => setExpanded(!expanded)}>
      {folds ? `Show ${section.entries.length - PHONE_FOLD} more` : 'Show fewer'}<span className="sr-only">: {section.label}</span>
      <ChevronDown size={14} aria-hidden="true" className={folds ? undefined : 'rotate-180'} />
    </button>}
  </section>;
}

/** Search, type and team live in the URL (?q, ?type, ?team), so a filtered view can be shared. */
export function useDirectoryFilters() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  // An old link to a type that no longer exists (Tools & plugins) shows everything instead of an empty list.
  const rawType = params.get('type') ?? '';
  const type = (RESOURCE_TYPES as readonly string[]).includes(rawType) ? rawType : '';
  const team = params.get('team') ?? '';
  function set(values: Record<string, string>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values)) { if (value) next.set(key, value); else next.delete(key); }
    next.delete('page');
    setParams(next, { replace: true, preventScrollReset: true });
  }
  const update = (key: string, value: string) => set({ [key]: value });
  const clear = () => set({ q: '', type: '', team: '' });
  const results = filterResources(AI_DIRECTORY, query, type, team);
  // Chip counts ignore the type filter, so each chip says what you'd get by picking it.
  const counts = countByType(filterResources(AI_DIRECTORY, query, '', team));
  const total = RESOURCE_TYPES.reduce((sum, t) => sum + counts[t], 0);
  useEffect(() => {
    const legacy: Record<string, string> = { '#ai-training': 'Guides & training', '#ai-how-to': 'Guides & training', '#ai-slack': 'Help & channels' };
    const target = legacy[window.location.hash];
    if (target) { update('type', target); document.getElementById('ai-skills-library')?.scrollIntoView(); }
    else if (window.location.hash === '#ai-skills-library') document.getElementById('ai-skills-library')?.scrollIntoView();
  }, []); // Runs once on arrival.
  return { query, type, team, set, update, clear, results, sections: groupResources(results), counts, total, searching: Boolean(query.trim()) };
}
export type DirectoryFilters = ReturnType<typeof useDirectoryFilters>;

/** Search on top; type chips and the team filter on the line below (folded behind Filters on phones). */
export function DirectoryToolbar({ f, filterRowClassName }: { f: DirectoryFilters; filterRowClassName?: string }) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { query, type, team, update, counts, total } = f;
  const teams = [...new Set(AI_DIRECTORY.flatMap(r => r.team ? [r.team] : []))];
  return <div className="directory-toolbar">
    <div className="directory-search-row">
      <label className="relative flex-1"><span className="sr-only">Search AI resources</span><Search size={19} className="pointer-events-none absolute left-4 top-4 text-muted-foreground" aria-hidden="true" /><input type="search" value={query} onChange={e => update('q', e.target.value)} placeholder="Search AI resources" className="action-focus min-h-12 w-full rounded-md border border-border bg-white pl-12 pr-4 text-base placeholder:text-muted-foreground" /></label>
      <button type="button" className="action-focus tap-target h-8 shrink-0 rounded-full border border-og-midnight bg-white px-3 text-[13px] font-semibold md:hidden" aria-expanded={filtersOpen} aria-controls="directory-filters" onClick={() => setFiltersOpen(!filtersOpen)}>Filters{(type || team) && ' · on'}</button>
    </div>
    <div id="directory-filters" className={cn(`${filtersOpen ? 'flex' : 'hidden'} directory-filter-row flex-col md:flex md:flex-row md:flex-wrap md:items-center`, filterRowClassName)}>
      <div className="type-chips hidden md:flex" role="group" aria-label="Filter by resource type">
        {(['', ...RESOURCE_TYPES] as const).map(t => { const Icon = t ? TYPE_ICONS[t] : null; const selected = type === t; return <button key={t} type="button" aria-pressed={selected} onClick={() => update('type', t)} className="type-chip action-focus tap-target">{Icon && <Icon size={14} aria-hidden="true" />}{t || 'All'}<span className="type-chip__count">{t ? counts[t] : total}</span></button>; })}
      </div>
      <label className="flex items-center gap-2 text-sm md:hidden">Type<select value={type} onChange={e => update('type', e.target.value)} className="action-focus min-h-11 min-w-0 flex-1 rounded-md border border-border bg-white px-2"><option value="">All resources ({total})</option>{RESOURCE_TYPES.map(t => <option key={t} value={t}>{t} ({counts[t]})</option>)}</select></label>
      <label className="team-filter"><span className="team-filter__label">Skills for</span><select value={team} onChange={e => update('team', e.target.value)}><option value="">All teams</option>{teams.map(t => <option key={t}>{t}</option>)}</select><ChevronDown size={14} aria-hidden="true" /></label>
    </div>
  </div>;
}

/** The live result count, plus Clear filters once anything is set. */
export function DirectoryStatus({ f }: { f: DirectoryFilters }) {
  const { results, query, type, team, clear } = f;
  return <div className="my-3 flex min-h-6 items-center justify-between gap-4 text-sm"><p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'resource' : 'resources'}{type && ` · ${type}`}{team && ` · Skills for ${team}`}</p>{(query || type || team) && <button className={`${LINK} min-h-11`} onClick={clear}>Clear filters</button>}</div>;
}

/** One white surface per group, then the empty state when nothing matches. */
export function DirectoryGroups({ f, rowStyle }: { f: DirectoryFilters; rowStyle?: RowStyle }) {
  const { sections, searching, type, team, results, clear } = f;
  return <>
    {sections.map(section => <GroupSection key={section.id} section={section} searching={searching} filtered={Boolean(searching || type || team)} rowStyle={rowStyle} />)}
    {!results.length && <div className="border-y border-border py-12 text-center"><Heading as="h3" className="text-lg font-bold">No matching resources</Heading><p className="mt-2 text-foreground">Try a different search or clear your filters.</p><button onClick={clear} className={`${LINK} mt-5 min-h-11`}>Clear filters</button></div>}
  </>;
}
