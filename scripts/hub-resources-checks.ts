import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { ASSETS, availableAssets, assetAnchor, getAsset, getAssetFile, isAssetAvailable } from "../src/data/assets";
import { HUB_SEARCH_ITEMS, searchHub } from "../src/lib/hub-search";

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
assert.equal(searchHub("Zoom")[0]?.id, "asset-zoom-bg");
const vectors = searchHub("SVG");
assert(vectors.some((item) => item.id === "asset-logo-dark"));
assert(vectors.some((item) => item.id === "asset-logo-light"));
assert(vectors.some((item) => item.id === "asset-icon-examples"));
assert(vectors.every((item) => item.kind === "Asset"));
assert(searchHub("new employee").some((item) => item.kind === "Template" && item.path?.startsWith("/design-canvas/")));
assert.equal(searchHub("???").length, 0);
assert.equal(searchHub("for the").length, 0);
console.log("PASS: natural-language logo selection, Figtree, Zoom, SVG, templates, and empty search");
