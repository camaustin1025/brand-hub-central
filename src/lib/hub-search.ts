import { availableAssets, assetAnchor } from "../data/assets";
import { designCanvasTemplatePath, HUB_NAV, isWipSection, type HubNavItem } from "../data/hub";
import { publishedSocialTemplates } from "../data/social-templates";

export type HubSearchItem = HubNavItem & { kind: "Guide" | "Asset" | "Template" };

export const HUB_SEARCH_ITEMS: HubSearchItem[] = [
  ...HUB_NAV.flatMap((group) => group.items).map((item) => ({ ...item, kind: "Guide" as const })),
  ...availableAssets().map((asset) => ({
    id: assetAnchor(asset.id), label: asset.title, description: asset.description,
    keywords: [...asset.tags, ...asset.formats, asset.type, "download", ...(["logo", "background"].includes(asset.type) ? ["backgrounds"] : [])].join(" "),
    kind: "Asset" as const, wip: isWipSection(asset.section),
  })),
  ...publishedSocialTemplates().map((template) => ({
    id: "social-" + template.id, label: template.category + ": " + template.title,
    description: template.description, keywords: template.keywords,
    path: designCanvasTemplatePath(template.id), kind: "Template" as const,
  })),
];

const STOP_WORDS = new Set(["a", "an", "and", "are", "can", "do", "for", "goes", "hub", "i", "in", "is", "me", "my", "of", "on", "the", "to", "use", "what", "where", "which", "with"]);

export function searchHub(query: string, items = HUB_SEARCH_ITEMS): HubSearchItem[] {
  const terms = query.toLowerCase().replace(/[^a-z0-9+#]+/g, " ").split(" ").filter((term) => term.length > 1 && !STOP_WORDS.has(term));
  if (!terms.length) return [];
  return items.map((item) => {
    const title = item.label.toLowerCase();
    const keywords = item.keywords.toLowerCase();
    const description = item.description.toLowerCase();
    const text = description + " " + keywords;
    const matched = terms.filter((term) => title.includes(term) || text.includes(term));
    const score = matched.reduce((total, term) => total + (title.includes(term) ? 6 : keywords.includes(term) ? 3 : 1), 0)
      + (matched.length === terms.length ? 10 : 0) + (matched.length && item.kind === "Asset" ? 1 : 0);
    return { item, score: matched.length ? score : 0 };
  }).filter(({ score }) => score > 0).sort((a, b) => b.score - a.score).slice(0, 7).map(({ item }) => item);
}
