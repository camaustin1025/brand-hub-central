import { isEmployeeSectionVisible } from "./employee-launch";
import { BACKGROUND_GRADIENT } from "./tokens";

export type AssetType = "logo" | "font" | "token" | "background" | "social" | "template" | "icon" | "artwork";
export type AssetFormat = "SVG" | "PNG" | "EPS" | "TTF" | "JSON" | "CSS" | "ZIP";
export type AssetFile = { format: AssetFormat; href: string; label?: string };

type AssetRecord = {
  id: string;
  title: string;
  description: string;
  type: AssetType;
  tags: string[];
  preview: string | null;
  previewBg?: "midnight" | "light";
  section: string;
  files: AssetFile[];
  employeeHold?: string;
};

// Legacy primary-file fields are derived here so older reference views keep
// working. Every download destination is authored once, in files below.
export type Asset = AssetRecord & { href: string | null; formats: AssetFormat[] };

export const ASSET_CATEGORIES: { type: AssetType; label: string }[] = [
  { type: "logo", label: "Logo kit" },
  { type: "font", label: "Font kit" },
  { type: "background", label: "Zoom backgrounds" },
  { type: "icon", label: "Icon examples" },
  { type: "token", label: "Design tokens" },
  { type: "social", label: "Social graphics" },
];

const RECORDS: AssetRecord[] = [
  {
    id: "logo-dark", title: "Logo for dark backgrounds",
    description: "White wordmark with Groovy Green rings. Use on Midnight backgrounds.",
    type: "logo", tags: ["logo", "dark", "midnight", "primary", "full", "wordmark", "vector"],
    preview: "/logo-dark.png", section: "logo",
    files: [{ format: "PNG", href: "/logo-dark.png" }, { format: "SVG", href: "/working-canvas/logo-dark-bg.svg" }],
  },
  {
    id: "logo-light", title: "Logo for light backgrounds",
    description: "Midnight wordmark with #00CC6A rings on white. This green is a logo-only exception; use the supplied file unchanged.",
    type: "logo", tags: ["logo", "light", "white", "primary", "full", "wordmark", "vector"],
    preview: "/logo-white.png", previewBg: "light", section: "logo",
    files: [{ format: "PNG", href: "/logo-white.png" }, { format: "SVG", href: "/working-canvas/logo-light-bg.svg" }],
  },
  {
    id: "logomark-dark", title: "Logomark for dark backgrounds",
    description: "Standalone Groovy Green rings for dark backgrounds.",
    type: "logo", tags: ["logo", "logomark", "mark", "dark", "midnight", "rings"],
    preview: "/ordergroove-logomark-dark-bgs.png", section: "logo",
    files: [{ format: "PNG", href: "/ordergroove-logomark-dark-bgs.png" }],
  },
  {
    id: "logomark-light", title: "Logomark for light backgrounds",
    description: "Standalone green rings for light backgrounds.",
    type: "logo", tags: ["logo", "logomark", "mark", "light", "white", "rings"],
    preview: "/ordergroove-logomark-light-bgs.png", previewBg: "light", section: "logo",
    files: [{ format: "PNG", href: "/ordergroove-logomark-light-bgs.png" }],
  },
  {
    id: "font-kit", title: "Figtree font kit",
    description: "Figtree in five static weights from Regular 400 to ExtraBold 800. The ZIP includes the font license.",
    type: "font", tags: ["font", "figtree", "typography", "typeface", "regular", "bold", "install"],
    preview: null, previewBg: "light", section: "typography",
    files: [{ format: "ZIP", href: "/fonts/Figtree-font-kit.zip", label: "Font kit ZIP" }, { format: "TTF", href: "/fonts/Figtree-Regular.ttf", label: "Regular TTF" }],
  },
  {
    id: "brand-gradient", title: "Cyan to Lemon gradient",
    description: "Original 3840 × 2160 background artwork. Keep text on a clear, readable surface.",
    type: "artwork", tags: ["gradient", "cyan", "lemon", "brand", "16:9"],
    preview: BACKGROUND_GRADIENT.image, previewBg: "light", section: "color",
    files: [{ format: "PNG", href: BACKGROUND_GRADIENT.image }],
  },
  {
    id: "zoom-bg", title: "Office lounge",
    description: "Green wall and glass meeting room.",
    type: "background", tags: ["zoom", "background", "video", "meeting", "calls", "16:9", "office", "lounge", "green wall"],
    preview: "/zoom-backgrounds/previews/office-lounge.jpg", section: "zoom-backgrounds",
    files: [{ format: "PNG", href: "/zoom-backgrounds/office-lounge.png" }],
  },
  {
    id: "zoom-office-workspace", title: "Office workspace",
    description: "Open office with a green wall and meeting pod.",
    type: "background", tags: ["zoom", "background", "video", "meeting", "calls", "16:9", "office", "desks", "green wall"],
    preview: "/zoom-backgrounds/previews/office-workspace.jpg", section: "zoom-backgrounds",
    files: [{ format: "PNG", href: "/zoom-backgrounds/office-workspace.png" }],
  },
  {
    id: "zoom-midnight-loop", title: "Midnight",
    description: "Plain Midnight with the Ordergroove logo in the upper left.",
    type: "background", tags: ["zoom", "background", "video", "meeting", "calls", "16:9", "midnight", "plain", "logo"],
    preview: "/zoom-backgrounds/previews/midnight-logo.jpg", section: "zoom-backgrounds",
    files: [{ format: "PNG", href: "/zoom-backgrounds/midnight-logo.png" }],
  },
  {
    id: "zoom-gradient", title: "Cyan to Lemon gradient",
    description: "Bright brand gradient with a Midnight logo.",
    type: "background", tags: ["zoom", "background", "video", "meeting", "calls", "16:9", "gradient", "cyan", "lemon"],
    preview: "/zoom-backgrounds/previews/gradient.jpg", section: "zoom-backgrounds",
    files: [{ format: "PNG", href: "/zoom-backgrounds/gradient.png" }],
  },
  {
    id: "zoom-midnight-glow", title: "Midnight glow",
    description: "Midnight with a soft green and cyan glow.",
    type: "background", tags: ["zoom", "background", "video", "meeting", "calls", "16:9", "midnight", "glow", "gradient"],
    preview: "/zoom-backgrounds/previews/midnight-glow.jpg", section: "zoom-backgrounds",
    files: [{ format: "PNG", href: "/zoom-backgrounds/midnight-glow.png" }],
  },
  {
    id: "zoom-office-reception", title: "Office reception",
    description: "Warm wood reception with a Midnight logo wall.",
    type: "background", tags: ["zoom", "background", "video", "meeting", "calls", "16:9", "office", "reception", "wood"],
    preview: "/zoom-backgrounds/previews/office-reception.jpg", section: "zoom-backgrounds",
    files: [{ format: "PNG", href: "/zoom-backgrounds/office-reception.png" }],
  },
  {
    id: "icon-examples", title: "Brand icon examples",
    description: "Original payment, heart, and chart SVG specimens. For all 293 icons in every brand color, use the Icon library page.",
    type: "icon", tags: ["icon", "icons", "payment", "heart", "chart", "material", "symbols", "rounded", "vector", "examples"],
    preview: "/working-canvas/icon-examples.svg", previewBg: "light", section: "icons",
    files: [{ format: "SVG", href: "/working-canvas/icon-examples.svg" }],
  },
  {
    id: "tokens-json", title: "tokens.json", description: "Canonical color, type, and gradient values as JSON.",
    type: "token", tags: ["tokens", "developers"], preview: null, section: "tokens", files: [],
  },
  {
    id: "tokens-css", title: "tokens.css", description: "The same values as CSS custom properties.",
    type: "token", tags: ["tokens", "developers", "css"], preview: null, section: "tokens", files: [],
  },
  {
    id: "social-linkedin", title: "LinkedIn banner", description: "Company banner, sized for LinkedIn. Awaiting a verified export.",
    type: "social", tags: ["social", "linkedin", "banner"], preview: null, section: "downloads", files: [],
  },
];

export const ASSETS: Asset[] = RECORDS.map((asset) => ({
  ...asset, href: asset.files[0]?.href ?? null, formats: [...new Set(asset.files.map((file) => file.format))],
}));

export function isAssetAvailable(asset: Asset) {
  return !asset.employeeHold && isEmployeeSectionVisible(asset.section) && asset.files.length > 0;
}

export function availableAssets() { return ASSETS.filter(isAssetAvailable); }

/** Asset types shown as tiles in the homepage Logos & fonts block. */
export const HOME_TILE_TYPES: AssetType[] = ["logo", "font"];
export function assetAnchor(id: string) { return "asset-" + id; }

export function getAsset(id: string): Asset {
  const asset = ASSETS.find((item) => item.id === id);
  if (!asset) throw new Error("Unknown brand asset: " + id);
  return asset;
}

export function findAssetFile(id: string, format: AssetFormat): AssetFile | undefined {
  const asset = getAsset(id);
  return isAssetAvailable(asset) ? asset.files.find((item) => item.format === format) : undefined;
}

export function getAssetFile(id: string, format: AssetFormat): AssetFile {
  const file = findAssetFile(id, format);
  if (!file) throw new Error("Unavailable brand asset format: " + id + " / " + format);
  return file;
}
