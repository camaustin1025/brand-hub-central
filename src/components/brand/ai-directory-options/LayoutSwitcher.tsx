/** Dev-only floating switcher for the AI Resources layout review. Never ships: AiResources loads it behind import.meta.env.DEV. */
import { useSearchParams } from 'react-router-dom';
import { cn } from '@/lib/utils';
import type { DirectoryLayout } from '../ai-directory-layout';

const OPTIONS: { id: DirectoryLayout; label: string }[] = [
  { id: 'current', label: 'Current' },
  { id: 'library', label: 'A · Library' },
  { id: 'table', label: 'B · Table' },
  { id: 'categories', label: 'C · Categories' },
];

export default function LayoutSwitcher({ layout }: { layout: DirectoryLayout }) {
  const [params, setParams] = useSearchParams();
  function choose(id: DirectoryLayout) {
    const next = new URLSearchParams(params);
    if (id === 'current') next.delete('layout'); else next.set('layout', id);
    setParams(next, { replace: true, preventScrollReset: true });
  }
  return <div role="group" aria-label="Directory layout (dev preview)" className="dark fixed bottom-32 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full bg-og-midnight p-1 text-[13px] font-semibold text-white shadow-[0_25px_50px_-12px_rgba(23,19,47,0.35)] sm:bottom-20 lg:bottom-4 lg:left-[calc(var(--hub-nav-w,284px)+24px)] lg:translate-x-0">
    <span className="hidden px-3 text-og-green sm:inline">Layout</span>
    {OPTIONS.map(o => <button key={o.id} type="button" aria-pressed={layout === o.id} onClick={() => choose(o.id)}
      className={cn('action-focus h-11 whitespace-nowrap md:h-9 rounded-full px-3 transition-colors', layout === o.id ? 'bg-white text-og-midnight' : 'hover:bg-white/10')}>{o.label}</button>)}
  </div>;
}
