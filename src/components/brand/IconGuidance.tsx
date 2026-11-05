import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpRight, Check, Copy } from "lucide-react";
import { ICON_COLORS, MATERIAL_SYMBOLS_GUIDE_URL, MATERIAL_SYMBOLS_LIBRARY_URL } from "@/data/brand-resources";
import { buttonVariants } from "@/components/ui/button";
import { ICON_LIBRARY_PATH } from "@/data/hub";
import { useCopyText } from "@/hooks/use-copy-text";
import { cn } from "@/lib/utils";

type Surface = keyof typeof ICON_COLORS;
type IconColor = (typeof ICON_COLORS)[Surface][number];

const TREATMENTS = ["Plain", "Tinted", "Solid"] as const;
const SURFACES: { id: Surface; label: string }[] = [
  { id: "light", label: "Light backgrounds" },
  { id: "dark", label: "Dark backgrounds" },
];

function HexCopyBox({ name, hex, dark }: { name: string; hex: string; dark: boolean }) {
  const { copy, copied, error } = useCopyText(hex);

  return (
    <>
      <button type="button" onClick={copy} aria-label={`Copy ${name} hex ${hex}`} title={`Copy ${hex}`}
        className={cn("action-focus inline-flex min-h-11 w-[108px] shrink-0 select-text items-center justify-center gap-1.5 rounded border px-2 font-mono text-[11px] font-normal tracking-normal transition-colors",
          dark ? "border-white/40 bg-white/5 text-white hover:bg-white/10 focus-visible:outline-white" : "border-og-midnight/50 bg-og-midnight/[0.03] text-og-midnight hover:bg-og-midnight/[0.07]")}>
        {copied ? <Check size={12} aria-hidden="true" className="shrink-0" /> : <Copy size={12} aria-hidden="true" className="shrink-0 opacity-60" />}
        {copied ? "Copied" : hex}
      </button>
      <span role="status" className="sr-only">
        {error ? `Copy unavailable. Select ${hex} to copy manually.` : copied ? `${name} hex ${hex} copied` : ""}
      </span>
    </>
  );
}

function IconTile({ treatment, color, surface }: { treatment: (typeof TREATMENTS)[number]; color: IconColor; surface: Surface }) {
  const background = treatment === "Tinted" ? color.tint : treatment === "Solid" ? color.hex : undefined;
  const image = treatment === "Solid" ? (surface === "dark" ? "dark-card-midnight" : "light-card-white") : color.image;
  return (
    <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full sm:h-14 sm:w-14" style={{ backgroundColor: background }}>
      <img src={`/icon-guidance/${image}.svg`} width={48} height={48} alt="" className="h-3/5 w-3/5" />
    </span>
  );
}

/** One table: colors as rows, treatments as columns, light band above dark band. */
function IconTreatmentPreview() {
  return (
    <div id="icon-treatment-preview" className="max-w-[720px] overflow-hidden rounded-lg border border-border">
      <table className="w-full table-fixed border-collapse text-center">
        <caption className="sr-only">Material Symbols Rounded in Plain, Tinted and Solid treatments, one row per color, light backgrounds then dark backgrounds</caption>
        <colgroup>
          <col className="w-[42%] sm:w-[44%]" />
          <col />
          <col />
          <col />
        </colgroup>
        <thead className="bg-white text-og-midnight">
          <tr className="border-b border-border">
            <th scope="col" className="px-4 py-3 text-left text-xs font-semibold">Color</th>
            {TREATMENTS.map((treatment) => <th key={treatment} scope="col" className="py-3 text-xs font-semibold">{treatment}</th>)}
          </tr>
        </thead>
        {SURFACES.map((surface) => {
          const dark = surface.id === "dark";
          const colors = ICON_COLORS[surface.id];
          return (
            <tbody key={surface.id} className={dark ? "bg-og-midnight text-white" : "bg-white text-og-midnight"}>
              <tr>
                <th scope="rowgroup" colSpan={4} className="px-4 pb-1 pt-5 text-left text-sm font-semibold">{surface.label}</th>
              </tr>
              {colors.map((color, index) => {
                const last = index === colors.length - 1;
                return (
                  <tr key={color.name}>
                    <th scope="row" className={cn("px-4 py-2 text-left font-normal", last && "pb-5")}>
                      <span className="flex flex-col items-start gap-1.5 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                        <span className="text-sm font-semibold">{color.name}</span>
                        <HexCopyBox name={color.name} hex={color.hex} dark={dark} />
                      </span>
                    </th>
                    {TREATMENTS.map((treatment) => (
                      <td key={treatment} className={cn("py-2", last && "pb-5")}>
                        <IconTile treatment={treatment} color={color} surface={surface.id} />
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          );
        })}
      </table>
    </div>
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

      <IconTreatmentPreview />

      <div className="flex justify-end">
        <a href={MATERIAL_SYMBOLS_GUIDE_URL} target="_blank" rel="noopener noreferrer" className="action-focus inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">
          Material Symbols guide <ArrowUpRight size={15} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}
