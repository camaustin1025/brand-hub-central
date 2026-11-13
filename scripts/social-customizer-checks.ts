import assert from "node:assert/strict";
import { safeReturnPath } from "../src/lib/auth-return-path";
import { SOCIAL_TEMPLATE_FIXTURE, EVENT_TEMPLATE_FIXTURE, SOCIAL_FIXTURE_ASSETS } from "../src/data/social-template-fixture";
import { PUBLISHED_SOCIAL_TEMPLATES, SOCIAL_ASSETS, getPublishedSocialTemplate, publishedSocialTemplates, type SocialTemplate } from "../src/data/social-templates";
import { validateSocialTemplates } from "../src/lib/social-template-validation";
import { dragSocialCrop, drawSocialGraphic, layoutSocialText, photoSourceRect, socialDownloadFilename, socialPhotoFrame } from "../src/lib/social-renderer";
import { socialTemplateBuildErrors } from "./validate-social-templates";
import { DESIGN_CANVAS_PATH, HUB_NAV, RESOURCE_PAGE_PATHS, designCanvasCategoryId, designCanvasTemplatePath } from "../src/data/hub";
import path from "node:path";

const origin = "https://hub.example";
for (const value of ["/", "/design-canvas/new-hire", "/voice?find=two%20words#rules"]) assert.equal(safeReturnPath(value, origin), value);
for (const value of [undefined, null, "", "https://evil.example", "https://hub.example/voice", "//evil.example", "///evil.example", "\\evil.example", "/\\evil.example", "/%5cevil.example", "/%2f%2fevil.example", "/.%2f/evil.example", "/x/..//evil.example", "/bad%", "/%00", "/\n/evil.example"]) assert.equal(safeReturnPath(value, origin), "/", String(value));
console.log("PASS: internal return paths and adversarial redirect inputs");

const grabGroup = HUB_NAV.find((group) => group.label === "Grab-and-go");
assert.deepEqual(grabGroup?.items.filter((item) => item.path === DESIGN_CANVAS_PATH).map((item) => item.label), ["LinkedIn graphics"]);
assert.equal(HUB_NAV.flatMap((group) => group.items).filter((item) => item.path === DESIGN_CANVAS_PATH).length, 1);
assert.equal(HUB_NAV.flatMap((group) => group.items).filter((item) => item.path?.startsWith("/toolkit")).length, 0);
assert.equal(new Set(HUB_NAV.flatMap((group) => group.items).map((item) => item.id)).size, HUB_NAV.flatMap((group) => group.items).length);
assert.equal(RESOURCE_PAGE_PATHS.toolkit, DESIGN_CANVAS_PATH);
assert.equal(designCanvasTemplatePath("event-lets-meet"), "/design-canvas/event-lets-meet");
assert.equal(designCanvasCategoryId(" Event  Attendance! "), "event-attendance");
console.log("PASS: LinkedIn graphics is one Grab-and-go link to the Design canvas page, and toolkit anchors point to it");

const fixture = () => structuredClone(SOCIAL_TEMPLATE_FIXTURE);
assert.deepEqual(validateSocialTemplates([fixture()], SOCIAL_ASSETS, true), []);
assert.ok(validateSocialTemplates([fixture()], SOCIAL_ASSETS).some((error) => error.includes("fixtures cannot be published")));
assert.ok(validateSocialTemplates([fixture(), fixture()], SOCIAL_ASSETS, true).some((error) => error.includes("duplicate template")));
const invalidCases: [string, (template: SocialTemplate) => void][] = [
  ["asset", (t) => { t.assetIds = ["missing"]; }],
  ["bounds", (t) => { t.photo!.x = 1200; }],
  ["text rules", (t) => { t.fields[0].minFontSize = 1000; }],
  ["Figtree", (t) => { Object.assign(t.fields[0], { fontFamily: "Arial" }); }],
  ["color", (t) => { t.variants[0].background = "#123456"; }],
  ["sourceUrl", (t) => { t.sourceUrl = ""; }],
  ["owner", (t) => { t.owner = ""; }],
  ["review", (t) => { t.reviewedAt = "2026-02-30"; }],
  ["JSON", (t) => { Object.assign(t, { run: () => true }); }],
];
for (const [message, mutate] of invalidCases) {
  const candidate = fixture(); mutate(candidate);
  assert.ok(validateSocialTemplates([candidate], SOCIAL_ASSETS, true).some((error) => error.includes(message)), message);
}
for (const status of ["pilot", "current", "retired"] as const) {
  const candidate = { ...fixture(), developmentOnly: false, status };
  PUBLISHED_SOCIAL_TEMPLATES.push(candidate);
  assert.equal(!!getPublishedSocialTemplate("new-hire"), status !== "retired");
  PUBLISHED_SOCIAL_TEMPLATES.pop();
}
PUBLISHED_SOCIAL_TEMPLATES.push(fixture());
assert.equal(getPublishedSocialTemplate("new-hire"), undefined);
PUBLISHED_SOCIAL_TEMPLATES.pop();
console.log("PASS: schema, provenance, review, font/color and publication guards");

const runBuildGuard = () => socialTemplateBuildErrors(path.resolve("public"));
assert.deepEqual(runBuildGuard(), []);
SOCIAL_ASSETS["missing-file-check"] = "/missing-file-check.png";
assert.ok(runBuildGuard().some((error) => error.includes("Missing or unsafe social template asset")));
delete SOCIAL_ASSETS["missing-file-check"];
const candidate = { ...fixture(), developmentOnly: false, sourceUrl: "https://example.com/approved-master", width: -1 };
PUBLISHED_SOCIAL_TEMPLATES.push(candidate);
assert.ok(runBuildGuard().some((error) => error.includes("invalid output size")));
PUBLISHED_SOCIAL_TEMPLATES.pop();
console.log("PASS: Vite build guard rejects missing files and impossible published definitions");

const definition = fixture();
for (const zoom of [1, 2, 3]) for (const x of [0, 0.5, 1]) for (const y of [0, 0.5, 1]) {
  const rect = photoSourceRect({ width: 2560, height: 1920 }, definition.photo!, { x, y, zoom });
  assert.ok(rect.x >= 0 && rect.y >= 0 && rect.x + rect.width <= 2560 && rect.y + rect.height <= 1920);
  assert.equal(rect.width / rect.height, definition.photo!.width / definition.photo!.height);
}
const ctx = { font: "", measureText: (value: string) => ({ width: value.length * Number(ctx.font.split(" ")[1].replace("px", "")) * 0.6 }) } as CanvasRenderingContext2D;
assert.ok(layoutSocialText(ctx, "Zoë O’Connor-Sánchez", definition.fields[0]));
assert.equal(layoutSocialText(ctx, "W".repeat(200), definition.fields[0]), null);
assert.equal(socialDownloadFilename(definition, { name: "../Zoë / Sánchez?" }), "ordergroove-new-hire-Zoë-Sánchez.png");
console.log("PASS: crop bounds at all edges/zoom levels, text overflow and safe filenames");

// Session 5: drag in output pixels, independent of the rendered preview size.
for (const template of PUBLISHED_SOCIAL_TEMPLATES) {
  const frame = template.photo!;
  const square = { width: 1200, height: 1200 };
  const portrait = { width: 1200, height: 1800 };
  const start = { x: 0.5, y: 0.5, zoom: 2 };
  const original = structuredClone(start);
  const before = photoSourceRect(square, frame, start);
  const moved = dragSocialCrop(start, square, frame, 12, -9);
  const after = photoSourceRect(square, frame, moved);
  const scale = frame.width / before.width;
  assert.ok(Math.abs((before.x - after.x) * scale - 12) < 1e-9, `${template.id}: horizontal movement is 1:1`);
  assert.ok(Math.abs((before.y - after.y) * scale + 9) < 1e-9, `${template.id}: vertical movement is 1:1`);
  assert.deepEqual(start, original, "drag must not mutate the input crop");
  assert.deepEqual(dragSocialCrop(start, square, frame, 1e6, -1e6), { x: 0, y: 1, zoom: 2 });
  assert.deepEqual(dragSocialCrop(start, square, frame, -1e6, 1e6), { x: 1, y: 0, zoom: 2 });
  const atOne = { x: 0.3, y: 0.6, zoom: 1 };
  // A square photo only has no overflow in a square frame; Groovy Award frames are slightly wider than tall.
  if (frame.width === frame.height) assert.deepEqual(dragSocialCrop(atOne, square, frame, 50, -50), atOne, "square at 1× has no overflow on either axis");
  const portraitMoved = dragSocialCrop(atOne, portrait, frame, 50, -10);
  assert.equal(portraitMoved.x, atOne.x, "portrait at 1× has no horizontal overflow");
  assert.ok(portraitMoved.y > atOne.y, "portrait at 1× moves vertically");
  const landscapeMoved = dragSocialCrop(atOne, { width: 1800, height: 1200 }, frame, -10, 50);
  assert.equal(landscapeMoved.y, atOne.y, "landscape at 1× has no vertical overflow");
  assert.ok(landscapeMoved.x > atOne.x);
  assert.deepEqual(dragSocialCrop(start, square, frame, 0, 0), start);
}
console.log("PASS: all New Employee designs drag 1:1, clamp at edges, preserve no-overflow axes, and distinguish portrait/square at 1×");

// Storage planning is pure; the browser acceptance runner also exercises the real IndexedDB transactions.
import {
  currentSocialInputs, currentSocialPhotoId, isFirstSocialDownload, migratedSocialDraft, planSocialVersion, sameSocialInputs, socialPhotoId, unreferencedSocialPhotoIds,
} from "../src/lib/social-drafts";
import { assertSocialPhotoSize, socialPhotoDimensions, socialPhotoEncoding } from "../src/lib/social-photo";
const photo = new Blob(["one processed headshot"], { type: "image/jpeg" });
const id = await socialPhotoId(photo);
assert.equal(id?.length, 64);
assert.equal(await socialPhotoId(new Blob(["one processed headshot"])), id);
assert.notEqual(await socialPhotoId(new Blob(["another headshot"])), id);
const state = { ownerUserId: "a", templateId: "new-hire", templateVersion: 1, fields: { name: "Cameron", jobTitle: "Marketing" }, variantId: "white", crop: { x: 0.5, y: 0.5, zoom: 1 }, photoId: id };
const thumbnail = new Blob(["thumbnail"]);
let versions = planSocialVersion([], state, thumbnail, false);
assert.equal(isFirstSocialDownload(state, versions), true);
versions = planSocialVersion(versions, structuredClone(state), thumbnail, true);
assert.equal(versions.length, 1);
assert.equal(versions[0].downloaded, true);
assert.equal(isFirstSocialDownload(state, versions), false);
versions = planSocialVersion(versions, state, thumbnail, false);
assert.equal(versions[0].downloaded, true, "Save version must retain a previous Downloaded tag");
const firstId = versions[0].id;
for (let index = 1; index <= 10; index++) versions = planSocialVersion(versions, { ...state, fields: { ...state.fields, name: `Person ${index}` } }, thumbnail, false);
assert.equal(versions.length, 10);
assert.equal(versions.some((version) => version.id === firstId), false);
assert.equal(versions[0].fields.name, "Person 10");
assert.equal(versions[9].fields.name, "Person 1");
assert.equal(new Set(versions.map((version) => version.photoId)).size, 1);
assert.equal(sameSocialInputs(state, { ...state, crop: { ...state.crop, x: 0.6 } }), false);
assert.equal(sameSocialInputs(state, { ...state, ownerUserId: "b" }), false);
const downloaded = planSocialVersion([], state, thumbnail, true);
assert.equal(isFirstSocialDownload({ ...state, templateVersion: 2 }, downloaded), false, "First download is based on inputs/photo, across design updates");
assert.equal(isFirstSocialDownload({ ...state, photoId: "other" }, downloaded), true);
assert.equal(isFirstSocialDownload({ ...state, fields: { ...state.fields, name: "Another" } }, downloaded), true);
assert.equal(isFirstSocialDownload(state, [...versions, ...downloaded]), false, "Check all versions, not only newest");
const photos = [{ ownerUserId: "a", id: id!, blob: photo }, { ownerUserId: "a", id: "orphan", blob: photo }];
const draft = { ...state, schemaVersion: 1 as const, updatedAt: new Date().toISOString() };
assert.deepEqual(unreferencedSocialPhotoIds([draft], [], photos), ["orphan"]);
assert.deepEqual(unreferencedSocialPhotoIds([], versions, photos), ["orphan"]);
assert.deepEqual(unreferencedSocialPhotoIds([], [], photos), [id, "orphan"]);
const updated = fixture(); updated.version = 2; updated.variants = [updated.variants[1]];
assert.deepEqual(currentSocialInputs(state, updated), { fields: state.fields, crop: state.crop, variantId: "midnight" });
assert.deepEqual(currentSocialInputs(state, fixture()), { fields: state.fields, crop: state.crop, variantId: "white" });
console.log("PASS: version cap/order, duplicate update, Downloaded retention, SHA-256 dedupe, reference garbage collection, first_download and current-design restoration");

assert.deepEqual(socialPhotoEncoding(false), { type: "image/jpeg", quality: 0.9 });
assert.deepEqual(socialPhotoEncoding(true), { type: "image/png" });
assert.throws(() => assertSocialPhotoSize({ width: 10000, height: 5100 }), /50 megapixels/);
assert.doesNotThrow(() => assertSocialPhotoSize({ width: 8064, height: 6048 }));
const png = new Uint8Array(24); const pngView = new DataView(png.buffer);
pngView.setUint32(0, 0x89504e47); png.set(new TextEncoder().encode("IHDR"), 12); pngView.setUint32(16, 10000); pngView.setUint32(20, 5100);
assert.deepEqual(socialPhotoDimensions(png), { width: 10000, height: 5100 });
const jpeg = Uint8Array.from([0xff,0xd8,0xff,0xc0,0,17,8,0x13,0xec,0x27,0x10,3,1,0x11,0,2,0x11,0,3,0x11,0]);
assert.deepEqual(socialPhotoDimensions(jpeg), { width: 10000, height: 5100 });
assert.equal(socialPhotoDimensions(new Uint8Array([1, 2, 3])), null);
console.log("PASS: opaque JPEG/transparent PNG encoding policy and dimension preflight before decode");

// Session 3: every definition rule also runs in the Vite publication guard.
import { emptySocialFields, formatSocialField, requiredSocialFieldError } from "../src/lib/social-fields";
assert.deepEqual(validateSocialTemplates([structuredClone(EVENT_TEMPLATE_FIXTURE)], SOCIAL_FIXTURE_ASSETS, true), []);
const invalidGeneralCases: [string, (template: SocialTemplate) => void][] = [
  ["Fields", (t) => { t.fields.push({ ...t.fields[0] }); }],
  ["field key", (t) => { t.fields[0].key = "bad-key"; }],
  ["field key", (t) => { t.fields[0].key = "1Name"; }],
  ["field type", (t) => { Object.assign(t.fields[0], { type: "number" }); }],
  ["date format", (t) => { Object.assign(t.fields[0], { type: "date", dateFormat: "numeric" }); }],
  ["date format", (t) => { Object.assign(t.fields[0], { type: "date" }); }],
  ["alignment", (t) => { Object.assign(t.fields[0], { align: "justify" }); }],
  ["alignment", (t) => { Object.assign(t.lockedLayers[0], { align: "middle" }); }],
  ["2 unique", (t) => { Object.assign(t.fields[0], { type: "choice", options: ["One"] }); }],
  ["2 unique", (t) => { Object.assign(t.fields[0], { type: "choice", options: ["One", "One"] }); }],
  ["2 unique", (t) => { Object.assign(t.fields[0], { type: "choice", options: ["One", " "] }); }],
  ["prefill", (t) => { Object.assign(t.fields[0], { type: "time" }); }],
  ["1 prefill", (t) => { Object.assign(t.fields[1], { prefill: "googleName" }); }],
  ["1 field", (t) => { t.fields = []; }],
  ["per-variant", (t) => { t.lockedLayers = [{ id: "art", type: "asset", x: 0, y: 0, width: 1200, height: 1200, assetIdByVariant: { white: "art" } }]; t.assetIds = ["art"]; }],
  ["per-variant", (t) => { t.lockedLayers = [{ id: "art", type: "asset", x: 0, y: 0, width: 1200, height: 1200, assetIdByVariant: { white: "art", midnight: "art", unknown: "art" } }]; t.assetIds = ["art"]; }],
  ["undeclared", (t) => { t.lockedLayers = [{ id: "art", type: "asset", x: 0, y: 0, width: 1200, height: 1200, assetIdByVariant: { white: "art", midnight: "missing" } }]; t.assetIds = ["art"]; }],
  ["either", (t) => { t.lockedLayers = [Object.assign({ id: "art", type: "asset" as const, x: 0, y: 0, width: 1200, height: 1200, assetId: "art" }, { assetIdByVariant: { white: "art", midnight: "art" } })]; t.assetIds = ["art"]; }],
];
for (const [message, mutate] of invalidGeneralCases) {
  const candidate = fixture(); mutate(candidate);
  assert.ok(validateSocialTemplates([candidate], { art: "/art.png" }, true).some((error) => error.includes(message)), message);
  // The exact validation is used by npm run build; confirm these aren't test-only rules.
  candidate.developmentOnly = false; candidate.sourceUrl = "https://figma.com/design/example";
  PUBLISHED_SOCIAL_TEMPLATES.push(candidate);
  assert.ok(runBuildGuard().length, `build guard: ${message}`);
  PUBLISHED_SOCIAL_TEMPLATES.pop();
}
console.log("PASS: generic fields, date format, alignment, choice, prefill, artwork and empty-template guards");
const event = structuredClone(EVENT_TEMPLATE_FIXTURE);
const dateField = event.fields[1];
assert.equal(formatSocialField(dateField, "2026-11-12"), "Thursday, November 12");
assert.equal(formatSocialField({ ...dateField, type: "date", dateFormat: "short" }, "2026-11-12"), "Nov 12, 2026");
assert.equal(formatSocialField({ ...dateField, type: "date", dateFormat: "long" }, "2026-11-12"), "November 12, 2026");
assert.equal(formatSocialField(dateField, "2026-02-30"), null);
assert.equal(formatSocialField(dateField, "2028-02-29"), "Tuesday, February 29");
assert.equal(formatSocialField(event.fields[2], "14:00"), "2:00 PM ET");
assert.equal(formatSocialField(event.fields[2], "00:30"), "12:30 AM ET");
assert.equal(formatSocialField(event.fields[2], "24:00"), null);
assert.equal(formatSocialField(event.fields[2], ""), "");
assert.equal(formatSocialField(event.fields[3], "Removed"), null);
assert.equal(formatSocialField(event.fields[3], "Virtual"), "Virtual");
assert.deepEqual(emptySocialFields(fixture(), "Local Preview"), { name: "Local Preview", jobTitle: "" });
assert.deepEqual(emptySocialFields(event, "Local Preview"), { eventName: "", date: "", time: "", location: "" });
console.log(`PASS: date/time/choice formatting and prefill in ${process.env.TZ}`);

const previous = {
  ...state, templateId: event.id, templateVersion: 2,
  fieldTypes: { eventName: "text", date: "text", time: "time", location: "choice", removed: "text" } as const,
  fields: { eventName: "Evening event", date: "2026-11-12", time: "14:00", location: "Old city", removed: "Gone" },
  variantId: "removed", crop: { x: 0.2, y: 0.8, zoom: 2 },
};
for (const version of [1, 3]) {
  const next = { ...event, version };
  assert.equal(currentSocialPhotoId(previous, next), null, "removed photo is not restored");
  assert.equal(currentSocialPhotoId(state, { ...fixture(), version }), id, "retained photo survives either version direction");
  assert.deepEqual(currentSocialInputs(previous, next), {
    fields: { eventName: "Evening event", date: "", time: "14:00", location: "" },
    crop: { x: 0.5, y: 0.5, zoom: 1 }, variantId: "white",
  });
  assert.equal(currentSocialInputs({ ...previous, fields: { ...previous.fields, location: "Virtual" }, variantId: "midnight" }, next).fields.location, "Virtual");
  assert.equal(currentSocialInputs({ ...previous, variantId: "midnight" }, next).variantId, "midnight");
  assert.deepEqual(currentSocialInputs(state, { ...fixture(), version }), { fields: state.fields, crop: state.crop, variantId: "white" }, "legacy text records carry in both directions");
}
const genericA = { ...previous, fields: { location: "Virtual", date: "2026-11-12" } };
assert.equal(sameSocialInputs(genericA, { ...genericA, fields: { date: "2026-11-12", location: "Virtual" } }), true);
assert.equal(sameSocialInputs(genericA, { ...genericA, fields: { ...genericA.fields, location: "New York" } }), false);
assert.equal(sameSocialInputs(genericA, { ...genericA, fields: { ...genericA.fields, extra: "" } }), false);
assert.equal(sameSocialInputs(genericA, { ...genericA, fields: { location: "Virtual" } }), false);
assert.equal(socialDownloadFilename(event, { eventName: "Autumn event" }), "ordergroove-event-fixture-Autumn-event.png");
assert.equal(socialDownloadFilename(event, { eventName: "" }), "ordergroove-event-fixture.png");
assert.equal(socialDownloadFilename(event, { eventName: "!!!" }), "ordergroove-event-fixture.png");
const primary = fixture(); primary.fields.reverse();
assert.equal(socialDownloadFilename(primary, { name: "Cameron", jobTitle: "Marketer" }), "ordergroove-new-hire-Cameron.png");
console.log("PASS: forward/rollback carry-over, removed fields/types/options/photo/variant, generic comparison and filenames");

assert.equal(socialDownloadFilename({ ...event, fields: event.fields.filter(field => field.type !== "text") }, {}), "ordergroove-event-fixture.png");
const listFirst = { ...fixture(), developmentOnly: false, id: "list-first" };
const listSecond = { ...fixture(), developmentOnly: false, id: "list-second", status: "current" as const };
const originalPublished = [...PUBLISHED_SOCIAL_TEMPLATES];
PUBLISHED_SOCIAL_TEMPLATES.push(listFirst, fixture(), { ...listFirst, id: "retired", status: "retired" }, listSecond);
assert.deepEqual(publishedSocialTemplates().map(template => template.id), [...originalPublished.map(template => template.id), "list-first", "list-second"]);
PUBLISHED_SOCIAL_TEMPLATES.splice(originalPublished.length);
console.log("PASS: no-text filenames and published-template list order/filtering");

const prototypeKey = fixture(); prototypeKey.fields[0].key = "toString";
assert.deepEqual(validateSocialTemplates([prototypeKey], SOCIAL_ASSETS, true), []);
assert.equal(socialDownloadFilename(prototypeKey, {}), "ordergroove-new-hire.png");
assert.equal(socialDownloadFilename(prototypeKey, Object.fromEntries([["toString", "Cameron"]])), "ordergroove-new-hire-Cameron.png");


// Follow-up: blank-value copy follows the control, without changing text/time wording.
assert.equal(requiredSocialFieldError(event.fields[0], ""), "Enter event name.");
assert.equal(requiredSocialFieldError(event.fields[0], "   "), "Enter event name.");
assert.equal(requiredSocialFieldError(event.fields[1], ""), "Choose a date.");
assert.equal(requiredSocialFieldError(event.fields[3], ""), "Choose a location.");
assert.equal(requiredSocialFieldError({ ...event.fields[2], required: true }, ""), "Enter time.");
assert.equal(requiredSocialFieldError(event.fields[2], ""), null);
assert.equal(requiredSocialFieldError(event.fields[3], "Virtual"), null);
assert.equal(requiredSocialFieldError(event.fields[0], "Autumn event"), null);
console.log("PASS: required-field copy for text, date, choice, time and optional fields");

const previousBeforeMigration = structuredClone(previous);
for (const version of [1, 3]) {
  const next = { ...event, version };
  const migrated = migratedSocialDraft(previous, next)!;
  assert.equal(migrated.templateVersion, version);
  assert.equal(migrated.ownerUserId, previous.ownerUserId);
  assert.equal(migrated.templateId, next.id);
  assert.equal(migrated.photoId, null);
  assert.deepEqual(migrated.fields, { eventName: "Evening event", date: "", time: "14:00", location: "" });
  assert.deepEqual(migrated.fieldTypes, { eventName: "text", date: "date", time: "time", location: "choice" });
  assert.deepEqual(currentSocialInputs(migrated, next), currentSocialInputs(previous, next));
  assert.equal(migratedSocialDraft(migrated, next), null, "reloaded current-version draft needs no further save");
  assert.equal(migratedSocialDraft(previous, { ...next, status: "retired" }), null, "retired records stay untouched");
}
assert.deepEqual(previous, previousBeforeMigration, "migration must not mutate the loaded record");
assert.equal(migratedSocialDraft(state, fixture()), null, "matching versions need no write");
const migratedPhotoDraft = migratedSocialDraft(state, { ...fixture(), version: 2 })!;
assert.equal(migratedPhotoDraft.photoId, state.photoId);
assert.deepEqual(migratedPhotoDraft.crop, state.crop);
assert.deepEqual(migratedPhotoDraft.fields, state.fields);
console.log("PASS: one-time forward/rollback draft migration, current field types, retained photo/crop and retired/matching no-op");

// Session 4: new schema rules apply to editable fields and locked text alike.
assert.deepEqual(validateSocialTemplates(PUBLISHED_SOCIAL_TEMPLATES, SOCIAL_ASSETS), []);
assert.deepEqual(PUBLISHED_SOCIAL_TEMPLATES.map(template => template.id), ["new-employee-badge", "new-employee-split-light", "new-employee-split-dark", "event-shoptalk-2027", "event-lets-meet", "groovy-award-gradient-landscape", "groovy-award-midnight-tag-landscape", "groovy-award-gradient-square", "groovy-award-midnight-tag-square"]);
for (const template of PUBLISHED_SOCIAL_TEMPLATES.filter(template => template.category !== "Groovy Awards")) {
  assert.equal(template.category, template.id.startsWith("event-") ? "Event Attendance" : "New Employee");
  assert.equal(template.width, 1200);
  assert.equal(template.height, 627);
  assert.ok(SOCIAL_ASSETS[template.previewAssetId!]);
  assert.equal(template.lockedLayers.length, 1);
  assert.equal(template.lockedLayers[0].type, "asset");
}
const invalidSession4Cases: [string, (template: SocialTemplate) => void][] = [
  ["category", t => { t.category = " "; }],
  ["category", t => { delete (t as Partial<SocialTemplate>).category; }],
  ["category", t => { Object.assign(t, { category: 7 }); }],
  ["preview asset", t => { t.previewAssetId = "missing"; }],
  ["preview asset", t => { t.previewAssetId = "toString"; }],
  ["preview asset", t => { Object.assign(t, { previewAssetId: null }); }],
  ["color", t => { t.fields[0].color = "#123456"; }],
  ["color", t => { Object.assign(t.fields[0], { color: 12 }); }],
  ["color", t => { Object.assign(t.lockedLayers[0], { color: "#123456" }); }],
  ["opacity", t => { t.fields[0].opacity = 0.099; }],
  ["opacity", t => { t.fields[0].opacity = 1.001; }],
  ["opacity", t => { Object.assign(t.fields[0], { opacity: "0.7" }); }],
  ["opacity", t => { Object.assign(t.lockedLayers[0], { opacity: 0 }); }],
];
for (const [message, mutate] of invalidSession4Cases) {
  const template = fixture(); mutate(template);
  assert.ok(validateSocialTemplates([template], SOCIAL_ASSETS, true).some(error => error.includes(message)), message);
  template.developmentOnly = false; template.sourceUrl = "https://figma.com/design/example";
  PUBLISHED_SOCIAL_TEMPLATES.push(template);
  assert.ok(runBuildGuard().some(error => error.includes(message)), `build guard: ${message}`);
  PUBLISHED_SOCIAL_TEMPLATES.pop();
}
for (const opacity of [0.1, 0.7, 1]) {
  const template = fixture();
  Object.assign(template.fields[0], { color: "#D8D7DF", opacity });
  Object.assign(template.lockedLayers[0], { color: "#17132F", opacity });
  template.previewAssetId = "new-employee-badge-preview";
  assert.deepEqual(validateSocialTemplates([template], SOCIAL_ASSETS, true), []);
}
console.log("PASS: published New Employee templates, required category, optional registered preview, token text colors and opacity boundaries, including build guard");

const painted: { text: string; color: string; opacity: number }[] = [];
const paintContext = {
  font: "", fillStyle: "", globalAlpha: 1,
  save() { paintStack.push({ color: this.fillStyle, opacity: this.globalAlpha }); },
  restore() { const saved = paintStack.pop()!; this.fillStyle = saved.color; this.globalAlpha = saved.opacity; },
  fillText(text: string) { painted.push({ text, color: this.fillStyle, opacity: this.globalAlpha }); },
  measureText(value: string) { return { width: value.length, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 2 }; },
  fillRect() {}, drawImage() {},
};
const paintStack: { color: string; opacity: number }[] = [];
const mockCanvas = () => ({ width: 0, height: 0, getContext: () => paintContext }) as unknown as HTMLCanvasElement;
const priorDocument = Object.getOwnPropertyDescriptor(globalThis, "document");
Object.defineProperty(globalThis, "document", { configurable: true, value: { createElement: mockCanvas } });
try {
  const template = fixture(); delete template.photo;
  Object.assign(template.lockedLayers[0], { color: "#D8D7DF", opacity: 0.1 });
  Object.assign(template.fields[0], { color: "#17132F", opacity: 0.7 });
  for (const variant of template.variants) {
    painted.length = 0;
    assert.deepEqual(drawSocialGraphic(mockCanvas(), template, { fields: { name: "Name", jobTitle: "Job title" }, variantId: variant.id, crop: { x: 0.5, y: 0.5, zoom: 1 } }, { fontsLoaded: true, assets: {} }, null), {});
    assert.deepEqual(painted, [
      { text: "FIXTURE", color: "#D8D7DF", opacity: 0.1 },
      { text: "Name", color: "#17132F", opacity: 0.7 },
      { text: "Job title", color: variant.foreground, opacity: 1 },
    ]);
  }
} finally {
  if (priorDocument) Object.defineProperty(globalThis, "document", priorDocument);
  else Reflect.deleteProperty(globalThis, "document");
}
console.log("PASS: editable and locked text overrides render without leaking color/opacity; omitted rules retain full-opacity variant foreground");

// Session 6: Event Attendance templates use text defaults, placeholders and affixes.
{
  const shoptalk = getPublishedSocialTemplate("event-shoptalk-2027")!;
  const anyEvent = getPublishedSocialTemplate("event-lets-meet")!;
  const [eventField, detailsField] = anyEvent.fields;
  assert.equal(formatSocialField(eventField, "Shoptalk"), "Let's meet at Shoptalk!");
  assert.equal(formatSocialField(eventField, "  NRF  "), "Let's meet at NRF!", "affixed values are trimmed");
  assert.equal(formatSocialField(eventField, "   "), "", "an empty value draws nothing, not a bare prefix");
  assert.equal(formatSocialField(detailsField, " March 22–24  |  Las Vegas"), " March 22–24  |  Las Vegas", "fields without affixes keep their value");
  assert.deepEqual(emptySocialFields(shoptalk, "Local Preview"), { shoptalkDetails: "March 22–24  |  Las Vegas" }, "event facts use an event-specific key, so another event's details never carry over");
  assert.deepEqual(emptySocialFields(anyEvent, "Local Preview"), { event: "", details: "" });
  assert.deepEqual(emptySocialFields(fixture(), "Local Preview"), { name: "Local Preview", jobTitle: "" }, "prefill is unchanged");
  assert.equal(requiredSocialFieldError(eventField, ""), "Enter event name.");
  assert.equal(requiredSocialFieldError(detailsField, ""), "Enter event details.");
  assert.equal(socialDownloadFilename(anyEvent, { event: "Shoptalk", details: "March 22–24" }), "ordergroove-event-lets-meet-Shoptalk.png");
}
const invalidSession6Cases: [string, (template: SocialTemplate) => void][] = [
  ["defaultValue", t => { Object.assign(t.fields[1], { defaultValue: " " }); }],
  ["defaultValue", t => { Object.assign(t.fields[1], { defaultValue: "x".repeat(121) }); }],
  ["placeholder", t => { Object.assign(t.fields[1], { placeholder: 7 }); }],
  ["prefix", t => { Object.assign(t.fields[1], { prefix: "x".repeat(41) }); }],
  ["suffix", t => { Object.assign(t.fields[1], { suffix: "" }); }],
  ["only allowed on text", t => { t.fields.push({ ...structuredClone(EVENT_TEMPLATE_FIXTURE.fields.find(field => field.type === "date")!), key: "when", prefix: "On " } as SocialTemplate["fields"][number]); }],
  ["not both", t => { Object.assign(t.fields[0], { defaultValue: "Sam" }); }],
];
for (const [message, mutate] of invalidSession6Cases) {
  const template = fixture(); mutate(template);
  assert.ok(validateSocialTemplates([template], SOCIAL_ASSETS, true).some(error => error.includes(message)), message);
  template.developmentOnly = false; template.sourceUrl = "https://figma.com/design/example";
  PUBLISHED_SOCIAL_TEMPLATES.push(template);
  assert.ok(runBuildGuard().some(error => error.includes(message)), `build guard: ${message}`);
  PUBLISHED_SOCIAL_TEMPLATES.pop();
}
{
  const template = fixture();
  Object.assign(template.fields[1], { defaultValue: "Engineer", placeholder: "Your title", prefix: "Role: ", suffix: "." });
  assert.deepEqual(validateSocialTemplates([template], SOCIAL_ASSETS, true), []);
}
console.log("PASS: Event Attendance templates, text defaults, placeholders and affixes, including build guard");
{
  const rules = { ...getPublishedSocialTemplate("event-lets-meet")!.fields[1], minFontSize: 10, maxFontSize: 10, lineHeight: 1, height: 1000, maxLines: 3 };
  const measure = paintContext as unknown as CanvasRenderingContext2D;
  assert.deepEqual(layoutSocialText(measure, " March   |   Vegas ", { ...rules, width: 1000 })?.lines, ["March   |   Vegas"], "typed spacing survives on one line");
  assert.deepEqual(layoutSocialText(measure, "a\t|  b", { ...rules, width: 1000 })?.lines, ["a |  b"], "other whitespace draws as spaces");
  assert.deepEqual(layoutSocialText(measure, "a   |   b", { ...rules, width: 3 })?.lines, ["a", "|", "b"], "a line break drops the spacing");
}
console.log("PASS: text layout keeps typed spacing between words and drops it at line breaks");

// Groovy Awards: four Figma options with cut-out photos, text stacks, tracking, uppercase and a preview-only sample.
{
  const groovy = PUBLISHED_SOCIAL_TEMPLATES.filter(template => template.category === "Groovy Awards");
  assert.deepEqual(groovy.map(template => [template.id, template.width, template.height]), [
    ["groovy-award-gradient-landscape", 1200, 627], ["groovy-award-midnight-tag-landscape", 1200, 627],
    ["groovy-award-gradient-square", 800, 800], ["groovy-award-midnight-tag-square", 800, 800],
  ]);
  for (const template of groovy) {
    assert.deepEqual(validateSocialTemplates([template], SOCIAL_ASSETS), [], template.id);
    assert.deepEqual(template.fields.map(field => [field.key, field.required]), [["name", true], ["jobTitle", true], ["quarter", true], ["award", true]]);
    assert.deepEqual(emptySocialFields(template, "Local Preview"), { name: "", jobTitle: "", quarter: "Q4 2026", award: "Groovy Award Winner" }, "no Google prefill: the winner may not be the editor");
    assert.deepEqual(template.sample, { photoAssetId: "groovy-award-sample-portrait", fields: { name: "Groovy Guy", jobTitle: "Senior Account Manager" } }, "fictional sample only");
    assert.ok(template.lockedLayers[0].belowPhoto && !template.lockedLayers[1].belowPhoto, "gradient backdrop under the photo, artwork over it");
    assert.ok(template.photo?.required && template.photo.opaqueClip, "photo required, with a panel for opaque photos");
    assert.ok(/node-id=80-(617|837|1055|1122)$/.test(template.sourceUrl));
    assert.equal(socialDownloadFilename(template, { name: "Groovy Guy", quarter: "Q4 2026" }), `ordergroove-${template.id}-Groovy-Guy.png`, "file name uses the winner's name");
  }
  const [landscape] = groovy;
  const cutout = socialPhotoFrame(landscape.photo!, { hasTransparency: true });
  const opaque = socialPhotoFrame(landscape.photo!, { hasTransparency: false });
  assert.deepEqual([cutout.x, cutout.y, cutout.width, cutout.height, cutout.radii], [525.03, 0, 674.97, 627, undefined], "transparent photos use the full cut-out frame");
  assert.deepEqual([opaque.x, opaque.y, opaque.width, opaque.height, opaque.radii, opaque.shape], [600, 97.3, 600, 529.7, [30, 0, 0, 0], "rect"], "opaque photos fill the rounded panel");
  assert.deepEqual(socialPhotoFrame(landscape.photo!, null).radii, [30, 0, 0, 0], "the empty placeholder uses the panel");
  assert.equal(socialPhotoFrame(getPublishedSocialTemplate("new-employee-badge")!.photo!, null).shape, "ellipse", "frames without opaqueClip are unchanged");
  const moved = dragSocialCrop({ x: 0.5, y: 0.5, zoom: 2 }, { width: 1600, height: 1200 }, opaque, 30, 0);
  assert.ok(moved.x < 0.5, "dragging an opaque photo uses the panel geometry");
}
const invalidGroovyCases: [string, (template: SocialTemplate) => void][] = [
  ["letterSpacing", t => { t.fields[0].letterSpacing = 0.6; }],
  ["letterSpacing", t => { Object.assign(t.fields[0], { letterSpacing: "-1%" }); }],
  ["textTransform", t => { Object.assign(t.fields[0], { textTransform: "capitalize" }); }],
  ["belowPhoto", t => { Object.assign(t.lockedLayers[0], { belowPhoto: "yes" }); }],
  ["opaqueClip", t => { t.photo!.opaqueClip = { x: 0, y: 0, width: 100, height: 100, radii: [60, 0, 0, 0] }; }],
  ["opaqueClip", t => { t.photo!.opaqueClip = { x: 1100, y: 0, width: 200, height: 100, radii: [0, 0, 0, 0] }; }],
  ["unknown text stack", t => { t.fields[0].stack = "missing"; }],
  ["shorter than its fields", t => { t.textStacks = [{ id: "card", x: 620, y: 350, width: 500, height: 300, gap: 10, verticalAlign: "center" }]; t.fields.forEach(field => { field.stack = "card"; field.y = 350; }); }],
  ["start at its text stack's top", t => { t.textStacks = [{ id: "card", x: 620, y: 300, width: 500, height: 600, gap: 10, verticalAlign: "top" }]; t.fields[0].stack = "card"; }],
  ["has no fields", t => { t.textStacks = [{ id: "card", x: 620, y: 300, width: 500, height: 600, gap: 10, verticalAlign: "top" }]; }],
  ["top, center or bottom", t => { t.textStacks = [{ id: "card", x: 620, y: 350, width: 500, height: 600, gap: -1, verticalAlign: "top" }]; t.fields[0].stack = "card"; }],
  ["sample jobTitle must match a required text field", t => { t.sample = { fields: { jobTitle: "Engineer" } }; }],
  ["sample name must be nonempty", t => { t.sample = { fields: { name: " " } }; }],
  ["sample photo", t => { t.sample = { photoAssetId: "missing", fields: {} }; }],
  ["sample photo", t => { delete t.photo; t.sample = { photoAssetId: "groovy-award-sample-portrait", fields: {} }; }],
];
for (const [message, mutate] of invalidGroovyCases) {
  const template = fixture(); mutate(template);
  assert.ok(validateSocialTemplates([template], SOCIAL_ASSETS, true).some(error => error.includes(message)), message);
  template.developmentOnly = false; template.sourceUrl = "https://figma.com/design/example";
  PUBLISHED_SOCIAL_TEMPLATES.push(template);
  assert.ok(runBuildGuard().some(error => error.includes(message)), `build guard: ${message}`);
  PUBLISHED_SOCIAL_TEMPLATES.pop();
}
console.log("PASS: 4 Groovy Award designs with fictional samples, cut-out and opaque photo frames, and stack, tracking, uppercase, backdrop and sample guards, including build guard");
{
  // Rendering: stacks move neighbours, uppercase applies, samples draw only in the editor preview, backdrops paint first.
  const ops: string[] = [];
  const texts: { text: string; y: number; spacing: string }[] = [];
  const ctx2 = {
    font: "", fillStyle: "", globalAlpha: 1, letterSpacing: "0px", textAlign: "left", textBaseline: "alphabetic",
    save() {}, restore() {}, beginPath() {}, rect() {}, roundRect() { ops.push("roundRect"); }, ellipse() {}, clip() {}, fill() {},
    fillRect() { ops.push("fillRect"); },
    drawImage(image: { id: string }) { ops.push(`image:${image.id}`); },
    fillText(text: string, _x: number, y: number) { texts.push({ text, y, spacing: this.letterSpacing }); },
    measureText(value: string) { return { width: value.length * Number(this.font.split(" ")[1].replace("px", "")) * 0.5, actualBoundingBoxAscent: 10, actualBoundingBoxDescent: 2 }; },
  };
  const canvas = () => ({ width: 0, height: 0, getContext: () => ctx2 }) as unknown as HTMLCanvasElement;
  const prior = Object.getOwnPropertyDescriptor(globalThis, "document");
  Object.defineProperty(globalThis, "document", { configurable: true, value: { createElement: canvas } });
  try {
    const template = getPublishedSocialTemplate("groovy-award-midnight-tag-landscape")!;
    const assets = Object.fromEntries([...template.assetIds, "groovy-award-sample-portrait"].map(id => [id, { id, naturalWidth: 1350, naturalHeight: 1254 }])) as unknown as Record<string, HTMLImageElement>;
    const resources = { fontsLoaded: true as const, assets };
    const inputs = (fields: Record<string, string>) => ({ fields: { name: "", jobTitle: "", quarter: "q4 2026", award: "Groovy Award Winner", ...fields }, variantId: template.variants[0].id, crop: { x: 0.5, y: 0.5, zoom: 1 } });
    const errors = drawSocialGraphic(canvas(), template, inputs({}), resources, null, { sample: true });
    assert.deepEqual(Object.keys(errors).sort(), ["jobTitle", "name"], "sample values still block download");
    // The last drawImage copies the detached surface to the target canvas.
    assert.deepEqual(ops.filter(op => op.startsWith("image:groovy")), ["image:groovy-award-midnight-tag-landscape-backdrop", "image:groovy-award-sample-portrait", "image:groovy-award-midnight-tag-landscape"]);
    assert.deepEqual(texts.slice(0, 3).map(item => item.text), ["Groovy Guy", "Senior Account Manager", "Q4 2026"], "sample text drawn, quarter uppercased");
    assert.equal(texts.slice(3).map(item => item.text).join(" "), "Groovy Award Winner");
    assert.equal(texts[0].spacing, `${-0.01 * 35}px`, "name tracking follows Figma's -1%");
    ops.length = 0; texts.length = 0;
    drawSocialGraphic(canvas(), template, inputs({}), resources, null);
    assert.ok(!ops.includes("image:groovy-award-sample-portrait") && !texts.some(item => item.text === "Groovy Guy"), "export path never draws the sample");
    assert.ok(ops.includes("roundRect"), "the empty placeholder takes the rounded panel");
    texts.length = 0;
    drawSocialGraphic(canvas(), template, inputs({ name: "Sam Lee", jobTitle: "Engineer" }), resources, null);
    const shortName = texts.find(item => item.text === "Sam Lee")!.y;
    texts.length = 0;
    drawSocialGraphic(canvas(), template, inputs({ name: "Alexandra Montgomery Fitzgerald Okonkwo", jobTitle: "Engineer" }), resources, null);
    const names = texts.slice(0, texts.findIndex(item => item.text === "Engineer"));
    const title = texts.find(item => item.text === "Engineer")!.y;
    assert.equal(names.length, 2, "a long name wraps to 2 lines");
    assert.ok(names[0].y < shortName, "the centered stack moves up for a 2-line name");
    assert.ok(title > names[1].y, "the job title moves below the second name line instead of overlapping it");
  } finally {
    if (prior) Object.defineProperty(globalThis, "document", prior);
    else Reflect.deleteProperty(globalThis, "document");
  }
}
console.log("PASS: Groovy Award rendering keeps samples out of export, paints the backdrop under the photo, stacks wrapped text without overlap and applies tracking and uppercase");

// Bonus: in-browser background removal helpers (the browser run covers the model itself).
import { confidenceToAlpha, guidedMask } from "../src/lib/social-background";
{
  assert.equal(confidenceToAlpha(0), 0);
  assert.equal(confidenceToAlpha(0.35), 0);
  assert.equal(confidenceToAlpha(0.55), 128);
  assert.equal(confidenceToAlpha(0.75), 255);
  assert.equal(confidenceToAlpha(1), 255);
  for (let c = 0; c < 1; c += 0.05) assert.ok(confidenceToAlpha(c + 0.05) >= confidenceToAlpha(c), "alpha never decreases as confidence rises");
  // A blurry mask edge snaps to a sharp edge in the photo: left half dark, right half light.
  const width = 40, height = 8;
  const guide = new Float32Array(width * height), coarse = new Float32Array(width * height);
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) {
    guide[y * width + x] = x < 20 ? 0.1 : 0.9;
    coarse[y * width + x] = Math.min(1, Math.max(0, (x - 12) / 16));
  }
  const refined = guidedMask(guide, coarse, width, height, 4);
  const row = (values: Float32Array, x: number) => values[4 * width + x];
  assert.ok(row(refined, 17) < row(coarse, 17) && row(refined, 22) > row(coarse, 22), "refinement sharpens toward the photo's edge");
  assert.ok(Math.abs(row(refined, 2)) < 0.05 && Math.abs(row(refined, 37) - 1) < 0.05, "flat areas keep their mask value");
  // Static guard: the runtime and model are self-hosted, never fetched from a CDN.
  const source = (await import("node:fs")).readFileSync(path.resolve("src/lib/social-background.ts"), "utf8");
  assert.ok(!/https?:\/\//.test(source) && source.includes("BASE_URL"), "background removal loads only from this site");
  for (const file of ["mediapipe/selfie_segmenter.tflite", "mediapipe/wasm/vision_wasm_internal.wasm", "mediapipe/wasm/vision_wasm_internal.js", "mediapipe/LICENSE.txt"]) assert.ok((await import("node:fs")).existsSync(path.resolve("public", file)), file);
}
console.log("PASS: background removal alpha ramp, guided edge refinement and self-hosted runtime");
