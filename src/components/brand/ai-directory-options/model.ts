/**
 * Row model for the AI Resources layout options (Library and Filtered table). Every column comes
 * from a field AiResource already has: type, team, source (owner or byline), url, catalog, identifier
 * and related. Nothing here invents an owner, date or status.
 */
import { AI_DIRECTORY, RESOURCE_TYPES, WORKFLOWS, filterResources, groupResources, type AiResource, type ResourceType } from '@/data/ai-directory';
import { OG_AI_CHANNEL, SKILL_GROUPS } from '@/data/ai-resources';

export type Kind = 'Skill' | 'Guide' | 'Tool' | 'Plugin' | 'Asset' | 'Channel';
export const KINDS: readonly Kind[] = ['Skill', 'Guide', 'Tool', 'Plugin', 'Asset', 'Channel'];
/** The short type a row shows. Tools & plugins split on their source: org plugins vs tools and connectors. */
export function kindOf(r: AiResource): Kind {
  if (r.type === 'Skills') return 'Skill';
  if (r.type === 'Tools & plugins') return r.source === 'Org plugin' ? 'Plugin' : 'Tool';
  if (r.type === 'Guides & training') return 'Guide';
  if (r.type === 'Assets') return 'Asset';
  return 'Channel';
}

export type Platform = 'Claude' | 'Google Drive' | 'Slack' | 'Salesforce' | 'Gong';
export const PLATFORMS: readonly Platform[] = ['Claude', 'Google Drive', 'Slack', 'Salesforce', 'Gong'];
/** Where the resource lives, read from its link (same rules as the current row icon). */
export function platformOf(r: AiResource): Platform {
  if (r.url?.includes('slack.com')) return 'Slack';
  if (r.url?.includes('google.com')) return 'Google Drive';
  if (r.title === 'Salesforce') return 'Salesforce';
  if (r.url?.includes('claude.') || r.url?.includes('anthropic.') || r.source === 'Org plugin' || r.title.startsWith('Claude')) return 'Claude';
  return 'Gong';
}
export function platformIcon(r: AiResource): string | null {
  const p = platformOf(r);
  if (p === 'Gong') return null;
  if (p === 'Google Drive' && r.url?.includes('/presentation/')) return '/platform-icons/google-slides.svg';
  return `/platform-icons/${p.toLowerCase().replace(' ', '-')}.svg`;
}

/** Sources that only name the platform, which the row icon already shows. */
const HIDDEN_SOURCES = ['Claude', 'Org plugin', 'Tool / connector', 'Slack', 'Shared drive', 'Anthropic'];
/** A doc owner or a post byline (e.g. "Ethan Jones, Mar 30"); empty when the source only names a platform. */
export function ownerOf(r: AiResource): string {
  if (HIDDEN_SOURCES.includes(r.source)) return '';
  return r.source.startsWith('Slack · ') ? r.source.slice(8) : r.source;
}

export type Access = 'Direct link' | 'Search only' | 'Ask for access';
export const ACCESS: readonly Access[] = ['Direct link', 'Search only', 'Ask for access'];
/** Catalog skills aren't shared org-wide; resources with no link go through #og-ai. */
export function accessOf(r: AiResource): Access {
  return !r.url ? 'Ask for access' : r.catalog ? 'Search only' : 'Direct link';
}

export type Action = { href: string; label: string; primary: boolean };
export function actionOf(r: AiResource): Action {
  if (!r.url) return { href: OG_AI_CHANNEL.url, label: 'Ask in #og-ai', primary: false };
  if (r.catalog) return { href: r.url, label: 'View skill', primary: false };
  if (r.type === 'Skills') return { href: r.url, label: 'Open skill', primary: true };
  if (r.type === 'Assets') return { href: r.url, label: 'Open file', primary: false };
  if (r.type === 'Help & channels') return { href: r.url, label: 'Open channel', primary: false };
  return { href: r.url, label: 'Open', primary: false };
}

export type ResourceRow = { kind: 'resource'; resource: AiResource; step?: number; workflow?: string };
export type WorkflowRow = { kind: 'workflow'; id: string; title: string; body: string; total: number; matched: number; resource: AiResource };
export type Row = ResourceRow | WorkflowRow;
/** One block per directory entry: a resource, or a workflow followed by its matching steps. */
export type Block = Row[];

/** Rows in the current directory's order (type, then team for skills, then title), workflows kept whole. */
export function blocksFor(results: AiResource[]): Block[] {
  return groupResources(results).flatMap(section => section.entries.map((e): Block => {
    if (e.kind === 'resource') return [{ kind: 'resource', resource: e.resource }];
    const ids = WORKFLOWS.find(w => w.id === e.id)?.steps ?? [];
    return [
      { kind: 'workflow', id: e.id, title: e.title, body: e.body, total: e.total, matched: e.steps.length, resource: e.steps[0] },
      ...e.steps.map((r): ResourceRow => ({ kind: 'resource', resource: r, step: ids.indexOf(r.id) + 1, workflow: e.title })),
    ];
  }));
}

/** The anchor a row title had in the current design, so old #links still land. */
export function anchorFor(label: string) {
  return label.normalize('NFKD').toLowerCase().replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'resource';
}
export const rowAnchor = (row: Row) => anchorFor(row.kind === 'workflow' ? `${row.title} · ${row.total} steps` : row.resource.title);

export type Folder = { id: string; label: string; type: ResourceType | ''; team: string; nested?: boolean };
/** Option A's folder list: everything, each type, and the skill teams nested under Skills. */
export const FOLDERS: Folder[] = [
  { id: 'all', label: 'All resources', type: '', team: '' },
  ...RESOURCE_TYPES.flatMap((type): Folder[] => type === 'Skills'
    ? [{ id: 'skills', label: 'Skills', type, team: '' }, ...SKILL_GROUPS.map(g => ({ id: `skills-${g.id}`, label: g.label, type, team: g.label, nested: true }))]
    : [{ id: anchorFor(type), label: type, type, team: '' }]),
];

export type Facets = { query: string; type: string; team: string; platform: string; access: string };
/** Option B's filter: the current search, type and team rules, plus platform and access. */
export function filterFacets(f: Facets, resources: AiResource[] = AI_DIRECTORY) {
  return filterResources(resources, f.query, f.type, f.team)
    .filter(r => (!f.platform || platformOf(r) === f.platform) && (!f.access || accessOf(r) === f.access));
}
