import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Download, Loader2, Search } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { useAuthUser } from "@/hooks/use-auth-user";
import { recordAssetDownload } from "@/lib/asset-downloads";
import { buildIconSvg, buildIconZip, iconBlob, saveBlob } from "@/lib/icon-render";
import { cn } from "@/lib/utils";
import {
  ICON_COUNT, ICON_FORMATS, ICON_SURFACES, ICON_TREATMENTS,
  iconColors, iconFilename, iconLabel, iconZipFilename, loadIconLibrary, matchesIconQuery, styleSlug,
  type IconFormat, type IconGlyph, type IconLibraryData, type IconStyle, type IconSurface, type IconTreatment,
} from "@/data/icon-library";

const DEFAULT_COLOR: Record<IconSurface, string> = { light: "Brand Green", dark: "Groovy Green" };
const LICENSE_URL = "/icon-guidance/LICENSE.txt";

let licenseText: string | null = null;
async function loadLicense() {
  if (licenseText) return licenseText;
  const response = await fetch(LICENSE_URL);
  if (!response.ok) throw new Error("License unavailable");
  licenseText = await response.text();
  return licenseText;
}

function svgDataUrl(svg: string) {
  return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
}

function Toggle({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={pressed} onClick={onClick}
      className={cn("action-focus inline-flex min-h-11 items-center gap-2 rounded-full border border-og-midnight px-4 py-2 text-sm font-semibold transition-colors", pressed ? "bg-og-midnight text-white" : "bg-white text-og-midnight hover:bg-og-gray-950")}>
      {children}
    </button>
  );
}

function ControlGroup({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  const id = useId();
  return (
    <div>
      <p id={id} className="text-sm font-semibold">{label}</p>
      <div role="group" aria-labelledby={id} className="mt-2 flex flex-wrap gap-2">{children}</div>
      {hint && <p className="mt-2 max-w-[60ch] text-xs leading-5 text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function IconLibrary() {
  const user = useAuthUser();
  const [library, setLibrary] = useState<IconLibraryData | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  const [surface, setSurface] = useState<IconSurface>("light");
  const [colorName, setColorName] = useState(DEFAULT_COLOR.light);
  const [treatment, setTreatment] = useState<IconTreatment>("tinted");
  const [format, setFormat] = useState<IconFormat>("png");
  const [categoryId, setCategoryId] = useState("all");
  const [query, setQuery] = useState("");

  const [zipProgress, setZipProgress] = useState<{ done: number; total: number } | null>(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const searchId = useId();
  const categoryFieldId = useId();

  useEffect(() => {
    let active = true;
    setLoadError(false);
    loadIconLibrary().then((data) => { if (active) setLibrary(data); }).catch(() => { if (active) setLoadError(true); });
    return () => { active = false; };
  }, [attempt]);

  const colors = iconColors(surface);
  const color = colors.find((item) => item.name === colorName) ?? colors[0];
  const style = useMemo<IconStyle>(() => ({ surface, color, treatment }), [surface, color, treatment]);
  const dark = surface === "dark";
  const trimmedQuery = query.trim();

  const visible = useMemo(() => {
    if (!library) return [];
    return library.categories
      .filter((category) => categoryId === "all" || category.id === categoryId)
      .map((category) => ({ ...category, icons: category.icons.filter((icon) => matchesIconQuery(icon, category, trimmedQuery)) }))
      .filter((category) => category.icons.length > 0);
  }, [library, categoryId, trimmedQuery]);
  const visibleCount = visible.reduce((sum, category) => sum + category.icons.length, 0);

  const previews = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of visible) for (const icon of category.icons) map.set(icon.name, svgDataUrl(buildIconSvg(icon, style)));
    return map;
  }, [visible, style]);

  const changeSurface = (next: IconSurface) => {
    setSurface(next);
    setColorName((current) => iconColors(next).some((item) => item.name === current) ? current : DEFAULT_COLOR[next]);
  };

  const downloadIcon = async (icon: IconGlyph) => {
    setError("");
    try {
      const filename = iconFilename(icon.name, style, format);
      saveBlob(await iconBlob(icon, style, format), filename);
      setStatus(`Downloaded ${filename}`);
      recordAssetDownload(user?.id, { asset_type: "icon", asset_id: icon.name, variant: styleSlug(style), format, item_count: 1 });
    } catch {
      setError(`${iconLabel(icon.name)} couldn't be downloaded. Try again.`);
    }
  };

  const downloadZip = async () => {
    if (zipProgress || visibleCount === 0) return;
    const scope = trimmedQuery ? "search" : categoryId;
    const categories = visible;
    const zipStyle = style;
    const zipFormat = format;
    setError(""); setStatus("");
    setZipProgress({ done: 0, total: visibleCount });
    try {
      const license = await loadLicense();
      const blob = await buildIconZip(categories, zipStyle, zipFormat, license, (done, total) => setZipProgress({ done, total }));
      const filename = iconZipFilename(scope, zipStyle, zipFormat);
      saveBlob(blob, filename);
      setStatus(`Downloaded ${filename}`);
      recordAssetDownload(user?.id, { asset_type: "icon_set", asset_id: scope, variant: styleSlug(zipStyle), format: zipFormat, item_count: visibleCount });
    } catch {
      setError("The ZIP couldn't be created. Try again.");
    } finally {
      setZipProgress(null);
    }
  };

  const activeCategory = library?.categories.find((category) => category.id === categoryId);
  const formatLabel = format.toUpperCase();
  const zipLabel = zipProgress
    ? `Building ZIP: ${zipProgress.done} of ${zipProgress.total}`
    : `Download ${visibleCount === ICON_COUNT ? `all ${ICON_COUNT}` : visibleCount} ${formatLabel}${visibleCount === 1 ? "" : "s"} as ZIP`;
  const summary = trimmedQuery
    ? `${visibleCount} ${visibleCount === 1 ? "icon matches" : "icons match"} “${trimmedQuery}”${activeCategory ? ` in ${activeCategory.name}` : ""}`
    : activeCategory ? `${activeCategory.name}: ${visibleCount} icons` : `All ${visibleCount} icons`;
  const previewSize = treatment === "plain" ? 34 : 56;

  return (
    <div id="icon-library">
      <div className="grid gap-6 lg:grid-cols-2">
        <ControlGroup label="Background">
          {ICON_SURFACES.map((item) => (
            <Toggle key={item.id} pressed={surface === item.id} onClick={() => changeSurface(item.id)}>{item.label}</Toggle>
          ))}
        </ControlGroup>
        <ControlGroup label="Color">
          {colors.map((item) => (
            <Toggle key={item.name} pressed={color.name === item.name} onClick={() => setColorName(item.name)}>
              <span aria-hidden="true" className="h-4 w-4 shrink-0 rounded-full border border-og-midnight/20" style={{ backgroundColor: item.hex }} />
              {item.name}
            </Toggle>
          ))}
        </ControlGroup>
        <ControlGroup label="Style">
          {ICON_TREATMENTS.map((item) => (
            <Toggle key={item.id} pressed={treatment === item.id} onClick={() => setTreatment(item.id)}>{item.label}</Toggle>
          ))}
        </ControlGroup>
        <ControlGroup label="Format" hint={ICON_FORMATS.find((item) => item.id === format)?.description}>
          {ICON_FORMATS.map((item) => (
            <Toggle key={item.id} pressed={format === item.id} onClick={() => setFormat(item.id)}>{item.label}</Toggle>
          ))}
        </ControlGroup>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-[minmax(0,1fr)_minmax(0,16rem)]">
        <div>
          <label htmlFor={searchId} className="text-sm font-semibold">Search icons</label>
          <div className="relative mt-2">
            <Search aria-hidden="true" size={16} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input id={searchId} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try card, truck or chart" autoComplete="off"
              className="action-focus block min-h-11 w-full rounded border border-input bg-background py-2 pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground" />
          </div>
        </div>
        <div>
          <label htmlFor={categoryFieldId} className="text-sm font-semibold">Category</label>
          <select id={categoryFieldId} value={categoryId} onChange={(event) => setCategoryId(event.target.value)}
            className="action-focus mt-2 block min-h-11 w-full rounded border border-input bg-background px-3 text-sm text-foreground">
            <option value="all">All categories ({ICON_COUNT})</option>
            {library?.categories.map((category) => <option key={category.id} value={category.id}>{category.name} ({category.icons.length})</option>)}
          </select>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold" aria-live="polite">{library ? summary : ""}</p>
        <button type="button" onClick={downloadZip} disabled={!library || visibleCount === 0 || Boolean(zipProgress)} className={cn(buttonVariants(), "min-h-11")}>
          {zipProgress ? <Loader2 aria-hidden="true" className="animate-spin" /> : <Download aria-hidden="true" />}
          {zipLabel}
        </button>
      </div>
      <p className="mt-3 text-xs leading-5 text-muted-foreground">
        Every ZIP has a folder per category, plus the Material Symbols license (Apache 2.0) and a notice. Icons not in this library? Use Material Symbols Rounded at weight 400, or ask Marketing.
      </p>
      <div className="mt-2 min-h-5 text-sm">
        {error ? <p role="alert" className="font-semibold text-og-radish dark:text-og-flamingo">{error}</p> : <p role="status" className="text-muted-foreground">{status}</p>}
      </div>

      <div className={cn("mt-3 overflow-hidden rounded-lg border border-border", dark ? "bg-og-midnight text-white" : "bg-white text-og-midnight")}>
        {!library && !loadError && (
          <p className="flex min-h-40 items-center justify-center gap-2 p-6 text-sm"><Loader2 aria-hidden="true" size={16} className="animate-spin" />Loading {ICON_COUNT} icons</p>
        )}
        {loadError && (
          <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-6 text-center text-sm">
            <p>The icon library didn't load. Check your connection and try again.</p>
            <button type="button" onClick={() => setAttempt((value) => value + 1)} className={cn("min-h-11 rounded-full border px-4 font-semibold", dark ? "border-white" : "border-og-midnight")}>Try again</button>
          </div>
        )}
        {library && visibleCount === 0 && (
          <p className="p-6 text-sm">No icons match “{trimmedQuery}”. Try another word, like card, truck or chart, or ask Marketing for a new icon.</p>
        )}
        {library && visibleCount > 0 && (
          <div className="space-y-8 p-4 md:p-6">
            {visible.map((category) => (
              <section key={category.id} aria-labelledby={`icons-${category.id}`}>
                <h2 id={`icons-${category.id}`} className="text-sm font-semibold">
                  {category.name} <span className={cn("font-normal", dark ? "text-white/70" : "text-og-gray-400")}>({category.icons.length})</span>
                </h2>
                <ul className="mt-3 grid grid-cols-[repeat(auto-fill,minmax(5.5rem,1fr))] gap-1">
                  {category.icons.map((icon) => (
                    <li key={icon.name}>
                      <button type="button" onClick={() => downloadIcon(icon)} title={`Download ${icon.name} (${formatLabel})`}
                        aria-label={`Download ${iconLabel(icon.name)}, ${formatLabel}`}
                        className={cn("flex w-full flex-col items-center rounded px-1 pb-2 pt-1 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset",
                          dark ? "hover:bg-white/10 focus-visible:ring-white" : "hover:bg-og-gray-950 focus-visible:ring-og-midnight")}>
                        <span className="flex h-16 w-16 items-center justify-center">
                          <img src={previews.get(icon.name)} alt="" width={previewSize} height={previewSize} decoding="async" />
                        </span>
                        <span className={cn("mt-1 line-clamp-2 text-center text-[11px] leading-4 [overflow-wrap:anywhere]", dark ? "text-white/80" : "text-og-gray-300")}>
                          {icon.name.split("_").map((part, index) => <span key={index}>{index > 0 && <>_<wbr /></>}{part}</span>)}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
