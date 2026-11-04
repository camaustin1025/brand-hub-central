import {
  ICON_GLYPH_SIZE, ICON_PNG_SIZE, ICON_TILE_SIZE, ICON_TINT_OPACITY,
  iconFilename, solidInk,
  type IconCategory, type IconFormat, type IconGlyph, type IconStyle,
} from "@/data/icon-library";

const SVG_NS = "http://www.w3.org/2000/svg";

function glyphPath(icon: IconGlyph, fill: string, offset = 0) {
  const rule = icon.rule ? ` fill-rule="${icon.rule}" clip-rule="${icon.rule}"` : "";
  const transform = offset ? ` transform="translate(${offset} ${offset})"` : "";
  return `<path${transform} fill="${fill}"${rule} d="${icon.d}"/>`;
}

/**
 * Builds one icon as a standalone SVG. Plain is the bare 48 px glyph. Tinted and Solid
 * are the 80 px Figma tile: a circle with the glyph centred at 60% of the tile.
 * `size` sets the rendered width and height; the artwork scales with the viewBox.
 */
export function buildIconSvg(icon: IconGlyph, style: IconStyle, size?: number) {
  const { color, treatment, surface } = style;
  if (treatment === "plain") {
    const px = size ?? ICON_GLYPH_SIZE;
    return `<svg xmlns="${SVG_NS}" width="${px}" height="${px}" viewBox="0 0 ${ICON_GLYPH_SIZE} ${ICON_GLYPH_SIZE}">${glyphPath(icon, color.hex)}</svg>`;
  }
  const px = size ?? ICON_TILE_SIZE;
  const r = ICON_TILE_SIZE / 2;
  const offset = (ICON_TILE_SIZE - ICON_GLYPH_SIZE) / 2;
  const circle = treatment === "tinted"
    ? `<circle cx="${r}" cy="${r}" r="${r}" fill="${color.hex}" fill-opacity="${ICON_TINT_OPACITY}"/>`
    : `<circle cx="${r}" cy="${r}" r="${r}" fill="${color.hex}"/>`;
  const ink = treatment === "tinted" ? color.hex : solidInk(surface);
  return `<svg xmlns="${SVG_NS}" width="${px}" height="${px}" viewBox="0 0 ${ICON_TILE_SIZE} ${ICON_TILE_SIZE}">${circle}${glyphPath(icon, ink, offset)}</svg>`;
}

/**
 * Rasterizes the SVG at 512 x 512 with a transparent background.
 * Encodes with the synchronous toDataURL: canvas.toBlob is frame-scheduled and can take
 * a full second per call in throttled or background tabs, which stalls a 293-icon ZIP.
 */
export async function renderIconPng(icon: IconGlyph, style: IconStyle, size = ICON_PNG_SIZE): Promise<Blob> {
  const url = URL.createObjectURL(new Blob([buildIconSvg(icon, style, size)], { type: "image/svg+xml" }));
  const canvas = document.createElement("canvas");
  try {
    const image = new Image(size, size);
    image.src = url;
    await image.decode();
    canvas.width = canvas.height = size;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");
    context.drawImage(image, 0, 0, size, size);
    const dataUrl = canvas.toDataURL("image/png");
    if (!dataUrl.startsWith("data:image/png;base64,")) throw new Error("PNG couldn't be created");
    const binary = atob(dataUrl.slice(dataUrl.indexOf(",") + 1));
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new Blob([bytes], { type: "image/png" });
  } finally {
    URL.revokeObjectURL(url);
    canvas.width = canvas.height = 0;
  }
}

export async function iconBlob(icon: IconGlyph, style: IconStyle, format: IconFormat): Promise<Blob> {
  return format === "svg"
    ? new Blob([buildIconSvg(icon, style)], { type: "image/svg+xml" })
    : renderIconPng(icon, style);
}

export function saveBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 30_000);
}

/* ---------- ZIP (stored, no compression; SVGs are tiny and PNGs are already compressed) ---------- */

export type ZipEntry = { path: string; data: Uint8Array<ArrayBuffer> };

const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    table[n] = c >>> 0;
  }
  return table;
})();

export function crc32(bytes: Uint8Array) {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function dosDateTime(date: Date) {
  const time = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
  const day = ((Math.max(date.getFullYear(), 1980) - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
  return { time, day };
}

/** Writes a standard ZIP archive (method 0, UTF-8 names) from in-memory files. */
export function buildZip(entries: ZipEntry[], date = new Date()): Uint8Array<ArrayBuffer> {
  const encoder = new TextEncoder();
  const { time, day } = dosDateTime(date);
  const records = entries.map((entry) => ({ name: encoder.encode(entry.path), data: entry.data, crc: crc32(entry.data) }));
  const localSize = records.reduce((sum, r) => sum + 30 + r.name.length + r.data.length, 0);
  const centralSize = records.reduce((sum, r) => sum + 46 + r.name.length, 0);
  const out = new Uint8Array(new ArrayBuffer(localSize + centralSize + 22));
  const view = new DataView(out.buffer);
  let offset = 0;
  const offsets: number[] = [];

  const header = (signature: number, central: boolean, r: (typeof records)[number]) => {
    view.setUint32(offset, signature, true); offset += 4;
    if (central) { view.setUint16(offset, 20, true); offset += 2; } // version made by
    view.setUint16(offset, 20, true); // version needed
    view.setUint16(offset + 2, 0x0800, true); // UTF-8 names
    view.setUint16(offset + 4, 0, true); // stored
    view.setUint16(offset + 6, time, true);
    view.setUint16(offset + 8, day, true);
    view.setUint32(offset + 10, r.crc, true);
    view.setUint32(offset + 14, r.data.length, true);
    view.setUint32(offset + 18, r.data.length, true);
    view.setUint16(offset + 22, r.name.length, true);
    view.setUint16(offset + 24, 0, true); // extra length
    offset += 26;
  };

  for (const r of records) {
    offsets.push(offset);
    header(0x04034b50, false, r);
    out.set(r.name, offset); offset += r.name.length;
    out.set(r.data, offset); offset += r.data.length;
  }
  const centralStart = offset;
  records.forEach((r, index) => {
    header(0x02014b50, true, r);
    view.setUint16(offset, 0, true); // comment length
    view.setUint16(offset + 2, 0, true); // disk number
    view.setUint16(offset + 4, 0, true); // internal attributes
    view.setUint32(offset + 6, 0, true); // external attributes
    view.setUint32(offset + 10, offsets[index], true);
    offset += 14;
    out.set(r.name, offset); offset += r.name.length;
  });
  view.setUint32(offset, 0x06054b50, true);
  view.setUint16(offset + 4, 0, true);
  view.setUint16(offset + 6, 0, true);
  view.setUint16(offset + 8, records.length, true);
  view.setUint16(offset + 10, records.length, true);
  view.setUint32(offset + 12, offset - centralStart, true);
  view.setUint32(offset + 16, centralStart, true);
  view.setUint16(offset + 20, 0, true);
  return out;
}

export function iconNotice(style: IconStyle) {
  return [
    "Ordergroove icon library",
    "",
    `Style: ${style.color.name} (${style.color.hex}), ${style.treatment}, for ${style.surface} backgrounds.`,
    "Source: Ordergroove Slide Skill 2.0 Figma file, Icon Library.",
    "https://www.figma.com/design/1LAizYM7R7QVubcHuix1KF/Slide-Skill-2.0?node-id=289-2635",
    "",
    "Usage: pair each icon with text that carries the meaning. Keep one color and treatment within a set.",
    "Light-set icons are for white or light backgrounds. Dark-set icons are for non-white backgrounds.",
    "",
    "Glyphs: Google Material Symbols Rounded, used under the Apache License 2.0 (see LICENSE.txt).",
    "https://github.com/google/material-design-icons",
    "",
  ].join("\n");
}

/**
 * Builds a ZIP of icons in one style: a folder per category, plus LICENSE.txt and NOTICE.txt.
 * PNG rendering runs one icon at a time and reports progress.
 */
export async function buildIconZip(
  categories: IconCategory[], style: IconStyle, format: IconFormat, license: string,
  onProgress?: (done: number, total: number) => void,
): Promise<Blob> {
  const encoder = new TextEncoder();
  const total = categories.reduce((sum, category) => sum + category.icons.length, 0);
  const entries: ZipEntry[] = [];
  let done = 0;
  for (const category of categories) {
    for (const icon of category.icons) {
      const blob = await iconBlob(icon, style, format);
      entries.push({ path: `${category.name.replace(/[/\\:]/g, "-")}/${iconFilename(icon.name, style, format)}`, data: new Uint8Array(await blob.arrayBuffer()) });
      onProgress?.(++done, total);
    }
  }
  entries.push({ path: "LICENSE.txt", data: encoder.encode(license) });
  entries.push({ path: "NOTICE.txt", data: encoder.encode(iconNotice(style)) });
  return new Blob([buildZip(entries)], { type: "application/zip" });
}
