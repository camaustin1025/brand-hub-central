import { useEffect, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import { ArrowUpRight, Boxes } from 'lucide-react';
import type { AiResource } from '@/data/ai-directory';
import { OG_AI_CHANNEL } from '@/data/ai-resources';
import { cn } from '@/lib/utils';
import { platformIcon, platformOf } from './model';

export const FILTER_KEYS = ['q', 'type', 'team', 'platform', 'access'] as const;

/** URL-backed filters, shared with the current design (?q, ?type, ?team keep working across layouts). */
export function useDirectoryParams() {
  const [params, setParams] = useSearchParams();
  const get = (key: string) => params.get(key) ?? '';
  function set(values: Record<string, string>) {
    const next = new URLSearchParams(params);
    for (const [key, value] of Object.entries(values)) { if (value) next.set(key, value); else next.delete(key); }
    next.delete('page');
    setParams(next, { replace: true, preventScrollReset: true });
  }
  const clear = () => set(Object.fromEntries(FILTER_KEYS.map(key => [key, ''])));
  // Old section hashes still land on the directory, filtered the way they used to be.
  useEffect(() => {
    const legacy: Record<string, string> = { '#ai-training': 'Guides & training', '#ai-how-to': 'Guides & training', '#ai-slack': 'Help & channels' };
    const target = legacy[window.location.hash];
    if (target) { set({ type: target }); document.getElementById('ai-skills-library')?.scrollIntoView(); }
    else if (window.location.hash === '#ai-skills-library') document.getElementById('ai-skills-library')?.scrollIntoView();
  }, []); // Runs once on arrival, like the current directory.
  return { query: get('q'), type: get('type'), team: get('team'), platform: get('platform'), access: get('access'), set, clear };
}

export function External({ href, className, children, label }: { href: string; className?: string; children: ReactNode; label?: string }) {
  return <a className={cn('action-focus', className)} href={href} target="_blank" rel="noopener noreferrer">{children}<span className="sr-only">{label ? `: ${label}` : ''} (opens in a new tab)</span></a>;
}

/** Platform mark for a row. Gong has no mark in the repo, so it keeps the current generic glyph. */
export function PlatformMark({ resource, size = 18 }: { resource: AiResource; size?: number }) {
  const src = platformIcon(resource);
  const label = platformOf(resource);
  return src
    ? <img src={src} alt={label} width={size} height={size} />
    : <Boxes size={size} className="text-violet-700" role="img" aria-label={label} />;
}

/** The related link a few rows carry (a certificate channel, a how-to, a one-pager). */
export function RelatedLink({ resource: r, className }: { resource: AiResource; className?: string }) {
  if (!r.related) return null;
  return <External href={r.related.url} className={className} label={r.title}>{r.related.label}<ArrowUpRight size={12} aria-hidden="true" /></External>;
}

/** One line under the list explaining the two non-direct access paths. */
export function AccessNote({ className }: { className?: string }) {
  return <p className={className}><strong>Search only</strong> skills aren’t shared org-wide: search the Claude skill catalog for the skill name. Tools without a link: <External href={OG_AI_CHANNEL.url}>ask in #og-ai</External> for access.</p>;
}
