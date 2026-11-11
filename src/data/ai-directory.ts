import { CONNECTORS, HOW_TO_POSTS, OFFER_BUILDER_ONE_PAGER, ORG_PLUGINS, SKILL_GROUPS, SLACK_CHANNELS, TRAINING, TRAINING_CHANNEL, type ResourceLink } from './ai-resources';

export const RESOURCE_TYPES = ['Skills', 'Guides & training', 'Tools & plugins', 'Assets', 'Help & channels'] as const;
export type ResourceType = typeof RESOURCE_TYPES[number];
export type AiResource = { id: string; title: string; identifier?: string; body: string; type: ResourceType; team?: string; url?: string; catalog?: boolean; source: string; related?: ResourceLink; };
const TITLES: Record<string, string> = {
  'og-sales-deck': 'Sales deck', 'negotiation-pricing-model': 'Negotiation & pricing model', 'sow-generator': 'Statement of work', 'sow-generator-type-options': 'Statement of work variants', 'account-signal-tracker': 'Account signal tracker', 'e100-account-brief-generator': 'E100 account brief', 'account-status-update': 'Account status update', 'sbr-scan': 'SBR: scan', 'sbr-prep': 'SBR: preparation', 'sbr-practice': 'SBR: practice', 'sbr-recap': 'SBR: recap', 'dormant-customer': 'Re-engage a quiet customer', 'merchant-retention-agent': 'Merchant retention', 'customer-master-sheet': 'Customer master sheet', 'ordergroove-slides': 'Ordergroove slides', 'brand-pack': 'Prospect brand kit', 'linkedin-post': 'LinkedIn posts', 'web-video': 'Web video', 'internal-handoff': 'Internal deal handoff', 'ordergroove-shopify-bundles': 'Shopify bundle subscriptions',
};
export const AI_DIRECTORY: AiResource[] = [
  ...SKILL_GROUPS.flatMap(group => group.skills.map(s => ({ id: s.name, title: TITLES[s.name] ?? s.name, identifier: s.name, body: s.body, type: 'Skills' as const, team: group.label, url: s.url, catalog: s.status === 'catalog', source: 'Claude', related: s.extra }))),
  ...TRAINING.map((r, i) => ({ id: `training-${i}`, title: r.label, body: r.body, type: (r.label.includes('kickoff') ? 'Assets' : 'Guides & training') as ResourceType, url: r.url, source: r.owner, related: i === 0 ? { ...TRAINING_CHANNEL, label: 'Share your Claude 101 certificate' } : r.extra })),
  ...HOW_TO_POSTS.map((r, i) => ({ id: `how-to-${i}`, title: r.title, body: r.body, type: 'Guides & training' as const, url: r.url, source: `Slack · ${r.byline}` })),
  ...ORG_PLUGINS.map(r => ({ id: r.name, title: r.name.replace(/-/g, ' '), identifier: r.name, body: r.body, type: 'Tools & plugins' as const, source: 'Org plugin' })),
  ...CONNECTORS.map((r, i) => ({ id: `tool-${i}`, title: r.name, body: r.body, type: 'Tools & plugins' as const, source: 'Tool / connector' })),
  { id: 'offer-builder', title: 'Offer Builder one-pager', body: 'Ordergroove Offer Builder Skill reference on the shared drive.', type: 'Assets' as const, url: OFFER_BUILDER_ONE_PAGER.url, source: 'Shared drive' },
  ...SLACK_CHANNELS.map(r => ({ id: r.label, title: r.label, body: r.body, type: 'Help & channels' as const, url: r.url, source: 'Slack' })),
].sort((a, b) => a.title.localeCompare(b.title));
/** Team narrows skills only. Guides, tools, assets, and channels belong to everyone, so they stay visible. */
export function filterResources(resources: AiResource[], query: string, type: string, team: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return resources.filter(r => (!type || r.type === type) && (!team || !r.team || r.team === team) && words.every(word => [r.title, r.identifier, r.body, r.team, r.source, r.related?.label].filter(Boolean).join(' ').toLocaleLowerCase().includes(word)));
}

export function countByType(resources: AiResource[]) {
  return Object.fromEntries(RESOURCE_TYPES.map(t => [t, resources.filter(r => r.type === t).length])) as Record<ResourceType, number>;
}

/** Skills that run in sequence collapse into one row, with their steps in workflow order. */
export const WORKFLOWS = [
  { id: 'sbr', title: 'SBR workflow', body: 'Run a strategic business review in four skills: scan, prep, practice, and recap.', steps: ['sbr-scan', 'sbr-prep', 'sbr-practice', 'sbr-recap'] },
];

export type DirectoryEntry =
  | { kind: 'resource'; resource: AiResource }
  | { kind: 'workflow'; id: string; title: string; body: string; total: number; steps: AiResource[] };
export type DirectorySection = { id: string; label: string; count: number; entries: DirectoryEntry[] };

const entryTitle = (e: DirectoryEntry) => (e.kind === 'resource' ? e.resource.title : e.title);

function toEntries(resources: AiResource[]): DirectoryEntry[] {
  const inWorkflow = new Set(WORKFLOWS.flatMap(w => w.steps));
  const entries: DirectoryEntry[] = resources.filter(r => !inWorkflow.has(r.id)).map(resource => ({ kind: 'resource', resource }));
  for (const w of WORKFLOWS) {
    const steps = w.steps.flatMap(id => resources.filter(r => r.id === id));
    if (steps.length) entries.push({ kind: 'workflow', id: w.id, title: w.title, body: w.body, total: w.steps.length, steps });
  }
  return entries.sort((a, b) => entryTitle(a).localeCompare(entryTitle(b)));
}

/** One section per resource type, in RESOURCE_TYPES order. Skills split by team, in SKILL_GROUPS order. Empty sections drop out. */
export function groupResources(resources: AiResource[]): DirectorySection[] {
  return RESOURCE_TYPES.flatMap(type => {
    const ofType = resources.filter(r => r.type === type);
    const groups = type === 'Skills'
      ? SKILL_GROUPS.map(g => ({ id: `skills-${g.id}`, label: `Skills · ${g.label}`, items: ofType.filter(r => r.team === g.label) }))
      : [{ id: type.toLowerCase().replace(/[^a-z]+/g, '-'), label: type, items: ofType }];
    return groups.filter(g => g.items.length).map(g => ({ id: g.id, label: g.label, count: g.items.length, entries: toEntries(g.items) }));
  });
}
