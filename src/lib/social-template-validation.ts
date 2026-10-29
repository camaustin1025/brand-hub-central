import { COLOR_GROUPS } from "../data/tokens";
import { socialDateParts } from "./social-fields";
import type { Bounds, SocialTemplate, TextRules } from "../data/social-templates";

const approvedColors = new Set(COLOR_GROUPS.flatMap((group) => group.swatches.map((swatch) => swatch.hex.toUpperCase())));
const weights = new Set([400, 500, 600, 700, 800]);
const isDate = (value: string) => !!socialDateParts(value);

function isJsonData(value: unknown, ancestors = new Set<object>()): boolean {
  if (value === null || typeof value === "string" || typeof value === "boolean") return true;
  if (typeof value === "number") return Number.isFinite(value);
  if (typeof value !== "object" || ancestors.has(value)) return false;
  if (!Array.isArray(value) && Object.getPrototypeOf(value) !== Object.prototype) return false;
  ancestors.add(value);
  const valid = Object.values(value).every((child) => isJsonData(child, ancestors));
  ancestors.delete(value);
  return valid;
}

/** Pure validation, also usable by a future template publishing screen. */
export function validateSocialTemplates(templates: SocialTemplate[], assets: Record<string, string>, allowFixtures = false): string[] {
  if (!isJsonData(templates)) return ["Template definitions must be plain JSON-compatible data."];
  const errors: string[] = [];
  const ids = new Set<string>();
  for (const template of templates) {
    const fail = (message: string) => errors.push(`${template.id || "Template"}: ${message}`);
    const unique = (values: string[], label: string) => {
      if (values.some((value) => !value?.trim()) || new Set(values).size !== values.length) fail(`${label} must have unique, nonempty IDs`);
    };
    const bounds = (box: Bounds, label: string) => {
      if (![box.x, box.y, box.width, box.height].every(Number.isFinite) || box.x < 0 || box.y < 0 || box.width <= 0 || box.height <= 0 || box.x + box.width > template.width || box.y + box.height > template.height) fail(`${label} has illegal bounds`);
    };
    const text = (rules: TextRules, label: string) => {
      bounds(rules, label);
      if (rules.align !== undefined && !["left", "center", "right"].includes(rules.align)) fail(`${label} has unknown alignment`);
      if (rules.fontFamily !== "Figtree" || !weights.has(rules.fontWeight)) fail(`${label} must use a bundled Figtree weight`);
      if (rules.color !== undefined) color(rules.color);
      if (rules.opacity !== undefined && (!Number.isFinite(rules.opacity) || rules.opacity < 0.1 || rules.opacity > 1)) fail(`${label} opacity must be from 0.1 to 1`);
      if (![rules.minFontSize, rules.maxFontSize, rules.lineHeight, rules.maxLines].every(Number.isFinite) || rules.minFontSize <= 0 || rules.maxFontSize < rules.minFontSize || rules.maxFontSize > 500 || rules.lineHeight < 1 || rules.lineHeight > 2 || !Number.isInteger(rules.maxLines) || rules.maxLines < 1 || rules.minFontSize * rules.lineHeight > rules.height) fail(`${label} has impossible text rules`);
    };
    const color = (value: string) => { if (typeof value !== "string" || !approvedColors.has(value.toUpperCase())) fail(`unapproved color ${value}`); };
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(template.id) || ids.has(template.id)) fail("invalid or duplicate template ID");
    ids.add(template.id);
    if (!Number.isInteger(template.version) || template.version < 1) fail("version must be a positive integer");
    if (!["pilot", "current", "retired"].includes(template.status)) fail("unknown status");
    if (!template.title.trim() || !template.owner.trim()) fail("title and owner are required");
    if (typeof template.category !== "string" || !template.category.trim()) fail("category is required");
    if (!template.description?.trim() || !template.keywords?.trim()) fail("description and keywords are required");
    if (template.developmentOnly && !allowFixtures) fail("fixtures cannot be published");
    try {
      const source = new URL(template.sourceUrl);
      if (source.protocol !== "https:" && !(allowFixtures && template.developmentOnly && source.protocol === "repo:")) fail("sourceUrl must be an HTTPS master link");
    } catch { fail("sourceUrl is required"); }
    try {
      if (!isDate(template.reviewedAt) || !isDate(template.reviewDueAt) || template.reviewDueAt <= template.reviewedAt) fail("valid review dates in order are required");
    } catch { fail("valid review dates are required"); }
    if (![template.width, template.height].every((n) => Number.isInteger(n) && n > 0 && n <= 8192) || template.width * template.height > 50_000_000) fail("invalid output size");
    unique(template.assetIds, "Assets");
    for (const id of template.assetIds) if (!Object.prototype.hasOwnProperty.call(assets, id)) fail(`unknown asset ${id}`);
    if (template.previewAssetId !== undefined && (typeof template.previewAssetId !== "string" || !Object.prototype.hasOwnProperty.call(assets, template.previewAssetId))) fail(`unknown preview asset ${template.previewAssetId}`);
    if (!template.variants.length) fail("at least 1 variant is required");
    unique(template.variants.map((v) => v.id), "Variants");
    for (const variant of template.variants) {
      if (!variant.label.trim()) fail("variant labels are required");
      color(variant.background); color(variant.foreground);
    }
    if (template.photo) {
      bounds(template.photo, "Photo");
      if (!["rect", "ellipse"].includes(template.photo.shape) || !Number.isFinite(template.photo.maxZoom) || template.photo.maxZoom < 1 || template.photo.maxZoom > 5 || typeof template.photo.required !== "boolean") fail("invalid photo rules");
    }
    unique(template.fields.map((field) => field.key), "Fields");
    if (!template.fields.length) fail("at least 1 field is required");
    if (template.fields.filter((field) => "prefill" in field).length > 1) fail("at most 1 prefill is allowed");
    for (const field of template.fields) {
      text(field, field.key);
      if (!/^[a-z][a-zA-Z0-9]*$/.test(field.key)) fail("invalid field key");
      if (!field.label.trim() || typeof field.required !== "boolean") fail("invalid field rules");
      if (!["text", "date", "time", "choice"].includes(field.type)) fail("unknown field type");
      if ("dateFormat" in field && (field.type !== "date" || !["short", "long", "weekday"].includes(field.dateFormat))) fail("unknown date format");
      if (field.type === "date" && !["short", "long", "weekday"].includes(field.dateFormat)) fail("unknown date format");
      if (field.type === "choice" && (!Array.isArray(field.options) || field.options.length < 2 || field.options.some((option) => typeof option !== "string" || !option.trim()) || new Set(field.options.map((option) => option.trim())).size !== field.options.length)) fail("choice needs at least 2 unique nonempty options");
      if ("prefill" in field && (field.type !== "text" || field.prefill !== "googleName")) fail("prefill must be googleName on a text field");
      if (field.type === "time" && field.timeZoneLabel !== undefined && (typeof field.timeZoneLabel !== "string" || !field.timeZoneLabel.trim())) fail("invalid time zone label");
    }
    unique(template.lockedLayers.map((layer) => layer.id), "Layers");
    for (const layer of template.lockedLayers) {
      bounds(layer, layer.id);
      if (layer.type === "text") { text(layer, layer.id); if (!layer.text.trim()) fail("locked text must not be empty"); }
      else if (layer.type === "asset") {
        if (("assetId" in layer) === ("assetIdByVariant" in layer)) fail("asset layer needs either assetId or assetIdByVariant");
        if (layer.assetIdByVariant) {
          const variantIds = template.variants.map((variant) => variant.id);
          if (variantIds.some((id) => !Object.prototype.hasOwnProperty.call(layer.assetIdByVariant, id)) || Object.keys(layer.assetIdByVariant).some((id) => !variantIds.includes(id))) fail("incomplete or unknown per-variant artwork");
        }
        const references = layer.assetIdByVariant ? Object.values(layer.assetIdByVariant) : [layer.assetId];
        for (const id of references) if (!id || !template.assetIds.includes(id)) fail(`undeclared layer asset ${id}`);
      }
      else if (layer.type === "rect" || layer.type === "ellipse") color(layer.color);
      else fail("unknown layer type");
    }
  }
  return errors;
}
