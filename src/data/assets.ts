/**
 * Asset model — intentionally flat enough for the v1 Downloads page but
 * carrying the `tags`, `type`, and `formats` fields the v1.5 DAM-lite will
 * filter and search on. Shipping this shape now means v1.5 is additive, not
 * a rebuild (see docs/DAM & Downloads - Design Direction.md).
 *
 * `href` values marked TODO point at assets still being re-sourced (every
 * old-hub download link was dead — see the audit's "Assets to re-source").
 */

export type AssetType =
  | "logo"
  | "font"
  | "token"
  | "background"
  | "social"
  | "template";

export type AssetFormat = "SVG" | "PNG" | "EPS" | "TTF" | "JSON" | "CSS" | "ZIP";

export type Asset = {
  id: string;
  title: string;
  description: string;
  type: AssetType;
  formats: AssetFormat[];
  tags: string[];
  /** Preview image served from /public, or null for a generated tile. */
  preview: string | null;
  /** Preview backdrop. Light-background assets need a white tile to be visible. */
  previewBg?: "midnight" | "light";
  /** Download target. null renders as "Not available yet". */
  href: string | null;
  /** Explicit review hold; a download URL alone does not clear this hold. */
  employeeHold?: string;
};

export const ASSET_CATEGORIES: { type: AssetType; label: string }[] = [
  { type: "logo", label: "Logo kit" },
  { type: "font", label: "Font kit" },
  { type: "token", label: "Design tokens" },
  { type: "background", label: "Backgrounds" },
  { type: "social", label: "Social graphics" },
];

export const ASSETS: Asset[] = [
  {
    id: "logo-dark",
    title: "Logo for dark backgrounds",
    description: "Primary lockup: white wordmark, Groovy Green rings, on Midnight.",
    type: "logo",
    formats: ["PNG"],
    tags: ["logo", "dark", "primary"],
    preview: "/logo-dark.png",
    href: "/logo-dark.png",
  },
  {
    id: "logo-light",
    title: "Logo for light backgrounds",
    description: "Midnight wordmark with #00CC6A rings on white. This green is a logo-only exception; use the supplied file unchanged.",
    type: "logo",
    formats: ["PNG"],
    tags: ["logo", "light", "primary"],
    preview: "/logo-white.png",
    previewBg: "light",
    href: "/logo-white.png",
  },
  {
    id: "logomark",
    employeeHold: "Replace the cropped PNG with a clean master; the current file contains stray white fragments at its edges.",
    title: "Isolated logomark",
    description: "The interlocking rings alone. Default: Groovy Green on Midnight.",
    type: "logo",
    formats: ["PNG"],
    tags: ["logo", "logomark", "mark"],
    preview: "/logomark.png",
    href: "/logomark.png",
  },
  {
    id: "font-kit",
    title: "Figtree font kit",
    description: "Static weights 400 to 800. The only brand typeface.",
    type: "font",
    formats: ["TTF", "ZIP"],
    tags: ["font", "figtree", "typography"],
    preview: null,
    href: null, // TODO bundle /public/fonts into a zip
  },
  {
    id: "tokens-json",
    title: "tokens.json",
    description: "Canonical color, type, and gradient values as JSON.",
    type: "token",
    formats: ["JSON"],
    tags: ["tokens", "developers"],
    preview: null,
    href: null, // TODO generate after audit D1/D2 land
  },
  {
    id: "tokens-css",
    title: "tokens.css",
    description: "The same values as CSS custom properties.",
    type: "token",
    formats: ["CSS"],
    tags: ["tokens", "developers", "css"],
    preview: null,
    href: null, // TODO generate after audit D1/D2 land
  },
  {
    id: "zoom-bg",
    title: "Groovy Green Zoom background",
    description: "Midnight canvas with the paired-circle gradient.",
    type: "background",
    formats: ["PNG"],
    tags: ["zoom", "background", "circles"],
    preview: "/midnight_bg.png",
    href: "/midnight_bg.png",
  },
  {
    id: "social-linkedin",
    title: "LinkedIn banner",
    description: "Approved company banner, sized for LinkedIn.",
    type: "social",
    formats: ["PNG"],
    tags: ["social", "linkedin", "banner"],
    preview: null,
    href: null, // TODO regenerate at current dimensions
  },
];
