/**
 * Ordergroove color tokens — verified against brand.md and the Phase 0 audit.
 *
 * The green contrast rule (canon 5.2, the most-missed rule in the system):
 *   light background -> #008847   |   dark background -> #00FF85
 * `onLight` / `onDark` flags below drive the live contrast badge on <Swatch>.
 *
 * The supplied light-background logo retains #00CC6A as a logo-only exception
 * (approved by Cameron on 2026-10-26). Do not add it to the UI palette.
 * Open audit decisions: D10 (#FF61D3 name). D2 resolved 2026-11-12: green on light is #008847.
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
  note: "Use Green (#008847) on light backgrounds and Groovy Green (#00FF85) on dark.\nSet small text in Midnight.",
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
      name: "Green on light",
      hex: "#008847",
      rgb: "0, 136, 71",
      usage: "Accent on light backgrounds only",
      cmyk: "100, 0, 48, 47",
      pantone: "Match pending",
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
      usage: "Supporting text on light",
      cmyk: "25, 30, 0, 58",
      pantone: "5265 C",
      onLight: true,
      onDark: false,
    },
    {
      name: "Soft",
      hex: "#666279",
      rgb: "102, 98, 121",
      usage: "Captions and metadata on light",
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
  note: "Use these as small accents, never as the main color. Never set Laser Lemon text on white.",
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

export const COLOR_GROUPS = [CORE, SUPPORTING, SECONDARY];

// The brand gradient: original background artwork plus its CSS recipe.
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

const round2 = (value: number) => Number(value.toFixed(2));

/** The one brand gradient as CSS. Rounded to 2 decimals so canon and the kits print the same string. */
export const BACKGROUND_GRADIENT_CSS = `linear-gradient(${round2(BACKGROUND_GRADIENT.angle)}deg, ${BACKGROUND_GRADIENT.stops.map((stop) => `${stop.hex} ${round2(stop.position)}%`).join(", ")})`;

/** Cyan to Lemon is the only brand gradient (Cameron, 2026-11-12). */
export const GRADIENTS: Gradient[] = [
  { name: BACKGROUND_GRADIENT.name, css: BACKGROUND_GRADIENT_CSS, stops: BACKGROUND_GRADIENT.stops.map((stop) => stop.hex), status: "signature" },
];
