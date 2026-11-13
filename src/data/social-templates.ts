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
  /** Tracking in em, e.g. -0.01 for Figma's -1%. Browsers without canvas letterSpacing draw default tracking. */
  letterSpacing?: number;
  textTransform?: "uppercase";
};
export type SocialField = TextRules & {
  key: string;
  label: string;
  required: boolean;
  /** Joins a text stack: the stack sets this field's top. Its y must equal the stack's y. */
  stack?: string;
} & (
  | { type: "text"; prefill?: "googleName"; defaultValue?: string; placeholder?: string; prefix?: string; suffix?: string }
  | { type: "date"; dateFormat: "short" | "long" | "weekday" }
  | { type: "time"; timeZoneLabel?: string }
  | { type: "choice"; options: string[] }
);
/** belowPhoto paints the layer after the variant background and before the photo, e.g. a gradient backdrop. */
export type LockedLayer = { id: string; belowPhoto?: boolean } & (
  | (Bounds & { type: "rect" | "ellipse"; color: string })
  | (Bounds & { type: "asset" } & ({ assetId: string; assetIdByVariant?: never } | { assetId?: never; assetIdByVariant: Record<string, string> }))
  | (TextRules & { type: "text"; text: string })
);
/** Stacked fields draw one after another with a fixed gap, aligned vertically within the stack box,
 * so a value that wraps moves its neighbours instead of overlapping them. */
export type TextStack = Bounds & { id: string; gap: number; verticalAlign: "top" | "center" | "bottom" };
export type PhotoFrame = Bounds & {
  required: boolean;
  shape: "rect" | "ellipse";
  maxZoom: number;
  /** Cut-out designs: photos with transparency use the full frame; opaque photos (and the empty
   * placeholder) are placed in this rounded rectangle instead. Radii are [top-left, top-right, bottom-right, bottom-left]. */
  opaqueClip?: Bounds & { radii: [number, number, number, number] };
};
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
  photo?: PhotoFrame;
  fields: SocialField[];
  textStacks?: TextStack[];
  /** Fictional sample content for the editor preview only. It is never exported: empty required
   * fields and a missing required photo still block download. */
  sample?: { photoAssetId?: string; fields: Record<string, string> };
};

/** Approved distributable files only. A future template references these IDs. */
export const SOCIAL_ASSETS: Record<string, string> = {
  "new-employee-badge": "/social/new-employee-badge.png",
  "new-employee-badge-preview": "/social/new-employee-badge-preview.png",
  "new-employee-split-light": "/social/new-employee-split-light.png",
  "new-employee-split-light-preview": "/social/new-employee-split-light-preview.png",
  "new-employee-split-dark": "/social/new-employee-split-dark.png",
  "new-employee-split-dark-preview": "/social/new-employee-split-dark-preview.png",
  "event-shoptalk-2027": "/social/event-shoptalk-2027.png",
  "event-shoptalk-2027-preview": "/social/event-shoptalk-2027-preview.png",
  "event-lets-meet": "/social/event-lets-meet.png",
  "event-lets-meet-preview": "/social/event-lets-meet-preview.png",
  "groovy-award-gradient-landscape": "/social/groovy-award-gradient-landscape.png",
  "groovy-award-gradient-landscape-backdrop": "/social/groovy-award-gradient-landscape-backdrop.png",
  "groovy-award-gradient-landscape-preview": "/social/groovy-award-gradient-landscape-preview.png",
  "groovy-award-midnight-tag-landscape": "/social/groovy-award-midnight-tag-landscape.png",
  "groovy-award-midnight-tag-landscape-backdrop": "/social/groovy-award-midnight-tag-landscape-backdrop.png",
  "groovy-award-midnight-tag-landscape-preview": "/social/groovy-award-midnight-tag-landscape-preview.png",
  "groovy-award-gradient-square": "/social/groovy-award-gradient-square.png",
  "groovy-award-gradient-square-backdrop": "/social/groovy-award-gradient-square-backdrop.png",
  "groovy-award-gradient-square-preview": "/social/groovy-award-gradient-square-preview.png",
  "groovy-award-midnight-tag-square": "/social/groovy-award-midnight-tag-square.png",
  "groovy-award-midnight-tag-square-backdrop": "/social/groovy-award-midnight-tag-square-backdrop.png",
  "groovy-award-midnight-tag-square-preview": "/social/groovy-award-midnight-tag-square-preview.png",
  // Stock model (Unsplash License), shown only as the editor's sample photo. See groovy-award-sample-portrait-CREDIT.md.
  "groovy-award-sample-portrait": "/social/groovy-award-sample-portrait.webp",
};
export const SOCIAL_FONT_FILES = {
  400: "/fonts/Figtree-Regular.ttf",
  500: "/fonts/Figtree-Medium.ttf",
  600: "/fonts/Figtree-SemiBold.ttf",
  700: "/fonts/Figtree-Bold.ttf",
  800: "/fonts/Figtree-ExtraBold.ttf",
};

/* Groovy Awards: 4 options from Figma "Groovy Award" (section 80:580). Artwork is rebuilt from the
 * Figma logo, trophy and sparkle vectors; no photo or text is baked in. The sample below is fictional
 * and the portrait is a generated image of no real person, not an Ordergroove employee or award winner. */
const GROOVY_AWARD_SAMPLE: NonNullable<SocialTemplate["sample"]> = {
  photoAssetId: "groovy-award-sample-portrait",
  fields: { name: "Groovy Guy", jobTitle: "Senior Account Manager" }, // Fictional sample text
};
const GROOVY_AWARD_META = {
  version: 1,
  status: "pilot",
  category: "Groovy Awards",
  keywords: "groovy award, groovy awards, award, winner, recognition, quarterly, celebrate, LinkedIn, headshot",
  owner: "Cameron Austin",
  reviewedAt: "2026-11-13",
  reviewDueAt: "2027-02-13",
  sample: GROOVY_AWARD_SAMPLE,
} as const;
const LANDSCAPE_AWARD_PHOTO: NonNullable<SocialTemplate["photo"]> = { x: 525.03, y: 0, width: 674.97, height: 627, shape: "rect", required: true, maxZoom: 3, opaqueClip: { x: 600, y: 97.3, width: 600, height: 529.7, radii: [30, 0, 0, 0] } };
const SQUARE_AWARD_PHOTO: NonNullable<SocialTemplate["photo"]> = { x: 146.49, y: 193.52, width: 653.51, height: 606.48, shape: "rect", required: true, maxZoom: 3, opaqueClip: { x: 162.3, y: 309.57, width: 637.7, height: 490.43, radii: [30, 0, 0, 0] } };

export const GROOVY_AWARD_TEMPLATES: SocialTemplate[] = [
  {
    ...GROOVY_AWARD_META,
    id: "groovy-award-gradient-landscape",
    title: "Gradient landscape",
    description: "A full-gradient Groovy Award winner graphic with the winner's photo, name, job title, quarter and award.",
    sourceUrl: "https://www.figma.com/design/uoOF8jsKhT64QvQV253uI5/Social-Skill?node-id=80-1055",
    width: 1200,
    height: 627,
    assetIds: ["groovy-award-gradient-landscape-backdrop", "groovy-award-gradient-landscape"],
    previewAssetId: "groovy-award-gradient-landscape-preview",
    variants: [{ id: "gradient", label: "Gradient", background: "#FFFFFF", foreground: "#17132F" }],
    lockedLayers: [
      { id: "backdrop", type: "asset", assetId: "groovy-award-gradient-landscape-backdrop", belowPhoto: true, x: 0, y: 0, width: 1200, height: 627 },
      { id: "artwork", type: "asset", assetId: "groovy-award-gradient-landscape", x: 0, y: 0, width: 1200, height: 627 },
    ],
    photo: LANDSCAPE_AWARD_PHOTO,
    textStacks: [
      { id: "headline", x: 56.13, y: 159.57, width: 700, height: 190.84, gap: 2.84, verticalAlign: "bottom" },
      { id: "nameCard", x: 462.1, y: 433.68, width: 241.2, height: 103.95, gap: 3.97, verticalAlign: "center" },
    ],
    fields: [
      { key: "name", type: "text", label: "Name", required: true, placeholder: "Groovy Guy", stack: "nameCard", x: 462.1, y: 433.68, width: 241.2, height: 55.18, fontFamily: "Figtree", fontWeight: 700, minFontSize: 20, maxFontSize: 35, lineHeight: 1.15, maxLines: 2, letterSpacing: -0.01 },
      { key: "jobTitle", type: "text", label: "Job title", required: true, placeholder: "Senior Account Manager", stack: "nameCard", x: 463.1, y: 433.68, width: 240.2, height: 44.8, fontFamily: "Figtree", fontWeight: 500, minFontSize: 13, maxFontSize: 18, lineHeight: 1.4, maxLines: 2 },
      { key: "quarter", type: "text", label: "Quarter", required: true, defaultValue: "Q4 2026", stack: "headline", x: 58.13, y: 159.57, width: 698, height: 34, fontFamily: "Figtree", fontWeight: 700, minFontSize: 20, maxFontSize: 30.72, lineHeight: 1.104, maxLines: 1, textTransform: "uppercase" },
      { key: "award", type: "text", label: "Award", required: true, defaultValue: "Groovy Award Winner", stack: "headline", x: 56.13, y: 159.57, width: 700, height: 154, fontFamily: "Figtree", fontWeight: 700, minFontSize: 36, maxFontSize: 66.852, lineHeight: 1.15, maxLines: 2, letterSpacing: -0.01 },
    ],
  },
  {
    ...GROOVY_AWARD_META,
    id: "groovy-award-midnight-tag-landscape",
    title: "Midnight tag landscape",
    description: "A white Groovy Award winner graphic with a gradient panel, a Midnight name tag, and the winner's photo, name, job title, quarter and award.",
    sourceUrl: "https://www.figma.com/design/uoOF8jsKhT64QvQV253uI5/Social-Skill?node-id=80-1122",
    width: 1200,
    height: 627,
    assetIds: ["groovy-award-midnight-tag-landscape-backdrop", "groovy-award-midnight-tag-landscape"],
    previewAssetId: "groovy-award-midnight-tag-landscape-preview",
    variants: [{ id: "midnight-tag", label: "Midnight tag", background: "#FFFFFF", foreground: "#17132F" }],
    lockedLayers: [
      { id: "backdrop", type: "asset", assetId: "groovy-award-midnight-tag-landscape-backdrop", belowPhoto: true, x: 0, y: 0, width: 1200, height: 627 },
      { id: "artwork", type: "asset", assetId: "groovy-award-midnight-tag-landscape", x: 0, y: 0, width: 1200, height: 627 },
    ],
    photo: LANDSCAPE_AWARD_PHOTO,
    textStacks: [
      { id: "headline", x: 56.13, y: 132.03, width: 468.9, height: 246.32, gap: 5.32, verticalAlign: "bottom" },
      { id: "nameCard", x: 461.58, y: 433.68, width: 241.79, height: 103.95, gap: 3.97, verticalAlign: "center" },
    ],
    fields: [
      { key: "name", type: "text", label: "Name", required: true, placeholder: "Groovy Guy", stack: "nameCard", x: 461.58, y: 433.68, width: 241.79, height: 55.18, fontFamily: "Figtree", fontWeight: 700, minFontSize: 20, maxFontSize: 35, lineHeight: 1.15, maxLines: 2, letterSpacing: -0.01, color: "#FFFFFF" },
      { key: "jobTitle", type: "text", label: "Job title", required: true, placeholder: "Senior Account Manager", stack: "nameCard", x: 462.58, y: 433.68, width: 240.79, height: 44.8, fontFamily: "Figtree", fontWeight: 500, minFontSize: 13, maxFontSize: 18, lineHeight: 1.4, maxLines: 2, color: "#FFFFFF" },
      { key: "quarter", type: "text", label: "Quarter", required: true, defaultValue: "Q4 2026", stack: "headline", x: 58.13, y: 132.03, width: 466.9, height: 34, fontFamily: "Figtree", fontWeight: 700, minFontSize: 20, maxFontSize: 30.72, lineHeight: 1.104, maxLines: 1, textTransform: "uppercase", color: "#009A50" },
      { key: "award", type: "text", label: "Award", required: true, defaultValue: "Groovy Award Winner", stack: "headline", x: 56.13, y: 132.03, width: 468.9, height: 207, fontFamily: "Figtree", fontWeight: 700, minFontSize: 36, maxFontSize: 66.852, lineHeight: 1.15, maxLines: 3, letterSpacing: -0.01 },
    ],
  },
  {
    ...GROOVY_AWARD_META,
    id: "groovy-award-gradient-square",
    title: "Gradient square",
    description: "A square full-gradient Groovy Award winner graphic with the winner's photo, name, job title, quarter and award.",
    sourceUrl: "https://www.figma.com/design/uoOF8jsKhT64QvQV253uI5/Social-Skill?node-id=80-617",
    width: 800,
    height: 800,
    assetIds: ["groovy-award-gradient-square-backdrop", "groovy-award-gradient-square"],
    previewAssetId: "groovy-award-gradient-square-preview",
    variants: [{ id: "gradient", label: "Gradient", background: "#FFFFFF", foreground: "#17132F" }],
    lockedLayers: [
      { id: "backdrop", type: "asset", assetId: "groovy-award-gradient-square-backdrop", belowPhoto: true, x: 0, y: 0, width: 800, height: 800 },
      { id: "artwork", type: "asset", assetId: "groovy-award-gradient-square", x: 0, y: 0, width: 800, height: 800 },
    ],
    photo: SQUARE_AWARD_PHOTO,
    textStacks: [
      { id: "headline", x: 56.13, y: 108, width: 687.74, height: 119.3, gap: 2.68, verticalAlign: "bottom" },
      { id: "nameCard", x: 84.95, y: 588.28, width: 234.56, height: 86.94, gap: 4.8, verticalAlign: "top" },
    ],
    fields: [
      { key: "name", type: "text", label: "Name", required: true, placeholder: "Groovy Guy", stack: "nameCard", x: 84.95, y: 588.28, width: 234.56, height: 41.4, fontFamily: "Figtree", fontWeight: 700, minFontSize: 18, maxFontSize: 36, lineHeight: 1.15, maxLines: 2, letterSpacing: -0.01 },
      { key: "jobTitle", type: "text", label: "Job title", required: true, placeholder: "Senior Account Manager", stack: "nameCard", x: 86.95, y: 588.28, width: 232.56, height: 40.74, fontFamily: "Figtree", fontWeight: 500, minFontSize: 13, maxFontSize: 18, lineHeight: 1.4, maxLines: 2 },
      { key: "quarter", type: "text", label: "Quarter", required: true, defaultValue: "Q4 2026", stack: "headline", x: 58.3, y: 108, width: 685.57, height: 28.3, fontFamily: "Figtree", fontWeight: 700, minFontSize: 18, maxFontSize: 25.6, lineHeight: 1.104, maxLines: 1, textTransform: "uppercase" },
      { key: "award", type: "text", label: "Award", required: true, defaultValue: "Groovy Award Winner", stack: "headline", x: 56.13, y: 108, width: 687.74, height: 88.32, fontFamily: "Figtree", fontWeight: 700, minFontSize: 32, maxFontSize: 66.852, lineHeight: 1.15, maxLines: 2, letterSpacing: -0.01 },
    ],
  },
  {
    ...GROOVY_AWARD_META,
    id: "groovy-award-midnight-tag-square",
    title: "Midnight tag square",
    description: "A square white Groovy Award winner graphic with a gradient panel, a Midnight name tag, and the winner's photo, name, job title, quarter and award.",
    sourceUrl: "https://www.figma.com/design/uoOF8jsKhT64QvQV253uI5/Social-Skill?node-id=80-837",
    width: 800,
    height: 800,
    assetIds: ["groovy-award-midnight-tag-square-backdrop", "groovy-award-midnight-tag-square"],
    previewAssetId: "groovy-award-midnight-tag-square-preview",
    variants: [{ id: "midnight-tag", label: "Midnight tag", background: "#FFFFFF", foreground: "#17132F" }],
    lockedLayers: [
      { id: "backdrop", type: "asset", assetId: "groovy-award-midnight-tag-square-backdrop", belowPhoto: true, x: 0, y: 0, width: 800, height: 800 },
      { id: "artwork", type: "asset", assetId: "groovy-award-midnight-tag-square", x: 0, y: 0, width: 800, height: 800 },
    ],
    photo: SQUARE_AWARD_PHOTO,
    textStacks: [
      { id: "headline", x: 56.13, y: 108, width: 687.74, height: 119.3, gap: 2.68, verticalAlign: "bottom" },
      { id: "nameCard", x: 84.95, y: 608.17, width: 234.56, height: 86.94, gap: 4.8, verticalAlign: "top" },
    ],
    fields: [
      { key: "name", type: "text", label: "Name", required: true, placeholder: "Groovy Guy", stack: "nameCard", x: 84.95, y: 608.17, width: 234.56, height: 41.4, fontFamily: "Figtree", fontWeight: 700, minFontSize: 18, maxFontSize: 36, lineHeight: 1.15, maxLines: 2, letterSpacing: -0.01, color: "#FFFFFF" },
      { key: "jobTitle", type: "text", label: "Job title", required: true, placeholder: "Senior Account Manager", stack: "nameCard", x: 86.95, y: 608.17, width: 232.56, height: 40.74, fontFamily: "Figtree", fontWeight: 500, minFontSize: 13, maxFontSize: 18, lineHeight: 1.4, maxLines: 2, color: "#FFFFFF" },
      { key: "quarter", type: "text", label: "Quarter", required: true, defaultValue: "Q4 2026", stack: "headline", x: 58.3, y: 108, width: 685.57, height: 28.3, fontFamily: "Figtree", fontWeight: 700, minFontSize: 18, maxFontSize: 25.6, lineHeight: 1.104, maxLines: 1, textTransform: "uppercase", color: "#009A50" },
      { key: "award", type: "text", label: "Award", required: true, defaultValue: "Groovy Award Winner", stack: "headline", x: 56.13, y: 108, width: 687.74, height: 88.32, fontFamily: "Figtree", fontWeight: 700, minFontSize: 32, maxFontSize: 66.852, lineHeight: 1.15, maxLines: 2, letterSpacing: -0.01 },
    ],
  },
];

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
  {
    id: "event-shoptalk-2027",
    version: 1,
    status: "pilot",
    category: "Event Attendance",
    title: "Shoptalk 2027",
    description: "Let people know you'll be at Shoptalk, March 22–24 in Las Vegas.",
    keywords: "event, events, conference, trade show, attending, Shoptalk, Las Vegas, booth, LinkedIn, headshot",
    sourceUrl: "https://www.figma.com/design/uoOF8jsKhT64QvQV253uI5/Social-Skill?node-id=1-272",
    owner: "Cameron Austin",
    reviewedAt: "2026-10-28",
    reviewDueAt: "2027-01-28",
    width: 1200,
    height: 627,
    assetIds: ["event-shoptalk-2027"],
    previewAssetId: "event-shoptalk-2027-preview",
    variants: [{ id: "gradient", label: "Gradient", background: "#FFFFFF", foreground: "#17132F" }],
    lockedLayers: [{ id: "artwork", type: "asset", assetId: "event-shoptalk-2027", x: 0, y: 0, width: 1200, height: 627 }],
    photo: { x: 690.5, y: 106.5, width: 414, height: 414, shape: "ellipse", required: true, maxZoom: 3 },
    fields: [
      { key: "shoptalkDetails", type: "text", label: "Event details", required: true, defaultValue: "March 22–24  |  Las Vegas", placeholder: "March 22–24  |  Las Vegas  |  Booth #1165", x: 78.5, y: 418, width: 590, height: 24, fontFamily: "Figtree", fontWeight: 700, minFontSize: 18, maxFontSize: 23.5, lineHeight: 1.012, maxLines: 1, align: "left" },
    ],
  },
  {
    id: "event-lets-meet",
    version: 1,
    status: "pilot",
    category: "Event Attendance",
    title: "Any event",
    description: "A Let's meet graphic for any event, with your photo and the event details.",
    keywords: "event, events, conference, trade show, attending, meet, booth, LinkedIn, headshot",
    sourceUrl: "https://www.figma.com/design/uoOF8jsKhT64QvQV253uI5/Social-Skill?node-id=1-272",
    owner: "Cameron Austin",
    reviewedAt: "2026-10-28",
    reviewDueAt: "2027-01-28",
    width: 1200,
    height: 627,
    assetIds: ["event-lets-meet"],
    previewAssetId: "event-lets-meet-preview",
    variants: [{ id: "gradient", label: "Gradient", background: "#FFFFFF", foreground: "#17132F" }],
    lockedLayers: [{ id: "artwork", type: "asset", assetId: "event-lets-meet", x: 0, y: 0, width: 1200, height: 627 }],
    photo: { x: 690.5, y: 106.5, width: 414, height: 414, shape: "ellipse", required: true, maxZoom: 3 },
    fields: [
      { key: "event", type: "text", label: "Event name", required: true, placeholder: "Shoptalk", prefix: "Let's meet at ", suffix: "!", x: 75, y: 203.5, width: 530, height: 190, fontFamily: "Figtree", fontWeight: 700, minFontSize: 48, maxFontSize: 90, lineHeight: 1.05, maxLines: 3, align: "left" },
      { key: "details", type: "text", label: "Event details", required: true, placeholder: "March 22–24  |  Las Vegas  |  Booth #1165", x: 78.5, y: 418, width: 590, height: 24, fontFamily: "Figtree", fontWeight: 700, minFontSize: 18, maxFontSize: 23.5, lineHeight: 1.012, maxLines: 1, align: "left" },
    ],
  },
  ...GROOVY_AWARD_TEMPLATES,
];

export function publishedSocialTemplates(): SocialTemplate[] {
  return PUBLISHED_SOCIAL_TEMPLATES.filter((template) =>
    !template.developmentOnly && (template.status === "pilot" || template.status === "current"),
  );
}

export function getPublishedSocialTemplate(id: string): SocialTemplate | undefined {
  return publishedSocialTemplates().find((template) => template.id === id);
}
