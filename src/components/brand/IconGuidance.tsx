import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ICON_COLORS, MATERIAL_SYMBOLS_GUIDE_URL, MATERIAL_SYMBOLS_LIBRARY_URL } from "@/data/brand-resources";
import { buttonVariants } from "@/components/ui/button";
import { ICON_LIBRARY_PATH } from "@/data/hub";
import { useCopyText } from "@/hooks/use-copy-text";
import { cn } from "@/lib/utils";

const TREATMENTS = ["Plain", "Tinted", "Solid"] as const;

function HexCopyBox({ name, hex, dark }: { name: string; hex: string; dark: boolean }) {
  const { copy, copied, error } = useCopyText(hex);

  return (
    <>
      <button type="button" onClick={copy} aria-label={`Copy ${name} hex ${hex}`} title={`Copy ${hex}`}
        className={cn("action-focus mt-2 inline-flex min-h-11 w-full select-text items-center justify-center rounded border px-1 font-mono text-[11px] font-normal tracking-normal transition-colors",
          dark ? "border-white/40 bg-white/5 text-white hover:bg-white/10 focus-visible:outline-white" : "border-og-midnight/50 bg-og-midnight/[0.03] text-og-midnight hover:bg-og-midnight/[0.07]")}>
        {copied ? "Copied" : hex}
      </button>
      <span role="status" className="sr-only">
        {error ? `Copy unavailable. Select ${hex} to copy manually.` : copied ? `${name} hex ${hex} copied` : ""}
      </span>
    </>
  );
}

function IconTreatmentPreview({ surface }: { surface: "light" | "dark" }) {
  const dark = surface === "dark";
  const colors = ICON_COLORS[surface];
  const title = dark ? "Dark backgrounds" : "Light backgrounds";

  return (
    <section aria-labelledby={`icon-preview-${surface}`} className={cn("min-w-0 overflow-hidden rounded-lg border border-border", dark ? "bg-og-midnight text-white" : "bg-white text-og-midnight")}>
      <h3 id={`icon-preview-${surface}`} className="px-4 pt-5 text-sm font-semibold">{title}</h3>
      <div role="region" aria-label={`Icon treatments on ${surface} backgrounds. Scroll horizontally to see all colors.`} tabIndex={0} className={cn("action-focus overflow-x-auto p-4 pt-0", dark && "focus-visible:outline-white")}>
        <table className="w-full min-w-[384px] table-fixed border-separate border-spacing-y-3 text-center">
          <caption className="sr-only">Material Symbols Rounded in Plain, Tinted and Solid treatments on {surface} backgrounds</caption>
          <thead><tr><th scope="col" className="w-12 text-left text-xs font-semibold">Style</th>{colors.map((color) => (
            <th scope="col" key={color.name} className="px-1 align-top text-xs font-semibold">
              <span className="flex min-h-8 items-center justify-center">{color.name}</span>
              <HexCopyBox name={color.name} hex={color.hex} dark={dark} />
            </th>
          ))}</tr></thead>
          <tbody>{TREATMENTS.map((treatment) => (
            <tr key={treatment}><th scope="row" className="text-left text-sm font-semibold">{treatment}</th>{colors.map((color) => (
              <td key={color.name} className="py-1">
                <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full" style={{ backgroundColor: treatment === "Tinted" ? color.tint : treatment === "Solid" ? color.hex : undefined }}>
                  <img src={`/icon-guidance/${treatment === "Solid" ? dark ? "dark-card-midnight" : "light-card-white" : color.image}.svg`} width={48} height={48} alt="" className="h-3/5 w-3/5" />
                </span>
              </td>
            ))}</tr>
          ))}</tbody>
        </table>
      </div>
    </section>
  );
}

export function IconGuidance() {
  return (
    <div className="space-y-6">
      <div>
        <Link to={ICON_LIBRARY_PATH} className={cn(buttonVariants(), "min-h-11")}>
          Browse all 293 icons <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>

      <dl className="grid gap-5 border-y border-border py-5 sm:grid-cols-3">
        <div>
          <dt className="text-sm font-semibold">Family</dt>
          <dd className="mt-1 text-sm leading-6 text-muted-foreground">
            <a href={MATERIAL_SYMBOLS_LIBRARY_URL} target="_blank" rel="noopener noreferrer" className="action-focus inline-flex items-center gap-1 underline underline-offset-4">
              Material Symbols Rounded <ArrowUpRight size={15} aria-hidden="true" />
            </a>
          </dd>
        </div>
        {[["Icon size", "48 × 48 in the source library"], ["Tile proportions", "80px circle, 48px icon (60%)"]].map(([label, value]) => (
          <div key={label}><dt className="text-sm font-semibold">{label}</dt><dd className="mt-1 text-sm leading-6 text-muted-foreground">{value}</dd></div>
        ))}
      </dl>

      <div>
        <div id="icon-treatment-preview" className="grid gap-6 xl:grid-cols-2">
          <IconTreatmentPreview surface="light" />
          <IconTreatmentPreview surface="dark" />
        </div>
        <p className="mt-2 text-xs leading-5 text-muted-foreground md:hidden">Scroll to compare colors.</p>
      </div>

      <div className="flex justify-end">
        <a href={MATERIAL_SYMBOLS_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="action-focus inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">
          Material Symbols guide <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
