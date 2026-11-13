import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ASSETS, availableAssets, assetAnchor, getAsset, getAssetFile, isAssetAvailable } from "../src/data/assets";
import { HUB_SEARCH_ITEMS, searchHub } from "../src/lib/hub-search";
import { HUB_NAV } from "../src/data/hub";
import { AI_DIRECTORY, CATEGORIES, RESOURCE_TYPES, WORKFLOWS, countByType, filterResources, groupResources } from "../src/data/ai-directory";

const available = availableAssets();
assert.equal(new Set(ASSETS.map((asset) => asset.id)).size, ASSETS.length);
assert.equal(isAssetAvailable({ ...getAsset("logo-light"), employeeHold: "Under review" }), false);
assert.equal(isAssetAvailable({ ...getAsset("logo-light"), files: [] }), false);
assert.equal(isAssetAvailable({ ...getAsset("logo-light"), section: "tokens" }), false);
for (const id of ["tokens-json", "tokens-css", "social-linkedin"]) {
  assert(!available.some((asset) => asset.id === id), "Unavailable asset leaked: " + id);
  assert(!HUB_SEARCH_ITEMS.some((item) => item.id === assetAnchor(id)), "Unavailable search result: " + id);
}
assert.throws(() => getAssetFile("logo-dark", "EPS"));
assert.equal(getAssetFile("logo-dark", "SVG").href, "/working-canvas/logo-dark-bg.svg");
assert.equal(getAssetFile("logo-light", "SVG").href, "/working-canvas/logo-light-bg.svg");
assert.throws(() => getAssetFile("tokens-json", "JSON"));
console.log("PASS: asset review holds, section holds, and missing-format guards");

for (const asset of available) {
  assert(HUB_SEARCH_ITEMS.some((item) => item.id === assetAnchor(asset.id)), "Asset is not searchable: " + asset.id);
  for (const file of asset.files) {
    assert(file.href.startsWith("/") && !file.href.includes(".."));
    const bytes = fs.readFileSync(path.resolve("public", file.href.slice(1)));
    assert(bytes.length > 0, "Empty download: " + file.href);
    if (file.format === "PNG") assert.equal(bytes.subarray(0, 8).toString("hex"), "89504e470d0a1a0a");
    if (file.format === "SVG") { assert(bytes.toString().includes("<svg")); assert(!bytes.toString().includes("<script")); }
    if (file.format === "ZIP") assert.equal(bytes.subarray(0, 4).toString("hex"), "504b0304");
    if (file.format === "TTF") assert.equal(bytes.subarray(0, 4).toString("hex"), "00010000");
  }
}
assert.equal(getAssetFile("font-kit", "ZIP").href, "/fonts/Figtree-font-kit.zip");
console.log("PASS: every released asset is indexed and every format has a real file of the advertised type");

assert.equal(searchHub("logo for white background")[0]?.id, "asset-logo-light");
assert.equal(searchHub("Figtree")[0]?.id, "asset-font-kit");
assert.equal(searchHub("Zoom")[0]?.id, "zoom-backgrounds");
assert.equal(searchHub("Zoom")[0]?.path, "/zoom-backgrounds");
assert.equal(HUB_SEARCH_ITEMS.find((item) => item.id === "asset-zoom-bg")?.path, "/zoom-backgrounds#asset-zoom-bg");
assert.equal(HUB_SEARCH_ITEMS.find((item) => item.id === "asset-font-kit")?.path, undefined);
assert.equal(HUB_SEARCH_ITEMS.find((item) => item.id === "asset-brand-gradient")?.path, "/#color");
const vectors = searchHub("SVG");
assert(vectors.some((item) => item.id === "asset-logo-dark"));
assert(vectors.some((item) => item.id === "asset-logo-light"));
assert(vectors.some((item) => item.id === "asset-icon-examples"));
assert(vectors.every((item) => item.kind === "Asset"));
assert(searchHub("new employee").some((item) => item.kind === "Template" && item.path?.startsWith("/design-canvas/")));
assert.equal(searchHub("???").length, 0);
assert.equal(searchHub("for the").length, 0);
console.log("PASS: natural-language logo selection, Figtree, Zoom, SVG, templates, and empty search");

// Asset lookups in page components must resolve before the app can render.
for (const file of ["src/components/hub/WorkingCanvasHero.tsx", "src/components/brand/GradientDetails.tsx"]) {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/(?:getAsset|findAssetFile)\("([^"]+)"/g)) getAsset(match[1]);
}
assert.equal(ASSETS.filter((asset) => asset.type === "background").length, 6);
console.log("PASS: homepage asset references resolve and Zoom collection has six backgrounds");

// AI resources: grouped sections must cover every resource exactly once, workflows hold their steps in order,
// and the team filter narrows skills without hiding resources that belong to everyone.
{
  const sections = groupResources(AI_DIRECTORY);
  const shown = sections.flatMap((s) => s.entries.flatMap((e) => (e.kind === "resource" ? [e.resource.id] : e.steps.map((r) => r.id))));
  assert.equal(shown.length, AI_DIRECTORY.length, "Every AI resource appears once in the grouped list");
  assert.equal(new Set(shown).size, shown.length);
  assert.equal(sections.reduce((sum, s) => sum + s.count, 0), AI_DIRECTORY.length);
  assert.equal(sections[0].label.startsWith("Skills"), true, "Skills lead the directory");
  const counts = countByType(AI_DIRECTORY);
  assert.equal(RESOURCE_TYPES.reduce((sum, t) => sum + counts[t], 0), AI_DIRECTORY.length);
  for (const w of WORKFLOWS) {
    const entry = sections.flatMap((s) => s.entries).find((e) => e.kind === "workflow" && e.id === w.id);
    assert(entry && entry.kind === "workflow", "Workflow row missing: " + w.id);
    assert.deepEqual(entry.steps.map((r) => r.id), w.steps, "Workflow steps out of order: " + w.id);
  }
  const team = AI_DIRECTORY.find((r) => r.team)!.team!;
  const forTeam = filterResources(AI_DIRECTORY, "", "", team);
  assert(forTeam.every((r) => !r.team || r.team === team), "Team filter leaked another team's skills");
  assert.equal(forTeam.filter((r) => !r.team).length, AI_DIRECTORY.filter((r) => !r.team).length, "Team filter hid shared resources");
  const recap = groupResources(filterResources(AI_DIRECTORY, "recap", "", "")).flatMap((s) => s.entries);
  assert(recap.some((e) => e.kind === "workflow" && e.steps.length === 1 && e.steps[0].id === "sbr-recap"), "Search for one step shows it inside its workflow");
}
console.log("PASS: AI resources group by type, roll SBR into one workflow row, and scope the team filter to skills");

// AI resources category card: "All" holds the whole directory, the type categories add back up to it,
// the team categories add up to every skill, and every skill row links straight to its skill page.
{
  const count = (id: string) => { const c = CATEGORIES.find((x) => x.id === id)!; return filterResources(AI_DIRECTORY, "", c.type, c.team).length; };
  assert.equal(count("all"), AI_DIRECTORY.length);
  assert.equal(CATEGORIES.filter((c) => c.type && !c.team).reduce((sum, c) => sum + count(c.id), 0), AI_DIRECTORY.length, "Type categories cover the directory");
  assert.equal(CATEGORIES.filter((c) => c.nested).reduce((sum, c) => sum + count(c.id), 0), count("skills"), "Team categories cover every skill");
  for (const r of AI_DIRECTORY.filter((x) => x.type === "Skills" && x.source !== "Org plugin")) {
    assert(r.url?.startsWith("https://claude.ai/customize/skills/id/plugin_") && !r.catalog, "Skill should link straight to its page: " + r.id);
  }
  const page = fs.readFileSync("src/components/brand/AiResources.tsx", "utf8");
  assert(page.includes("<AiCategoriesDirectory />") && !page.includes("ai-directory-options"), "AI Resources renders the category directory, with no layout options left");
}
console.log("PASS: AI resources categories cover the directory and every skill links to its page");

// Hidden WIP pages (Team & culture, New employees): their nav data stays, but the sidebar, search and Home never offer them.
{
  const items = HUB_NAV.flatMap((group) => group.items);
  for (const id of ["team-culture", "new-employee-resources"]) {
    const item = items.find((entry) => entry.id === id);
    assert(item && item.wip && item.hiddenInNav && item.path, "WIP page entry kept and hidden: " + id);
    assert(!HUB_SEARCH_ITEMS.some((result) => result.id === id), "Hidden WIP page is searchable: " + id);
  }
  for (const query of ["team culture", "new employees onboarding", "org chart directory", "first week"]) {
    assert(!searchHub(query).some((result) => result.id === "team-culture" || result.id === "new-employee-resources"), "Search surfaced a hidden WIP page for: " + query);
  }
  assert(!HUB_SEARCH_ITEMS.some((result) => result.hiddenInNav || result.disabled), "Search lists a hidden or disabled section");
  assert(!fs.readFileSync("src/components/hub/HubSearch.tsx", "utf8").includes("⌘K"), "The search bar no longer draws a shortcut hint");
}
console.log("PASS: hidden WIP pages stay out of the sidebar data and search, and the search bar has no shortcut hint");
