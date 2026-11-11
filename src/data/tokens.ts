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
  /** Print CMYK (C, M, Y, K), simple conversion with no printer profile. */
  cmyk?: string;
  /**
   * Pantone spot color for print (C = coated). Groovy Green's 802 C is KNI's
   * standing spec; the rest are proposed matches (2026-11-11) pending a
   * physical swatch check. ColorTiers prints that caveat under the palette.
   */
  pantone?: string;
  /** Tile-only usage line, shown even in rows that hide usage. */
  tileNote?: string;
  /** Drops the usage line on the palette tile when it only restates the name. */
  hideTileUsage?: boolean;
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
  title: "Primary",
  note: "Use #009A50 accents on light surfaces and #00FF85 on dark.\nUse Midnight for small text on light surfaces.",
  swatches: [
    {
      name: "Midnight",
      hex: "#17132F",
      rgb: "23, 19, 47",
      cmyk: "51, 60, 0, 82",
      usage: "Primary dark background",
      hideTileUsage: true,
      pantone: "5255 C",
      onLight: true,
      onDark: false,
    },
    {
      name: "White",
      hex: "#FFFFFF",
      rgb: "255, 255, 255",
      cmyk: "0, 0, 0, 0",
      usage: "Light backgrounds",
      hideTileUsage: true,
      pantone: "Paper white",
      onLight: false,
      onDark: true,
    },
    {
      name: "Groovy Green",
      hex: "#00FF85",
      rgb: "0, 255, 133",
      cmyk: "100, 0, 48, 0",
      usage: "Accent on dark backgrounds only",
      pantone: "802 C",
      onLight: false,
      onDark: true,
    },
    {
      name: "Green (light-bg)",
      hex: "#009A50",
      rgb: "0, 154, 80",
      usage: "Accent on light backgrounds only",
      cmyk: "100, 0, 48, 40",
      pantone: "7482 C",
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
      usage: "Muted surfaces on dark, subtitle text on light",
      cmyk: "35, 41, 0, 72",
      pantone: "276 C",
      onLight: true,
      onDark: true,
    },
    {
      name: "Muted",
      hex: "#4F4A6A",
      rgb: "79, 74, 106",
      usage: "Text tone on light",
      cmyk: "25, 30, 0, 58",
      pantone: "5265 C",
      onLight: true,
      onDark: false,
    },
    {
      name: "Soft",
      hex: "#666279",
      rgb: "102, 98, 121",
      usage: "Secondary text tone on light",
      cmyk: "16, 19, 0, 53",
      pantone: "5275 C",
      onLight: true,
      onDark: false,
    },
    {
      name: "Border",
      hex: "#D8D7DF",
      rgb: "216, 215, 223",
      usage: "Borders and dividers on light",
      cmyk: "3, 4, 0, 13",
      pantone: "5315 C",
      onLight: false,
      onDark: false,
    },
    {
      name: "Subtitle on dark",
      hex: "#EBEAF0",
      rgb: "235, 234, 240",
      usage: "Subtitle text on dark surfaces",
      cmyk: "2, 3, 0, 6",
      pantone: "663 C",
      onLight: false,
      onDark: true,
    },
  ],
};

export const SECONDARY: SwatchGroup = {
  title: "Secondary",
  note: "Decorative pop only, never leading. Laser Lemon is never text on white.",
  swatches: [
    { name: "Intense Cyan", hex: "#00FAFF", rgb: "0, 250, 255", cmyk: "100, 2, 0, 0", usage: "Decorative accent.", pantone: "311 C", onLight: false, onDark: true },
    { name: "Laser Lemon", tileNote: "Never use on white", hex: "#EAFF00", rgb: "234, 255, 0", cmyk: "8, 0, 100, 0", usage: "Decorative accent. Never text on white.", pantone: "809 C", onLight: false, onDark: true },
    { name: "Neon Carrot", hex: "#FF8500", rgb: "255, 133, 0", cmyk: "0, 48, 100, 0", usage: "Decorative accent.", pantone: "151 C", onLight: true, onDark: true },
    { name: "Radiant Radish", hex: "#D32E55", rgb: "211, 46, 85", cmyk: "0, 78, 60, 17", usage: "Decorative accent.", pantone: "710 C", onLight: true, onDark: true },
    { name: "Flamingo Pink", hex: "#FF61D3", rgb: "255, 97, 211", cmyk: "0, 62, 17, 0", usage: "Decorative accent. (Name pending audit D10.)", pantone: "813 C", onLight: true, onDark: true },
    { name: "Electric Eggplant", hex: "#8500FF", rgb: "133, 0, 255", cmyk: "48, 100, 0, 0", usage: "Decorative accent.", pantone: "266 C", onLight: false, onDark: true },
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

// Original background artwork, separate from the legacy web CSS recipe above.
// Verified from Figma Background Gradient 1 (10:708), October 27, 2026.
export const BACKGROUND_GRADIENT = {
  name: "Cyan to Lemon",
  image: "/working-canvas/bg-gradient-1.png",
  width: 3840,
  height: 2160,
  angle: 228.4292872718873,
  stops: [
    { name: "Intense Cyan", hex: "#00FAFF", position: 8.8768 },
    { name: "Laser Lemon", hex: "#EAFF00", position: 87.644 },
  ],
  source: "https://www.figma.com/design/1LAizYM7R7QVubcHuix1KF/Slide-Skill-2.0?node-id=10-708",
};

export const BACKGROUND_GRADIENT_CSS = `linear-gradient(${BACKGROUND_GRADIENT.angle}deg, ${BACKGROUND_GRADIENT.stops.map((stop) => `${stop.hex} ${stop.position}%`).join(", ")})`;
