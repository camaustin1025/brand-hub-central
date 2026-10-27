/**
 * Ordergroove color tokens — verified against brand.md and the Phase 0 audit.
 *
 * The green contrast rule (canon 5.2, the most-missed rule in the system):
 *   light background -> #009A50   |   dark background -> #00FF85
 * `onLight` / `onDark` flags below drive the live contrast badge on <Swatch>.
 *
 * The supplied light-background logo retains #00CC6A as a logo-only exception
 * (approved by Cameron on 2026-10-26). Do not add it to the UI palette.
 * Open audit decisions: D2 (Green-300 ramp), D10 (#FF61D3 name).
 */

export type Swatch = {
  name: string;
  hex: string;
  rgb: string;
  usage: string;
  /** Intended as an accent/fill on light surfaces; not a text contrast guarantee. */
  onLight: boolean;
  /** Intended as an accent/fill on dark surfaces; verify text contrast separately. */
  onDark: boolean;
};

export type SwatchGroup = {
  title: string;
  note?: string;
  swatches: Swatch[];
};

export const CORE: SwatchGroup = {
  title: "Core",
  note: "Use #009A50 accents on light surfaces and #00FF85 on dark. Use Midnight for small text on light surfaces and for labels on green buttons. White text on #009A50 does not have enough contrast.",
  swatches: [
    {
      name: "Midnight",
      hex: "#17132F",
      rgb: "23, 19, 47",
      usage: "Primary dark background",
      onLight: true,
      onDark: false,
    },
    {
      name: "White",
      hex: "#FFFFFF",
      rgb: "255, 255, 255",
      usage: "Light backgrounds",
      onLight: false,
      onDark: true,
    },
    {
      name: "Groovy Green",
      hex: "#00FF85",
      rgb: "0, 255, 133",
      usage: "Accent on DARK backgrounds only",
      onLight: false,
      onDark: true,
    },
    {
      name: "Green (light-bg)",
      hex: "#009A50",
      rgb: "0, 154, 80",
      usage: "Accent on LIGHT backgrounds. Pair green buttons with Midnight labels; use Midnight for small text on white.",
      onLight: true,
      onDark: false,
    },
  ],
};

export const SUPPORTING: SwatchGroup = {
  title: "Supporting neutrals",
  swatches: [
    {
      name: "Dark Indigo",
      hex: "#2E2A47",
      rgb: "46, 42, 71",
      usage: "Muted surfaces on dark. Subtitle/muted text on light.",
      onLight: true,
      onDark: true,
    },
    {
      name: "Muted",
      hex: "#4F4A6A",
      rgb: "79, 74, 106",
      usage: "Text tone on light.",
      onLight: true,
      onDark: false,
    },
    {
      name: "Soft",
      hex: "#666279",
      rgb: "102, 98, 121",
      usage: "Secondary text tone on light.",
      onLight: true,
      onDark: false,
    },
    {
      name: "Border",
      hex: "#D8D7DF",
      rgb: "216, 215, 223",
      usage: "Borders and dividers on light.",
      onLight: false,
      onDark: false,
    },
    {
      name: "Subtitle on dark",
      hex: "#EBEAF0",
      rgb: "235, 234, 240",
      usage: "Subtitle text on dark surfaces.",
      onLight: false,
      onDark: true,
    },
  ],
};

export const SECONDARY: SwatchGroup = {
  title: "Secondary",
  note: "Decorative pop only, never leading. Laser Lemon is never text on white.",
  swatches: [
    { name: "Intense Cyan", hex: "#00FAFF", rgb: "0, 250, 255", usage: "Decorative accent.", onLight: false, onDark: true },
    { name: "Laser Lemon", hex: "#EAFF00", rgb: "234, 255, 0", usage: "Decorative accent. Never text on white.", onLight: false, onDark: true },
    { name: "Neon Carrot", hex: "#FF8500", rgb: "255, 133, 0", usage: "Decorative accent.", onLight: true, onDark: true },
    { name: "Radiant Radish", hex: "#D32E55", rgb: "211, 46, 85", usage: "Decorative accent.", onLight: true, onDark: true },
    { name: "Flamingo Pink", hex: "#FF61D3", rgb: "255, 97, 211", usage: "Decorative accent. (Name pending audit D10.)", onLight: true, onDark: true },
    { name: "Electric Eggplant", hex: "#8500FF", rgb: "133, 0, 255", usage: "Decorative accent.", onLight: false, onDark: true },
  ],
};

export type Gradient = {
  name: string;
  css: string;
  stops: string[];
  status: "signature" | "approved" | "web";
};

export const GRADIENTS: Gradient[] = [
  {
    name: "Signature (Green → Cyan)",
    css: "linear-gradient(135deg, #00FF85, #00FAFF)",
    stops: ["#00FF85", "#00FAFF"],
    status: "signature",
  },
  {
    name: "Purple → Blue → Green",
    css: "linear-gradient(135deg, #7821F5, #71ACFF, #00FF85)",
    stops: ["#7821F5", "#71ACFF", "#00FF85"],
    status: "approved",
  },
  {
    name: "Orange → Yellow",
    css: "linear-gradient(135deg, #FF8500, #EAFF00)",
    stops: ["#FF8500", "#EAFF00"],
    status: "approved",
  },
  {
    name: "Web brand gradient",
    css: "linear-gradient(135deg, #E0FE00, #0BFE5F, #00FEFE)",
    stops: ["#E0FE00", "#0BFE5F", "#00FEFE"],
    status: "web",
  },
];

export const COLOR_GROUPS = [CORE, SUPPORTING, SECONDARY];
