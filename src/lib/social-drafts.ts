import type { SocialFieldType, SocialTemplate } from "../data/social-templates";
import { emptySocialFields } from "./social-fields";
import { DEFAULT_PHOTO_CROP, type SocialInputs } from "./social-renderer";

export const SOCIAL_STORAGE_ERROR = "Draft couldn’t be saved in this browser. You can still download your graphic.";
export const SOCIAL_DATABASE_NAME = "brand-hub-social";
export const SOCIAL_VERSION_LIMIT = 10;
export type SocialSnapshot = SocialInputs & {
  ownerUserId: string;
  templateId: string;
  templateVersion: number;
  photoId: string | null;
  /** Legacy records without this map contain text fields only. */
  fieldTypes?: Record<string, SocialFieldType>;
};
export type SocialDraft = SocialSnapshot & { schemaVersion: 1; updatedAt: string };
export type SocialVersion = SocialSnapshot & { id: string; thumbnail: Blob; createdAt: string; downloaded: boolean };
type SocialPhoto = { ownerUserId: string; id: string; blob: Blob };
export type SocialLocalState = { draft: SocialDraft | null; versions: SocialVersion[]; photos: SocialPhoto[] };

let persistentStorageRequested = false;
function requestPersistentStorage() {
  if (persistentStorageRequested) return;
  persistentStorageRequested = true;
  try { void navigator.storage?.persist?.().catch(() => {}); } catch { /* Best effort only. */ }
}

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(SOCIAL_DATABASE_NAME, 1);
    let blocked = false;
    request.onupgradeneeded = () => {
      const db = request.result;
      const drafts = db.createObjectStore("drafts", { keyPath: ["ownerUserId", "templateId"] });
      drafts.createIndex("owner", "ownerUserId");
      const versions = db.createObjectStore("versions", { keyPath: "id" });
      versions.createIndex("owner", "ownerUserId");
      const photos = db.createObjectStore("photos", { keyPath: ["ownerUserId", "id"] });
      photos.createIndex("owner", "ownerUserId");
    };
    request.onerror = () => reject(request.error);
    request.onblocked = () => { blocked = true; reject(new Error(SOCIAL_STORAGE_ERROR)); };
    request.onsuccess = () => {
      if (blocked) { request.result.close(); return; }
      request.result.onversionchange = () => request.result.close();
      resolve(request.result);
    };
  });
}

/** All requests are scheduled within the transaction; success means oncomplete, never onsuccess. */
async function accountTransaction<T>(ownerUserId: string, mode: IDBTransactionMode, run: (tx: IDBTransaction, drafts: SocialDraft[], versions: SocialVersion[], photos: SocialPhoto[]) => T): Promise<T> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(["drafts", "versions", "photos"], mode);
    let result: T;
    let failure: unknown;
    const drafts = tx.objectStore("drafts").index("owner").getAll(ownerUserId);
    const versions = tx.objectStore("versions").index("owner").getAll(ownerUserId);
    const photos = tx.objectStore("photos").index("owner").getAll(ownerUserId);
    photos.onsuccess = () => {
      try { result = run(tx, drafts.result, versions.result, photos.result); }
      catch (error) { failure = error; tx.abort(); }
    };
    tx.oncomplete = () => { db.close(); resolve(result); };
    tx.onabort = tx.onerror = () => { db.close(); reject(failure ?? tx.error ?? new Error(SOCIAL_STORAGE_ERROR)); };
  });
}

export async function socialPhotoId(blob: Blob | null): Promise<string | null> {
  if (!blob) return null;
  const hash = await crypto.subtle.digest("SHA-256", await blob.arrayBuffer());
  return [...new Uint8Array(hash)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function sameSocialInputs(a: SocialSnapshot, b: SocialSnapshot): boolean {
  return a.templateId === b.templateId && a.ownerUserId === b.ownerUserId && a.photoId === b.photoId &&
    Object.keys(a.fields).length === Object.keys(b.fields).length && Object.keys(a.fields).every((key) => Object.prototype.hasOwnProperty.call(b.fields, key) && a.fields[key] === b.fields[key]) && a.variantId === b.variantId &&
    a.crop.x === b.crop.x && a.crop.y === b.crop.y && a.crop.zoom === b.crop.zoom;
}
export const newestSocialVersions = (versions: SocialVersion[]) => [...versions].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
export const isFirstSocialDownload = (snapshot: SocialSnapshot, versions: SocialVersion[]) => !versions.some((version) => version.downloaded && sameSocialInputs(snapshot, version));

export function planSocialVersion(versions: SocialVersion[], snapshot: SocialSnapshot, thumbnail: Blob, downloaded: boolean): SocialVersion[] {
  const sorted = newestSocialVersions(versions);
  const newest = sorted[0];
  if (newest && newest.templateVersion === snapshot.templateVersion && sameSocialInputs(newest, snapshot)) {
    return [{ ...newest, ...snapshot, thumbnail, downloaded: newest.downloaded || downloaded }, ...sorted.slice(1)];
  }
  const createdAt = new Date(Math.max(Date.now(), newest ? Date.parse(newest.createdAt) + 1 : 0)).toISOString();
  return [{ ...snapshot, id: crypto.randomUUID(), thumbnail, createdAt, downloaded }, ...sorted].slice(0, SOCIAL_VERSION_LIMIT);
}

export function unreferencedSocialPhotoIds(drafts: SocialDraft[], versions: SocialVersion[], photos: SocialPhoto[]): string[] {
  const referenced = new Set([...drafts, ...versions].map((record) => record.photoId));
  return photos.filter((photo) => !referenced.has(photo.id)).map((photo) => photo.id);
}
function collectPhotos(tx: IDBTransaction, ownerUserId: string, drafts: SocialDraft[], versions: SocialVersion[], photos: SocialPhoto[]) {
  for (const id of unreferencedSocialPhotoIds(drafts, versions, photos)) tx.objectStore("photos").delete([ownerUserId, id]);
}
function putPhoto(tx: IDBTransaction, snapshot: SocialSnapshot, blob: Blob | null, photos: SocialPhoto[]): SocialPhoto[] {
  if (!snapshot.photoId || !blob || photos.some((photo) => photo.id === snapshot.photoId)) return photos;
  const photo = { ownerUserId: snapshot.ownerUserId, id: snapshot.photoId, blob };
  tx.objectStore("photos").put(photo);
  return [...photos, photo];
}

export async function loadSocialState(ownerUserId: string, templateId: string): Promise<SocialLocalState> {
  return accountTransaction(ownerUserId, "readonly", (_tx, drafts, versions, photos) => {
    const draft = drafts.find((record) => record.templateId === templateId) ?? null;
    const scoped = newestSocialVersions(versions.filter((record) => record.templateId === templateId));
    const ids = new Set([draft, ...scoped].map((record) => record?.photoId));
    return { draft, versions: scoped, photos: photos.filter((photo) => ids.has(photo.id)) };
  });
}
export async function hasSocialDraft(ownerUserId: string, templateId: string): Promise<boolean> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("drafts", "readonly");
    const request = tx.objectStore("drafts").getKey([ownerUserId, templateId]);
    tx.oncomplete = () => { db.close(); resolve(request.result !== undefined); };
    tx.onabort = tx.onerror = () => { db.close(); reject(tx.error ?? new Error(SOCIAL_STORAGE_ERROR)); };
  });
}
export async function saveSocialDraft(snapshot: SocialSnapshot, blob: Blob | null): Promise<SocialDraft> {
  requestPersistentStorage();
  return accountTransaction(snapshot.ownerUserId, "readwrite", (tx, drafts, versions, photos) => {
    const draft: SocialDraft = { ...snapshot, schemaVersion: 1, updatedAt: new Date().toISOString() };
    tx.objectStore("drafts").put(draft);
    const next = [...drafts.filter((record) => record.templateId !== snapshot.templateId), draft];
    collectPhotos(tx, snapshot.ownerUserId, next, versions, putPhoto(tx, snapshot, blob, photos));
    return draft;
  });
}
export async function saveSocialVersion(snapshot: SocialSnapshot, blob: Blob | null, thumbnail: Blob, downloaded: boolean) {
  requestPersistentStorage();
  return accountTransaction(snapshot.ownerUserId, "readwrite", (tx, drafts, versions, photos) => {
    const scoped = versions.filter((version) => version.templateId === snapshot.templateId);
    const firstDownload = isFirstSocialDownload(snapshot, scoped);
    const next = planSocialVersion(scoped, snapshot, thumbnail, downloaded);
    const ids = new Set(next.map((version) => version.id));
    for (const version of scoped) if (!ids.has(version.id)) tx.objectStore("versions").delete(version.id);
    tx.objectStore("versions").put(next[0]);
    collectPhotos(tx, snapshot.ownerUserId, drafts, [...versions.filter((version) => version.templateId !== snapshot.templateId), ...next], putPhoto(tx, snapshot, blob, photos));
    return { versions: next, firstDownload };
  });
}
export async function socialDeletionRemovesPhoto(ownerUserId: string, templateId: string, versionId?: string): Promise<boolean> {
  return accountTransaction(ownerUserId, "readonly", (_tx, drafts, versions) => {
    const target = versionId ? versions.find((version) => version.id === versionId && version.templateId === templateId) : drafts.find((draft) => draft.templateId === templateId);
    if (!target?.photoId) return false;
    return ![...drafts, ...versions].some((record) => record !== target && record.photoId === target.photoId);
  });
}
export async function deleteSocialRecord(ownerUserId: string, templateId: string, versionId?: string): Promise<void> {
  return accountTransaction(ownerUserId, "readwrite", (tx, drafts, versions, photos) => {
    const nextDrafts = versionId ? drafts : drafts.filter((draft) => draft.templateId !== templateId);
    const nextVersions = versionId ? versions.filter((version) => version.id !== versionId || version.templateId !== templateId) : versions;
    if (versionId) {
      if (versions.some((version) => version.id === versionId && version.templateId === templateId)) tx.objectStore("versions").delete(versionId);
    } else tx.objectStore("drafts").delete([ownerUserId, templateId]);
    collectPhotos(tx, ownerUserId, nextDrafts, nextVersions, photos);
  });
}

export const currentSocialPhotoId = (saved: SocialSnapshot, template: SocialTemplate): string | null => template.photo ? saved.photoId : null;

/** Carry inputs into the current design; callers never restore stored template definitions. */
export function currentSocialInputs(saved: SocialSnapshot, template: SocialTemplate, googleName = ""): SocialInputs {
  const fields = emptySocialFields(template, googleName);
  for (const field of template.fields) {
    const value = saved.fields[field.key];
    const previousType = saved.fieldTypes?.[field.key] ?? "text";
    if (typeof value === "string" && previousType === field.type && (field.type !== "choice" || field.options.includes(value))) {
      fields[field.key] = value || fields[field.key];
    }
  }
  return { fields, crop: { ...(template.photo ? saved.crop : DEFAULT_PHOTO_CROP) }, variantId: template.variants.some((variant) => variant.id === saved.variantId) ? saved.variantId : template.variants[0].id };
}

/** Re-save a carried draft once, so the update notice does not repeat on reload. */
export function migratedSocialDraft(saved: SocialSnapshot, template: SocialTemplate, googleName = ""): SocialSnapshot | null {
  if (saved.templateVersion === template.version || template.status === "retired") return null;
  return {
    ...currentSocialInputs(saved, template, googleName),
    ownerUserId: saved.ownerUserId,
    templateId: template.id,
    templateVersion: template.version,
    fieldTypes: Object.fromEntries(template.fields.map((field) => [field.key, field.type])),
    photoId: currentSocialPhotoId(saved, template),
  };
}
