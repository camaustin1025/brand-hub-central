import { Heading } from "@/components/layout/Heading";
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Boxes, ChevronDown, FileText, MessageCircle, Search, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';
import { AI_DIRECTORY, RESOURCE_TYPES, countByType, filterResources, groupResources, type AiResource, type DirectoryEntry } from '@/data/ai-directory';
import { APPROVAL_STEPS, APPROVAL_CRITERIA, APPROVAL_DECISIONS, SECURITY_GUIDELINES, SECURITY_CHANNEL, INFOSEC_CHANNEL, SHARING_RULES } from '@/data/ai-resources';

const ICONS = { 'Skills': Sparkles, 'Guides & training': BookOpen, 'Tools & plugins': Boxes, 'Assets': FileText, 'Help & channels': MessageCircle };
const LINK = 'action-focus rounded-sm font-semibold underline underline-offset-4 hover:text-foreground';
function External({ href, children }: { href: string; children: React.ReactNode }) {
  return <a className={LINK} href={href} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only"> (opens in a new tab)</span></a>;
}
function PlatformIcon({ resource: r }: { resource: AiResource }) {
  const platform = r.url?.includes('slack.com') ? 'slack'
    : r.url?.includes('google.com') ? 'google-drive'
    : r.title === 'Salesforce' ? 'salesforce'
    : r.url?.includes('claude.') || r.url?.includes('anthropic.') || r.source === 'Org plugin' || r.title.startsWith('Claude') ? 'claude' : null;
  const label = platform === 'google-drive' ? 'Google Drive' : platform === 'slack' ? 'Slack' : platform === 'salesforce' ? 'Salesforce' : 'Claude';
  return <span className="mt-0.5 inline-flex size-8 shrink-0 items-center justify-center rounded-md border border-border bg-white" title={platform ? label : r.source}>
    {platform ? <img src={`/platform-icons/${platform}.svg`} alt={label} width={20} height={20} /> : <Boxes size={20} className="text-violet-700" aria-hidden="true" />}
  </span>;
}
function ResourceRow({ resource: r, step = false }: { resource: AiResource; step?: boolean }) {
  const [open, setOpen] = useState(false);
  const detailId = `resource-${r.id.replace(/[^a-z0-9-]/gi, '')}`;
  const action = r.type === 'Skills' ? 'Open skill' : r.type === 'Assets' ? 'Open file' : r.type === 'Help & channels' ? 'Open channel' : 'Open';
  return <>
    <tr className={step ? 'resource-row resource-step' : 'resource-row'}>
      <td className="resource-main">
        <div className="resource-identity"><PlatformIcon resource={r} /><div className="min-w-0"><Heading as="h3" className="resource-title">{r.title}</Heading><p className="resource-description text-foreground">{r.body}</p></div></div>
      </td>
      <td className="resource-actions">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {r.url && !r.catalog && (r.type === 'Skills'
            ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="action-focus tap-target inline-flex h-8 items-center justify-center whitespace-nowrap rounded-full border border-og-midnight bg-white px-3 text-[13px] font-semibold text-og-midnight transition-colors hover:bg-og-midnight hover:text-white">Open skill<span className="sr-only">: {r.title} (opens in a new tab)</span></a>
            : <External href={r.url}>{action}<ArrowUpRight size={13} className="ml-1 inline" aria-hidden="true" /><span className="sr-only">: {r.title}</span></External>)}
          <button type="button" className="action-focus min-h-11 rounded-sm text-[13px] font-semibold underline decoration-og-midnight/25 underline-offset-4 transition-colors hover:decoration-og-midnight" aria-expanded={open} aria-controls={detailId} onClick={() => setOpen(!open)}>
            {r.catalog ? 'Catalog access' : !r.url ? 'Access details' : open ? 'Less' : 'Details'}<span className="sr-only">: {r.title}</span>
          </button>
        </div>
      </td>
    </tr>
    {open && <tr className={step ? 'resource-expanded resource-step' : 'resource-expanded'}><td colSpan={2} id={detailId} className="px-4 pb-5 pt-1 text-sm leading-6">
      <div className="max-w-[var(--measure)] space-y-2"><p>{r.body}</p>
      {r.identifier && <p><strong>{r.source === 'Org plugin' ? 'Plugin' : 'Skill'} name:</strong> <code className="select-all break-all">{r.identifier}</code></p>}
      {r.catalog && <p>Not shared org-wide. Search the Claude skill catalog for the skill name above. <External href={r.url!}>View skill<span className="sr-only">: {r.title}</span></External>.</p>}
      {!r.url && <p>No direct link is listed here. Ask in <External href="https://ordergroove.slack.com/archives/C09HTBGS8JD">#og-ai</External> for access.</p>}
      {r.team && <p><strong>Team:</strong> {r.team}</p>}
      {!['Claude', 'Org plugin', 'Tool / connector', 'Slack', 'Shared drive', 'Anthropic'].includes(r.source) && <p>{r.source.startsWith('Slack · ') ? r.source.slice(8) : r.source}</p>}
      {r.related && <p><External href={r.related.url}>{r.related.label}</External></p>}
      </div>
    </td></tr>}
  </>;
}
/** A workflow collapses its steps into one row. A search that matches a step opens it, so matches are never hidden. */
function WorkflowRow({ entry: w, searching }: { entry: Extract<DirectoryEntry, { kind: 'workflow' }>; searching: boolean }) {
  const [open, setOpen] = useState(false);
  const expanded = searching || open;
  return <>
    <tr className="resource-row">
      <td className="resource-main">
        <div className="resource-identity"><PlatformIcon resource={w.steps[0]} /><div className="min-w-0"><Heading as="h3" className="resource-title">{w.title}<span className="font-normal text-muted-foreground"> · {w.total} steps</span></Heading><p className="resource-description text-foreground">{w.body}</p></div></div>
      </td>
      <td className="resource-actions">
        {searching
          ? <p className="text-[13px] text-muted-foreground">{w.steps.length === w.total ? 'All steps match' : `${w.steps.length} of ${w.total} steps match`}</p>
          : <button type="button" className="action-focus inline-flex min-h-11 items-center gap-1 rounded-sm text-[13px] font-semibold underline decoration-og-midnight/25 underline-offset-4 transition-colors hover:decoration-og-midnight" aria-expanded={expanded} onClick={() => setOpen(!open)}>
              {expanded ? 'Hide steps' : `Show ${w.total} steps`}<ChevronDown size={15} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} aria-hidden="true" /><span className="sr-only">: {w.title}</span>
            </button>}
      </td>
    </tr>
    {expanded && w.steps.map(r => <ResourceRow key={r.id} resource={r} step />)}
  </>;
}
export function AiResources() {
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
  }, []);
  const teams = [...new Set(AI_DIRECTORY.flatMap(r => r.team ? [r.team] : []))];
  return <div className="ai-directory [container-type:inline-size]">
    <section aria-label="AI resource directory" id="ai-skills-library" className="scroll-mt-24">
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
      {results.length > 0 && <table className="resource-table w-full border-collapse border border-border text-left text-sm">
        <caption className="sr-only">AI resources and access links, grouped by type</caption>
        <thead><tr><th scope="col">Resource</th><th scope="col">Access</th></tr></thead>
        {sections.map(s => <tbody key={s.id}>
          <tr className="resource-group"><th scope="rowgroup" colSpan={2}><Heading as="h2">{s.label}<span className="resource-group-count">{s.count}</span></Heading></th></tr>
          {s.entries.map(e => e.kind === 'resource' ? <ResourceRow key={e.resource.id} resource={e.resource} /> : <WorkflowRow key={e.id} entry={e} searching={searching} />)}
        </tbody>)}
      </table>}
      {!results.length && <div className="border-y border-border py-12 text-center"><Heading as="h3" className="text-lg font-bold">No matching resources</Heading><p className="mt-2 text-foreground">Try a different search or clear your filters.</p><button onClick={clear} className={`${LINK} mt-5 min-h-11`}>Clear filters</button></div>}
    </section>
    <section id="ai-sharing" className="sharing-panel dark scroll-mt-24">
      <span id="ai-start-here" className="scroll-mt-24" />
      <Heading as="h2"><ShieldCheck aria-hidden="true" size={26} />What you can share</Heading>
      <p className="sharing-panel__intro section-lede">Use your OG Gmail to sign in to Team accounts (Claude, ChatGPT, Gemini). Read the <External href={SECURITY_GUIDELINES.url}>{SECURITY_GUIDELINES.label}</External>.</p>
      <div className="sharing-panel__cols">
        <div className="sharing-panel__col sharing-panel__col--never">
          <Heading as="h3"><span className="sharing-panel__mark"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" aria-hidden="true"><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg></span>Never share</Heading>
          <ul>{SHARING_RULES.never.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
        <div className="sharing-panel__col sharing-panel__col--team">
          <Heading as="h3"><span className="sharing-panel__mark"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5" /></svg></span>Team account only</Heading>
          <ul>{SHARING_RULES.teamOnly.map(item => <li key={item}>{item}</li>)}</ul>
        </div>
      </div>
    </section>
    <section id="ai-connectors" className="mt-12 scroll-mt-24 border-t border-border pt-8"><Heading as="h2" className="reference-section-title">Get a new tool approved</Heading><p className="section-lede mt-0.5 text-sm leading-6">Get approval before connecting a tool. Questions: <External href={SECURITY_CHANNEL.url}>{SECURITY_CHANNEL.label}</External>. Reviews: <External href={INFOSEC_CHANNEL.url}>{INFOSEC_CHANNEL.label}</External>.</p><ol className="mt-5 space-y-4 text-sm">{APPROVAL_STEPS.map((s, index) => <li key={s.link.url} className="flex gap-3"><span aria-hidden="true" className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-og-midnight text-xs font-bold tabular-nums text-white">{index + 1}</span><div><External href={s.link.url}>{s.link.label}</External><p className="mt-1 leading-6 text-foreground">{s.body}</p></div></li>)}</ol><p className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm"><External href={APPROVAL_CRITERIA.url}>{APPROVAL_CRITERIA.label}</External><External href={APPROVAL_DECISIONS.url}>{APPROVAL_DECISIONS.label}</External></p></section>

  </div>;
}
