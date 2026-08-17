export type HubNavItem = {
  id: string;
  label: string;
  icon: string;
};

export type HubNavGroup = {
  label: string;
  items: HubNavItem[];
};

export const HUB_NAV: HubNavGroup[] = [
  {
    label: "Start here",
    items: [
      { id: "overview", label: "Overview", icon: "home" },
      { id: "quick-reference", label: "Quick reference", icon: "bolt" },
    ],
  },
  {
    label: "Brand foundation",
    items: [
      { id: "positioning", label: "Positioning & Messaging", icon: "foundation" },
      { id: "voice", label: "Voice & Language Rules", icon: "record_voice_over" },
    ],
  },
  {
    label: "Visual identity",
    items: [
      { id: "logo-color", label: "Logo & Color", icon: "palette" },
      { id: "tokens", label: "Tokens for Code", icon: "data_object" },
    ],
  },
  {
    label: "Resources",
    items: [
      { id: "downloads", label: "Downloads", icon: "download" },
      { id: "toolkit", label: "GTM & Employee Toolkit", icon: "handyman" },
    ],
  },
  {
    label: "Brand systems",
    items: [
      { id: "ai-skills", label: "AI & Skills", icon: "smart_toy" },
      { id: "updates", label: "What's New", icon: "new_releases" },
    ],
  },
];

export const HUB_SECTIONS = HUB_NAV.flatMap((group) => group.items).map(({ id, label }) => ({
  id,
  label,
}));

export const ROUTE_TO_HUB_ANCHOR: Record<string, string> = {
  "/foundation": "positioning",
  "/voice": "voice",
  "/visual-identity": "logo-color",
  "/tokens": "tokens",
  "/downloads": "downloads",
  "/toolkit": "toolkit",
  "/ai-skills": "ai-skills",
};
