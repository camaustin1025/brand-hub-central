/**
 * Option C, "Categories" (2026-11-13, after the 9:05 critique). The current directory, unchanged,
 * with Option A's category card beside it once the pane is wide enough: search stays first and full
 * width, groups and folds stay, every row keeps its platform icon, and the type chips and team pill
 * give way to the card (they come back when the pane narrows and on phones).
 */
import { useEffect } from 'react';
import { LayoutGrid, type LucideIcon } from 'lucide-react';
import { AI_DIRECTORY, filterResources } from '@/data/ai-directory';
import { cn } from '@/lib/utils';
import { DirectoryGroups, DirectoryStatus, DirectoryToolbar, TYPE_ICONS, useDirectoryFilters } from '../AiDirectoryList';
import { FOLDERS, type Folder } from './model';
import c from './Categories.module.css';

const CATEGORY_ICONS: Record<string, LucideIcon> = { '': LayoutGrid, ...TYPE_ICONS };

/**
 * This option loads after the page, so the browser's own jump to a #row link has already missed,
 * and :target never applies to a row that arrived late. Once the rows exist, land on the linked one
 * and mark its row (data-linked) so it reads as "you are here".
 */
function useLandOnLinkedRow() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target || !document.getElementById('ai-skills-library')?.contains(target)) return;
    target.closest('li')?.setAttribute('data-linked', '');
    const frame = requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, []);
}

export default function CategoriesDirectory() {
  const f = useDirectoryFilters();
  useLandOnLinkedRow();
  const current = FOLDERS.find(x => x.type === f.type && x.team === f.team);
  // Each count applies the search, so the card says what every category holds for this query.
  const countFor = (x: Folder) => filterResources(AI_DIRECTORY, f.query, x.type, x.team).length;

  return <section aria-label="AI resource directory" id="ai-skills-library" className={cn(c.root, 'scroll-mt-24')}>
    <DirectoryToolbar f={f} filterRowClassName={c.filtersBesideCard} />
    <div className={c.layout}>
      <div className={c.card} role="group" aria-labelledby="directory-categories-label">
        <p id="directory-categories-label" className={c.cardLabel}>Categories</p>
        <ul className={c.categoryList}>
          {FOLDERS.map(x => {
            const Icon = x.nested ? null : CATEGORY_ICONS[x.type];
            return <li key={x.id}>
              <button type="button" aria-pressed={current?.id === x.id} onClick={() => f.set({ type: x.type, team: x.team })} className={cn(c.category, x.nested && c.nested, 'action-focus')}>
                <span className={c.categoryLabel}>{Icon && <Icon size={16} strokeWidth={1.9} aria-hidden="true" className={c.categoryIcon} />}<span>{x.label}</span></span>
                <span className={c.count}><span className="sr-only">, </span>{countFor(x)}<span className="sr-only"> {countFor(x) === 1 ? 'resource' : 'resources'}</span></span>
              </button>
            </li>;
          })}
        </ul>
      </div>
      <div className={c.main}>
        <DirectoryStatus f={f} />
        <DirectoryGroups f={f} />
      </div>
    </div>
  </section>;
}
