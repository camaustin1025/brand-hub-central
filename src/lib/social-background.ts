import type { PhotoFrame } from "../data/social-templates";
import { canvasBlob, restoreSocialPhoto, withCutoutHeadroom, type ProcessedPhoto } from "./social-photo";

/* Background removal runs entirely in this browser with MediaPipe's Selfie Segmenter (Apache-2.0).
 * The wasm runtime and model are self-hosted under public/mediapipe and load only when someone asks
 * for a cut-out, so photos never leave the device and no third-party host is contacted. */
const BASE = `${import.meta.env.BASE_URL}mediapipe`;
type Segmenter = import("@mediapipe/tasks-vision").ImageSegmenter;
let segmenter: Promise<Segmenter> | null = null;

export type BackgroundStage = "loading" | "removing";
export const BACKGROUND_REMOVAL_ERROR = "We couldn't remove the background from this photo. Your original photo is still in place.";

function loadSegmenter(): Promise<Segmenter> {
  segmenter ??= (async () => {
    const { FilesetResolver, ImageSegmenter } = await import("@mediapipe/tasks-vision");
    const fileset = await FilesetResolver.forVisionTasks(`${BASE}/wasm`);
    return ImageSegmenter.createFromOptions(fileset, {
      baseOptions: { modelAssetPath: `${BASE}/selfie_segmenter.tflite`, delegate: "CPU" },
      runningMode: "IMAGE",
      outputCategoryMask: false,
      outputConfidenceMasks: true,
    });
  })();
  // A failed load can be retried on the next attempt.
  segmenter.catch(() => { segmenter = null; });
  return segmenter;
}

/** Map person confidence (0-1) to alpha (0-255): a narrow ramp keeps hair soft without a halo of old background. */
export function confidenceToAlpha(confidence: number, low = 0.35, high = 0.75): number {
  const t = Math.min(1, Math.max(0, (confidence - low) / (high - low)));
  return Math.round(t * t * (3 - 2 * t) * 255);
}

/** Mean over a (2r+1)² window, clamped at the edges. Two separable running sums, O(pixels). */
function boxMean(source: Float32Array, width: number, height: number, r: number): Float32Array {
  const rows = new Float32Array(source.length);
  const out = new Float32Array(source.length);
  for (let y = 0; y < height; y++) {
    const row = y * width;
    let sum = 0;
    for (let x = 0; x <= Math.min(r, width - 1); x++) sum += source[row + x];
    for (let x = 0; x < width; x++) {
      const lo = Math.max(0, x - r), hi = Math.min(width - 1, x + r);
      rows[row + x] = sum / (hi - lo + 1);
      if (x + r + 1 < width) sum += source[row + x + r + 1];
      if (x - r >= 0) sum -= source[row + x - r];
    }
  }
  for (let x = 0; x < width; x++) {
    let sum = 0;
    for (let y = 0; y <= Math.min(r, height - 1); y++) sum += rows[y * width + x];
    for (let y = 0; y < height; y++) {
      const lo = Math.max(0, y - r), hi = Math.min(height - 1, y + r);
      out[y * width + x] = sum / (hi - lo + 1);
      if (y + r + 1 < height) sum += rows[(y + r + 1) * width + x];
      if (y - r >= 0) sum -= rows[(y - r) * width + x];
    }
  }
  return out;
}

/** Guided filter (He et al.): snaps the coarse 256-pixel mask to edges in the photo itself, so hair and
 * shoulders follow the real outline instead of the model's grid. Guide is luminance from 0 to 1. */
export function guidedMask(guide: Float32Array, mask: Float32Array, width: number, height: number, r: number, eps = 1e-3): Float32Array {
  const n = guide.length;
  const ii = new Float32Array(n), ip = new Float32Array(n);
  for (let i = 0; i < n; i++) { ii[i] = guide[i] * guide[i]; ip[i] = guide[i] * mask[i]; }
  const meanI = boxMean(guide, width, height, r), meanP = boxMean(mask, width, height, r);
  const corrI = boxMean(ii, width, height, r), corrIp = boxMean(ip, width, height, r);
  const a = ii, b = ip; // reuse buffers
  for (let i = 0; i < n; i++) {
    const variance = corrI[i] - meanI[i] * meanI[i];
    a[i] = (corrIp[i] - meanI[i] * meanP[i]) / (variance + eps);
    b[i] = meanP[i] - a[i] * meanI[i];
  }
  const meanA = boxMean(a, width, height, r), meanB = boxMean(b, width, height, r);
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = meanA[i] * guide[i] + meanB[i];
  return out;
}

/** Returns a new transparent PNG photo. The original photo object is left untouched for "Use original photo". */
export async function removeSocialPhotoBackground(photo: ProcessedPhoto, frame: PhotoFrame, onStage?: (stage: BackgroundStage) => void): Promise<ProcessedPhoto> {
  onStage?.("loading");
  const model = await loadSegmenter();
  onStage?.("removing");
  // Let the status paint before the synchronous segmentation call.
  await new Promise((resolve) => setTimeout(resolve, 30));
  const canvas = document.createElement("canvas");
  const maskCanvas = document.createElement("canvas");
  let padded: HTMLCanvasElement | null = null;
  try {
    canvas.width = photo.width;
    canvas.height = photo.height;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) throw new Error(BACKGROUND_REMOVAL_ERROR);
    ctx.drawImage(photo.image, 0, 0);
    const result = model.segment(canvas);
    try {
      const masks = result.confidenceMasks ?? [];
      // Selfie Segmenter reports one person-confidence mask; a two-class model puts the person second.
      const mask = masks.length > 1 ? masks[1] : masks[0];
      if (!mask) throw new Error(BACKGROUND_REMOVAL_ERROR);
      const confidence = mask.getAsFloat32Array();
      // Upsample the mask with the browser's smoothing so edges follow the photo, not the model grid.
      maskCanvas.width = mask.width;
      maskCanvas.height = mask.height;
      const maskCtx = maskCanvas.getContext("2d");
      if (!maskCtx) throw new Error(BACKGROUND_REMOVAL_ERROR);
      const maskPixels = maskCtx.createImageData(mask.width, mask.height);
      for (let i = 0; i < confidence.length; i++) maskPixels.data[i * 4 + 3] = Math.round(Math.min(1, Math.max(0, confidence[i])) * 255);
      maskCtx.putImageData(maskPixels, 0, 0);
    } finally { result.close(); }
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const scaled = document.createElement("canvas");
    try {
      scaled.width = canvas.width;
      scaled.height = canvas.height;
      const scaledCtx = scaled.getContext("2d", { willReadFrequently: true });
      if (!scaledCtx) throw new Error(BACKGROUND_REMOVAL_ERROR);
      scaledCtx.imageSmoothingQuality = "high";
      // Upscale raw confidence, soften the interpolation steps, then sharpen into alpha at full size,
      // so the edge is a smooth curve instead of the model's 256-pixel staircase.
      const step = Math.max(scaled.width / maskCanvas.width, scaled.height / maskCanvas.height);
      scaledCtx.filter = `blur(${Math.max(0.5, step * 0.6).toFixed(1)}px)`;
      scaledCtx.drawImage(maskCanvas, 0, 0, scaled.width, scaled.height);
      const alpha = scaledCtx.getImageData(0, 0, scaled.width, scaled.height).data;
      const count = canvas.width * canvas.height;
      const guide = new Float32Array(count), coarse = new Float32Array(count);
      for (let i = 0; i < count; i++) {
        const p = i * 4;
        guide[i] = (0.299 * pixels.data[p] + 0.587 * pixels.data[p + 1] + 0.114 * pixels.data[p + 2]) / 255;
        coarse[i] = alpha[p + 3] / 255;
      }
      const refined = guidedMask(guide, coarse, canvas.width, canvas.height, Math.max(2, Math.round(step * 1.5)));
      let kept = 0;
      for (let i = 0; i < count; i++) { const value = confidenceToAlpha(refined[i]); pixels.data[i * 4 + 3] = value; if (value > 127) kept++; }
      const coverage = kept / count;
      // No person found, or nothing removed: keep the original rather than a broken cut-out.
      if (coverage < 0.03 || coverage > 0.97) throw new Error(BACKGROUND_REMOVAL_ERROR);
    } finally { scaled.width = scaled.height = 0; }
    ctx.putImageData(pixels, 0, 0);
    padded = frame.opaqueClip ? withCutoutHeadroom(canvas) : null;
    return await restoreSocialPhoto(await canvasBlob(padded ?? canvas, "image/png"));
  } finally {
    canvas.width = canvas.height = 0;
    maskCanvas.width = maskCanvas.height = 0;
    if (padded) padded.width = padded.height = 0;
  }
}
