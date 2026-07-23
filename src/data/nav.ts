/**
 * Site navigation, grouped by the three brand-hub modes:
 *   Read  — learn the rules      (Guidelines)
 *   Grab  — take a finished asset (Downloads)
 *   Build — the toolkit / more
 */

export type NavItem = {
  label: string;
  path: string;
  /** One-line description used on the Home "explore" cards. */
  blurb: string;
};

export type NavMode = {
  mode: "Read" | "Grab" | "Build";
  label: string;
  items: NavItem[];
};

export const NAV: NavMode[] = [
  {
    mode: "Read",
    label: "Guidelines",
    items: [
      {
        label: "Foundation & Messaging",
        path: "/foundation",
        blurb: "Who we are, the category we own, and the message ladder.",
      },
      {
        label: "Voice & Language Rules",
        path: "/voice",
        blurb: "How we sound, plus the pass/fail language rules.",
      },
      {
        label: "Visual Identity",
        path: "/visual-identity",
        blurb: "Color, logo, gradients, and the signature shapes. Click to copy.",
      },
      {
        label: "Design Tokens",
        path: "/tokens",
        blurb: "The canonical values, ready to pull into code.",
      },
    ],
  },
  {
    mode: "Grab",
    label: "Assets",
    items: [
      {
        label: "Downloads",
        path: "/downloads",
        blurb: "Logo kit, font kit, token kits, and social graphics.",
      },
    ],
  },
  {
    mode: "Build",
    label: "Toolkit",
    items: [
      {
        label: "GTM & Employee Toolkit",
        path: "/toolkit",
        blurb: "Decks, docs, signatures, and new-hire graphics.",
      },
      {
        label: "AI & Skills",
        path: "/ai-skills",
        blurb: "The brand skills and the assistant that keep work on brand.",
      },
    ],
  },
];

/** Flat list of every routed page. */
export const ALL_ROUTES: NavItem[] = NAV.flatMap((g) => g.items);

/**
 * The three Midnight cards on Home. One per mode, each pointing at the entry
 * page for that mode rather than at a sub-page.
 */
export type ExploreCard = {
  /** Material Symbols glyph name. */
  icon: string;
  title: string;
  blurb: string;
  cta: string;
  path: string;
};

export const EXPLORE: ExploreCard[] = [
  {
    icon: "menu_book",
    title: "Guidelines",
    blurb: "Read the visual and verbal guidelines for how to use our logo, color, copy and more.",
    cta: "Go to guidelines",
    path: "/foundation",
  },
  {
    icon: "photo_library",
    title: "Assets",
    blurb: "Browse and grab-and-go assets including copy, photography, illustration and more.",
    cta: "Go to assets",
    path: "/downloads",
  },
  {
    icon: "smart_toy",
    title: "AI & GTM Tools",
    blurb: "Use the brand skills and templates that keep new work on brand from the first draft.",
    cta: "Explore the tools",
    path: "/ai-skills",
  },
];
