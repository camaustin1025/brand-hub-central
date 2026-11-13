import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import { Download, Info, X, ZoomIn, ZoomOut } from "lucide-react";
import { useAuthUser } from "@/hooks/use-auth-user";
import { HubShell } from "@/components/hub/HubShell";
import { Button } from "@/components/ui/button";
import { PhotoPosition } from "@/components/social/PhotoPosition";
import { MarketingContact } from "@/components/social/MarketingContact";
import { getPublishedSocialTemplate, publishedSocialTemplates, PUBLISHED_SOCIAL_TEMPLATES, SOCIAL_ASSETS, type SocialTemplate } from "@/data/social-templates";
import { DESIGN_CANVAS_NAV_ID, DESIGN_CANVAS_PATH, designCanvasCategoryId, designCanvasTemplatePath } from "@/data/hub";
import { cn } from "@/lib/utils";
import { canvasBlob, processSocialPhoto, restoreSocialPhoto, type ProcessedPhoto } from "@/lib/social-photo";
import {
  currentSocialInputs, currentSocialPhotoId, deleteSocialRecord, isFirstSocialDownload, loadSocialState, migratedSocialDraft, saveSocialDraft, saveSocialVersion,
  socialDeletionRemovesPhoto, socialPhotoId, SOCIAL_STORAGE_ERROR, type SocialSnapshot, type SocialVersion,
} from "@/lib/social-drafts";
import { emptySocialFields, formatSocialField, socialPrimaryValue } from "@/lib/social-fields";
import { recordSocialUsage } from "@/lib/social-usage";
import {
  DEFAULT_PHOTO_CROP, drawSocialGraphic, exportSocialPng, loadSocialResources, socialDownloadFilename,
  type SocialFieldErrors, type SocialInputs, type SocialResources,
} from "@/lib/social-renderer";

type FixtureModule = typeof import("@/data/social-template-fixture");
// A guarded dynamic import keeps fixture modules and their PNGs out of production.
const developmentFixtures = import.meta.env.DEV ? import("@/data/social-template-fixture") : null;

const emptyInputs = (definition: SocialTemplate, name = ""): SocialInputs => ({ fields: emptySocialFields(definition, name), variantId: definition.variants[0].id, crop: { ...DEFAULT_PHOTO_CROP } });

function canSharePng(png: Blob, filename: string): boolean {
  try {
    return matchMedia("(pointer: coarse)").matches && !!navigator.share && !!navigator.canShare?.({ files: [new File([png], filename, { type: "image/png" })] });
  } catch { return false; }
}

function VersionThumbnail({ blob, width, height }: { blob: Blob; width: number; height: number }) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url ? <img src={url} alt="" className="w-full object-contain" style={{ aspectRatio: `${width} / ${height}` }} /> : null;
}

async function thumbnailFor(png: Blob): Promise<Blob> {
  const image = await restoreSocialPhoto(png);
  const canvas = document.createElement("canvas");
  try {
    canvas.width = 240;
    canvas.height = Math.round(240 * image.height / image.width);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas unavailable");
    ctx.drawImage(image.image, 0, 0, canvas.width, canvas.height);
    return await canvasBlob(canvas, "image/jpeg", 0.8);
  } finally { URL.revokeObjectURL(image.url); canvas.width = canvas.height = 0; }
}

function SocialEditor({ definition, initialName, ownerUserId, assets }: { definition: SocialTemplate; initialName: string; ownerUserId: string; assets?: Record<string, string> }) {
  const navigate = useNavigate();
  const [inputs, setInputs] = useState<SocialInputs>(() => emptyInputs(definition, initialName));
  const [resources, setResources] = useState<SocialResources | null>(null);
  const [photo, setPhoto] = useState<ProcessedPhoto | null>(null);
  const [photoBusy, setPhotoBusy] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [storageInfoOpen, setStorageInfoOpen] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [templateError, setTemplateError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<SocialFieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [attempted, setAttempted] = useState(false);
  const [previewReady, setPreviewReady] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState("");
  const [renderAttempt, setRenderAttempt] = useState(0);
  const [status, setStatus] = useState("");
  const [saveStatus, setSaveStatus] = useState("");
  const [storageError, setStorageError] = useState(false);
  const [localReady, setLocalReady] = useState(false);
  const [hasDraft, setHasDraft] = useState(false);
  const [versions, setVersions] = useState<SocialVersion[]>([]);
  const [changed, setChanged] = useState(0);
  const [designUpdated, setDesignUpdated] = useState(false);
  const [preparedPng, setPreparedPng] = useState<Blob | null>(null);
  const [shareSupported, setShareSupported] = useState(() => canSharePng(new Blob([new Uint8Array(1)], { type: "image/png" }), socialDownloadFilename(definition, inputs.fields)));
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const photoRef = useRef<ProcessedPhoto | null>(null);
  const photoIdRef = useRef<string | null>(null);
  const photoRequest = useRef(0);
  const mounted = useRef(false);
  const opened = useRef(false);
  const downloadUrls = useRef(new Set<string>());
  const saveQueue = useRef<Promise<unknown>>(Promise.resolve());
  const saveGeneration = useRef(0);
  const pendingSave = useRef<(() => void) | null>(null);
  const versionsRef = useRef(versions);
  const storageFailed = useRef(false);
  const unavailable = definition.status === "retired";

  const failStorage = () => {
    storageFailed.current = true;
    if (mounted.current) { setStorageError(true); setSaveStatus(""); }
  };
  const enqueue = <T,>(operation: () => Promise<T>): Promise<T> => {
    const next = saveQueue.current.catch(() => {}).then(operation);
    saveQueue.current = next;
    return next;
  };
  const replacePhoto = (next: ProcessedPhoto | null, id: string | null) => {
    if (photoRef.current) URL.revokeObjectURL(photoRef.current.url);
    photoRef.current = next;
    photoIdRef.current = id;
    setPhoto(next);
  };
  const snapshot = (): SocialSnapshot => ({ ...inputs, fields: { ...inputs.fields }, crop: { ...inputs.crop }, ownerUserId, templateId: definition.id, templateVersion: definition.version, fieldTypes: Object.fromEntries(definition.fields.map((field) => [field.key, field.type])), photoId: definition.photo ? photoIdRef.current : null });
  const applySaved = async (saved: SocialSnapshot, blob: Blob | null) => {
    const request = ++photoRequest.current;
    const photoId = currentSocialPhotoId(saved, definition);
    const restored = photoId && blob ? await restoreSocialPhoto(blob) : null;
    if (!mounted.current || request !== photoRequest.current) { if (restored) URL.revokeObjectURL(restored.url); return; }
    replacePhoto(restored, photoId);
    setInputs(currentSocialInputs(saved, definition, initialName));
    setDesignUpdated(saved.templateVersion !== definition.version);
    setTouched({}); setAttempted(false); setPhotoError(""); setExportError(""); setStatus(""); setPreparedPng(null);
  };

  useEffect(() => {
    mounted.current = true;
    const urls = downloadUrls.current;
    const canvas = canvasRef.current;
    if (!opened.current) { opened.current = true; recordSocialUsage(definition, ownerUserId, "editor_opened"); }
    return () => {
      // Flush an outstanding debounce on route changes. Browser termination is not a save guarantee.
      pendingSave.current?.();
      pendingSave.current = null;
      mounted.current = false;
      photoRequest.current += 1;
      if (photoRef.current) URL.revokeObjectURL(photoRef.current.url);
      photoRef.current = null;
      urls.forEach((url) => URL.revokeObjectURL(url)); urls.clear();
      if (canvas) canvas.width = canvas.height = 0;
    };
  // Account/template identity is fixed by the keyed editor mount.
  }, []);

  useEffect(() => {
    let active = true;
    loadSocialState(ownerUserId, definition.id).then(async (stored) => {
      if (!active) return;
      versionsRef.current = stored.versions; setVersions(stored.versions);
      if (stored.draft) {
        const blob = stored.photos.find((item) => item.id === stored.draft!.photoId)?.blob ?? null;
        await applySaved(stored.draft, blob);
        if (!active) return;
        setHasDraft(true);
        const migrated = migratedSocialDraft(stored.draft, definition, initialName);
        if (migrated) {
          setSaveStatus("Saving…");
          await enqueue(() => saveSocialDraft(migrated, definition.photo ? blob : null));
          if (!active) return;
        }
        setSaveStatus("Saved");
      }
    }).catch(() => { if (active) failStorage(); }).finally(() => { if (active) setLocalReady(true); });
    return () => { active = false; };
  }, [ownerUserId, definition]);

  useEffect(() => {
    let active = true;
    loadSocialResources(definition, assets).then((loaded) => { if (active) setResources(loaded); })
      .catch(() => { if (active) setTemplateError("We couldn't load the template. Try again."); });
    return () => { active = false; };
  }, [definition, assets]);

  useEffect(() => {
    if (!resources || !canvasRef.current || unavailable) return;
    try {
      // The preview may show the template's fictional sample; the PNG export never does.
      setFieldErrors(drawSocialGraphic(canvasRef.current, definition, inputs, resources, photo, { sample: true }));
      setPreviewReady(true); setTemplateError("");
    } catch { setPreviewReady(false); setTemplateError("We couldn't load the template. Try again."); }
  }, [definition, inputs, resources, photo, unavailable]);

  useEffect(() => {
    if (!localReady || !changed || storageError || unavailable) return;
    const saved = snapshot();
    const generation = ++saveGeneration.current;
    const blob = photo?.blob ?? null;
    let dispatched = false;
    const flush = () => {
      if (dispatched || storageFailed.current) return;
      dispatched = true;
      pendingSave.current = null;
      void enqueue(() => saveSocialDraft(saved, blob)).then(() => {
        if (mounted.current && generation === saveGeneration.current && !pendingSave.current) { setHasDraft(true); setSaveStatus("Saved"); }
      }).catch(failStorage);
    };
    pendingSave.current = flush;
    setSaveStatus("Saving…");
    const timer = window.setTimeout(flush, 500);
    return () => { window.clearTimeout(timer); };
  }, [changed, localReady, inputs, photo, storageError, unavailable]);

  const validGraphic = !!resources && previewReady && !templateError && !Object.keys(fieldErrors).length &&
    (!definition.photo?.required || !!photo) && !photoError && !photoBusy && !unavailable;

  useEffect(() => {
    setPreparedPng(null);
    if (!shareSupported || !validGraphic || !resources) return;
    let active = true;
    const timer = window.setTimeout(() => {
      void exportSocialPng(definition, inputs, resources, photo).then((png) => {
        if (!active) return;
        setPreparedPng(png);
        setShareSupported(canSharePng(png, socialDownloadFilename(definition, inputs.fields)));
      }).catch(() => { if (active) setExportError("PNG couldn't be created. Try again."); });
    }, 400);
    return () => { active = false; window.clearTimeout(timer); };
  }, [definition, inputs, resources, photo, validGraphic, renderAttempt, shareSupported]);

  const updateInputs = (next: SocialInputs) => {
    saveGeneration.current += 1;
    setInputs(next); setChanged((value) => value + 1); setStatus(""); setExportError(""); setPreparedPng(null);
  };
  const choosePhoto = async (file: File) => {
    if (!definition.photo) return;
    const request = ++photoRequest.current;
    setPhotoBusy(true); setPhotoError(""); setStatus(""); setExportError(""); setPreparedPng(null);
    try {
      const next = await processSocialPhoto(file, definition.photo);
      let id: string | null;
      try { id = await socialPhotoId(next.blob); } catch { URL.revokeObjectURL(next.url); throw new Error("We couldn't read this photo. Save it as JPEG and try again."); }
      if (!mounted.current || request !== photoRequest.current) { URL.revokeObjectURL(next.url); return; }
      replacePhoto(next, id);
      setInputs((previous) => ({ ...previous, crop: { ...DEFAULT_PHOTO_CROP } }));
      setChanged((value) => value + 1);
    } catch (error) {
      if (mounted.current && request === photoRequest.current) setPhotoError(error instanceof Error ? error.message : "We couldn't read this photo. Save it as JPEG and try again.");
    } finally { if (mounted.current && request === photoRequest.current) setPhotoBusy(false); }
  };

  const persistVersion = async (saved: SocialSnapshot, blob: Blob | null, png: Blob, downloaded: boolean): Promise<{ firstDownload: boolean } | null> => {
    if (storageFailed.current) return null;
    setSaveStatus("Saving…");
    try {
      const thumbnail = await thumbnailFor(png);
      const result = await enqueue(() => saveSocialVersion(saved, blob, thumbnail, downloaded));
      versionsRef.current = result.versions;
      if (mounted.current) { setVersions(result.versions); if (!pendingSave.current) setSaveStatus("Saved"); }
      return { firstDownload: result.firstDownload };
    } catch { failStorage(); return null; }
  };
  const saveVersion = async () => {
    if (!validGraphic || !resources || storageFailed.current) return;
    setExporting(true); setStatus(""); setExportError("");
    try {
      const png = preparedPng ?? await exportSocialPng(definition, inputs, resources, photo);
      pendingSave.current?.();
      if (await persistVersion(snapshot(), photo?.blob ?? null, png, false)) setStatus("Version saved");
    } catch { setExportError("PNG couldn't be created. Try again."); }
    finally { if (mounted.current) setExporting(false); }
  };

  const removePhoto = () => {
    photoRequest.current += 1;
    replacePhoto(null, null);
    setPhotoError("");
    updateInputs({ ...inputs, crop: { ...DEFAULT_PHOTO_CROP } });
  };

  const switchDesign = async (target: SocialTemplate) => {
    if (target.id === definition.id || switching || storageFailed.current) return;
    setSwitching(true);
    const saved = snapshot();
    try {
      const carried: SocialSnapshot = {
        ...currentSocialInputs(saved, target),
        ownerUserId, templateId: target.id, templateVersion: target.version,
        fieldTypes: Object.fromEntries(target.fields.map((field) => [field.key, field.type])),
        photoId: currentSocialPhotoId(saved, target),
      };
      // Fields this design lacks keep what the target's own draft already had, e.g. an event name.
      const existing = (await loadSocialState(ownerUserId, target.id)).draft;
      for (const field of target.fields) {
        const kept = existing?.fields[field.key];
        if (!Object.prototype.hasOwnProperty.call(saved.fields, field.key) && typeof kept === "string" && kept.trim()) carried.fields[field.key] = kept;
      }
      pendingSave.current?.();
      await saveQueue.current;
      await enqueue(() => saveSocialDraft(carried, target.photo ? photo?.blob ?? null : null));
      if (mounted.current) navigate(designCanvasTemplatePath(target.id));
    } catch { failStorage(); }
    finally { if (mounted.current) setSwitching(false); }
  };
  const download = async (event: FormEvent) => {
    event.preventDefault(); setAttempted(true);
    if (!validGraphic || !resources || exporting || (shareSupported && !preparedPng)) return;
    const saved = snapshot();
    const blob = photo?.blob ?? null;
    const firstDownload = isFirstSocialDownload(saved, versionsRef.current);
    setExporting(true); setExportError(""); setStatus("");
    try {
      // No await precedes share(): Safari requires the original tap's user activation.
      let png = preparedPng;
      if (shareSupported && png) {
        await navigator.share({ files: [new File([png], socialDownloadFilename(definition, inputs.fields), { type: "image/png" })] });
      } else {
        png ??= await exportSocialPng(definition, inputs, resources, photo);
        if (!mounted.current) return;
        const url = URL.createObjectURL(png);
        downloadUrls.current.add(url);
        const link = document.createElement("a");
        link.href = url; link.download = socialDownloadFilename(definition, inputs.fields);
        document.body.appendChild(link); link.click(); link.remove();
        window.setTimeout(() => { URL.revokeObjectURL(url); downloadUrls.current.delete(url); }, 30_000);
      }
      pendingSave.current?.();
      if (mounted.current) setStatus("PNG ready");
      const persisted = await persistVersion(saved, blob, png!, true);
      recordSocialUsage(definition, ownerUserId, "downloaded", persisted?.firstDownload ?? firstDownload);
      if (mounted.current && persisted) setStatus("PNG ready");
    } catch (error) {
      if (mounted.current && !(error instanceof Error && error.name === "AbortError")) setExportError("PNG couldn't be created. Try again.");
    } finally { if (mounted.current) setExporting(false); }
  };

  const selectVersion = async (version: SocialVersion) => {
    setPhotoBusy(true);
    try {
      const stored = await loadSocialState(ownerUserId, definition.id);
      await applySaved(version, stored.photos.find((item) => item.id === version.photoId)?.blob ?? null);
      if (mounted.current) setChanged((value) => value + 1);
    } catch { failStorage(); }
    finally { if (mounted.current) setPhotoBusy(false); }
  };
  const deleteRecord = async (versionId?: string) => {
    try {
      pendingSave.current?.();
      await saveQueue.current.catch(() => {});
      const removesPhoto = await socialDeletionRemovesPhoto(ownerUserId, definition.id, versionId);
      if (!window.confirm(`Delete ${versionId ? "this version" : "your draft"}?${removesPhoto ? " Its photo will also be removed from this browser because nothing else uses it." : " Photos used by other drafts or versions will stay in this browser."}`)) return;
      await enqueue(() => deleteSocialRecord(ownerUserId, definition.id, versionId));
      if (!mounted.current) return;
      if (versionId) {
        versionsRef.current = versionsRef.current.filter((version) => version.id !== versionId);
        setVersions(versionsRef.current);
      } else {
        pendingSave.current = null;
        photoRequest.current += 1;
        replacePhoto(null, null); setInputs(emptyInputs(definition, initialName)); setChanged(0); setHasDraft(false);
        setTouched({}); setAttempted(false); setDesignUpdated(false); setPreparedPng(null);
      }
      setSaveStatus(""); setStatus(versionId ? "Version deleted" : "Draft deleted");
    } catch { failStorage(); }
  };

  const variant = definition.variants.find((item) => item.id === inputs.variantId) ?? definition.variants[0];
  const sampleFields = definition.sample?.fields ?? {};
  const samplePhotoShown = !photo && !!definition.sample?.photoAssetId;
  const sampleParts = [...(samplePhotoShown ? ["photo"] : []), ...definition.fields.filter((field) => !!sampleFields[field.key] && !inputs.fields[field.key]?.trim()).map((field) => field.label.toLowerCase())];
  const sampleShown = sampleParts.length > 0;
  const sampleList = sampleParts.length > 1 ? `${sampleParts.slice(0, -1).join(", ")} and ${sampleParts.at(-1)}` : sampleParts[0];
  const canAct = localReady && !exporting && !photoBusy && !switching;
  const designs = publishedSocialTemplates().filter((template) => template.category === definition.category);
  return (
    <HubShell activeId={DESIGN_CANVAS_NAV_ID} focused>
      <div className="sticky top-16 z-30 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-b border-border bg-white px-4 py-3 lg:px-6">
        <nav aria-label="Breadcrumb" className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1 text-sm">
          <Link to={DESIGN_CANVAS_PATH} className="action-focus text-muted-foreground hover:underline">LinkedIn graphics</Link>
          <span aria-hidden="true" className="text-og-midnight/30">/</span>
          <Link to={`${DESIGN_CANVAS_PATH}#${designCanvasCategoryId(definition.category)}`} className="action-focus text-muted-foreground hover:underline">{definition.category}</Link>
          <span aria-hidden="true" className="text-og-midnight/30">/</span>
          <h1 className="text-base font-semibold leading-6">{definition.title}</h1>
        </nav>
        <div className="flex w-full items-center justify-end gap-2 sm:w-auto sm:gap-3">
          <p role="status" aria-live="polite" className="mr-auto text-xs text-muted-foreground sm:mr-1">{storageError ? "Not saved" : switching ? "Switching…" : status || saveStatus}</p>
          <Button type="button" variant="outline" onClick={() => void saveVersion()} disabled={!canAct || !validGraphic || storageError} aria-describedby={storageError ? "social-storage-error" : undefined}>Save version</Button>
          <Button type="submit" form="social-editor-form" disabled={!canAct || !resources || !!templateError || unavailable || (shareSupported && validGraphic && !preparedPng)}>
            <Download size={16} aria-hidden="true" />{exporting ? "Preparing PNG…" : shareSupported ? "Save to Photos" : "Download PNG"}
          </Button>
        </div>
      </div>
      <div className="flex min-h-[calc(100svh-137px)] min-w-0 flex-col lg:flex-row">
        <section aria-label="Graphic workspace" className="min-w-0 flex-1 bg-[#F5F5F8] px-4 py-8 sm:p-10 lg:px-12 lg:py-16">
          <div className="mx-auto w-full max-w-[760px] space-y-6">
            {import.meta.env.DEV && definition.developmentOnly && <p className="text-sm">Development fixture. These shapes are for testing and are not approved artwork.</p>}
            {designUpdated && <p role="status" className="text-sm">The design was updated.</p>}
            {unavailable && <p role="status" className="text-sm">This graphic is no longer available. Your inputs stay in this browser until you delete them.</p>}
            {!unavailable && sampleShown && <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              <span className="rounded bg-og-midnight px-2 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">Sample</span>
              <span>The {sampleList} shown {sampleParts.length > 1 ? "are a fictional sample. Replace them" : "is a fictional sample. Replace it"} to download.</span>
            </p>}
            {/* Tall designs (800 × 800) shrink to fit the viewport, so the design picker stays in view. */}
            {!unavailable && <div className="relative mx-auto bg-white shadow-sm ring-1 ring-border" style={{ maxWidth: `max(280px, min(100%, calc((100svh - 260px) * ${definition.width / definition.height})))` }}>
              <canvas ref={canvasRef} width={definition.width} height={definition.height} role="img"
                aria-label={`${definition.title} preview. ${definition.fields.map((field) => `${field.label}: ${formatSocialField(field, inputs.fields[field.key] ?? "") || (sampleFields[field.key] ? `sample, ${sampleFields[field.key]}` : "empty")}`).join(". ")}. ${variant.label} design.${samplePhotoShown ? " Sample photo." : ""}`}
                className="block h-auto w-full" style={{ aspectRatio: `${definition.width} / ${definition.height}` }} />
              <PhotoPosition template={definition} photo={photo} sample={samplePhotoShown} crop={inputs.crop} canvasRef={canvasRef} disabled={!canAct}
                onChange={(crop) => updateInputs({ ...inputs, crop })} onChoose={() => fileRef.current?.click()} onFile={(file) => void choosePhoto(file)} />
            </div>}
            {photo && definition.photo && <div className="mx-auto flex max-w-[280px] items-center gap-3">
              <ZoomOut size={18} aria-hidden="true" className="shrink-0 text-og-midnight/60" />
              <input type="range" min="1" max={definition.photo.maxZoom} step="0.05" value={inputs.crop.zoom} disabled={!canAct || unavailable}
                aria-label="Zoom" aria-valuetext={`${inputs.crop.zoom.toFixed(2)} times`} className="action-focus h-6 min-w-0 flex-1 accent-og-midnight"
                onChange={(event) => updateInputs({ ...inputs, crop: { ...inputs.crop, zoom: Number(event.target.value) } })} />
              <ZoomIn size={18} aria-hidden="true" className="shrink-0 text-og-midnight/60" />
            </div>}
            {designs.length > 1 && <div className="flex flex-wrap items-center gap-3">
              <span className="mr-1 text-sm font-semibold">Design</span>
              <div className="flex min-w-0 flex-1 flex-wrap gap-3">
                {/* Equal heights, so square and landscape designs read as one row. */}
                {designs.map((design) => <button key={design.id} type="button" aria-label={`Switch to ${design.title}`} aria-current={design.id === definition.id ? "true" : undefined}
                  disabled={!canAct || storageError || unavailable} onClick={() => void switchDesign(design)}
                  className={cn("action-focus h-16 shrink-0 overflow-hidden rounded border border-border bg-white transition-shadow hover:ring-2 hover:ring-og-midnight/30", design.id === definition.id && "ring-2 ring-og-midnight ring-offset-2 ring-offset-background")}>
                  <img src={SOCIAL_ASSETS[design.previewAssetId!]} alt="" width={design.width} height={design.height} className="h-full w-auto" />
                </button>)}
              </div>
            </div>}
            {definition.variants.length > 1 && <div className="flex flex-wrap gap-2" role="group" aria-label="Color">
              {definition.variants.map((design) => <Button key={design.id} type="button" size="sm" variant="ghost" aria-pressed={inputs.variantId === design.id} disabled={!canAct || unavailable} onClick={() => updateInputs({ ...inputs, variantId: design.id })}>{design.label}</Button>)}
            </div>}
            {versions.length > 0 && <section aria-labelledby="recent-versions-heading" className="border-t border-border pt-6">
              <h2 id="recent-versions-heading" className="text-sm font-semibold">Versions</h2>
              <ul className="mt-3 flex flex-wrap gap-4">
                {versions.map((version) => <li key={version.id} className="relative w-[120px] min-w-0 rounded border border-border bg-white">
                  <button type="button" disabled={!canAct} onClick={() => void selectVersion(version)} aria-label={`Load version for ${socialPrimaryValue(definition, version.fields)}`} className="action-focus block w-full rounded p-1 text-left">
                    <VersionThumbnail blob={version.thumbnail} width={definition.width} height={definition.height} />
                    <span className="mt-1 block truncate px-1 text-xs font-semibold">{socialPrimaryValue(definition, version.fields) || "Untitled graphic"}</span>
                    <time dateTime={version.createdAt} className="block px-1 pb-1 text-[10px] text-muted-foreground">{new Date(version.createdAt).toLocaleDateString()}</time>
                    {version.downloaded && <span className="mx-1 mb-1 inline-block rounded bg-muted px-1.5 py-0.5 text-[10px]">Downloaded</span>}
                  </button>
                  <Button type="button" variant="ghost" size="icon" aria-label="Delete version" disabled={!canAct || storageError} onClick={() => void deleteRecord(version.id)} className="absolute -right-2 -top-2 h-7 w-7 border border-border bg-white shadow-sm"><X size={12} aria-hidden="true" /></Button>
                </li>)}
              </ul>
            </section>}
          </div>
        </section>
        <form id="social-editor-form" onSubmit={download} noValidate className="flex w-full min-w-0 flex-col border-t border-border bg-white p-6 lg:w-[320px] lg:shrink-0 lg:border-l lg:border-t-0">
          <fieldset disabled={!canAct || unavailable} className="min-w-0 space-y-5">
            <legend className="sr-only">Customize graphic</legend>
            {definition.fields.map((field) => {
              // Too-long and invalid values show while typing; a missing required value waits for a download attempt.
              const typed = touched[field.key] === true && !!inputs.fields[field.key]?.trim();
              const error = (attempted || typed) && Object.prototype.hasOwnProperty.call(fieldErrors, field.key) ? fieldErrors[field.key] : undefined;
              const qualifier = field.type === "time" ? field.timeZoneLabel : null;
              const inputProps = {
                id: `social-${field.key}`, required: field.required, value: inputs.fields[field.key] ?? "",
                placeholder: field.type === "text" && field.placeholder ? field.placeholder : !field.required ? "Optional" : undefined,
                "aria-invalid": !!error, "aria-describedby": error ? `error-${field.key}` : undefined,
                className: "action-focus min-h-11 w-full rounded-md border border-input bg-white px-3 py-2 text-base placeholder:text-og-midnight/40",
                onChange: (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                  setTouched((previous) => ({ ...previous, [field.key]: true }));
                  updateInputs({ ...inputs, fields: { ...inputs.fields, [field.key]: event.target.value } });
                },
              };
              return <div key={field.key}>
                <label htmlFor={`social-${field.key}`} className="mb-2 block text-sm font-semibold">{field.label}{qualifier && <span className="font-normal"> ({qualifier})</span>}</label>
                {field.type === "choice" ? <select {...inputProps}>
                  <option value="">{!field.required ? "Optional" : `Choose ${field.label.toLowerCase()}`}</option>
                  {field.options.map((option) => <option key={option} value={option}>{option}</option>)}
                </select> : <input {...inputProps} type={field.type} autoComplete="off" />}
                {error && <p id={`error-${field.key}`} role="alert" className="mt-2 text-sm text-destructive">{error}</p>}
              </div>;
            })}
            {definition.photo && <div className="space-y-2">
              <p className="text-sm font-semibold">Photo</p>
              <div className="flex flex-wrap items-center gap-2">
                {photo && <img src={photo.url} alt="Your photo" className="h-10 w-10 rounded-full object-cover" />}
                <Button type="button" size="sm" variant="outline" onClick={() => fileRef.current?.click()}>{photoBusy ? "Reading photo…" : photo ? "Replace" : "Add photo"}</Button>
                {photo && <Button type="button" variant="ghost" size="sm" className="px-2" onClick={removePhoto}>Remove</Button>}
              </div>
              <input ref={fileRef} type="file" accept="image/*,.heic,.heif" aria-label="Photo" hidden onChange={(event) => {
                const file = event.currentTarget.files?.[0]; event.currentTarget.value = "";
                if (file) void choosePhoto(file);
              }} />
              {definition.photo.opaqueClip && <p className="text-xs leading-5 text-muted-foreground">A PNG with the background removed sits right on the design. Other photos fill a rounded panel.</p>}
              {photoError && <p role="alert" className="text-sm text-destructive">{photoError}</p>}
              {attempted && !photo && definition.photo.required && !photoError && <p role="alert" className="text-sm text-destructive">Add a photo to download.</p>}
            </div>}
          </fieldset>
          <div className="space-y-3 pt-5">
            {templateError && <p role="alert" className="text-sm text-destructive">{templateError}</p>}
            {(!resources || !localReady) && !templateError && <p role="status" className="text-sm">Loading editor…</p>}
            {exportError && <div className="space-y-2">
              <p role="alert" className="text-sm text-destructive">{exportError}</p>
              <Button type="button" variant="ghost" size="sm" disabled={!canAct} onClick={() => { setExportError(""); setRenderAttempt((value) => value + 1); }}>Try again</Button>
            </div>}
          </div>
          <div className="mt-8 space-y-2 pt-6 lg:mt-auto">
            {storageError && <p id="social-storage-error" role="alert" className="text-sm text-destructive">{SOCIAL_STORAGE_ERROR}</p>}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span>Saved in this browser</span>
              <Button type="button" variant="ghost" size="icon" aria-label="About browser storage" aria-expanded={storageInfoOpen} aria-controls="social-storage-info" onClick={() => setStorageInfoOpen((open) => !open)} className="h-8 w-8"><Info size={14} aria-hidden="true" /></Button>
            </div>
            {storageInfoOpen && <div id="social-storage-info" className="space-y-2 text-xs leading-5 text-foreground">
              <p>Your draft and saved versions stay in this browser. They won’t appear on another device, so download anything you want to keep.</p>
              <p>Someone with access to this browser profile can access its stored data.</p>
            </div>}
            <Button type="button" variant="ghost" size="sm" disabled={!hasDraft || !canAct || storageError} onClick={() => void deleteRecord()} className="-ml-3 text-xs">Delete draft</Button>
          </div>
        </form>
      </div>
      <footer className="border-t border-border bg-white px-4 py-4 text-center [&_p]:text-xs"><MarketingContact /></footer>
    </HubShell>
  );
}

export default function SocialCustomizer() {
  const user = useAuthUser();
  const [fixtures, setFixtures] = useState<FixtureModule | null>(null);
  useEffect(() => { void developmentFixtures?.then(setFixtures); }, []);
  const { templateId } = useParams<{ templateId: string }>();
  if (developmentFixtures && !fixtures) return <p role="status" className="p-6">Loading graphic...</p>;
  // Retired metadata stays reachable for local deletion, with editing/export unavailable.
  const template = getPublishedSocialTemplate(templateId ?? "") ??
    PUBLISHED_SOCIAL_TEMPLATES.find((item) => item.id === templateId && item.status === "retired" && !item.developmentOnly) ??
    (import.meta.env.DEV ? fixtures?.SOCIAL_TEMPLATE_FIXTURES.find((item) => item.id === templateId) : undefined);
  if (!template) return <Navigate to={DESIGN_CANVAS_PATH} replace />;
  if (!user) return null;
  const metadataName: unknown = user.user_metadata.full_name ?? user.user_metadata.name;
  return <SocialEditor key={`${user.id}:${template.id}:${template.version}`} ownerUserId={user.id} definition={template} assets={import.meta.env.DEV && template.developmentOnly ? fixtures?.SOCIAL_FIXTURE_ASSETS : undefined} initialName={typeof metadataName === "string" ? metadataName : ""} />;
}
