import type { SocialTemplate } from "../data/social-templates";

export type ProcessedPhoto = {
  blob: Blob;
  image: HTMLImageElement;
  url: string;
  width: number;
  height: number;
  /** Intake stores PNG only when pixels are transparent (a cut-out); everything else is JPEG. */
  hasTransparency: boolean;
};

const DECODE_ERROR = "We couldn't read this photo. Save it as JPEG and try again.";

export function canvasBlob(canvas: HTMLCanvasElement, type = "image/png", quality?: number): Promise<Blob> {
  return new Promise((resolve, reject) => canvas.toBlob((blob) => blob ? resolve(blob) : reject(new Error("PNG couldn't be created. Try again.")), type, quality));
}

export async function restoreSocialPhoto(blob: Blob): Promise<ProcessedPhoto> {
  const url = URL.createObjectURL(blob);
  const image = new Image();
  image.src = url;
  try {
    await image.decode();
    return { image, url, blob, width: image.naturalWidth, height: image.naturalHeight, hasTransparency: blob.type === "image/png" };
  } catch {
    URL.revokeObjectURL(url);
    throw new Error(DECODE_ERROR);
  }
}

/** Read common raster headers without allocating decoded pixels. JPEG dimensions precede scan data. */
export function socialPhotoDimensions(bytes: Uint8Array): { width: number; height: number } | null {
  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const ascii = (offset: number, count: number) => String.fromCharCode(...bytes.slice(offset, offset + count));
  if (bytes.length >= 24 && view.getUint32(0) === 0x89504e47 && ascii(12, 4) === "IHDR") return { width: view.getUint32(16), height: view.getUint32(20) };
  if (bytes.length >= 10 && /^GIF8[79]a$/.test(ascii(0, 6))) return { width: view.getUint16(6, true), height: view.getUint16(8, true) };
  if (bytes.length >= 30 && ascii(0, 4) === "RIFF" && ascii(8, 4) === "WEBP") {
    if (ascii(12, 4) === "VP8X") return { width: 1 + bytes[24] + (bytes[25] << 8) + (bytes[26] << 16), height: 1 + bytes[27] + (bytes[28] << 8) + (bytes[29] << 16) };
    if (ascii(12, 4) === "VP8 ") return { width: view.getUint16(26, true) & 0x3fff, height: view.getUint16(28, true) & 0x3fff };
    if (ascii(12, 4) === "VP8L" && bytes[20] === 0x2f) {
      const bits = view.getUint32(21, true);
      return { width: 1 + (bits & 0x3fff), height: 1 + ((bits >>> 14) & 0x3fff) };
    }
  }
  if (bytes.length >= 26 && ascii(0, 2) === "BM" && view.getUint32(14, true) >= 40) return { width: Math.abs(view.getInt32(18, true)), height: Math.abs(view.getInt32(22, true)) };
  if (bytes.length >= 4 && view.getUint16(0) === 0xffd8) {
    let offset = 2;
    while (offset + 3 < bytes.length) {
      if (bytes[offset++] !== 0xff) break;
      while (bytes[offset] === 0xff) offset++;
      const marker = bytes[offset++];
      if (marker === 0xda || marker === 0xd9) break;
      if (marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (offset + 2 > bytes.length) break;
      const length = view.getUint16(offset);
      if (length < 2 || offset + length > bytes.length) break;
      if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker) && length >= 7) return { width: view.getUint16(offset + 5), height: view.getUint16(offset + 3) };
      offset += length;
    }
  }
  return null;
}

export function assertSocialPhotoSize({ width, height }: { width: number; height: number }) {
  if (!width || !height) throw new Error(DECODE_ERROR);
  if (width * height > 50_000_000) throw new Error("Choose a photo with 50 megapixels or fewer.");
}

export function socialPhotoEncoding(hasTransparency: boolean): { type: string; quality?: number } {
  return hasTransparency ? { type: "image/png" } : { type: "image/jpeg", quality: 0.9 };
}

function hasTransparentPixels(ctx: CanvasRenderingContext2D, width: number, height: number): boolean {
  // Bound the readback allocation, including for wide panoramas.
  for (let y = 0; y < height; y += 64) {
    const pixels = ctx.getImageData(0, y, width, Math.min(64, height - y)).data;
    for (let i = 3; i < pixels.length; i += 4) if (pixels[i] !== 255) return true;
  }
  return false;
}

/** Cut-outs usually touch the top of the photo. Transparent space above lets people drag the head
 * lower in a cut-out frame, clear of headline text. Returns a new canvas; the source is left unchanged. */
export function withCutoutHeadroom(source: HTMLCanvasElement, fraction = 0.2): HTMLCanvasElement {
  const padded = document.createElement("canvas");
  const top = Math.round(source.height * fraction);
  padded.width = source.width;
  padded.height = source.height + top;
  const ctx = padded.getContext("2d");
  if (!ctx) throw new Error(DECODE_ERROR);
  ctx.drawImage(source, 0, top);
  return padded;
}

/** Normalize EXIF orientation, freeze frame 1, and retain only output-sized pixels. */
export async function processSocialPhoto(file: File, frame: NonNullable<SocialTemplate["photo"]>): Promise<ProcessedPhoto> {
  if (file.size > 25_000_000) throw new Error("Choose a photo that is 25 MB or smaller.");
  const prefix = (await file.slice(0, 1024).text()).split("\u0000").join("").replace(/\uFEFF/g, "").trimStart();
  const isSvg = /svg/i.test(file.type) || /\.svgz?$/i.test(file.name) ||
    ((!prefix || prefix.startsWith("<")) && /<svg[\s>]/i.test((await file.text()).split("\u0000").join("")));
  if (isSvg) throw new Error("SVG photos aren't supported. Choose a JPEG, PNG or another photo format.");

  const dimensions = socialPhotoDimensions(new Uint8Array(await file.arrayBuffer()));
  let probe: HTMLImageElement | undefined;
  let probeUrl: string | undefined;
  let source: ImageBitmap | HTMLImageElement | undefined;
  const canvas = document.createElement("canvas");
  try {
    if (dimensions) assertSocialPhotoSize(dimensions);
    else {
      // Other browser-supported formats: inspect natural size after load, before requesting a full bitmap.
      // A browser may decode during load; headers above avoid that for common phone formats.
      probeUrl = URL.createObjectURL(file);
      probe = new Image();
      await new Promise<void>((resolve, reject) => {
        probe!.onload = () => resolve();
        probe!.onerror = () => reject(new Error(DECODE_ERROR));
        probe!.src = probeUrl!;
      });
      assertSocialPhotoSize({ width: probe.naturalWidth, height: probe.naturalHeight });
    }
    try {
      source = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      if (!probe) {
        probeUrl = URL.createObjectURL(file);
        probe = new Image();
        probe.src = probeUrl;
        await probe.decode().catch(() => { throw new Error(DECODE_ERROR); });
      }
      source = probe;
    }
    const width = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
    const height = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
    assertSocialPhotoSize({ width, height });
    const scale = Math.min(1, Math.max(frame.width * frame.maxZoom / width, frame.height * frame.maxZoom / height), 8192 / width, 8192 / height, Math.sqrt(16_000_000 / (width * height)));
    canvas.width = Math.max(1, Math.round(width * scale));
    canvas.height = Math.max(1, Math.round(height * scale));
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error(DECODE_ERROR);
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    const transparent = hasTransparentPixels(ctx, canvas.width, canvas.height);
    const encoding = socialPhotoEncoding(transparent);
    if (transparent && frame.opaqueClip) {
      const padded = withCutoutHeadroom(canvas);
      try { return await restoreSocialPhoto(await canvasBlob(padded, "image/png")); } finally { padded.width = padded.height = 0; }
    }
    return await restoreSocialPhoto(await canvasBlob(canvas, encoding.type, encoding.quality));
  } finally {
    if (probeUrl) URL.revokeObjectURL(probeUrl);
    if (source && "close" in source) source.close();
    canvas.width = canvas.height = 0;
  }
}
