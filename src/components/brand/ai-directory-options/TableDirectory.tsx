/**
 * Option B, "Filtered table" (2026-11-13 review). Modeled on an Airtable interface page: a
 * breadcrumb title, a row of dropdown filter chips (type, team, platform, access) with search, and a
 * compact table with light tag pills. Every facet is a field the data already has.
 */
import { ArrowUpRight, ChevronDown, Search } from 'lucide-react';
import { RESOURCE_TYPES } from '@/data/ai-directory';
import { SKILL_GROUPS } from '@/data/ai-resources';
import { cn } from '@/lib/utils';
import { ACCESS, PLATFORMS, actionOf, blocksFor, filterFacets, kindOf, ownerOf, rowAnchor, type Facets, type Row } from './model';
import { AccessNote, External, PlatformMark, RelatedLink, useDirectoryParams } from './shared';
import t from './Table.module.css';

type FacetKey = 'type' | 'team' | 'platform' | 'access';
const FACETS: { key: FacetKey; label: string; any: string; options: readonly string[] }[] = [
  { key: 'type', label: 'Type', any: 'All', options: RESOURCE_TYPES },
  // Team narrows skills only (guides, tools and channels belong to everyone), so the chip says so.
  { key: 'team', label: 'Skills for', any: 'All teams', options: SKILL_GROUPS.map(g => g.label) },
  { key: 'platform', label: 'Platform', any: 'All', options: PLATFORMS },
  { key: 'access', label: 'Access', any: 'All', options: ACCESS },
];

function FilterChip({ facet, facets, onChange }: { facet: (typeof FACETS)[number]; facets: Facets; onChange: (value: string) => void }) {
  const value = facets[facet.key];
  // Each option's count applies every other filter, so it says what you'd get by picking it.
  const count = (option: string) => filterFacets({ ...facets, [facet.key]: option }).length;
  return <label className={cn('team-filter', t.chip, value && t.chipOn)}>
    <span className="team-filter__label">{facet.label}</span>
    <select value={value} onChange={e => onChange(e.target.value)}>
      <option value="">{facet.any}</option>
      {facet.options.map(option => <option key={option} value={option}>{option} ({count(option)})</option>)}
    </select>
    <ChevronDown size={14} aria-hidden="true" />
  </label>;
}

function TableRow({ row }: { row: Row }) {
  const r = row.resource;
  const workflow = row.kind === 'workflow';
  const action = workflow ? null : actionOf(r);
  const owner = ownerOf(r);
  return <tr id={rowAnchor(row)} className={cn(t.row, row.kind === 'resource' && row.step && t.stepRow, workflow && t.workflowRow)}>
    <td className={t.nameCell}>
      <div className={t.identity}>
        {row.kind === 'resource' && row.step
          ? <span className={t.stepNumber} aria-hidden="true">{row.step}</span>
          : <span className={t.mark}><PlatformMark resource={r} size={16} /></span>}
        <div className="min-w-0">
          <p className={t.name}>
            {row.kind === 'resource' && row.step ? <span className="sr-only">{row.workflow}, step {row.step}: </span> : null}
            {workflow ? row.title : r.title}
            {workflow && <span className={t.nameMeta}> · {row.total} steps</span>}
          </p>
          {!workflow && r.identifier && <code className={t.code}>{r.identifier}</code>}
        </div>
      </div>
    </td>
    <td className={t.descCell}>
      <p>{workflow ? row.body : r.body}</p>
      {workflow && row.matched < row.total && <p className={t.subtle}>{row.matched} of {row.total} steps match</p>}
      {!workflow && r.related && <RelatedLink resource={r} className={t.related} />}
    </td>
    <td className={t.tagCell}>
      <span className={t.tags}>
        <span className={t.pill}>{workflow ? 'Workflow' : kindOf(r)}</span>
        {!workflow && r.catalog && <span className={cn(t.pill, t.pillOutline)}>Search only</span>}
      </span>
    </td>
    <td className={t.tagCell}>
      {r.team ? <span className={t.tags}><span className={cn(t.pill, t.pillTeam)}>{r.team}</span></span> : owner ? <span className={t.owner}>{owner}</span> : null}
    </td>
    <td className={t.actionCell}>
      {action && <External href={action.href} className={t.action} label={r.title}>{action.label}<ArrowUpRight size={13} aria-hidden="true" /></External>}
    </td>
  </tr>;
}

export default function TableDirectory() {
  const params = useDirectoryParams();
  const facets: Facets = { query: params.query, type: params.type, team: params.team, platform: params.platform, access: params.access };
  const results = filterFacets(facets);
  const rows = blocksFor(results).flat();
  const filtered = Boolean(facets.query || facets.type || facets.team || facets.platform || facets.access);
  const crumbs = [facets.type || 'All resources', facets.team && `Skills for ${facets.team}`, facets.platform, facets.access].filter(Boolean);

  return <section aria-label="AI resource directory" id="ai-skills-library" className={cn(t.root, 'scroll-mt-24')}>
    <div className={t.header}>
      <h2 className={t.crumbs}>
        <span>Directory</span>
        {crumbs.map(c => <span key={c} className={t.crumb}><span aria-hidden="true" className={t.slash}>/</span><span className="sr-only">, </span>{c}</span>)}
      </h2>
      <div className={t.headerMeta}>
        <p role="status" aria-live="polite">{results.length} {results.length === 1 ? 'resource' : 'resources'}</p>
        {filtered && <button type="button" className={cn(t.clear, 'action-focus')} onClick={params.clear}>Clear filters</button>}
      </div>
    </div>

    <div className={t.toolbar}>
      <div className={t.chips} role="group" aria-label="Filter resources">
        {FACETS.map(f => <FilterChip key={f.key} facet={f} facets={facets} onChange={value => params.set({ [f.key]: value })} />)}
      </div>
      <label className={t.search}>
        <span className="sr-only">Search resources</span>
        <Search size={16} aria-hidden="true" />
        <input type="search" value={facets.query} onChange={e => params.set({ q: e.target.value })} placeholder="Search" className="action-focus" />
      </label>
    </div>

    {results.length > 0 && <table className={t.table}>
      <thead>
        <tr>
          <th scope="col" className={t.nameCol}>Name</th>
          <th scope="col">Description</th>
          <th scope="col" className={t.typeCol}>Type</th>
          <th scope="col" className={t.teamCol}>Team or owner</th>
          <th scope="col" className={t.actionCol}><span className="sr-only">Link</span></th>
        </tr>
      </thead>
      <tbody>{rows.map(row => <TableRow key={row.kind === 'workflow' ? `w-${row.id}` : row.resource.id} row={row} />)}</tbody>
    </table>}

    {!results.length && <div className={t.empty}>
      <p className={t.emptyTitle}>No matching resources</p>
      <p>Try a different search or fewer filters.</p>
      <button type="button" onClick={params.clear} className={cn(t.clear, 'action-focus')}>Clear filters</button>
    </div>}

    <AccessNote className={t.note} />
  </section>;
}
