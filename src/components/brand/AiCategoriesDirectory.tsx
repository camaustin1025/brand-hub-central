/**
 * The AI Resources directory (promoted 2026-11-13 from the "Categories" review option): the grouped list
 * with a category card beside it once the pane is wide enough. Search stays first and full width, groups
 * and phone folds stay, every row keeps its platform icon, and the type chips and team pill give way to
 * the card (they come back when the pane narrows and on phones). The chosen category carries the rail's
 * highlighter; descriptions are 13px across the list column so most fit one line, with Details at the end
 * of the description; a #link's row title is highlighted the same way.
 */
import { useEffect } from 'react';
import { LayoutGrid, type LucideIcon } from 'lucide-react';
import { AI_DIRECTORY, filterResources } from '@/data/ai-directory';
import { cn } from '@/lib/utils';
import { CATEGORIES, type Category } from '@/data/ai-directory';
import { DirectoryGroups, DirectoryStatus, DirectoryToolbar, TYPE_ICONS, useDirectoryFilters, type RowStyle } from './AiDirectoryList';
import c from './AiCategories.module.css';

const CATEGORY_ICONS: Record<string, LucideIcon> = { '': LayoutGrid, ...TYPE_ICONS };
const ROW_STYLE: RowStyle = { description: c.description, inlineDetails: c.inlineDetails, markLinked: true };

/**
 * Land on a #row link once the rows exist (a phone fold or a workflow may have opened to reveal it, after
 * the browser's own jump). The row's title carries the highlighter, via ROW_STYLE.
 */
function useLandOnLinkedRow() {
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const target = id ? document.getElementById(id) : null;
    if (!target || !document.getElementById('ai-skills-library')?.contains(target)) return;
    const frame = requestAnimationFrame(() => target.scrollIntoView({ block: 'start' }));
    return () => cancelAnimationFrame(frame);
  }, []);
}

export function AiCategoriesDirectory() {
  const f = useDirectoryFilters();
  useLandOnLinkedRow();
  const current = CATEGORIES.find(x => x.type === f.type && x.team === f.team);
  // Each count applies the search, so the card says what every category holds for this query.
  const countFor = (x: Category) => filterResources(AI_DIRECTORY, f.query, x.type, x.team).length;

  return <section aria-label="AI resource directory" id="ai-skills-library" className={cn(c.root, 'scroll-mt-24')}>
    <DirectoryToolbar f={f} filterRowClassName={c.filtersBesideCard} />
    <div className={c.layout}>
      <div className={c.card} role="group" aria-labelledby="directory-categories-label">
        <p id="directory-categories-label" className={c.cardLabel}>Categories</p>
        <ul className={c.categoryList}>
          {CATEGORIES.map(x => {
            const Icon = x.nested ? null : CATEGORY_ICONS[x.type];
            const chosen = current?.id === x.id;
            return <li key={x.id}>
              <button type="button" aria-pressed={chosen} onClick={() => f.set({ type: x.type, team: x.team })} className={cn(c.category, x.nested && c.nested, 'action-focus')}>
                <span className={c.categoryLabel}>{Icon && <Icon size={16} strokeWidth={1.9} aria-hidden="true" className={c.categoryIcon} />}<span className={chosen ? 'nav-highlight' : undefined}>{x.label}</span></span>
                <span className={c.count}><span className="sr-only">, </span>{countFor(x)}<span className="sr-only"> {countFor(x) === 1 ? 'resource' : 'resources'}</span></span>
              </button>
            </li>;
          })}
        </ul>
      </div>
      <div className={c.main}>
        <DirectoryStatus f={f} />
        <DirectoryGroups f={f} rowStyle={ROW_STYLE} />
      </div>
    </div>
  </section>;
}
