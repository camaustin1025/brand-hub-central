/**
 * Copy-and-paste token kits, built from the same data the hub renders
 * (tokens.ts and typography.ts). Nothing here holds its own hex or size:
 * change a value at the source and every kit changes with it.
 */
import { BACKGROUND_GRADIENT, BACKGROUND_GRADIENT_CSS, CORE, SECONDARY, SUPPORTING, type Swatch } from "./tokens";
import { FONT_FAMILY, TYPE_HIERARCHY, TYPE_WEIGHTS } from "./typography";

export type TokenKit = {
  id: string;
  label: string;
  /** Who it's for, shown above the code. */
  hint: string;
  filename: string;
  mime: string;
  content: string;
};

const GROUPS = [
  { key: "primary", label: "Primary", group: CORE },
  { key: "neutral", label: "Supporting neutrals", group: SUPPORTING },
  { key: "secondary", label: "Secondary accents. Small accents only, never the main color", group: SECONDARY },
];

const slug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const colorName = (swatch: Swatch) => slug(swatch.name);
// Drop internal notes such as "(Name pending audit D10.)"; kits carry usage only.
const usage = (swatch: Swatch) => swatch.usage.replace(/\s*\([^)]*\)/g, "").replace(/\.$/, "");
const gradientName = slug(BACKGROUND_GRADIENT.name);
// Quote named families; generic keywords (system-ui, sans-serif) stay bare.
const fontStack = FONT_FAMILY.map((font) => (/^(system-ui|sans-serif|serif|monospace)$/.test(font) ? font : `"${font}"`)).join(", ");
const weightName = (name: string) => slug(name);

const HEADER = "Ordergroove marketing tokens from the Brand Hub. Product UI uses its own tokens.";

function cssKit() {
  const lines = [`/* ${HEADER} */`, ":root {"];
  for (const { label, group } of GROUPS) {
    lines.push(`  /* ${label} */`);
    for (const swatch of group.swatches) lines.push(`  --og-${colorName(swatch)}: ${swatch.hex}; /* ${usage(swatch)} */`);
    lines.push("");
  }
  lines.push("  /* Gradient. One per section */", `  --og-gradient-${gradientName}: ${BACKGROUND_GRADIENT_CSS};`, "");
  lines.push("  /* Type. Figtree only */", `  --og-font-family: ${fontStack};`);
  for (const weight of TYPE_WEIGHTS) lines.push(`  --og-font-weight-${weightName(weight.name)}: ${weight.value};`);
  for (const level of TYPE_HIERARCHY) {
    lines.push(`  --og-${level.id}-size: ${level.size};`);
    lines.push(`  --og-${level.id}-weight: ${level.weight};`);
    lines.push(`  --og-${level.id}-line-height: ${level.lineHeight};`);
    if (level.letterSpacing) lines.push(`  --og-${level.id}-letter-spacing: ${level.letterSpacing};`);
  }
  lines.push("}");
  return lines.join("\n");
}

function tailwindKit() {
  const colors = GROUPS.flatMap(({ group }) => group.swatches)
    .map((swatch) => `          "${colorName(swatch)}": "${swatch.hex}", // ${usage(swatch)}`);
  const sizes = TYPE_HIERARCHY.map((level) => {
    const extra = [`lineHeight: "${level.lineHeight}"`, `fontWeight: "${level.weight}"`];
    if (level.letterSpacing) extra.push(`letterSpacing: "${level.letterSpacing}"`);
    return `        "og-${level.id}": ["${level.size}", { ${extra.join(", ")} }],`;
  });
  return [
    `// ${HEADER}`,
    "// Paste into tailwind.config.js. Use as bg-og-midnight, text-og-green-on-light, font-figtree, text-og-headline.",
    "module.exports = {",
    "  theme: {",
    "    extend: {",
    "      colors: {",
    "        og: {",
    ...colors,
    "        },",
    "      },",
    "      fontFamily: {",
    `        figtree: [${FONT_FAMILY.map((font) => `"${font}"`).join(", ")}],`,
    "      },",
    "      fontSize: {",
    ...sizes,
    "      },",
    "      backgroundImage: {",
    `        "og-gradient-${gradientName}": "${BACKGROUND_GRADIENT_CSS}",`,
    "      },",
    "    },",
    "  },",
    "};",
  ].join("\n");
}

function jsonKit() {
  const color = Object.fromEntries(GROUPS.map(({ key, group }) => [
    key,
    Object.fromEntries(group.swatches.map((swatch) => [colorName(swatch), { $type: "color", $value: swatch.hex, $description: usage(swatch) }])),
  ]));
  const tokens = {
    $description: HEADER,
    og: {
      color,
      gradient: {
        [gradientName]: {
          $type: "gradient",
          $value: BACKGROUND_GRADIENT.stops.map((stop) => ({ color: stop.hex, position: Number((stop.position / 100).toFixed(4)) })),
          $description: `One per section. CSS: ${BACKGROUND_GRADIENT_CSS}`,
        },
      },
      font: {
        family: { $type: "fontFamily", $value: FONT_FAMILY },
        weight: Object.fromEntries(TYPE_WEIGHTS.map((weight) => [weightName(weight.name), { $type: "fontWeight", $value: weight.value }])),
      },
      typography: Object.fromEntries(TYPE_HIERARCHY.map((level) => [level.id, {
        $type: "typography",
        $value: {
          fontFamily: "{og.font.family}",
          fontSize: level.size,
          fontWeight: level.weight,
          lineHeight: level.lineHeight,
          ...(level.letterSpacing ? { letterSpacing: level.letterSpacing } : {}),
        },
        ...(level.note || level.mobileSize ? { $description: [level.note, level.mobileSize && `${level.mobileSize} on phones`].filter(Boolean).join(". ") } : {}),
      }])),
    },
  };
  return JSON.stringify(tokens, null, 2);
}

function aiBrief() {
  const list = (swatches: Swatch[]) => swatches.map((swatch) => `- ${swatch.name} ${swatch.hex}: ${usage(swatch)}`);
  return [
    "# Ordergroove brand brief",
    "",
    "Follow this brief for anything you design or write for Ordergroove. Use only the values below. Don't invent colors, fonts, gradients, or logo versions.",
    "",
    "## Color",
    "",
    "Primary",
    ...list(CORE.swatches),
    "",
    "Supporting neutrals",
    ...list(SUPPORTING.swatches),
    "",
    "Secondary accents",
    ...list(SECONDARY.swatches),
    "",
    "Rules",
    "- Lead with Midnight, white, and Groovy Green.",
    `- Groovy Green ${hex("Groovy Green")} goes on dark backgrounds only. On light backgrounds, use Green ${hex("Green on light")}.`,
    `- Labels on Groovy Green buttons are Midnight. Labels on ${hex("Green on light")} buttons are white.`,
    "- Set small text and links on light backgrounds in Midnight.",
    `- ${SECONDARY.note}`,
    "",
    "## Gradient",
    "",
    `- ${BACKGROUND_GRADIENT.name}: \`${BACKGROUND_GRADIENT_CSS}\``,
    "- Use one gradient per section.",
    "",
    "## Type",
    "",
    `- Figtree only (free on Google Fonts), in weights ${TYPE_WEIGHTS.map((weight) => weight.value).join(", ")}. Never substitute another font.`,
    ...TYPE_HIERARCHY.map((level) => `- ${level.role}: ${level.mobileSize ? `${level.mobileSize} to ${level.size}` : level.size}, weight ${level.weight}, line height ${level.lineHeight}${level.letterSpacing ? `, letter-spacing ${level.letterSpacing}` : ""}${level.uppercase ? ", ALL CAPS" : ""}`),
    "- Sentence case for headings, labels, and subtitles, with no trailing periods. Eyebrows stay ALL CAPS.",
    "",
    "## Logo",
    "",
    "- Use the original logo files from the Brand Hub. Ask for them if you don't have them; never redraw the logo.",
    "- Place it on plain Midnight or white backgrounds, with at least one logomark's width of clear space on every side.",
    "- Scale proportionally. Don't stretch, crop, rotate, recolor, outline, or add effects.",
    "",
    "## Writing",
    "",
    "- Ordergroove is the enterprise standard for subscriptions and recurring revenue. The category is Autonomous Subscriptions.",
    "- Never lead with \"AI\". No em dashes. \"Everychannel\" is one word. Never name competitors.",
  ].join("\n");
}

function hex(name: string) {
  const swatch = CORE.swatches.find((entry) => entry.name === name);
  if (!swatch) throw new Error(`Token kits: missing core color "${name}"`);
  return swatch.hex;
}

export const TOKEN_KITS: TokenKit[] = [
  { id: "css", label: "CSS", hint: "CSS variables for any website or email template.", filename: "ordergroove-tokens.css", mime: "text/css", content: cssKit() },
  { id: "tailwind", label: "Tailwind", hint: "A theme block for tailwind.config.js.", filename: "ordergroove-tailwind.js", mime: "text/javascript", content: tailwindKit() },
  { id: "json", label: "JSON", hint: "Standard design-token format for Figma plugins and Style Dictionary.", filename: "ordergroove-tokens.json", mime: "application/json", content: jsonKit() },
  { id: "ai", label: "AI brief", hint: "Paste into Claude, or add to a Claude Project, so its designs stay on brand.", filename: "ordergroove-brand-brief.md", mime: "text/markdown", content: aiBrief() },
];
