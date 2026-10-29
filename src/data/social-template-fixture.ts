import type { SocialTemplate } from "./social-templates";

/** Technical test geometry only. No approved master artwork is represented. */
export const SOCIAL_TEMPLATE_FIXTURE: SocialTemplate = {
  id: "new-hire",
  version: 1,
  status: "pilot",
  developmentOnly: true,
  title: "New-hire graphic",
  category: "Development",
  description: "Add your name and photo to an Ordergroove graphic.",
  keywords: "new hire welcome social graphic",
  sourceUrl: "repo:src/data/social-template-fixture.ts",
  owner: "Development fixture, awaiting Marketing master",
  reviewedAt: "2026-10-27",
  reviewDueAt: "2027-01-27",
  width: 1200,
  height: 1200,
  assetIds: [],
  variants: [
    { id: "white", label: "White", background: "#FFFFFF", foreground: "#17132F" },
    { id: "midnight", label: "Midnight", background: "#17132F", foreground: "#FFFFFF" },
  ],
  lockedLayers: [
    { id: "fixture-label", type: "text", text: "FIXTURE", x: 80, y: 70, width: 1040, height: 100, fontFamily: "Figtree", fontWeight: 800, minFontSize: 64, maxFontSize: 64, lineHeight: 1.2, maxLines: 1 },
    { id: "grey-bar", type: "rect", x: 80, y: 1030, width: 1040, height: 80, color: "#D8D7DF" },
  ],
  photo: { x: 80, y: 250, width: 480, height: 640, shape: "rect", required: true, maxZoom: 3 },
  fields: [
    { type: "text", prefill: "googleName", key: "name", label: "Name", required: true, x: 620, y: 350, width: 500, height: 260, fontFamily: "Figtree", fontWeight: 700, minFontSize: 32, maxFontSize: 76, lineHeight: 1.15, maxLines: 3 },
    { type: "text", key: "jobTitle", label: "Job title", required: false, x: 620, y: 660, width: 500, height: 180, fontFamily: "Figtree", fontWeight: 400, minFontSize: 24, maxFontSize: 38, lineHeight: 1.25, maxLines: 3 },
  ],
};

/** Source-local URLs are emitted only when this dev-only module is used. */
export const SOCIAL_FIXTURE_ASSETS: Record<string, string> = {
  "event-white": new URL("./social-fixture-art/event-white.png", import.meta.url).href,
  "event-midnight": new URL("./social-fixture-art/event-midnight.png", import.meta.url).href,
};

export const EVENT_TEMPLATE_FIXTURE: SocialTemplate = {
  id: "event-fixture",
  version: 1,
  status: "pilot",
  developmentOnly: true,
  title: "Event graphic",
  category: "Development",
  description: "Add event details and choose a design for your graphic.",
  keywords: "event date time location social graphic",
  sourceUrl: "repo:src/data/social-template-fixture.ts",
  owner: "Development fixture, awaiting Marketing master",
  reviewedAt: "2026-10-27",
  reviewDueAt: "2027-01-27",
  width: 1200,
  height: 1200,
  assetIds: ["event-white", "event-midnight"],
  variants: [
    { id: "white", label: "White", background: "#FFFFFF", foreground: "#17132F" },
    { id: "midnight", label: "Midnight", background: "#17132F", foreground: "#FFFFFF" },
  ],
  lockedLayers: [
    { id: "artwork", type: "asset", assetIdByVariant: { white: "event-white", midnight: "event-midnight" }, x: 0, y: 0, width: 1200, height: 1200 },
  ],
  fields: [
    { key: "eventName", type: "text", label: "Event name", required: true, align: "center", x: 100, y: 300, width: 1000, height: 260, fontFamily: "Figtree", fontWeight: 700, minFontSize: 32, maxFontSize: 76, lineHeight: 1.15, maxLines: 3 },
    { key: "date", type: "date", dateFormat: "weekday", label: "Date", required: true, align: "center", x: 100, y: 620, width: 1000, height: 100, fontFamily: "Figtree", fontWeight: 600, minFontSize: 24, maxFontSize: 44, lineHeight: 1.2, maxLines: 1 },
    { key: "time", type: "time", timeZoneLabel: "ET", label: "Time", required: false, align: "center", x: 100, y: 760, width: 1000, height: 100, fontFamily: "Figtree", fontWeight: 500, minFontSize: 24, maxFontSize: 40, lineHeight: 1.2, maxLines: 1 },
    { key: "location", type: "choice", options: ["New York", "Virtual"], label: "Location", required: true, align: "center", x: 100, y: 900, width: 1000, height: 100, fontFamily: "Figtree", fontWeight: 400, minFontSize: 24, maxFontSize: 40, lineHeight: 1.2, maxLines: 1 },
  ],
};

export const SOCIAL_TEMPLATE_FIXTURES = [SOCIAL_TEMPLATE_FIXTURE, EVENT_TEMPLATE_FIXTURE];
