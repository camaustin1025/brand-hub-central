import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import glyphData from "../src/data/icon-glyphs.json";
import manifest from "./icon-library/manifest.json";
import { ICON_COLORS } from "../src/data/brand-resources";
import {
  ICON_CATEGORY_COUNT, ICON_CATEGORY_NAMES, ICON_COUNT, ICON_TREATMENTS, MIDNIGHT, WHITE,
  iconFilename, iconZipFilename, matchesIconQuery,
  type IconLibraryData, type IconStyle, type IconSurface,
} from "../src/data/icon-library";
import { buildIconSvg, buildIconZip, buildZip, crc32 } from "../src/lib/icon-render";
import { HUB_SEARCH_ITEMS, searchHub } from "../src/lib/hub-search";
import { HUB_NAV, ICON_LIBRARY_NAV_ID, ICON_LIBRARY_PATH, RESOURCE_PAGE_PATHS } from "../src/data/hub";

const data = glyphData as IconLibraryData;
const icons = data.categories.flatMap((category) => category.icons.map((icon) => ({ icon, category })));

assert.equal(data.categories.length, ICON_CATEGORY_COUNT);
assert.equal(icons.length, ICON_COUNT);
assert.equal(new Set(icons.map(({ icon }) => icon.name)).size, ICON_COUNT, "Icon names must be unique");
assert.deepEqual(data.categories.map((category) => category.name), manifest.categories.map((category) => category.name));
data.categories.forEach((category, index) => assert.deepEqual(category.icons.map((icon) => icon.name), manifest.categories[index].icons, "Order differs from Figma: " + category.name));
for (const { icon } of icons) {
  assert.match(icon.d, /^M[\d.]/, icon.name + " must start with an absolute moveto");
  assert.match(icon.d, /^[MmLlHhVvCcSsQqTtZz\d.\s-]+$/, icon.name + " has unexpected path characters");
  const numbers = icon.d.match(/-?(?:\d+\.?\d*|\.\d+)/g)?.map(Number) ?? [];
  assert(numbers.length > 2 && numbers.every(Number.isFinite), icon.name + " has invalid numbers");
}
console.log(`PASS: ${ICON_COUNT} glyphs in ${ICON_CATEGORY_COUNT} categories match the Figma manifest and parse cleanly`);

assert.equal(ICON_COLORS.light.length, 4);
assert.equal(ICON_COLORS.dark.length, 5);
const credit = icons.find(({ icon }) => icon.name === "credit_card")!.icon;
let combinations = 0;
for (const surface of ["light", "dark"] as IconSurface[]) {
  for (const color of ICON_COLORS[surface]) {
    for (const { id: treatment } of ICON_TREATMENTS) {
      const style: IconStyle = { surface, color, treatment };
      const svg = buildIconSvg(credit, style);
      combinations++;
      assert(svg.startsWith('<svg xmlns="http://www.w3.org/2000/svg"'));
      assert.equal(svg.match(/<path/g)?.length, 1);
      assert(!svg.includes("<script"));
      if (treatment === "plain") {
        assert(svg.includes('viewBox="0 0 48 48"') && svg.includes('width="48"'));
        assert(svg.includes(`fill="${color.hex}"`) && !svg.includes("<circle"));
      } else {
        assert(svg.includes('viewBox="0 0 80 80"') && svg.includes('width="80"'));
        assert(svg.includes('transform="translate(16 16)"'));
        assert(svg.includes(`<circle cx="40" cy="40" r="40" fill="${color.hex}"`));
      }
      if (treatment === "tinted") assert(svg.includes('fill-opacity="0.12"') && svg.includes(`<path transform="translate(16 16)" fill="${color.hex}"`));
      if (treatment === "solid") assert(svg.includes(`<path transform="translate(16 16)" fill="${surface === "light" ? WHITE : MIDNIGHT}"`), "Solid ink rule broken for " + color.name);
      assert(buildIconSvg(credit, style, 512).includes('width="512" height="512"'));
      assert.match(iconFilename("credit_card", style, "png"), /^og-icon_credit_card_(light|dark)_[a-z-]+_(plain|tinted|solid)\.png$/);
    }
  }
}
assert.equal(combinations, 27);
assert.equal(iconFilename("credit_card", { surface: "light", color: ICON_COLORS.light[2], treatment: "tinted" }, "svg"), "og-icon_credit_card_light_brand-green_tinted.svg");
assert.equal(iconZipFilename(data.categories[1].id, { surface: "dark", color: ICON_COLORS.dark[0], treatment: "solid" }, "png"), "ordergroove-icons_orders-shipping_dark_groovy-green_solid_png.zip");
console.log("PASS: all 27 color and treatment combinations follow the Figma tile spec, including Solid ink");

assert.deepEqual(ICON_CATEGORY_NAMES, data.categories.map((category) => category.name), "ICON_CATEGORY_NAMES drifted from icon-glyphs.json");
for (const query of ["icons", "icon download", "truck icon", "download icons png"]) {
  assert(searchHub(query).some((item) => item.id === "icon-library"), "Hub search misses the icon library for: " + query);
}
assert.equal(searchHub("icon library")[0]?.id, "icon-library");
const librarySearchItems = HUB_SEARCH_ITEMS.filter((item) => item.id === ICON_LIBRARY_NAV_ID);
assert.equal(librarySearchItems.length, 1, "Search must list the icon library once");
assert.equal(librarySearchItems[0].path, ICON_LIBRARY_PATH, "Search must open the icon library page");
assert(HUB_NAV.some((group) => group.items.some((item) => item.id === ICON_LIBRARY_NAV_ID && item.path === ICON_LIBRARY_PATH)), "Icon library page is missing from the sidebar");
assert.equal(RESOURCE_PAGE_PATHS[ICON_LIBRARY_NAV_ID], ICON_LIBRARY_PATH, "Old /#icon-library links must redirect to the page");
assert(fs.readFileSync(path.resolve("public/llms.txt"), "utf8").includes(`(${ICON_LIBRARY_PATH})`), "llms.txt must link the icon library page");
const journal = JSON.parse(fs.readFileSync(path.resolve("drizzle/migrations/meta/_journal.json"), "utf8")) as { entries: { idx: number; tag: string; when: number }[] };
const entry = journal.entries.find((item) => item.tag === "0004_asset_download_events");
assert(entry && entry.idx === 4 && entry.when > journal.entries[3].when, "Download-tracking migration is missing from the drizzle journal");
const migration = fs.readFileSync(path.resolve("drizzle/migrations/0004_asset_download_events.sql"), "utf8");
assert(migration.includes("ENABLE ROW LEVEL SECURITY") && migration.includes("WITH CHECK (user_id = auth.uid())") && !/GRANT SELECT/i.test(migration), "Download events must be insert-only and owner-checked");
console.log("PASS: icon library has its own page in the sidebar and search, old links redirect, category names are in sync, and the insert-only tracking migration is journaled");

const search = (query: string) => icons.filter(({ icon, category }) => matchesIconQuery(icon, category, query)).map(({ icon }) => icon.name);
assert(search("card").includes("credit_card") && search("card").includes("add_card"));
assert(search("heart").includes("favorite"));
assert(search("shipping").includes("local_shipping"));
assert(search("email").includes("mail"));
assert.equal(search("").length, ICON_COUNT);
assert.equal(search("zzzz-no-icon").length, 0);
console.log("PASS: icon search matches names, categories and aliases");

assert.equal(crc32(new TextEncoder().encode("The quick brown fox jumps over the lazy dog")), 0x414fa339);
const license = fs.readFileSync(path.resolve("public/icon-guidance/LICENSE.txt"), "utf8");
assert(license.includes("Apache License"));
const style: IconStyle = { surface: "light", color: ICON_COLORS.light[2], treatment: "tinted" };
const zip = new Uint8Array(await (await buildIconZip(data.categories.slice(0, 2), style, "svg", license)).arrayBuffer());
assert.equal(Buffer.from(zip.subarray(0, 4)).toString("hex"), "504b0304");
const dir = fs.mkdtempSync(path.join(os.tmpdir(), "og-icons-"));
const zipPath = path.join(dir, "icons.zip");
fs.writeFileSync(zipPath, zip);
fs.writeFileSync(path.join(dir, "empty.zip"), buildZip([]));
try {
  execFileSync("unzip", ["-tq", zipPath], { stdio: "pipe" });
  const listing = execFileSync("unzip", ["-Z1", zipPath], { encoding: "utf8" }).trim().split("\n");
  assert.equal(listing.length, data.categories[0].icons.length + data.categories[1].icons.length + 2);
  assert(listing.includes("LICENSE.txt") && listing.includes("NOTICE.txt"));
  assert(!listing.some((entry) => entry.startsWith("Payments & Pricing/")), "ZIP must contain only the requested categories");
  assert(listing.includes("Subscriptions & Renewals/og-icon_autorenew_light_brand-green_tinted.svg"));
  const extracted = execFileSync("unzip", ["-p", zipPath, "Orders & Shipping/og-icon_local_shipping_light_brand-green_tinted.svg"], { encoding: "utf8" });
  assert.equal(extracted, buildIconSvg(data.categories[1].icons[0], style));
  console.log("PASS: icon ZIPs pass unzip -t, keep category folders, and include LICENSE.txt and NOTICE.txt");
} catch (error) {
  if ((error as NodeJS.ErrnoException).code === "ENOENT") console.log("SKIP: unzip is not installed; ZIP structure not verified");
  else throw error;
} finally {
  fs.rmSync(dir, { recursive: true, force: true });
}
