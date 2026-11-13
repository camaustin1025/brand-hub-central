import { SOCIAL_ASSETS, type Bounds, type PhotoFrame, type SocialField, type SocialTemplate, type TextRules } from "../data/social-templates";
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
/** sample: draw the template's fictional sample for an empty field or missing photo. Editor preview only. */
export type SocialDrawOptions = { sample?: boolean };
type CanvasWithTracking = CanvasRenderingContext2D & { letterSpacing?: string };

export async function loadSocialResources(template: SocialTemplate, assets = SOCIAL_ASSETS): Promise<SocialResources> {
  const weights = new Set([...template.fields, ...template.lockedLayers.filter((layer) => layer.type === "text")].map((rules) => rules.fontWeight));
  await Promise.all([...weights].map(async (weight) => {
    const faces = await document.fonts.load(`${weight} 32px Figtree`);
    if (!faces.length || faces.some((face) => face.status !== "loaded")) throw new Error("Font unavailable");
  }));
  const ids = [...template.assetIds, ...(template.sample?.photoAssetId ? [template.sample.photoAssetId] : [])];
  const entries = await Promise.all(ids.map(async (id) => {
    const image = new Image();
    image.src = assets[id];
    await image.decode();
    return [id, image] as const;
  }));
  return { fontsLoaded: true, assets: Object.fromEntries(entries) };
}

function setTextStyle(ctx: CanvasRenderingContext2D, rules: TextRules, size: number) {
  ctx.font = `${rules.fontWeight} ${size}px Figtree`;
  // Canvas letterSpacing is applied to measuring and painting alike, so preview and PNG stay identical.
  (ctx as CanvasWithTracking).letterSpacing = `${(rules.letterSpacing ?? 0) * size}px`;
}

export function layoutSocialText(ctx: CanvasRenderingContext2D, value: string, rules: TextRules): TextLayout | null {
  const text = rules.textTransform === "uppercase" ? value.toLocaleUpperCase("en-US") : value;
  // Keep the spacing typed between words, so separators like "  |  " survive. A line break drops it.
  const parts = text.trim().split(/(\s+)/u).filter(Boolean);
  const words = parts.filter((_, index) => index % 2 === 0);
  const gaps = parts.filter((_, index) => index % 2 === 1).map((gap) => gap.replace(/\s/gu, " "));
  if (!words.length) return { lines: [], fontSize: rules.maxFontSize };
  for (let size = rules.maxFontSize; ; size = Math.max(rules.minFontSize, size - 1)) {
    setTextStyle(ctx, rules, size);
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
  setTextStyle(ctx, rules, layout.fontSize);
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

export type EffectivePhotoFrame = Omit<PhotoFrame, "opaqueClip"> & { radii?: [number, number, number, number] };

/** Where a photo is placed. Cut-out designs keep transparent photos in the full frame and put opaque
 * photos (or the empty placeholder) in the rounded opaqueClip, so a photo background never covers the design. */
export function socialPhotoFrame(frame: PhotoFrame, photo: { hasTransparency: boolean } | null): EffectivePhotoFrame {
  const { opaqueClip, ...rest } = frame;
  if (!opaqueClip || photo?.hasTransparency) return rest;
  return { ...rest, ...opaqueClip, shape: "rect" };
}

export function photoSourceRect(photo: Pick<ProcessedPhoto, "width" | "height">, frame: Bounds & { maxZoom: number }, crop: PhotoCropValue) {
  const zoom = Math.min(frame.maxZoom, Math.max(1, crop.zoom));
  const scale = Math.max(frame.width / photo.width, frame.height / photo.height) * zoom;
  const width = frame.width / scale;
  const height = frame.height / scale;
  return { x: (photo.width - width) * Math.min(1, Math.max(0, crop.x)), y: (photo.height - height) * Math.min(1, Math.max(0, crop.y)), width, height };
}

/** Place a cut-out (transparent) photo the way the designs do: the top of the person about 7% below the
 * top of the frame and the head a little right of center. Reads a small copy of the alpha channel. */
export function suggestCutoutCrop(photo: Pick<ProcessedPhoto, "image" | "width" | "height">, frame: Bounds & { maxZoom: number }): PhotoCropValue {
  const sample = document.createElement("canvas");
  try {
    const k = Math.min(1, 256 / Math.max(photo.width, photo.height));
    sample.width = Math.max(1, Math.round(photo.width * k));
    sample.height = Math.max(1, Math.round(photo.height * k));
    const ctx = sample.getContext("2d", { willReadFrequently: true });
    if (!ctx) return { ...DEFAULT_PHOTO_CROP };
    ctx.drawImage(photo.image, 0, 0, sample.width, sample.height);
    const alpha = ctx.getImageData(0, 0, sample.width, sample.height).data;
    let top = -1;
    for (let y = 0; y < sample.height && top < 0; y++) for (let x = 0; x < sample.width; x++) if (alpha[(y * sample.width + x) * 4 + 3] > 128) { top = y; break; }
    if (top < 0) return { ...DEFAULT_PHOTO_CROP };
    // Head centre: average opaque column across a band just below the top of the person.
    let sum = 0, count = 0;
    for (let y = top; y < Math.min(sample.height, top + sample.height * 0.15); y++) for (let x = 0; x < sample.width; x++) if (alpha[(y * sample.width + x) * 4 + 3] > 128) { sum += x; count++; }
    const headX = (count ? sum / count : sample.width / 2) / k;
    const source = photoSourceRect(photo, frame, DEFAULT_PHOTO_CROP);
    const scale = frame.width / source.width;
    const position = (target: number, size: number, window: number) => size - window > 0 ? Math.min(1, Math.max(0, target / (size - window))) : 0.5;
    return { zoom: 1, x: position(headX - frame.width * 0.53 / scale, photo.width, source.width), y: position(top / k - frame.height * 0.07 / scale, photo.height, source.height) };
  } finally { sample.width = sample.height = 0; }
}

/** Move the photo by logical output pixels, using the same source window as rendering. */
export function dragSocialCrop(crop: PhotoCropValue, photoSize: Pick<ProcessedPhoto, "width" | "height">, frame: Bounds & { maxZoom: number }, dxOutput: number, dyOutput: number): PhotoCropValue {
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

function framePath(ctx: CanvasRenderingContext2D, frame: EffectivePhotoFrame) {
  ctx.beginPath();
  if (frame.shape === "ellipse") ctx.ellipse(frame.x + frame.width / 2, frame.y + frame.height / 2, frame.width / 2, frame.height / 2, 0, 0, Math.PI * 2);
  else if (frame.radii && typeof ctx.roundRect === "function") ctx.roundRect(frame.x, frame.y, frame.width, frame.height, frame.radii);
  else ctx.rect(frame.x, frame.y, frame.width, frame.height);
}

function paintSocialGraphic(canvas: HTMLCanvasElement, template: SocialTemplate, inputs: SocialInputs, resources: SocialResources, photo: ProcessedPhoto | null, options: SocialDrawOptions): SocialFieldErrors {
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
  const paintLayer = (layer: SocialTemplate["lockedLayers"][number]) => {
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
  };
  template.lockedLayers.filter((layer) => layer.belowPhoto).forEach(paintLayer);
  if (template.photo) {
    const sampleImage = !photo && options.sample && template.sample?.photoAssetId ? resources.assets[template.sample.photoAssetId] : undefined;
    const source = photo ?? (sampleImage ? { image: sampleImage, width: sampleImage.naturalWidth, height: sampleImage.naturalHeight, hasTransparency: true } : null);
    const frame = socialPhotoFrame(template.photo, source);
    ctx.save();
    framePath(ctx, frame);
    ctx.clip();
    if (source) {
      const rect = photoSourceRect(source, frame, photo ? inputs.crop : DEFAULT_PHOTO_CROP);
      ctx.drawImage(source.image, rect.x, rect.y, rect.width, rect.height, frame.x, frame.y, frame.width, frame.height);
    } else {
      // Empty photo region in the editor. Required photos always block export.
      ctx.fillStyle = "#D8D7DF";
      ctx.fillRect(frame.x, frame.y, frame.width, frame.height);
    }
    ctx.restore();
  }
  template.lockedLayers.filter((layer) => !layer.belowPhoto).forEach(paintLayer);
  const errors: SocialFieldErrors = {};
  const placed: { field: SocialField; layout: TextLayout; y: number }[] = [];
  for (const field of template.fields) {
    const value = inputs.fields[field.key] ?? "";
    const sampleValue = options.sample && field.type === "text" && !value.trim() ? template.sample?.fields[field.key] : undefined;
    const requiredError = requiredSocialFieldError(field, value);
    if (requiredError) { errors[field.key] = requiredError; if (!sampleValue) continue; }
    const formatted = formatSocialField(field, sampleValue ?? value);
    if (formatted === null) { errors[field.key] = `Choose a valid ${field.label.toLowerCase()}.`; continue; }
    const layout = layoutSocialText(ctx, formatted, field);
    if (!layout) { errors[field.key] = `Too long for this design. Shorten the ${field.label.toLowerCase()}.`; continue; }
    placed.push({ field, layout, y: field.y });
  }
  for (const stack of template.textStacks ?? []) {
    const members = placed.filter((item) => item.field.stack === stack.id && item.layout.lines.length);
    const heights = members.map((item) => item.layout.lines.length * item.layout.fontSize * item.field.lineHeight);
    const total = heights.reduce((sum, height) => sum + height, 0) + stack.gap * Math.max(0, members.length - 1);
    let top = stack.y + (stack.verticalAlign === "center" ? (stack.height - total) / 2 : stack.verticalAlign === "bottom" ? stack.height - total : 0);
    members.forEach((item, index) => { item.y = top; top += heights[index] + stack.gap; });
  }
  for (const { field, layout, y } of placed) {
    ctx.fillStyle = variant.foreground;
    paintText(ctx, layout, y === field.y ? field : { ...field, y });
  }
  return errors;
}

/** One composition path for preview and PNG, at logical output pixels.
 * Always paint on a detached surface so page CSS cannot change text metrics
 * between a connected preview canvas and an exported canvas. */
export function drawSocialGraphic(canvas: HTMLCanvasElement, template: SocialTemplate, inputs: SocialInputs, resources: SocialResources, photo: ProcessedPhoto | null, options: SocialDrawOptions = {}): SocialFieldErrors {
  const surface = document.createElement("canvas");
  try {
    const errors = paintSocialGraphic(surface, template, inputs, resources, photo, options);
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
