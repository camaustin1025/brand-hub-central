import { useRef, useState, type KeyboardEvent, type RefObject } from "react";
import { ImagePlus } from "lucide-react";
import type { SocialTemplate } from "@/data/social-templates";
import type { ProcessedPhoto } from "@/lib/social-photo";
import { dragSocialCrop, photoSourceRect, socialPhotoFrame, type PhotoCropValue } from "@/lib/social-renderer";
import { cn } from "@/lib/utils";

export function PhotoPosition({ template, photo, sample = false, crop, canvasRef, disabled, onChange, onChoose, onFile }: {
  template: SocialTemplate;
  photo: ProcessedPhoto | null;
  /** The template's sample photo is showing: offer to replace it without covering the face. */
  sample?: boolean;
  crop: PhotoCropValue;
  canvasRef: RefObject<HTMLCanvasElement>;
  disabled: boolean;
  onChange: (crop: PhotoCropValue) => void;
  onChoose: () => void;
  onFile: (file: File) => void;
}) {
  const drag = useRef<{ pointerId: number; x: number; y: number; crop: PhotoCropValue; ratio: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  if (!template.photo) return null;
  // Cut-out designs place opaque photos in a smaller panel; the control follows the photo's actual frame.
  const frame = socialPhotoFrame(template.photo, photo ?? (sample ? { hasTransparency: true } : null));

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (!photo || !frame) return;
    let next: PhotoCropValue;
    const step = event.shiftKey ? 0.1 : 0.02;
    const source = photoSourceRect(photo, frame, crop);
    const scale = frame.width / source.width;
    const dx = (photo.width - source.width) * scale * step;
    const dy = (photo.height - source.height) * scale * step;
    switch (event.key) {
      case "ArrowLeft": next = dragSocialCrop(crop, photo, frame, -dx, 0); break;
      case "ArrowRight": next = dragSocialCrop(crop, photo, frame, dx, 0); break;
      case "ArrowUp": next = dragSocialCrop(crop, photo, frame, 0, -dy); break;
      case "ArrowDown": next = dragSocialCrop(crop, photo, frame, 0, dy); break;
      case "+": case "=": next = { ...crop, zoom: Math.min(frame.maxZoom, crop.zoom + 0.1) }; break;
      case "-": case "_": next = { ...crop, zoom: Math.max(1, crop.zoom - 0.1) }; break;
      default: return;
    }
    event.preventDefault();
    onChange(next);
  }

  // Percent radii scale with the preview: horizontal radii relative to width, vertical to height.
  const radius = frame.radii ? `${frame.radii.map((value) => `${value / frame.width * 100}%`).join(" ")} / ${frame.radii.map((value) => `${value / frame.height * 100}%`).join(" ")}` : undefined;
  return <button type="button" disabled={disabled} aria-label={photo ? "Photo position" : sample ? "Replace sample photo" : "Add photo"}
    className={cn("action-focus absolute flex flex-col gap-1 text-og-midnight", sample && !photo ? "items-end justify-end p-[3%]" : "items-center justify-center", frame.shape === "ellipse" && "rounded-full", photo ? dragging ? "cursor-grabbing" : "cursor-grab" : sample ? "cursor-pointer" : "cursor-pointer hover:bg-white/20")}
    style={{ left: `${frame.x / template.width * 100}%`, top: `${frame.y / template.height * 100}%`, width: `${frame.width / template.width * 100}%`, height: `${frame.height / template.height * 100}%`, borderRadius: radius, touchAction: photo ? "none" : undefined }}
    onClick={() => { if (!photo) onChoose(); }} onKeyDown={onKeyDown}
    onDragOver={(event) => { event.preventDefault(); event.dataTransfer.dropEffect = "copy"; }}
    onDrop={(event) => { event.preventDefault(); if (!disabled && event.dataTransfer.files[0]) onFile(event.dataTransfer.files[0]); }}
    onPointerDown={(event) => {
      if (!photo || event.button !== 0) return;
      const width = canvasRef.current?.getBoundingClientRect().width;
      if (!width) return;
      event.preventDefault(); event.currentTarget.focus();
      event.currentTarget.setPointerCapture(event.pointerId);
      drag.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, crop: { ...crop }, ratio: template.width / width };
      setDragging(true);
    }}
    onPointerMove={(event) => {
      const start = drag.current;
      if (!start || start.pointerId !== event.pointerId || !photo) return;
      onChange(dragSocialCrop(start.crop, photo, frame, (event.clientX - start.x) * start.ratio, (event.clientY - start.y) * start.ratio));
    }}
    onPointerUp={(event) => { if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId); }}
    onPointerCancel={() => { drag.current = null; setDragging(false); }}
    onLostPointerCapture={() => { drag.current = null; setDragging(false); }}>
    {!photo && !sample && <><ImagePlus className="h-5 w-5 sm:h-6 sm:w-6" aria-hidden="true" /><span className="text-[10px] font-semibold sm:text-sm">Add photo</span></>}
    {!photo && sample && <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold shadow-sm sm:px-3 sm:py-1.5 sm:text-sm"><ImagePlus className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />Replace sample photo</span>}
  </button>;
}
