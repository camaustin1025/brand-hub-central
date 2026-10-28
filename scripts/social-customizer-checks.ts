import assert from "node:assert/strict";
import { safeReturnPath } from "../src/lib/auth-return-path";
import { SOCIAL_TEMPLATE_FIXTURE, EVENT_TEMPLATE_FIXTURE, SOCIAL_FIXTURE_ASSETS } from "../src/data/social-template-fixture";
import { PUBLISHED_SOCIAL_TEMPLATES, SOCIAL_ASSETS, getPublishedSocialTemplate, publishedSocialTemplates, type SocialTemplate } from "../src/data/social-templates";
import { validateSocialTemplates } from "../src/lib/social-template-validation";
import { layoutSocialText, photoSourceRect, socialDownloadFilename } from "../src/lib/social-renderer";
import { socialTemplateBuildErrors } from "./validate-social-templates";
import path from "node:path";

const origin = "https://hub.example";
for (const value of ["/", "/toolkit/social/new-hire", "/voice?find=two%20words#rules"]) assert.equal(safeReturnPath(value, origin), value);
for (const value of [undefined, null, "", "https://evil.example", "https://hub.example/voice", "//evil.example", "///evil.example", "\\evil.example", "/\\evil.example", "/%5cevil.example", "/%2f%2fevil.example", "/.%2f/evil.example", "/x/..//evil.example", "/bad%", "/%00", "/\n/evil.example"]) assert.equal(safeReturnPath(value, origin), "/", String(value));
console.log("PASS: internal return paths and adversarial redirect inputs");

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
PUBLISHED_SOCIAL_TEMPLATES.push(listFirst, fixture(), { ...listFirst, id: "retired", status: "retired" }, listSecond);
assert.deepEqual(publishedSocialTemplates().map(template => template.id), ["list-first", "list-second"]);
PUBLISHED_SOCIAL_TEMPLATES.splice(0);
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
