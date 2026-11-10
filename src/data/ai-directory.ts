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
export function filterResources(resources: AiResource[], query: string, type: string, team: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  return resources.filter(r => (!type || r.type === type) && (!team || r.team === team) && words.every(word => [r.title, r.identifier, r.body, r.team, r.source, r.related?.label].filter(Boolean).join(' ').toLocaleLowerCase().includes(word)));
}
