import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { BookOpen, Boxes, FileText, MessageCircle, Search, ShieldCheck, Sparkles, ArrowUpRight } from 'lucide-react';
import { AI_DIRECTORY, RESOURCE_TYPES, filterResources, type AiResource } from '@/data/ai-directory';
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
function ResourceRow({ resource: r, showType }: { resource: AiResource; showType: boolean }) {
  const [open, setOpen] = useState(false);
  const detailId = `resource-${r.id.replace(/[^a-z0-9-]/gi, '')}`;
  const action = r.type === 'Skills' ? 'Open skill' : r.type === 'Assets' ? 'Open file' : r.type === 'Help & channels' ? 'Open channel' : 'Open';
  return <>
    <tr className="resource-row">
      <td className="resource-main">
        <div className="resource-identity"><PlatformIcon resource={r} /><div className="min-w-0"><h3 className="resource-title">{r.title}</h3><p className="resource-description text-muted-foreground">{r.body}</p></div></div>
      </td>
      {showType && <td className="resource-type text-muted-foreground">{r.type}</td>}
      <td className="resource-actions">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          {r.url && !r.catalog && (r.type === 'Skills'
            ? <a href={r.url} target="_blank" rel="noopener noreferrer" className="action-focus inline-flex min-h-9 items-center justify-center whitespace-nowrap rounded-md border border-og-midnight/30 bg-white px-2.5 text-sm font-semibold text-og-midnight transition-colors hover:border-og-midnight hover:bg-og-gray-950">Open skill<span className="sr-only">: {r.title} (opens in a new tab)</span></a>
            : <External href={r.url}>{action}<ArrowUpRight size={13} className="ml-1 inline" aria-hidden="true" /><span className="sr-only">: {r.title}</span></External>)}
          <button type="button" className="action-focus min-h-11 rounded-sm text-sm underline-offset-4 hover:underline" aria-expanded={open} aria-controls={detailId} onClick={() => setOpen(!open)}>
            {r.catalog ? 'Catalog access' : !r.url ? 'Access details' : open ? 'Less' : 'Details'}<span className="sr-only">: {r.title}</span>
          </button>
        </div>
      </td>
    </tr>
    {open && <tr className="resource-expanded"><td colSpan={showType ? 3 : 2} id={detailId} className="px-4 pb-5 pt-1 text-sm leading-6">
      <div className="max-w-[70ch] space-y-2"><p>{r.body}</p>
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
export function AiResources() {
  const [params, setParams] = useSearchParams();
  const [filtersOpen, setFiltersOpen] = useState(false);
  const directoryRef = useRef<HTMLElement>(null);
  const query = params.get('q') ?? '';
  const type = params.get('type') ?? '';
  const team = params.get('team') ?? '';
  function update(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); next.delete('page'); setParams(next, { replace: true, preventScrollReset: true }); }
  function clear() { const next = new URLSearchParams(params); ['q', 'type', 'team'].forEach(key => next.delete(key)); next.delete('page'); setParams(next, { replace: true, preventScrollReset: true }); }
  const results = filterResources(AI_DIRECTORY, query, type, team).sort((a, b) => {
    const category = RESOURCE_TYPES.indexOf(a.type) - RESOURCE_TYPES.indexOf(b.type);
    if (category) return category;
    const steps = ['sbr-scan', 'sbr-prep', 'sbr-practice', 'sbr-recap'];
    if (steps.includes(a.id) && steps.includes(b.id)) return steps.indexOf(a.id) - steps.indexOf(b.id);
    return a.title.localeCompare(b.title);
  });
  const pageCount = Math.max(1, Math.ceil(results.length / 12));
  const requestedPage = Number(params.get('page'));
  const page = Math.min(pageCount, Math.max(1, Number.isFinite(requestedPage) ? Math.floor(requestedPage) : 1));
  const visibleResults = results.slice((page - 1) * 12, page * 12);
  function goToPage(value: number) {
    const next = new URLSearchParams(params);
    if (value === 1) next.delete('page'); else next.set('page', String(value));
    setParams(next, { preventScrollReset: true });
    directoryRef.current?.scrollIntoView({ block: 'start' });
    directoryRef.current?.focus({ preventScroll: true });
  }
  useEffect(() => {
    const legacy: Record<string, string> = { '#ai-training': 'Guides & training', '#ai-how-to': 'Guides & training', '#ai-slack': 'Help & channels' };
    const target = legacy[window.location.hash];
    if (target) { update('type', target); document.getElementById('ai-skills-library')?.scrollIntoView(); }
  }, []);
  const teams = [...new Set(AI_DIRECTORY.flatMap(r => r.team ? [r.team] : []))];
  return <div className="ai-directory [container-type:inline-size]">
    <section ref={directoryRef} tabIndex={-1} aria-label="AI resource directory" id="ai-skills-library" className="scroll-mt-24 focus:outline-none">
      <div className="directory-toolbar">
      <div className="flex items-center gap-3">
        <label className="relative flex-1"><span className="sr-only">Search AI resources</span><Search size={19} className="pointer-events-none absolute left-4 top-4 text-muted-foreground" aria-hidden="true" /><input type="search" value={query} onChange={e => update('q', e.target.value)} placeholder="Search AI resources" className="action-focus min-h-12 w-full rounded-md border border-border bg-white pl-12 pr-4 text-base placeholder:text-muted-foreground" /></label>
        <button type="button" className="action-focus min-h-12 rounded-md border border-border bg-white px-3 text-sm font-semibold md:hidden" aria-expanded={filtersOpen} aria-controls="directory-filters" onClick={() => setFiltersOpen(!filtersOpen)}>Filters{(type || team) && ' · on'}</button>
      </div>
      <div id="directory-filters" className={`${filtersOpen ? 'flex' : 'hidden'} mt-3 flex-col gap-3 md:flex md:flex-row md:flex-wrap md:items-center`}>
        <div className="hidden flex-wrap gap-1.5 md:flex" role="group" aria-label="Filter by resource type">
          {['', ...RESOURCE_TYPES].map(t => { const Icon = t ? ICONS[t as keyof typeof ICONS] : null; return <button key={t} type="button" aria-pressed={type === t} onClick={() => update('type', t)} className={`action-focus inline-flex min-h-11 items-center gap-1.5 rounded-md px-2.5 text-sm font-semibold ${type === t ? 'bg-og-midnight text-white' : 'hover:bg-og-gray-950'}`}>{Icon && <Icon size={15} aria-hidden="true" />}{t || 'All'}</button>; })}
        </div>
        <label className="flex items-center gap-2 text-sm md:hidden">Type<select value={type} onChange={e => update('type', e.target.value)} className="action-focus min-h-11 min-w-0 flex-1 rounded-md border border-border bg-white px-2"><option value="">All resources</option>{RESOURCE_TYPES.map(t => <option key={t}>{t}</option>)}</select></label>
        <label className="flex items-center gap-2 text-sm md:ml-auto">Team<select value={team} onChange={e => update('team', e.target.value)} className="action-focus min-h-11 min-w-0 flex-1 rounded-md border border-border bg-white px-2 md:max-w-48"><option value="">All teams</option>{teams.map(t => <option key={t}>{t}</option>)}</select></label>
      </div>
      </div>
      <div className="my-3 flex min-h-6 items-center justify-between gap-4 text-sm"><p role="status" aria-live="polite">{results.length ? `${(page - 1) * 12 + 1}–${Math.min(page * 12, results.length)} of ${results.length} resources` : '0 resources'}{type && ` · ${type}`}</p>{(query || type || team) && <button className={`${LINK} min-h-11`} onClick={clear}>Clear filters</button>}</div>
      <table className="resource-table w-full border-collapse text-left text-sm">
        <caption className="sr-only">AI resources and access links</caption>
        <thead><tr><th scope="col">Resource</th>{!type && <th scope="col" className="resource-type">Type</th>}<th scope="col">Access</th></tr></thead>
        <tbody>{visibleResults.map(r => <ResourceRow key={r.id} resource={r} showType={!type} />)}</tbody>
      </table>
      {pageCount > 1 && <nav aria-label="Resource pages" className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 text-sm"><p>Page {page} of {pageCount}</p><div className="flex gap-2"><button onClick={() => goToPage(page - 1)} disabled={page === 1} className="action-focus min-h-11 rounded-md border border-border bg-white px-4 font-semibold disabled:cursor-default disabled:opacity-40">Previous</button><button onClick={() => goToPage(page + 1)} disabled={page === pageCount} className="action-focus min-h-11 rounded-md border border-border bg-white px-4 font-semibold disabled:cursor-default disabled:opacity-40">Next</button></div></nav>}
      {!results.length && <div className="border-y border-border py-12 text-center"><h3 className="text-lg font-bold">No matching resources</h3><p className="mt-2 text-muted-foreground">Try a different search or clear your filters.</p><button onClick={clear} className={`${LINK} mt-5 min-h-11`}>Clear filters</button></div>}
    </section>
    <section id="ai-sharing" className="mt-16 scroll-mt-24 border-t border-border pt-8"><span id="ai-start-here" className="scroll-mt-24" /><h2 className="flex items-center gap-3 text-2xl font-bold"><ShieldCheck aria-hidden="true" size={24} />What you can share</h2><p className="mt-3 text-sm leading-6">Use your OG Gmail to sign in to Team accounts (Claude, ChatGPT, Gemini). Read the <External href={SECURITY_GUIDELINES.url}>{SECURITY_GUIDELINES.label}</External>.</p><div className="mt-6 grid gap-8 [@container(min-width:40rem)]:grid-cols-2">{[{title:'Never share', items:SHARING_RULES.never}, {title:'Team account only', items:SHARING_RULES.teamOnly}].map(group => <div key={group.title}><h3 className="font-bold">{group.title}</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div><p className="mt-6 max-w-[70ch] text-sm leading-6"><strong>Brief Claude, then review.</strong> Include your audience, goal, and source material. Check facts, branding, and the final file before sharing.</p></section>
    <section id="ai-connectors" className="mt-12 scroll-mt-24 border-t border-border pt-8"><h2 className="text-2xl font-bold">Get a new tool approved</h2><p className="mt-3 text-sm leading-6">Get approval before connecting a tool. Questions: <External href={SECURITY_CHANNEL.url}>{SECURITY_CHANNEL.label}</External>. Reviews: <External href={INFOSEC_CHANNEL.url}>{INFOSEC_CHANNEL.label}</External>.</p><ol className="mt-5 list-decimal space-y-4 pl-5 text-sm">{APPROVAL_STEPS.map(s => <li key={s.link.url}><External href={s.link.url}>{s.link.label}</External><p className="mt-1 leading-6 text-muted-foreground">{s.body}</p></li>)}</ol><p className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm"><External href={APPROVAL_CRITERIA.url}>{APPROVAL_CRITERIA.label}</External><External href={APPROVAL_DECISIONS.url}>{APPROVAL_DECISIONS.label}</External></p></section>

  </div>;
}
