import { isEmployeeSectionVisible } from "./employee-launch";

export type HubNavItem = {
  id: string;
  label: string;
  description: string;
  keywords: string;
  /** Set when the section lives on its own route instead of inline on the hub. */
  path?: string;
};

export type HubNavGroup = {
  label: string;
  items: HubNavItem[];
};

/** Standalone resources, also used to redirect the former homepage anchors. */
export const RESOURCE_PAGE_PATHS = {
  toolkit: "/toolkit",
  "ai-skills": "/ai-resources",
} as const;

const DRAFT_HUB_NAV: HubNavGroup[] = [
  {
    label: "Start here",
    items: [
      {
        id: "overview",
        label: "Overview",
        description: "The fastest path to the right rule or resource.",
        keywords: "home intro start brand hub",
      },
      {
        id: "downloads",
        label: "Downloads",
        description: "Available logos and backgrounds.",
        keywords: "assets files png logo logomark background download",
      },
    ],
  },
  {
    label: "Brand foundation",
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
        label: "Voice & language",
        description: "Personality, pass/fail rules, and preferred terms.",
        keywords: "tone words copy writing language rules use avoid ai em dash",
      },
    ],
  },
  {
    label: "Visual identity",
    items: [
      {
        id: "color",
        label: "Color palette",
        description: "Canonical color values with contrast guidance.",
        keywords: "midnight groovy green cyan hex rgb swatches palette",
      },
      {
        id: "typography",
        label: "Typography",
        description: "Figtree, hierarchy, weights, and title rules.",
        keywords: "font type figtree headings eyebrow body weights",
      },
      {
        id: "logo-gradients",
        label: "Logo & gradients",
        description: "Primary lockups and approved gradient treatments.",
        keywords: "wordmark logomark dark light signature green cyan",
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
    label: "Resources",
    items: [
      {
        id: "toolkit",
        path: RESOURCE_PAGE_PATHS.toolkit,
        label: "GTM & employee toolkit",
        description: "Available resources for day-to-day work.",
        keywords: "zoom background employee resources",
      },
      {
        id: "ai-skills",
        path: RESOURCE_PAGE_PATHS["ai-skills"],
        label: "AI Resources & Guidance",
        description: "Shared Claude skills, starting with Ordergroove Slides 2.0.",
        keywords: "ai claude skills slides 2.0 presentations prompt guidance resources",
      },
    ],
  },
  {
    label: "Brand systems",
    items: [
      {
        id: "tokens",
        label: "Design tokens",
        description: "Approved marketing values, ready for code.",
        keywords: "developer css json code variables design system",
      },
    ],
  },
];

// Navigation and section search share the same employee-facing inventory.
export const HUB_NAV = DRAFT_HUB_NAV
  .map((group) => ({ ...group, items: group.items.filter((item) => isEmployeeSectionVisible(item.id)) }))
  .filter((group) => group.items.length > 0);

export const RIGHTS = [
  {
    n: "01",
    title: "Everychannel Infrastructure",
    body: "Subscriptions that work across every channel: in-store, digital, wholesale, and emerging surfaces. Scan to Subscribe is a proof point here.",
  },
  {
    n: "02",
    title: "The Groove Network",
    body: "The data moat: 1,000+ brands, $110B+ in transaction signals, 75M+ subscriber profiles. The most diversified data network in the category.",
  },
  {
    n: "03",
    title: "Testing Velocity",
    body: "Continuous experimentation at a pace no team could match alone. Agents appear by name only inside this pillar.",
  },
];

export const LADDER = [
  { rung: "Category", body: "Autonomous Subscriptions, the shift in how subscription commerce works." },
  { rung: "Rights to Win", body: "Everychannel Infrastructure, The Groove Network, Testing Velocity, in that locked order." },
  { rung: "Products", body: "The agents, Workflows, GraphQL, the MCP server." },
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

export const TOOLKIT_ITEMS = [
  {
    title: "Slide template",
    body: "On-brand Google Slides with correct colors, fonts, and layouts. The ordergroove-slides skill builds decks for you.",
    cta: "Open template",
    href: null,
    status: "Not available yet",
  },
  {
    title: "Word docs",
    body: "On-brand documents via the ordergroove-doc skill. Midnight and white, Figtree, no forbidden fonts.",
    cta: "How it works",
    href: null,
    status: "Not available yet",
  },
  {
    title: "Email signatures",
    body: "Fancy and simple variants, copy-paste ready. LinkedIn-only icons, correct-contrast green links.",
    cta: "Get your signature",
    href: null,
    status: "Not available yet",
  },
  {
    title: "New-hire graphics",
    body: "Welcome and I've-joined LinkedIn graphics. Copy the Canva design and drop in your headshot.",
    cta: "Open in Canva",
    href: null,
    status: "Not available yet",
  },
  {
    title: "Zoom backgrounds",
    body: "Midnight canvas with the paired-circle gradient, sized for video calls.",
    cta: "Download PNG",
    href: "/midnight_bg.png",
    status: null,
  },
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
