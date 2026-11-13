/**
 * Option A, "Library" (2026-11-13 review). Modeled on Retool's Resources page: a folder list on the
 * left that filters the list, the folder name as the title with search and one primary action on the
 * right, then a sortable table of rows with an icon tile, name, description, type, team or owner, and the link.
 * The categories carry the same icons as the current directory's filter pills.
 */
import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpRight, BookOpen, Boxes, ChevronDown, ChevronsUpDown, FileText, LayoutGrid, MessageCircle, Search, Sparkles, type LucideIcon } from 'lucide-react';
import { AI_DIRECTORY, filterResources } from '@/data/ai-directory';
import { OG_AI_CHANNEL } from '@/data/ai-resources';
import { cn } from '@/lib/utils';
import { FOLDERS, actionOf, blocksFor, kindOf, ownerOf, rowAnchor, type Block, type Row } from './model';
import { AccessNote, External, PlatformMark, RelatedLink, useDirectoryParams } from './shared';
import s from './Library.module.css';

type SortKey = 'name' | 'type' | 'owner';
type Sort = { key: SortKey; dir: 1 | -1 } | null;

const head = (b: Block) => b[0];
const nameOf = (r: Row) => (r.kind === 'workflow' ? r.title : r.resource.title);
const typeOf = (r: Row) => (r.kind === 'workflow' ? 'Workflow' : kindOf(r.resource));
const ownerFor = (r: Row) => r.resource.team ?? ownerOf(r.resource);
const SORT_VALUE: Record<SortKey, (r: Row) => string> = { name: nameOf, type: typeOf, owner: ownerFor };
/** The current directory's filter-pill icons, keyed by resource type ('' is All). Team folders nest without one. */
const FOLDER_ICONS: Record<string, LucideIcon> = { '': LayoutGrid, 'Skills': Sparkles, 'Guides & training': BookOpen, 'Tools & plugins': Boxes, 'Assets': FileText, 'Help & channels': MessageCircle };

function FolderIcon({ type }: { type: string }) {
  const Icon = FOLDER_ICONS[type];
  return Icon ? <Icon size={15} strokeWidth={1.9} aria-hidden="true" className={s.folderIcon} /> : null;
}

function sortBlocks(blocks: Block[], sort: Sort) {
  if (!sort) return blocks;
  const value = SORT_VALUE[sort.key];
  // Rows without a value sink to the bottom either way, like an empty cell in a spreadsheet.
  return [...blocks].sort((a, b) => {
    const x = value(head(a)), y = value(head(b));
    if (!x !== !y) return x ? -1 : 1;
    return (x.localeCompare(y) || nameOf(head(a)).localeCompare(nameOf(head(b)))) * sort.dir;
  });
}

function SortHeader({ label, k, sort, onSort, className }: { label: string; k: SortKey; sort: Sort; onSort: (k: SortKey) => void; className?: string }) {
  const active = sort?.key === k;
  const Icon = !active ? ChevronsUpDown : sort.dir === 1 ? ArrowUp : ArrowDown;
  return <th scope="col" className={className} aria-sort={active ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'}>
    <button type="button" className={cn(s.sort, 'action-focus')} onClick={() => onSort(k)}>{label}<Icon size={13} aria-hidden="true" className={active ? undefined : s.sortIdle} /></button>
  </th>;
}

function LibraryRow({ row }: { row: Row }) {
  const r = row.resource;
  const owner = ownerFor(row);
  if (row.kind === 'workflow') {
    return <tr id={rowAnchor(row)} className={cn(s.row, s.workflowRow)}>
      <td className={s.nameCell}>
        <div className={s.identity}>
          <span className={s.tile}><PlatformMark resource={r} size={16} /></span>
          <div className="min-w-0">
            <p className={s.name}>{row.title}<span className={s.nameMeta}> · {row.total} steps</span></p>
            {row.matched < row.total && <p className={s.meta}>{row.matched} of {row.total} steps match</p>}
          </div>
        </div>
      </td>
      <td className={s.descCell}><p className={s.description}>{row.body}</p></td>
      <td className={s.typeCell}>Workflow</td>
      <td className={s.ownerCell}>{owner}</td>
      <td className={s.actionCell} />
    </tr>;
  }
  const action = actionOf(r);
  return <tr id={rowAnchor(row)} className={cn(s.row, row.step && s.stepRow)}>
    <td className={s.nameCell}>
      <div className={s.identity}>
        {row.step
          ? <span className={s.stepNumber} aria-hidden="true">{row.step}</span>
          : <span className={s.tile}><PlatformMark resource={r} size={16} /></span>}
        <div className="min-w-0">
          <p className={s.name}>{row.step ? <span className="sr-only">{row.workflow}, step {row.step}: </span> : null}{r.title}</p>
          {r.identifier && <p className={s.meta}><code className={s.code}>{r.identifier}</code></p>}
        </div>
      </div>
    </td>
    <td className={s.descCell}>
      <p className={s.description}>{r.body}</p>
      {r.related && <p className={s.meta}><RelatedLink resource={r} className={s.related} /></p>}
    </td>
    <td className={s.typeCell}>{kindOf(r)}{r.catalog && <span className={s.tag}>Search only</span>}</td>
    <td className={s.ownerCell}>{owner}</td>
    <td className={s.actionCell}>
      <External href={action.href} className={action.primary ? s.openSkill : s.textAction} label={r.title}>{action.label}{!action.primary && <ArrowUpRight size={13} aria-hidden="true" />}</External>
    </td>
  </tr>;
}

export default function LibraryDirectory() {
  const { query, type, team, set, clear } = useDirectoryParams();
  const [sort, setSort] = useState<Sort>(null);
  const results = filterResources(AI_DIRECTORY, query, type, team);
  const blocks = sortBlocks(blocksFor(results), sort);
  const current = FOLDERS.find(f => f.type === type && f.team === team);
  const countFor = (f: (typeof FOLDERS)[number]) => filterResources(AI_DIRECTORY, query, f.type, f.team).length;
  const pick = (id: string) => { const f = FOLDERS.find(x => x.id === id) ?? FOLDERS[0]; set({ type: f.type, team: f.team }); };
  const onSort = (k: SortKey) => setSort(prev => (prev?.key !== k ? { key: k, dir: 1 } : prev.dir === 1 ? { key: k, dir: -1 } : null));
  const title = current?.label ?? (team ? `Skills for ${team}` : 'Resources');

  return <section aria-label="AI resource directory" id="ai-skills-library" className={cn(s.root, 'scroll-mt-24')}>
    <div className={s.layout}>
      <div className={s.folders} role="group" aria-labelledby="library-folders-label">
        <p id="library-folders-label" className={s.foldersLabel}>Categories</p>
        <ul className={s.folderList}>
          {FOLDERS.map(f => <li key={f.id}>
            <button type="button" aria-pressed={current?.id === f.id} onClick={() => pick(f.id)} className={cn(s.folder, f.nested && s.folderNested, 'action-focus')}>
              <span className={s.folderLabel}>{!f.nested && <FolderIcon type={f.type} />}<span className="min-w-0">{f.label}</span></span><span className={s.folderCount}>{countFor(f)}</span>
            </button>
          </li>)}
        </ul>
      </div>

      <div className={s.main}>
        <div className={s.header}>
          <h2 className={s.title}>{title}<span className={s.titleCount}><span className="sr-only">, </span>{results.length}<span className="sr-only"> {results.length === 1 ? 'resource' : 'resources'}</span></span></h2>
          <div className={s.headerActions}>
            <label className={s.search}>
              <span className="sr-only">Search resources on this page</span>
              <Search size={17} aria-hidden="true" />
              <input type="search" value={query} onChange={e => set({ q: e.target.value })} placeholder="Search" className="action-focus" />
            </label>
            <External href={OG_AI_CHANNEL.url} className={s.primary}>Ask in #og-ai</External>
          </div>
        </div>

        <label className={s.folderSelect}>
          <span className={s.folderSelectLabel}>Category</span>
          <select value={current?.id ?? ''} onChange={e => pick(e.target.value)} className="action-focus">
            {!current && <option value="">{title}</option>}
            {FOLDERS.map(f => <option key={f.id} value={f.id}>{f.nested ? `Skills: ${f.label}` : f.label} ({countFor(f)})</option>)}
          </select>
          <ChevronDown size={16} aria-hidden="true" />
        </label>

        <p role="status" aria-live="polite" className="sr-only">{results.length} {results.length === 1 ? 'resource' : 'resources'}</p>

        {results.length > 0 && <table className={s.table}>
          <thead>
            <tr>
              <SortHeader label="Name" k="name" sort={sort} onSort={onSort} className={s.nameCol} />
              <th scope="col" className={s.descCol}><span className={s.colLabel}>Description</span></th>
              <SortHeader label="Type" k="type" sort={sort} onSort={onSort} className={s.typeCol} />
              <SortHeader label="Team or owner" k="owner" sort={sort} onSort={onSort} className={s.ownerCol} />
              <th scope="col" className={s.actionCol}><span className="sr-only">Link</span></th>
            </tr>
          </thead>
          <tbody>{blocks.flat().map(row => <LibraryRow key={row.kind === 'workflow' ? `w-${row.id}` : row.resource.id} row={row} />)}</tbody>
        </table>}

        {!results.length && <div className={s.empty}>
          <p className={s.emptyTitle}>No matching resources</p>
          <p>Try a different search or category.</p>
          <button type="button" onClick={clear} className={cn(s.textAction, 'action-focus')}>Clear search and category</button>
        </div>}

        <AccessNote className={s.note} />
      </div>
    </div>
  </section>;
}
