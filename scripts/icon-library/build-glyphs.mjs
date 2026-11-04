#!/usr/bin/env node
/**
 * Rebuilds src/data/icon-glyphs.json from the Figma icon manifest.
 *
 * Usage:
 *   node scripts/icon-library/build-glyphs.mjs <google-svg-dir> <figma-svg-dir>
 *
 * <google-svg-dir> holds Material Symbols Rounded SVGs named <icon>.svg, from
 *   https://fonts.gstatic.com/s/i/short-term/release/materialsymbolsrounded/<icon>/default/48px.svg
 * <figma-svg-dir> holds SVG exports of the icons listed in manifest.figmaExports,
 *   whose Figma artwork differs from Google's current release. Figma always wins.
 *
 * Every glyph is stored once, as a single path in a 48 x 48 box. Colors and tile
 * treatments are applied in the browser (src/lib/icon-render.ts).
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const [googleDir, figmaDir] = process.argv.slice(2);
if (!googleDir || !figmaDir) {
  console.error("Usage: node scripts/icon-library/build-glyphs.mjs <google-svg-dir> <figma-svg-dir>");
  process.exit(1);
}

const manifest = JSON.parse(fs.readFileSync(path.join(here, "manifest.json"), "utf8"));
const figmaOnly = manifest.figmaExports.icons;

const ARG_COUNT = { m: 2, l: 2, h: 1, v: 1, c: 6, s: 4, q: 4, t: 2, a: 7, z: 0 };
const TOKEN = /[a-zA-Z]|[-+]?(?:\d+\.?\d*|\.\d+)(?:[eE][-+]?\d+)?/g;

function format(value) {
  const rounded = Math.round(value * 1000) / 1000;
  return String(Object.is(rounded, -0) ? 0 : rounded);
}

/** Scales a path by k and shifts absolute y coordinates by dy before scaling. */
function transformPath(d, k, dy) {
  const tokens = d.match(TOKEN) ?? [];
  const out = [];
  let command = null;
  let i = 0;
  let first = true;
  while (i < tokens.length) {
    if (/^[a-zA-Z]$/.test(tokens[i])) {
      command = tokens[i++];
      if (!(command.toLowerCase() in ARG_COUNT)) throw new Error("Unsupported path command " + command);
      // A leading relative moveto is absolute (SVG spec). Its implicit pairs stay relative linetos.
      if (first && command === "m") {
        command = "M";
        out.push("M");
        const args = tokens.slice(i, i + 2).map(Number);
        if (args.length !== 2 || args.some(Number.isNaN)) throw new Error("Incomplete arguments for m");
        i += 2;
        out.push([args[0] * k, (args[1] + dy) * k].map(format).join(" "));
        first = false;
        if (i < tokens.length && !/^[a-zA-Z]$/.test(tokens[i])) { command = "l"; out.push("l"); }
        continue;
      }
      out.push(command);
      if (command.toLowerCase() === "z") continue;
    }
    first = false;
    if (!command || command.toLowerCase() === "z") throw new Error("Path data without a command near token " + i);
    const lower = command.toLowerCase();
    const absolute = command !== lower;
    const count = ARG_COUNT[lower];
    const args = tokens.slice(i, i + count).map(Number);
    if (args.length !== count || args.some(Number.isNaN)) throw new Error("Incomplete arguments for " + command);
    i += count;
    const mapped = args.map((value, index) => {
      if (lower === "a") {
        if (index < 2) return value * k;
        if (index < 5) return value;
        return index === 5 ? value * k : (absolute ? (value + dy) * k : value * k);
      }
      const isY = lower === "v" || (lower !== "h" && index % 2 === 1);
      return isY && absolute ? (value + dy) * k : value * k;
    });
    out.push(mapped.map(format).join(" "));
  }
  return out.join(" ").replace(/([a-zA-Z]) /g, "$1").replace(/ -/g, "-");
}

function readGoogle(name) {
  const svg = fs.readFileSync(path.join(googleDir, name + ".svg"), "utf8");
  if (!svg.includes('viewBox="0 -960 960 960"')) throw new Error(name + ": unexpected Google viewBox");
  const paths = [...svg.matchAll(/<path\b[^>]*\sd="([^"]+)"/g)];
  if (paths.length !== 1) throw new Error(name + ": expected one path, found " + paths.length);
  return { d: transformPath(paths[0][1], 0.05, 960) };
}

function readFigma(name) {
  const svg = fs.readFileSync(path.join(figmaDir, name + ".svg"), "utf8");
  const match = /<path\b[^>]*id="Glyph"[^>]*>/.exec(svg);
  if (!match) throw new Error(name + ": no Glyph path in the Figma export");
  const d = /\sd="([^"]+)"/.exec(match[0])[1];
  const rule = /fill-rule="([^"]+)"/.exec(match[0])?.[1];
  return rule && rule !== "nonzero" ? { d: transformPath(d, 1, 0), rule } : { d: transformPath(d, 1, 0) };
}

const seen = new Set();
const categories = manifest.categories.map((category) => ({
  id: category.id,
  name: category.name,
  icons: category.icons.map((name) => {
    if (seen.has(name)) throw new Error("Duplicate icon " + name);
    seen.add(name);
    return { name, ...(figmaOnly[name] ? readFigma(name) : readGoogle(name)) };
  }),
}));

const output = {
  source: manifest.source,
  license: "Material Symbols by Google, Apache License 2.0",
  categories,
};
const target = path.join(root, "src/data/icon-glyphs.json");
fs.writeFileSync(target, JSON.stringify(output) + "\n");
console.log(`Wrote ${seen.size} icons in ${categories.length} categories to ${path.relative(root, target)} (${fs.statSync(target).size} bytes)`);
