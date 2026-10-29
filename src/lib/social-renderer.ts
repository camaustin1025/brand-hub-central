import { SOCIAL_ASSETS, type SocialTemplate, type TextRules } from "../data/social-templates";
import { formatSocialField, requiredSocialFieldError, socialPrimaryValue } from "./social-fields";
import { canvasBlob, type ProcessedPhoto } from "./social-photo";

export type PhotoCropValue = { x: number; y: number; zoom: number };
export const DEFAULT_PHOTO_CROP: PhotoCropValue = { x: 0.5, y: 0.5, zoom: 1 };

/** Serializable editor state is separate from decoded resources for session 2 persistence. */
export type SocialInputs = {
  fields: Record<string, string>;
  variantId: string;
  crop: PhotoCropValue;
};
export type SocialResources = { fontsLoaded: true; assets: Record<string, HTMLImageElement> };
export type SocialFieldErrors = Record<string, string>;
type TextLayout = { lines: string[]; fontSize: number };

export async function loadSocialResources(template: SocialTemplate, assets = SOCIAL_ASSETS): Promise<SocialResources> {
  const weights = new Set([...template.fields, ...template.lockedLayers.filter((layer) => layer.type === "text")].map((rules) => rules.fontWeight));
  await Promise.all([...weights].map(async (weight) => {
    const faces = await document.fonts.load(`${weight} 32px Figtree`);
    if (!faces.length || faces.some((face) => face.status !== "loaded")) throw new Error("Font unavailable");
  }));
  const entries = await Promise.all(template.assetIds.map(async (id) => {
    const image = new Image();
    image.src = assets[id];
    await image.decode();
    return [id, image] as const;
  }));
  return { fontsLoaded: true, assets: Object.fromEntries(entries) };
}

export function layoutSocialText(ctx: CanvasRenderingContext2D, value: string, rules: TextRules): TextLayout | null {
  // Keep the spacing typed between words, so separators like "  |  " survive. A line break drops it.
  const parts = value.trim().split(/(\s+)/u).filter(Boolean);
  const words = parts.filter((_, index) => index % 2 === 0);
  const gaps = parts.filter((_, index) => index % 2 === 1).map((gap) => gap.replace(/\s/gu, " "));
  if (!words.length) return { lines: [], fontSize: rules.maxFontSize };
  for (let size = rules.maxFontSize; ; size = Math.max(rules.minFontSize, size - 1)) {
    ctx.font = `${rules.fontWeight} ${size}px Figtree`;
    const lines: string[] = [];
    let line = "";
    let fits = true;
    for (const [index, word] of words.entries()) {
      if (ctx.measureText(word).width > rules.width) { fits = false; break; }
      const candidate = line ? `${line}${gaps[index - 1]}${word}` : word;
      if (ctx.measureText(candidate).width > rules.width) { lines.push(line); line = word; }
      else line = candidate;
      if (lines.length >= rules.maxLines) { fits = false; break; }
    }
    if (line) lines.push(line);
    if (fits && lines.length <= rules.maxLines && lines.length * size * rules.lineHeight <= rules.height) return { lines, fontSize: size };
    if (size === rules.minFontSize) return null;
  }
}

function paintText(ctx: CanvasRenderingContext2D, layout: TextLayout, rules: TextRules) {
  ctx.save();
  ctx.fillStyle = rules.color ?? ctx.fillStyle;
  ctx.globalAlpha = rules.opacity ?? 1;
  ctx.font = `${rules.fontWeight} ${layout.fontSize}px Figtree`;
  ctx.textBaseline = "alphabetic";
  ctx.textAlign = rules.align ?? "left";
  const x = rules.x + (rules.align === "center" ? rules.width / 2 : rules.align === "right" ? rules.width : 0);
  const metrics = ctx.measureText("ÁÉÅgjpq");
  const ascent = metrics.actualBoundingBoxAscent;
  const descent = metrics.actualBoundingBoxDescent;
  const lineHeight = layout.fontSize * rules.lineHeight;
  const baseline = rules.y + (lineHeight - ascent - descent) / 2 + ascent;
  layout.lines.forEach((line, index) => ctx.fillText(line, x, baseline + index * lineHeight));
  ctx.restore();
}

export function photoSourceRect(photo: Pick<ProcessedPhoto, "width" | "height">, frame: NonNullable<SocialTemplate["photo"]>, crop: PhotoCropValue) {
  const zoom = Math.min(frame.maxZoom, Math.max(1, crop.zoom));
  const scale = Math.max(frame.width / photo.width, frame.height / photo.height) * zoom;
  const width = frame.width / scale;
  const height = frame.height / scale;
  return { x: (photo.width - width) * Math.min(1, Math.max(0, crop.x)), y: (photo.height - height) * Math.min(1, Math.max(0, crop.y)), width, height };
}

/** Move the photo by logical output pixels, using the same source window as rendering. */
export function dragSocialCrop(crop: PhotoCropValue, photoSize: Pick<ProcessedPhoto, "width" | "height">, frame: NonNullable<SocialTemplate["photo"]>, dxOutput: number, dyOutput: number): PhotoCropValue {
  const source = photoSourceRect(photoSize, frame, crop);
  const scale = frame.width / source.width;
  const move = (position: number, overflow: number, delta: number) => overflow > 0
    ? Math.min(1, Math.max(0, position - delta / scale / overflow))
    : position;
  return {
    ...crop,
    x: move(crop.x, photoSize.width - source.width, dxOutput),
    y: move(crop.y, photoSize.height - source.height, dyOutput),
  };
}

function paintSocialGraphic(canvas: HTMLCanvasElement, template: SocialTemplate, inputs: SocialInputs, resources: SocialResources, photo: ProcessedPhoto | null): SocialFieldErrors {
  if (!resources.fontsLoaded) throw new Error("Fonts not loaded");
  canvas.width = template.width;
  canvas.height = template.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas unavailable");
  ctx.direction = "ltr";
  ctx.textAlign = "left";
  ctx.fontKerning = "normal";
  const variant = template.variants.find((item) => item.id === inputs.variantId);
  if (!variant) throw new Error("Variant unavailable");
  ctx.fillStyle = variant.background;
  ctx.fillRect(0, 0, template.width, template.height);
  const frame = template.photo;
  if (frame) {
    ctx.save();
    ctx.beginPath();
    if (frame.shape === "ellipse") ctx.ellipse(frame.x + frame.width / 2, frame.y + frame.height / 2, frame.width / 2, frame.height / 2, 0, 0, Math.PI * 2);
    else ctx.rect(frame.x, frame.y, frame.width, frame.height);
    ctx.clip();
    if (photo) {
      const source = photoSourceRect(photo, frame, inputs.crop);
      ctx.drawImage(photo.image, source.x, source.y, source.width, source.height, frame.x, frame.y, frame.width, frame.height);
    } else {
      // Empty photo region in the editor. Required photos always block export.
      ctx.fillStyle = "#D8D7DF";
      ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
    }
    ctx.restore();
  }
  for (const layer of template.lockedLayers) {
    if (layer.type === "asset") {
      const image = resources.assets[layer.assetId ?? layer.assetIdByVariant![variant.id]];
      if (!image) throw new Error("Artwork unavailable");
      ctx.drawImage(image, layer.x, layer.y, layer.width, layer.height);
    } else if (layer.type === "text") {
      const layout = layoutSocialText(ctx, layer.text, layer);
      if (!layout) throw new Error("Locked text does not fit");
      ctx.fillStyle = variant.foreground;
      paintText(ctx, layout, layer);
    } else {
      ctx.fillStyle = layer.color;
      if (layer.type === "rect") ctx.fillRect(layer.x, layer.y, layer.width, layer.height);
      else { ctx.beginPath(); ctx.ellipse(layer.x + layer.width / 2, layer.y + layer.height / 2, layer.width / 2, layer.height / 2, 0, 0, Math.PI * 2); ctx.fill(); }
    }
  }
  const errors: SocialFieldErrors = {};
  for (const field of template.fields) {
    const value = inputs.fields[field.key] ?? "";
    const requiredError = requiredSocialFieldError(field, value);
    if (requiredError) { errors[field.key] = requiredError; continue; }
    const formatted = formatSocialField(field, value);
    if (formatted === null) { errors[field.key] = `Choose a valid ${field.label.toLowerCase()}.`; continue; }
    const layout = layoutSocialText(ctx, formatted, field);
    if (!layout) { errors[field.key] = `Too long for this design. Shorten the ${field.label.toLowerCase()}.`; continue; }
    ctx.fillStyle = variant.foreground;
    paintText(ctx, layout, field);
  }
  return errors;
}

/** One composition path for preview and PNG, at logical output pixels.
 * Always paint on a detached surface so page CSS cannot change text metrics
 * between a connected preview canvas and an exported canvas. */
export function drawSocialGraphic(canvas: HTMLCanvasElement, template: SocialTemplate, inputs: SocialInputs, resources: SocialResources, photo: ProcessedPhoto | null): SocialFieldErrors {
  const surface = document.createElement("canvas");
  try {
    const errors = paintSocialGraphic(surface, template, inputs, resources, photo);
    canvas.width = template.width;
    canvas.height = template.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(surface, 0, 0);
    return errors;
  } finally {
    surface.width = surface.height = 0;
  }
}

export async function exportSocialPng(template: SocialTemplate, inputs: SocialInputs, resources: SocialResources, photo: ProcessedPhoto | null): Promise<Blob> {
  if (template.status === "retired" || (template.developmentOnly && !import.meta.env.DEV)) throw new Error("Template unavailable");
  if (template.photo?.required && !photo) throw new Error("Add a photo before downloading.");
  const canvas = document.createElement("canvas");
  try {
    const errors = drawSocialGraphic(canvas, template, inputs, resources, photo);
    if (Object.keys(errors).length) throw new Error("Check the highlighted fields.");
    return await canvasBlob(canvas);
  } finally {
    canvas.width = canvas.height = 0;
  }
}

export function socialDownloadFilename(template: SocialTemplate, fields: Record<string, string>): string {
  const value = socialPrimaryValue(template, fields);
  const safeValue = value.trim().replace(/[^\p{L}\p{N}]+/gu, "-").replace(/^-|-$/g, "").slice(0, 80).replace(/-$/g, "");
  return `ordergroove-${template.id}${safeValue ? `-${safeValue}` : ""}.png`;
}
