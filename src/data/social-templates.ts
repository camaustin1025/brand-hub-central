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
  variants: { id: string; label: string; background: string; foreground: string }[];
  lockedLayers: LockedLayer[];
  photo?: Bounds & { required: boolean; shape: "rect" | "ellipse"; maxZoom: number };
  fields: SocialField[];
};

/** Approved distributable files only. A future template references these IDs. */
export const SOCIAL_ASSETS: Record<string, string> = {};
export const SOCIAL_FONT_FILES = {
  400: "/fonts/Figtree-Regular.ttf",
  500: "/fonts/Figtree-Medium.ttf",
  600: "/fonts/Figtree-SemiBold.ttf",
  700: "/fonts/Figtree-Bold.ttf",
  800: "/fonts/Figtree-ExtraBold.ttf",
};

/** Add a template only after the source, geometry and variants are approved. */
export const PUBLISHED_SOCIAL_TEMPLATES: SocialTemplate[] = [];

export function publishedSocialTemplates(): SocialTemplate[] {
  return PUBLISHED_SOCIAL_TEMPLATES.filter((template) =>
    !template.developmentOnly && (template.status === "pilot" || template.status === "current"),
  );
}

export function getPublishedSocialTemplate(id: string): SocialTemplate | undefined {
  return publishedSocialTemplates().find((template) => template.id === id);
}
