import { Button } from "@/components/ui/button";
import { DEFAULT_PHOTO_CROP, type PhotoCropValue } from "@/lib/social-renderer";

export function PhotoCrop({ value, onChange, disabled, maxZoom }: {
  value: PhotoCropValue;
  onChange: (value: PhotoCropValue) => void;
  disabled: boolean;
  maxZoom: number;
}) {
  return (
    <fieldset disabled={disabled} className="space-y-4 disabled:opacity-50">
      <legend className="mb-2 text-sm font-semibold">Photo position</legend>
      <p id="crop-help" className="text-sm text-muted-foreground">Use the arrow keys to adjust each slider.</p>
      {(["x", "y"] as const).map((axis) => (
        <div key={axis}>
          <label htmlFor={`crop-${axis}`} className="flex justify-between text-sm">
            {axis === "x" ? "Horizontal position" : "Vertical position"}
            <span aria-hidden="true">{Math.round(value[axis] * 100)}%</span>
          </label>
          <input id={`crop-${axis}`} type="range" min="0" max="100" step="1" value={Math.round(value[axis] * 100)}
            aria-label={axis === "x" ? "Horizontal position" : "Vertical position"} aria-valuetext={`${Math.round(value[axis] * 100)}%`}
            aria-describedby="crop-help" className="action-focus mt-2 w-full accent-og-midnight"
            onChange={(event) => onChange({ ...value, [axis]: Number(event.target.value) / 100 })} />
        </div>
      ))}
      <div>
        <label htmlFor="crop-zoom" className="flex justify-between text-sm">Zoom <span aria-hidden="true">{value.zoom.toFixed(2)}×</span></label>
        <input id="crop-zoom" type="range" min="1" max={maxZoom} step="0.05" value={value.zoom}
          aria-label="Zoom" aria-valuetext={`${value.zoom.toFixed(2)} times`}
          aria-describedby="crop-help" className="action-focus mt-2 w-full accent-og-midnight"
          onChange={(event) => onChange({ ...value, zoom: Number(event.target.value) })} />
      </div>
      <Button type="button" size="sm" variant="ghost" onClick={() => onChange({ ...DEFAULT_PHOTO_CROP })}>Reset photo position</Button>
    </fieldset>
  );
}
