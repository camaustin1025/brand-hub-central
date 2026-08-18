export type HubNavItem = {
  id: string;
  label: string;
  icon: string;
  path: string;
  hash?: string;
};

export type HubNavGroup = {
  label: string;
  items: HubNavItem[];
};

export const HUB_NAV: HubNavGroup[] = [
  {
    label: "Start here",
    items: [
      { id: "overview", label: "Overview", icon: "home", path: "/", hash: "overview" },
      { id: "search", label: "Smart search", icon: "search", path: "/", hash: "search" },
      { id: "start-here", label: "Choose a path", icon: "bolt", path: "/", hash: "start-here" },
    ],
  },
  {
    label: "Guidelines",
    items: [
      {
        id: "positioning",
        label: "Positioning & Messaging",
        icon: "foundation",
        path: "/foundation",
      },
      {
        id: "voice",
        label: "Voice & Language Rules",
        icon: "record_voice_over",
        path: "/voice",
      },
      {
        id: "logo-color",
        label: "Logo & Color",
        icon: "palette",
        path: "/visual-identity",
      },
      { id: "tokens", label: "Tokens for Code", icon: "data_object", path: "/tokens" },
    ],
  },
  {
    label: "Resources",
    items: [
      { id: "downloads", label: "Downloads", icon: "download", path: "/downloads" },
      {
        id: "toolkit",
        label: "GTM & Employee Toolkit",
        icon: "handyman",
        path: "/toolkit",
      },
      { id: "ai-skills", label: "AI & Skills", icon: "smart_toy", path: "/ai-skills" },
      { id: "updates", label: "What's New", icon: "new_releases", path: "/", hash: "updates" },
    ],
  },
];

export const HUB_SECTIONS = HUB_NAV.flatMap((group) => group.items)
  .filter((item) => item.path === "/" && item.hash)
  .map((item) => ({ id: item.hash!, label: item.label }));
