import { useEffect } from 'react';
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
function Access({ resource: r }: { resource: AiResource }) {
  if (r.catalog) return <details className="text-sm"><summary className="action-focus cursor-pointer font-semibold underline underline-offset-4">Search catalog</summary><p className="mt-3 leading-6">Not shared org-wide. Search the Claude skill catalog for <code className="break-all">{r.identifier}</code>.</p><p className="mt-2"><External href={r.url!}>View skill<span className="sr-only">: {r.title}</span></External></p></details>;
  if (!r.url) return <details className="text-sm"><summary className="action-focus cursor-pointer font-semibold underline underline-offset-4">Details</summary><p className="mt-3 leading-6">{r.source}. No direct link is listed here. Ask in <External href="https://ordergroove.slack.com/archives/C09HTBGS8JD">#og-ai</External> for access.</p></details>;
  return <External href={r.url}>{r.type === 'Skills' ? 'Open skill' : r.type === 'Assets' ? 'Open file' : r.type === 'Help & channels' ? 'Open channel' : 'Open resource'} <ArrowUpRight size={14} className="inline" aria-hidden="true" /><span className="sr-only">: {r.title}</span></External>;
}
export function AiResources() {
  const [params, setParams] = useSearchParams();
  const query = params.get('q') ?? '';
  const type = params.get('type') ?? '';
  const team = params.get('team') ?? '';
  function update(key: string, value: string) { const next = new URLSearchParams(params); if (value) next.set(key, value); else next.delete(key); setParams(next, { replace: true, preventScrollReset: true }); }
  function clear() { const next = new URLSearchParams(params); ['q', 'type', 'team'].forEach(key => next.delete(key)); setParams(next, { replace: true, preventScrollReset: true }); }
  const results = filterResources(AI_DIRECTORY, query, type, team);
  useEffect(() => {
    const legacy: Record<string, string> = { '#ai-training': 'Guides & training', '#ai-how-to': 'Guides & training', '#ai-slack': 'Help & channels' };
    const target = legacy[window.location.hash];
    if (target) { update('type', target); document.getElementById('ai-skills-library')?.scrollIntoView(); }
  }, []);
  const teams = [...new Set(AI_DIRECTORY.flatMap(r => r.team ? [r.team] : []))];
  return <div className="ai-directory [container-type:inline-size]">
    <section aria-label="AI resource directory" id="ai-skills-library" className="scroll-mt-24">
      <div className="flex flex-col gap-4 [@container(min-width:42rem)]:flex-row">
        <label className="relative flex-1"><span className="sr-only">Search AI resources</span><Search size={19} className="pointer-events-none absolute left-4 top-4 text-muted-foreground" aria-hidden="true" /><input type="search" value={query} onChange={e => update('q', e.target.value)} placeholder="Search AI resources" className="action-focus min-h-12 w-full rounded-md border border-border bg-white pl-12 pr-4 text-base placeholder:text-muted-foreground" /></label>
        <label className="flex items-center gap-3 text-sm font-semibold">Team<select value={team} onChange={e => update('team', e.target.value)} className="action-focus min-h-12 min-w-0 rounded-md border border-border bg-white px-3 font-normal"><option value="">All teams</option>{teams.map(t => <option key={t}>{t}</option>)}</select></label>
      </div>
      <div className="mt-5 flex flex-wrap gap-2" role="group" aria-label="Filter by resource type">
        {['', ...RESOURCE_TYPES].map(t => { const Icon = t ? ICONS[t as keyof typeof ICONS] : null; const count = filterResources(AI_DIRECTORY, query, t, team).length; return <button key={t} type="button" aria-pressed={type === t} onClick={() => update('type', t)} className={`action-focus inline-flex min-h-11 items-center gap-2 rounded-md border px-3 text-sm font-semibold ${type === t ? 'border-og-midnight bg-og-midnight text-white' : 'border-border bg-white text-foreground hover:bg-og-gray-950'}`}>{Icon && <Icon size={16} aria-hidden="true" />}{t || 'All'}<span className={type === t ? 'text-og-green tabular-nums' : 'text-muted-foreground tabular-nums'}>{count}</span></button>; })}
      </div>
      <div className="my-5 flex min-h-6 items-center justify-between gap-4 text-sm"><p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'resource' : 'resources'}{type && ` · ${type}`}</p>{(query || type || team) && <button className={LINK} onClick={clear}>Clear filters</button>}</div>
      <table className="block w-full border-collapse text-left text-sm [@container(min-width:40rem)]:table">
        <caption className="sr-only">AI resources, resource types, and access links</caption>
        <thead className="hidden border-y border-border bg-og-gray-950 [@container(min-width:40rem)]:table-header-group"><tr><th scope="col" className="px-5 py-3 font-semibold">Resource</th><th scope="col" className="w-44 px-4 py-3 font-semibold">Type</th><th scope="col" className="w-40 px-4 py-3 font-semibold">Access</th></tr></thead>
        <tbody className="block [@container(min-width:40rem)]:table-row-group">{results.map(r => { const Icon = ICONS[r.type]; return <tr key={r.id} className="block border-b border-border bg-white [@container(min-width:40rem)]:table-row">
          <td className="block px-5 pb-3 pt-5 align-top [@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:py-5"><div className="flex items-start gap-3"><PlatformIcon resource={r} /><h3 className="min-w-0 self-center text-base font-bold leading-6">{r.title}</h3></div><p className="mt-1 max-w-[65ch] leading-6 text-muted-foreground">{r.body}</p>{r.identifier && <details className="mt-2 text-xs text-muted-foreground"><summary className="action-focus w-fit cursor-pointer">Skill / plugin name</summary><code className="mt-1 block select-all break-all">{r.identifier}</code></details>}{r.related && <p className="mt-2"><External href={r.related.url}>{r.related.label}</External></p>}{(r.team || !['Claude', 'Org plugin', 'Tool / connector', 'Slack', 'Shared drive', 'Anthropic'].includes(r.source)) && <p className="mt-2 text-xs text-muted-foreground">{[r.source.startsWith('Slack · ') ? r.source.slice(8) : ['Claude', 'Org plugin', 'Tool / connector', 'Slack', 'Shared drive', 'Anthropic'].includes(r.source) ? '' : r.source, r.team].filter(Boolean).join(' · ')}</p>}</td>
          <td className="block px-5 pb-3 align-top [@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:px-4 [@container(min-width:40rem)]:py-5"><span className="inline-flex items-center gap-2 leading-6 text-muted-foreground"><Icon size={16} aria-hidden="true" className="shrink-0" />{r.type}</span></td>
          <td className="block px-5 pb-5 align-top [@container(min-width:40rem)]:table-cell [@container(min-width:40rem)]:px-4 [@container(min-width:40rem)]:py-5"><Access resource={r} /></td>
        </tr>; })}</tbody>
      </table>
      {!results.length && <div className="border-y border-border py-12 text-center"><h3 className="text-lg font-bold">No matching resources</h3><p className="mt-2 text-muted-foreground">Try a different search or clear your filters.</p><button onClick={clear} className={`${LINK} mt-5 min-h-11`}>Clear filters</button></div>}
    </section>
    <section id="ai-sharing" className="mt-16 scroll-mt-24 border-t border-border pt-8"><span id="ai-start-here" className="scroll-mt-24" /><h2 className="flex items-center gap-3 text-2xl font-bold"><ShieldCheck aria-hidden="true" size={24} />What you can share</h2><p className="mt-3 text-sm leading-6">Use your OG Gmail to sign in to Team accounts (Claude, ChatGPT, Gemini). Read the <External href={SECURITY_GUIDELINES.url}>{SECURITY_GUIDELINES.label}</External>.</p><div className="mt-6 grid gap-8 [@container(min-width:40rem)]:grid-cols-2">{[{title:'Never share', items:SHARING_RULES.never}, {title:'Team account only', items:SHARING_RULES.teamOnly}].map(group => <div key={group.title}><h3 className="font-bold">{group.title}</h3><ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-6 text-muted-foreground">{group.items.map(item => <li key={item}>{item}</li>)}</ul></div>)}</div><p className="mt-6 max-w-[70ch] text-sm leading-6"><strong>Brief Claude, then review.</strong> Include your audience, goal, and source material. Check facts, branding, and the final file before sharing.</p></section>
    <section id="ai-connectors" className="mt-12 scroll-mt-24 border-t border-border pt-8"><h2 className="text-2xl font-bold">Get a new tool approved</h2><p className="mt-3 text-sm leading-6">Get approval before connecting a tool. Questions: <External href={SECURITY_CHANNEL.url}>{SECURITY_CHANNEL.label}</External>. Reviews: <External href={INFOSEC_CHANNEL.url}>{INFOSEC_CHANNEL.label}</External>.</p><ol className="mt-5 list-decimal space-y-4 pl-5 text-sm">{APPROVAL_STEPS.map(s => <li key={s.link.url}><External href={s.link.url}>{s.link.label}</External><p className="mt-1 leading-6 text-muted-foreground">{s.body}</p></li>)}</ol><p className="mt-5 flex flex-wrap gap-x-5 gap-y-3 text-sm"><External href={APPROVAL_CRITERIA.url}>{APPROVAL_CRITERIA.label}</External><External href={APPROVAL_DECISIONS.url}>{APPROVAL_DECISIONS.label}</External></p></section>

  </div>;
}
