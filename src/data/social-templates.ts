export type Bounds = { x: number; y: number; width: number; height: number };
export type SocialFieldType = "text" | "date" | "time" | "choice";
export type TextRules = Bounds & {
  fontFamily: "Figtree";
  fontWeight: 400 | 500 | 600 | 700 | 800;
  minFontSize: number;
  maxFontSize: number;
  lineHeight: number;
  maxLines: number;
  align?: "left" | "center" | "right";
  color?: string;
  opacity?: number;
};
export type SocialField = TextRules & {
  key: string;
  label: string;
  required: boolean;
} & (
  | { type: "text"; prefill?: "googleName" }
  | { type: "date"; dateFormat: "short" | "long" | "weekday" }
  | { type: "time"; timeZoneLabel?: string }
  | { type: "choice"; options: string[] }
);
export type LockedLayer = { id: string } & (
  | (Bounds & { type: "rect" | "ellipse"; color: string })
  | (Bounds & { type: "asset" } & ({ assetId: string; assetIdByVariant?: never } | { assetId?: never; assetIdByVariant: Record<string, string> }))
  | (TextRules & { type: "text"; text: string })
);
export type SocialTemplate = {
  id: string;
  version: number;
  status: "pilot" | "current" | "retired";
  title: string;
  category: string;
  description: string;
  keywords: string;
  sourceUrl: string;
  owner: string;
  reviewedAt: string;
  reviewDueAt: string;
  developmentOnly?: boolean;
  width: number;
  height: number;
  assetIds: string[];
  previewAssetId?: string;
  variants: { id: string; label: string; background: string; foreground: string }[];
  lockedLayers: LockedLayer[];
  photo?: Bounds & { required: boolean; shape: "rect" | "ellipse"; maxZoom: number };
  fields: SocialField[];
};

/** Approved distributable files only. A future template references these IDs. */
export const SOCIAL_ASSETS: Record<string, string> = {
  "new-employee-badge": "/social/new-employee-badge.png",
  "new-employee-badge-preview": "/social/new-employee-badge-preview.png",
  "new-employee-split-light": "/social/new-employee-split-light.png",
  "new-employee-split-light-preview": "/social/new-employee-split-light-preview.png",
  "new-employee-split-dark": "/social/new-employee-split-dark.png",
  "new-employee-split-dark-preview": "/social/new-employee-split-dark-preview.png",
};
export const SOCIAL_FONT_FILES = {
  400: "/fonts/Figtree-Regular.ttf",
  500: "/fonts/Figtree-Medium.ttf",
  600: "/fonts/Figtree-SemiBold.ttf",
  700: "/fonts/Figtree-Bold.ttf",
  800: "/fonts/Figtree-ExtraBold.ttf",
};

/** Add a template only after the source, geometry and variants are approved. */
export const PUBLISHED_SOCIAL_TEMPLATES: SocialTemplate[] = [
  {
    id: "new-employee-badge",
    version: 1,
    status: "pilot",
    category: "New Employee",
    title: "Proud to join",
    description: "A badge-style LinkedIn graphic with your photo, name and job title.",
    keywords: "new hire, new employee, joined, welcome, LinkedIn, headshot",
    sourceUrl: "https://www.figma.com/design/uoOF8jsKhT64QvQV253uI5/Social-Skill?node-id=17-922",
    owner: "Cameron Austin",
    reviewedAt: "2026-10-28",
    reviewDueAt: "2027-01-28",
    width: 1200,
    height: 627,
    assetIds: ["new-employee-badge"],
    previewAssetId: "new-employee-badge-preview",
    variants: [{ id: "white", label: "White", background: "#FFFFFF", foreground: "#17132F" }],
    lockedLayers: [{ id: "artwork", type: "asset", assetId: "new-employee-badge", x: 0, y: 0, width: 1200, height: 627 }],
    photo: { x: 846, y: 146, width: 184, height: 184, shape: "ellipse", required: true, maxZoom: 3 },
    fields: [
      { key: "name", type: "text", prefill: "googleName", label: "Name", required: true, x: 782, y: 366, width: 312, height: 36, fontFamily: "Figtree", fontWeight: 700, minFontSize: 20, maxFontSize: 32, lineHeight: 1.1, maxLines: 1, align: "center" },
      { key: "jobTitle", type: "text", label: "Job title", required: false, x: 782, y: 411, width: 312, height: 40, fontFamily: "Figtree", fontWeight: 500, minFontSize: 16, maxFontSize: 20, lineHeight: 1.1, maxLines: 2, align: "center", color: "#17132F", opacity: 0.7 },
    ],
  },
  {
    id: "new-employee-split-light",
    version: 1,
    status: "pilot",
    category: "New Employee",
    title: "I've joined",
    description: "A white and Midnight split graphic with your photo, name and job title.",
    keywords: "new hire, new employee, joined, welcome, LinkedIn, headshot",
    sourceUrl: "https://www.figma.com/design/uoOF8jsKhT64QvQV253uI5/Social-Skill?node-id=11-890",
    owner: "Cameron Austin",
    reviewedAt: "2026-10-28",
    reviewDueAt: "2027-01-28",
    width: 1200,
    height: 627,
    assetIds: ["new-employee-split-light"],
    previewAssetId: "new-employee-split-light-preview",
    variants: [{ id: "white", label: "White", background: "#FFFFFF", foreground: "#17132F" }],
    lockedLayers: [{ id: "artwork", type: "asset", assetId: "new-employee-split-light", x: 0, y: 0, width: 1200, height: 627 }],
    photo: { x: 806, y: 160, width: 308, height: 308, shape: "ellipse", required: true, maxZoom: 3 },
    fields: [
      { key: "name", type: "text", prefill: "googleName", label: "Name", required: true, x: 72, y: 452, width: 600, height: 33, fontFamily: "Figtree", fontWeight: 700, minFontSize: 22, maxFontSize: 30, lineHeight: 1.1, maxLines: 1, align: "left" },
      { key: "jobTitle", type: "text", label: "Job title", required: false, x: 72, y: 491, width: 600, height: 50, fontFamily: "Figtree", fontWeight: 500, minFontSize: 16, maxFontSize: 22, lineHeight: 1.1, maxLines: 2, align: "left", color: "#17132F", opacity: 0.7 },
    ],
  },
  {
    id: "new-employee-split-dark",
    version: 1,
    status: "pilot",
    category: "New Employee",
    title: "Excited to share",
    description: "A Midnight and white split graphic with your photo, name and job title.",
    keywords: "new hire, new employee, joined, welcome, LinkedIn, headshot",
    sourceUrl: "https://www.figma.com/design/uoOF8jsKhT64QvQV253uI5/Social-Skill?node-id=11-915",
    owner: "Cameron Austin",
    reviewedAt: "2026-10-28",
    reviewDueAt: "2027-01-28",
    width: 1200,
    height: 627,
    assetIds: ["new-employee-split-dark"],
    previewAssetId: "new-employee-split-dark-preview",
    variants: [{ id: "midnight", label: "Midnight", background: "#17132F", foreground: "#FFFFFF" }],
    lockedLayers: [{ id: "artwork", type: "asset", assetId: "new-employee-split-dark", x: 0, y: 0, width: 1200, height: 627 }],
    photo: { x: 770, y: 134, width: 340, height: 340, shape: "ellipse", required: true, maxZoom: 3 },
    fields: [
      { key: "name", type: "text", prefill: "googleName", label: "Name", required: true, x: 72, y: 410, width: 580, height: 33, fontFamily: "Figtree", fontWeight: 700, minFontSize: 22, maxFontSize: 30, lineHeight: 1.1, maxLines: 1, align: "left" },
      { key: "jobTitle", type: "text", label: "Job title", required: false, x: 72, y: 449, width: 580, height: 50, fontFamily: "Figtree", fontWeight: 500, minFontSize: 16, maxFontSize: 22, lineHeight: 1.1, maxLines: 2, align: "left", color: "#D8D7DF" },
    ],
  },
];

export function publishedSocialTemplates(): SocialTemplate[] {
  return PUBLISHED_SOCIAL_TEMPLATES.filter((template) =>
    !template.developmentOnly && (template.status === "pilot" || template.status === "current"),
  );
}

export function getPublishedSocialTemplate(id: string): SocialTemplate | undefined {
  return publishedSocialTemplates().find((template) => template.id === id);
}
