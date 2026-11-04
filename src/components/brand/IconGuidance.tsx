import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ICON_COLORS, ICONS_FIGMA_URL, MATERIAL_SYMBOLS_GUIDE_URL } from "@/data/brand-resources";
import { buttonVariants } from "@/components/ui/button";
import { ICON_LIBRARY_PATH } from "@/data/hub";
import { cn } from "@/lib/utils";

const TREATMENTS = ["Plain", "Tinted", "Solid"] as const;

export function IconGuidance() {
  const [surface, setSurface] = useState<"light" | "dark">("light");
  const dark = surface === "dark";
  const colors = ICON_COLORS[surface];
  const examples = dark
    ? [{ name: "Payments", image: "dark-card-green", tint: "rgba(0,255,133,0.12)" }, { name: "Loyalty", image: "dark-heart-pink", tint: "rgba(255,97,211,0.12)" }, { name: "Data", image: "dark-chart-cyan", tint: "rgba(0,250,255,0.12)" }]
    : [{ name: "Payments", image: "light-card-green", tint: "rgba(0,154,80,0.12)" }, { name: "Loyalty", image: "light-heart-pink", tint: "rgba(255,97,211,0.12)" }, { name: "Data", image: "light-chart-teal", tint: "rgba(0,190,192,0.12)" }];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
        <Link to={ICON_LIBRARY_PATH} className={cn(buttonVariants(), "min-h-11")}>
          Download icons <ArrowRight size={16} aria-hidden="true" />
        </Link>
        <a href={ICONS_FIGMA_URL} target="_blank" rel="noopener noreferrer" className="action-focus inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">
          Open icon library in Figma <ArrowUpRight size={15} aria-hidden="true" />
        </a>
        <a href={MATERIAL_SYMBOLS_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="action-focus inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">
          Material Symbols guide <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>

      <dl className="grid gap-5 border-y border-border py-5 sm:grid-cols-3">
        {[["Family", "Material Symbols Rounded"], ["Icon size", "48 × 48 in the source library"], ["Tile proportions", "80px circle, 48px icon (60%)"]].map(([label, value]) => (
          <div key={label}><dt className="text-sm font-semibold">{label}</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">{value}</dd></div>
        ))}
      </dl>

      <div>
        <h3 className="text-xl font-bold">Three icon treatments</h3>
        <p className="mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground">Plain uses the icon alone. Tinted adds a circle in the same color at 12% opacity. Solid uses a full-color circle with white or Midnight ink, depending on the background.</p>
        <div className="my-5 flex flex-wrap gap-2" role="group" aria-label="Icon background">
          {(["light", "dark"] as const).map((value) => (
            <button key={value} type="button" aria-pressed={surface === value} aria-controls="icon-treatment-preview" onClick={() => setSurface(value)} className={cn("action-focus min-h-11 rounded-full border border-og-midnight px-4 py-2 text-sm font-semibold transition-colors", surface === value ? "bg-og-midnight text-white" : "bg-white text-og-midnight hover:bg-og-gray-950")}>
              {value === "light" ? "Light backgrounds" : "Dark backgrounds"}
            </button>
          ))}
        </div>

        <div id="icon-treatment-preview" className={cn("overflow-hidden rounded-lg border border-border", dark ? "bg-og-midnight text-white" : "bg-white text-og-midnight")}>
          <div role="region" aria-label={`Icon treatments on ${surface} backgrounds. Scroll horizontally to see all colors.`} tabIndex={0} className="action-focus overflow-x-auto p-4 md:p-6">
            <table className="w-full min-w-[640px] table-fixed border-separate border-spacing-y-4 text-center">
              <caption className="sr-only">Credit card icon in Plain, Tinted and Solid treatments, using the original Figma artwork</caption>
              <thead><tr><th scope="col" className="w-16 text-left text-xs font-semibold">Style</th>{colors.map((color) => (
                <th scope="col" key={color.name} className="px-1 text-xs font-semibold"><span className="block">{color.name}</span><code className="mt-1 block font-normal">{color.hex}</code></th>
              ))}</tr></thead>
              <tbody>{TREATMENTS.map((treatment) => (
                <tr key={treatment}><th scope="row" className="text-left text-sm font-semibold">{treatment}</th>{colors.map((color) => (
                  <td key={color.name} className="py-1">
                    <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: treatment === "Tinted" ? color.tint : treatment === "Solid" ? color.hex : undefined }}>
                      <img src={`/icon-guidance/${treatment === "Solid" ? dark ? "dark-card-midnight" : "light-card-white" : color.image}.svg`} width={48} height={48} alt="" />
                    </span>
                  </td>
                ))}</tr>
              ))}</tbody>
            </table>
          </div>
          <div className={cn("border-t px-6 py-5", dark ? "border-white/20" : "border-border")}>
            <p className="text-sm font-semibold">In use</p>
            <div className="mt-4 flex flex-wrap gap-8">
              {examples.map((example) => (
                <figure key={example.name} className="text-center">
                  <span className="flex h-20 w-20 items-center justify-center rounded-full" style={{ backgroundColor: example.tint }}><img src={`/icon-guidance/${example.image}.svg`} width={48} height={48} alt="" /></span>
                  <figcaption className="mt-2 text-xs">{example.name}</figcaption>
                </figure>
              ))}
            </div>
            <p className="mt-5 max-w-[68ch] text-sm leading-6">{dark ? "Dark Solid tiles use Midnight icons. Keep white icons for Plain and Tinted treatments." : "Light Solid tiles use white icons. Midnight Plain and Tinted treatments need a light background. Tile Teal is specific to icon treatments."}</p>
          </div>
        </div>
        <p className="mt-3 text-xs leading-5 text-muted-foreground">On small screens, scroll the example table sideways to compare every color.</p>
      </div>

      <details className="border-y border-border py-2">
        <summary className="action-focus min-h-11 cursor-pointer py-3 text-sm font-semibold">Material Symbols settings</summary>
        <p className="mt-2 max-w-[68ch] text-sm leading-6 text-muted-foreground">Choose the Rounded family. Google’s settings control the glyph itself; Plain, Tinted, and Solid describe the surrounding tile treatment. Match the Figma examples and keep these settings consistent within a set.</p>
        <dl className="my-4 grid gap-4 text-sm sm:grid-cols-2">
          {[["Fill", "Outline or filled glyph"], ["Weight", "Stroke thickness"], ["Grade", "Fine adjustments to stroke thickness"], ["Optical size", "Adjusts the symbol for its display size"]].map(([label, description]) => (
            <div key={label}><dt className="font-semibold">{label}</dt><dd className="mt-1 leading-6 text-muted-foreground">{description}</dd></div>
          ))}
        </dl>
      </details>

      <div className="grid gap-6 md:grid-cols-2">
        <div><h3 className="text-base font-semibold">Choose the symbol for the meaning</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Use a Material Symbols Rounded icon that matches the idea: renewals, payments, loyalty, data, or another library category. Keep weight and fill consistent within a set. Use the supplied glyphs instead of emoji or drawn substitutes.</p></div>
        <div><h3 className="text-base font-semibold">Keep the label readable</h3><p className="mt-2 text-sm leading-6 text-muted-foreground">Pair decorative icon tiles with text that carries the meaning. Pink and teal treatments can have low contrast on white. Use Midnight for small text on light backgrounds.</p></div>
      </div>
    </div>
  );
}
