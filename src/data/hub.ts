import { publishedSocialTemplates, type SocialTemplate } from "./social-templates";
import { isEmployeeSectionVisible } from "./employee-launch";
import type { PageIconName } from "./page-icons";

export type HubNavItem = {
  id: string;
  label: string;
  description: string;
  keywords: string;
  /** Set when the section lives on its own route instead of inline on the hub. */
  path?: string;
  /** Still being written: tagged WIP in the nav, in search, and at the top of the section. */
  wip?: boolean;
  /** Visible announcement only; no navigation or search result until released. */
  disabled?: boolean;
  /** Left out of the sidebar entirely (disabled items otherwise show greyed out). */
  hiddenInNav?: boolean;
};

export type HubNavGroup = {
  label: string;
  items: HubNavItem[];
  /** The group title is itself the link to its single item, with no list under it. */
  linkTitle?: boolean;
  /** An emphasized row at the top of the group's list that opens another internal site in a new tab. */
  externalLink?: { label: string; href: string };
};

export const DESIGN_CANVAS_PATH = "/design-canvas";
export const DESIGN_CANVAS_NAV_ID = "design-canvas";

export function designCanvasTemplatePath(templateId: string) {
  return `${DESIGN_CANVAS_PATH}/${encodeURIComponent(templateId)}`;
}

export function designCanvasCategoryId(category: string) {
  return category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Published templates grouped by category, in first-appearance order. Drives the Design canvas page. */
export const DESIGN_CANVAS_CATEGORIES = [...publishedSocialTemplates().reduce((groups, template) => {
  groups.set(template.category, [...(groups.get(template.category) ?? []), template]);
  return groups;
}, new Map<string, SocialTemplate[]>())].map(([category, templates]) => ({ id: designCanvasCategoryId(category), category, templates }));

export const ICON_LIBRARY_PATH = "/icon-library";
export const ICON_LIBRARY_NAV_ID = "icon-library";

export const NEW_EMPLOYEE_PATH = "/new-employee-resources";
export const NEW_EMPLOYEE_NAV_ID = "new-employee-resources";

export const EMPLOYEE_RESOURCES_PATH = "/employee-resources";
export const EMPLOYEE_RESOURCES_NAV_ID = "employee-resources";

export const ZOOM_BACKGROUNDS_PATH = "/zoom-backgrounds";
export const ZOOM_BACKGROUNDS_NAV_ID = "zoom-backgrounds";

/** Standalone resources, also used to redirect the former homepage anchors. The toolkit became Design canvas. */
export const RESOURCE_PAGE_PATHS = {
  toolkit: DESIGN_CANVAS_PATH,
  "ai-skills": "/ai-resources",
  [ICON_LIBRARY_NAV_ID]: ICON_LIBRARY_PATH,
  [ZOOM_BACKGROUNDS_NAV_ID]: ZOOM_BACKGROUNDS_PATH,
  [NEW_EMPLOYEE_NAV_ID]: NEW_EMPLOYEE_PATH,
} as const;

/** The standalone page that holds a section's assets, if the section moved off the homepage. */
export function sectionPagePath(section: string): string | undefined {
  return (RESOURCE_PAGE_PATHS as Record<string, string>)[section];
}

// The homepage itself is reached from the masthead logo and every breadcrumb, so it has no nav item.
const DRAFT_HUB_NAV: HubNavGroup[] = [
  {
    label: "Grab-and-go",
    items: [
      {
        id: "downloads",
        label: "Logos & fonts",
        description: "The logo kit and the Figtree font kit.",
        keywords: "assets files logo logomark wordmark font figtree typeface download kit",
      },
      {
        // Search lists this page once, as an asset (see hub-search.ts).
        id: ZOOM_BACKGROUNDS_NAV_ID,
        path: ZOOM_BACKGROUNDS_PATH,
        label: "Zoom backgrounds",
        description: "Six backgrounds for video calls, with setup steps for Zoom.",
        keywords: "zoom backgrounds background video call meeting virtual teams google meet download",
      },
      {
        // Search lists this page once, as an asset (see hub-search.ts).
        id: ICON_LIBRARY_NAV_ID,
        path: ICON_LIBRARY_PATH,
        label: "Icon library",
        description: "Every brand icon as PNG or SVG, in each icon color and treatment.",
        keywords: "icon library download png svg zip",
      },
      {
        id: DESIGN_CANVAS_NAV_ID,
        path: DESIGN_CANVAS_PATH,
        label: "LinkedIn graphics",
        description: `Add your photo and details to a ready-made LinkedIn graphic: ${DESIGN_CANVAS_CATEGORIES.flatMap(({ templates }) => templates.map((template) => template.title)).join(", ")}.`,
        keywords: `linkedin graphics design canvas social graphic customize photo toolkit template ${DESIGN_CANVAS_CATEGORIES.map(({ category }) => category.toLowerCase()).join(" ")}`,
      },
    ],
  },
  {
    label: "Visual identity",
    items: [
      {
        id: "color",
        label: "Color & gradients",
        description: "Canonical color values, contrast guidance, and the brand gradient.",
        keywords: "midnight groovy green cyan lemon hex rgb cmyk pantone swatches palette gradient",
      },
      {
        id: "typography",
        label: "Typography",
        description: "Figtree, hierarchy, weights, and title rules.",
        keywords: "font type figtree headings eyebrow body weights",
      },
      {
        id: "logo",
        label: "Logo",
        description: "Primary lockups, standalone logomarks, and clear-space rules.",
        keywords: "wordmark logomark dark light lockup clear space",
      },
      {
        id: "icons",
        label: "Icons",
        description: "Material Symbols Rounded, icon colors, and tile treatments.",
        keywords: "icons iconography material symbols rounded plain tinted solid figma teal",
      },
    ],
  },
  {
    label: "Verbal identity",
    items: [
      {
        id: "messaging",
        path: "/foundation",
        label: "Foundation & messaging",
        description: "Positioning, audience, Rights to Win, and message ladder.",
        keywords: "autonomous subscriptions everychannel groove network testing velocity category",
      },
      {
        id: "voice",
        path: "/voice",
        wip: true,
        // Temporarily hidden on the live site while the page is rewritten; still reachable in local dev.
        disabled: true,
        hiddenInNav: true,
        label: "Voice & language",
        description: "Personality, pass/fail rules, and preferred terms.",
        keywords: "tone words copy writing language rules use avoid ai em dash",
      },
    ],
  },
  {
    label: "Brand systems",
    items: [
      {
        id: "tokens",
        label: "Design tokens",
        description: "Approved marketing color values. Code kits pending approval.",
        keywords: "developer css json code variables design system",
      },
    ],
  },
  {
    label: "Resources",
    externalLink: { label: "Product Hub", href: "https://product.ordergroove.com/" },
    items: [
      {
        id: "ai-skills",
        path: RESOURCE_PAGE_PATHS["ai-skills"],
        label: "AI resources & guidance",
        description: "Claude skills, training, Slack channels, and what you can share with AI tools.",
        keywords: "ai claude skills slides presentations prompt guidance resources security guidelines pii training claude 101 slack og-ai mcp connectors salesforce gong plugins",
      },
    ],
  },
  {
    label: "Working at OG",
    items: [
      {
        id: EMPLOYEE_RESOURCES_NAV_ID,
        path: EMPLOYEE_RESOURCES_PATH,
        label: "Employee resources",
        description: "Mission and values, 2026 company holidays, Rippling, and perks & benefits.",
        keywords: "mission values holidays holiday calendar time off pto refresh week rippling hris benefits perks insperity health fsa insurance calm boon parental leave adoption 401k retirement productivity allowance relationship commerce allowance ramp",
      },
      {
        id: "team-culture",
        wip: true,
        disabled: true,
        path: "/team-culture",
        label: "Team & culture",
        description: "Meet your teammates and find company updates and community resources.",
        keywords: "team culture people directory org chart community recognition values all hands",
      },
      {
        id: NEW_EMPLOYEE_NAV_ID,
        wip: true,
        disabled: true,
        path: NEW_EMPLOYEE_PATH,
        label: "New employees",
        description: "Your first-week brand kit: announce your new role, set up calls, and learn how we sound.",
        keywords: "new employee new hire onboarding first week start joined linkedin announcement zoom background welcome",
      },
    ],
  },
];

// Navigation and section search share the same employee-facing inventory.
export const HUB_NAV = DRAFT_HUB_NAV
  .map((group) => ({ ...group, items: group.items.filter((item) => isEmployeeSectionVisible(item.id)) }))
  .filter((group) => group.items.length > 0);

/** Guests only get the homepage: a path is theirs when it stays on Home (no path, "/", or a "/#section" anchor). */
export function isGuestPath(path?: string) {
  return !path || path === "/" || path.startsWith("/#");
}

export function isDisabledSection(id: string) {
  return HUB_NAV.some((group) => group.items.some((item) => item.id === id && item.disabled));
}

export function isWipSection(id: string) {
  return HUB_NAV.some((group) => group.items.some((item) => item.id === id && item.wip));
}

export const RIGHTS = [
  {
    n: "1",
    title: "Everychannel Infrastructure",
    tagline: "One platform. Everychannel.",
    body: "Storefronts, retail, voice, and agent endpoints you haven’t built yet. Integrate once and capture every channel, without re-architecting for each one.",
  },
  {
    n: "2",
    title: "The Groove Network",
    tagline: "The largest enterprise subscription dataset.",
    body: "Every reach, retry, recovery, and retention test, refined by the most diversified subscription data in enterprise commerce.",
  },
  {
    n: "3",
    title: "Testing Velocity",
    tagline: "Test faster. Compound the wins.",
    body: "Ordergroove agents propose variants. You deploy at 1%, 5%, or 10%. Every winner compounds, 24/7, alongside your team.",
  },
];

export const BUYING_GROUPS = [
  {
    group: "Business leaders",
    icon: "work",
    roles: "VP or Director of eCommerce, VP or Head of Digital, and retention, loyalty, CRM, and subscription leaders.",
    cares: "They care about revenue, churn, and speed to market.",
  },
  {
    group: "Technology leaders",
    icon: "language",
    roles: "CTO, CIO, VP of Engineering, and eCommerce platform and enterprise architecture leaders.",
    cares: "They care about integration, scalability, data access, and readiness for an agentic stack.",
  },
] as const satisfies readonly { group: string; icon: PageIconName; roles: string; cares: string }[];

export const LADDER = [
  { rung: "Category", body: "Autonomous Subscriptions, the shift in how subscription commerce works." },
  { rung: "Rights to Win", body: "Everychannel Infrastructure, The Groove Network, Testing Velocity, in that locked order." },
  { rung: "Products", body: "Agents (the autonomous layer), Workflows (orchestration), Open Platform (GraphQL API, MCP server)." },
  { rung: "Proof points", body: "Capabilities, stats, customer results. Deep-dive content only." },
];

export const VOICE_RULES = [
  'Never lead with "AI" or "AI agents." No "AI-powered." The category and outcome lead; the technology supports.',
  '"Subscriptions" must appear in any hero subhead.',
  "No em-dashes anywhere. Use commas, colons, or periods.",
  '"Everychannel" is one word. Always.',
  "Never name competitors in any external material.",
  'No "out of the box." Say "ready on day one" or "no custom builds required."',
  'No "heartland intelligence." Say "diversified data."',
  'No "Relationship Commerce." The category is Autonomous Subscriptions.',
  'Avoid "build" as the adoption verb. Use launch, deploy, activate, adopt.',
  'Never frame the company as "new." Ordergroove is 16 years old.',
  'No AI-tells: delve, seamless, innovative, game-changing, "excited to announce," "experience" as filler.',
];

export const TERMS: [string, string][] = [
  ["Subscribers", "Users, customers (in subscription context)"],
  ["Retention", "Churn prevention"],
  ["Flexible subscriptions", "Locked-in programs"],
  ["Everychannel / omnichannel", "Multi-channel"],
  ["Recurring revenue", "MRR/ARR in marketing copy"],
  ["Built for scale", "Enterprise-grade"],
  ["Diversified data", "Heartland intelligence"],
  ["Autonomous Subscriptions", "Relationship Commerce"],
  ["Launch, deploy, activate", "Build (as adoption verb)"],
  ["Ready on day one", "Out of the box"],
];

export const BRAND_SKILLS = [
  {
    name: "ordergroove-slides",
    body: "Generates on-brand PowerPoint and Google Slides decks with the correct palette, Figtree, and layouts.",
  },
  {
    name: "ordergroove-doc",
    body: "Creates and reformats Word docs to Ordergroove brand standards.",
  },
  {
    name: "v2linkedinpost",
    body: "Drafts LinkedIn posts in the company voice, following the hook and structure rules.",
  },
  {
    name: "brand.md",
    body: "The canonical brand instructions that AI and coding tools load automatically.",
  },
];
