# Social templates

No real template is approved or published. `PUBLISHED_SOCIAL_TEMPLATES` is empty, so production Toolkit and search have no social cards. The lazy editor dynamically imports `social-template-fixture.ts` only in development. Direct routes `/toolkit/social/new-hire` and `/toolkit/social/event-fixture` exercise technical geometry, not approved artwork. Event artwork is source-local and excluded with the fixture module from production output. Unknown or unpublished IDs return to Toolkit. Retired metadata remains reachable only to explain unavailability and let people delete local records.

## Package an approved template

### Figma handoff checklist

1. Supply the approved artwork PNG at the exact output width and height. Leave the photo area and intended background areas transparent so the photo and variant background can show through. Include locked graphics only, with no editable text baked in. For different artwork per variant, supply 1 PNG for each variant. Foreground artwork is drawn over the photo.
2. Supply the HTTPS Figma master link, template title, description, search keywords, owner, approval and review dates. Only distributable artwork belongs in `public/`; the sign-in screen does not protect static files.
3. Supply every photo, field and locked-layer box as `x`, `y`, `width`, `height` in output pixels, measured from the top left. All boxes must stay inside the output. Specify the photo shape, requirement and maximum zoom, or omit the photo entirely.
4. Supply field keys, types, labels, requirement and text rules: bundled Figtree weight, minimum/maximum size, line height, maximum lines and horizontal alignment. Text stays top-aligned. Supply date format, fixed time label, choice options and the optional Google-name prefill where applicable. Check long and accented values at minimum size.
5. Supply variants with stable IDs, readable labels, background and foreground colors from `src/data/tokens.ts`. No invented colorways or unfinished brand decisions. Check the PNG and preview against the master before approval.

### Field reference

Definitions are plain JSON-compatible data. Add approved distributable asset paths to `SOCIAL_ASSETS` in `social-templates.ts`, then add entries to `PUBLISHED_SOCIAL_TEMPLATES` in the order their Toolkit cards and search entries should appear. Each template has 1 route, `/toolkit/social/<id>`, and 1 output size.

| Template property | Contract |
| --- | --- |
| `id` | Unique lowercase kebab-case route/usage/storage identifier. Keep stable across design changes. |
| `version` | Positive integer. Bump for every approved design or field-rule change. |
| `status` | `pilot`, `current` or `retired`. Only pilot/current entries appear in Toolkit/search. Retired editors disable editing, saving and export, retain local records, and allow deletion. |
| `title` | Card, search and editor title. |
| `description` | Card/search description and editor introduction. |
| `keywords` | Space-separated search terms. |
| `sourceUrl` | HTTPS Figma master link. Only dev fixtures may use a `repo:` source. |
| `owner` | Named template maintainer. |
| `reviewedAt`, `reviewDueAt` | Valid `YYYY-MM-DD` dates, with due date after review date. Review quarterly and whenever brand canon changes. Overdue dates do not auto-retire templates. |
| `developmentOnly` | Optional boolean for technical fixtures only. Never set on published entries. |
| `width`, `height` | Positive integer output pixels, at most 8192 per side and 50 megapixels total. |
| `assetIds` | Unique IDs from `SOCIAL_ASSETS` for every referenced artwork file. Empty is allowed. |
| `variants` | At least 1 `{ id, label, background, foreground }`. IDs are unique/nonempty, colors are exact token hex values. Foreground colors apply to all editable and locked text. |
| `lockedLayers` | Ordered array of locked rectangles, ellipses, artwork or text. Empty is allowed. See below. |
| `photo` | Optional single frame: bounds plus `required` boolean, `shape` (`rect` or `ellipse`) and `maxZoom` from 1 to 5. Omit for no upload/crop controls, stored photo or placeholder. |
| `fields` | At least 1 editable field, in form order. See below. |

Every box uses `x`, `y`, `width`, `height` in output pixels. Text fields and locked text share these properties:

| Text property | Contract |
| --- | --- |
| `fontFamily` | Always `Figtree`. |
| `fontWeight` | 400, 500, 600, 700 or 800, from the bundled font files. |
| `minFontSize`, `maxFontSize` | Positive pixels, minimum no greater than maximum, maximum at most 500. |
| `lineHeight` | Multiplier from 1 to 2. The minimum-size line must fit the box height. |
| `maxLines` | Positive integer. Values shrink/wrap within these limits; overflow shows a field error and blocks export. |
| `align` | Optional `left`, `center` or `right`, default `left`. Horizontal alignment only; text stays top-aligned. |

Every editable field also has:

| Field property | Contract |
| --- | --- |
| `key` | Unique camelCase key matching `^[a-z][a-zA-Z0-9]*$`. Stable keys allow carry-over. |
| `label` | Nonempty visible input label. |
| `required` | Boolean. Required blank fields block export. |
| `type` | `text`, `date`, `time` or `choice`. Uses a native input/select. |
| `prefill` | Optional `googleName`, on at most 1 text field. Initializes from Google metadata once per keyed account/template mount when no saved value exists. User edits are never overwritten by later metadata. Delete draft reapplies it. |
| `dateFormat` | Required for date: `short` (`Nov 12, 2026`), `long` (`November 12, 2026`) or `weekday` (`Thursday, November 12`). Storage is `YYYY-MM-DD`; parsed from calendar parts without UTC string parsing. |
| `timeZoneLabel` | Optional nonempty fixed label for time, e.g. `ET`. Storage is `HH:mm`; `14:00` draws as `2:00 PM ET`. No time zone conversion. |
| `options` | Required for choice: at least 2 unique nonempty strings. Stores the chosen string. The empty selection is allowed only for optional fields. |

Locked layers each have a unique `id` plus bounds:

| Layer type | Additional properties |
| --- | --- |
| `rect`, `ellipse` | `color`, an exact token hex value. |
| `asset` | Either `assetId` for all variants or `assetIdByVariant: { [variantId]: assetId }`. The map must cover every variant exactly, without unknown variant IDs. All assets must be declared in `assetIds`. Never provide both properties. |
| `text` | Nonempty `text`, plus all shared text rules including optional `align`. Uses the selected variant's foreground. |

### Full example entry

This is illustrative data, not an approved or published template. The example assumes `team-event-white` and `team-event-midnight` are registered PNG assets and that Cameron has supplied the real Figma link and approval.

```ts
{
  id: "team-event",
  version: 1,
  status: "pilot",
  title: "Team event graphic",
  description: "Add the event details and choose a design for your graphic.",
  keywords: "team event date time location social graphic",
  sourceUrl: "https://www.figma.com/design/REPLACE_WITH_APPROVED_MASTER",
  owner: "Marketing",
  reviewedAt: "2026-10-27",
  reviewDueAt: "2027-01-27",
  width: 1200,
  height: 1200,
  assetIds: ["team-event-white", "team-event-midnight"],
  variants: [
    { id: "white", label: "White", background: "#FFFFFF", foreground: "#17132F" },
    { id: "midnight", label: "Midnight", background: "#17132F", foreground: "#FFFFFF" },
  ],
  lockedLayers: [
    { id: "artwork", type: "asset", assetIdByVariant: { white: "team-event-white", midnight: "team-event-midnight" }, x: 0, y: 0, width: 1200, height: 1200 },
    { id: "heading", type: "text", text: "Join us", x: 80, y: 80, width: 1040, height: 100, fontFamily: "Figtree", fontWeight: 700, minFontSize: 64, maxFontSize: 64, lineHeight: 1.2, maxLines: 1, align: "center" },
  ],
  photo: { x: 80, y: 320, width: 320, height: 480, required: false, shape: "rect", maxZoom: 3 },
  fields: [
    { key: "eventName", type: "text", label: "Event name", required: true, x: 460, y: 280, width: 660, height: 220, fontFamily: "Figtree", fontWeight: 700, minFontSize: 32, maxFontSize: 64, lineHeight: 1.2, maxLines: 3, align: "center" },
    { key: "date", type: "date", dateFormat: "weekday", label: "Date", required: true, x: 460, y: 540, width: 660, height: 120, fontFamily: "Figtree", fontWeight: 600, minFontSize: 24, maxFontSize: 40, lineHeight: 1.2, maxLines: 2, align: "center" },
    { key: "time", type: "time", timeZoneLabel: "ET", label: "Time", required: false, x: 460, y: 700, width: 660, height: 80, fontFamily: "Figtree", fontWeight: 500, minFontSize: 24, maxFontSize: 40, lineHeight: 1.2, maxLines: 1, align: "center" },
    { key: "location", type: "choice", options: ["New York", "Virtual"], label: "Location", required: true, x: 460, y: 820, width: 660, height: 80, fontFamily: "Figtree", fontWeight: 400, minFontSize: 24, maxFontSize: 40, lineHeight: 1.2, maxLines: 1, align: "center" },
    { key: "organizer", type: "text", prefill: "googleName", label: "Organizer", required: false, x: 80, y: 1000, width: 1040, height: 100, fontFamily: "Figtree", fontWeight: 400, minFontSize: 24, maxFontSize: 36, lineHeight: 1.2, maxLines: 2, align: "center" },
  ],
}
```

### Draw order, approval and updates

The shared preview/export renderer paints the variant background, then the clipped photo (or the editor's empty photo region if a frame exists), then locked layers in array order, then editable fields in array order. Artwork transparency exposes lower layers. An absent photo definition paints no placeholder. There is no editable text color, vertical alignment or text transform.

Run `npm run test:social` in `TZ=America/Los_Angeles` and `TZ=Pacific/Auckland`, then `npm run build` and `npm run lint`. The build rejects invalid definitions and missing/unsafe production assets. Compare preview and PNG with the Figma master, check long/short/accented values, every variant, crop edges where relevant, and mobile sharing. Obtain Cameron's visual approval before adding an entry as `pilot` or `current`. Publishing code and applying database migrations are separate approvals.

For each approved design change, replace the artwork/rules and bump `version`. Both higher and lower saved-version mismatches show “The design was updated.” and remain fully editable/exportable on the available design. Keep values only when key and field type match; a choice must still exist. Keep photo/crop only when a photo definition remains. Keep a surviving variant, otherwise use the first. Do not restore old artwork. Retiring a template hides its card/search entry and disables creation/export while preserving local deletion and Marketing contact.

## Renderer and photo contract

`SocialInputs` contains serializable fields, variant ID and normalized crop coordinates. `ProcessedPhoto` holds a normalized JPEG Blob (quality 0.9) for opaque photos, or a PNG Blob when processed pixels contain transparency, its decoded image, dimensions and object URL. Photos never leave the device. The intake accepts files up to 25,000,000 bytes and 50,000,000 pixels, rejects SVG, applies EXIF orientation, freezes the first animation frame and downsizes to crop needs. Very wide/tall sources are also limited to 8192 pixels per side and 16 megapixels after processing to keep the canvas bounded. Small originals are never enlarged during intake. JPEG, PNG, GIF, WebP and modern BMP headers are read before full decode; other formats use natural dimensions after Image load, before createImageBitmap. Browsers may decode those other formats during load. The processed canvas is checked for transparent pixels in bounded strips before choosing JPEG or PNG.

`loadSocialResources` loads the exact Figtree weights before measuring. `drawSocialGraphic` paints through one detached rendering surface for both preview and export, keeping inherited page typography out of the image. Preview scales those output pixels with CSS. Export always uses the declared width and height, regardless of device pixel ratio.

The editor revokes processed-photo and download object URLs on replacement/unmount. An in-flight photo operation cannot restore state after sign-out. Google metadata initializes the designated prefill field once per keyed account/template mount; field edits are never overwritten by metadata updates.

## Local drafts and saved versions

`src/lib/social-drafts.ts` owns the hand-written IndexedDB database `brand-hub-social`, schema 1. Drafts use `[ownerUserId, templateId]` keys. Field, variant, crop and photo changes debounce for 500 ms, then write photo and metadata in one transaction. Route unmount flushes a pending debounce; browser termination is not a save guarantee. The latest completed write wins. There are no draft revisions or cross-tab checks. The saved status follows transaction completion. Persistent storage is requested on the first save, with no dependency on its result.

Versions are limited to 10 per account/template, newest first, with a 240 px thumbnail, createdAt, templateVersion and downloaded. Identical newest states update that version and retain a Downloaded tag. Downloads also create/update a version. Photos are SHA-256 hashes of the processed Blob bytes, keyed by account plus hash. Drafts and versions share those records, across templates too. Delete and cap transactions collect photos with no remaining account references. Confirmations explain photo removal. Account scoping prevents normal discovery through the application, not access by someone who controls the browser profile.

Stored inputs always reopen using the available template definition. Same-key, same-type fields carry over, with choice values retained only while still offered. Photo and crop carry over only if the template still has a photo. A missing variant falls back to the first. Any template version mismatch, including a rollback, shows “The design was updated.” without disabling editing or export. Only retired definitions disable creation/export. New snapshots include `fieldTypes` for safe carry-over; legacy snapshots without it are treated as text fields. Object stores are unchanged, so IndexedDB stays at schema 1. No template artwork is stored in drafts or versions.

Storage errors show the specified warning and disable Save version. In-memory editing and download remain available. Cleared storage starts empty. Draft existence for the Toolkit card is read asynchronously and does not block the page. The card and editor use `MARKETING_CONTACT_URL = null` in `src/components/social/MarketingContact.tsx`; the Marketing sentence is plain text until Cameron supplies a destination.

## PNG downloads and phone sharing

On the share path, the PNG is rendered after 400 ms without changes. Desktop and unsupported devices render on click and keep Download enabled during valid edits. On a coarse pointer device, `navigator.canShare({ files })` must accept that PNG before the action becomes Save to Photos. The tap calls navigator.share with the prepared File before any await. Desktop and unsupported devices use an ordinary PNG download. AbortError silently cancels, adding no version or usage event. A successful download reports PNG ready immediately; the saved-version completion is shown only if persistence succeeds.

OAuth redirects to `window.location.origin`, with no path or fragment. The validated internal path, query and hash are saved in sessionStorage and restored after sign-in. If sessionStorage is denied, sign-in returns to the hub root.

## Internal usage data and pending migration

`0002_social_usage_events.sql` and its journal entry are prepared, **not applied**. Cameron approves database application separately. No drizzle-kit command is needed for this handoff. The table is insert-only for authenticated employees, with user_id constrained to auth.uid(), and no employee select/update/delete. The narrow insert wrapper in `src/lib/social-usage.ts` leaves generated Supabase files untouched.

Editor open is reported once per editor mount. Downloads are reported only after the browser download action or successful share. Usage inserts are never awaited and swallow failures. A download has already been handed to the browser before its version transaction and usage report; usage requests cannot delay either operation. Development fixtures log `[social-usage]` payloads locally instead of writing. No names, emails, fields or photos enter events. This is internal usage data, not anonymous data.

`first_download` uses the completed version transaction to check all retained account/template versions, with the already-loaded history as a fallback if storage fails. It checks for identical fields, variant, crop and photoId already tagged Downloaded. It does not depend on templateVersion. When local history is cleared or the earlier downloaded version is removed by the cap/deletion, this browser cannot recognize that earlier download.

Run the following 4 queries as an authorized database maintainer, never through an employee client. Set the same half-open date range and excluded test-account UUID array in each query. Replace the example dates with the period after pilot testing. Empty arrays exclude no accounts.

```sql
-- 1. Unique editor openers
WITH scope AS (
  SELECT * FROM public.social_usage_events
  WHERE created_at >= '2026-11-01T00:00:00Z'::timestamptz
    AND created_at < '2026-12-01T00:00:00Z'::timestamptz
    AND NOT (user_id = ANY (ARRAY[]::uuid[]))
)
SELECT count(DISTINCT user_id) AS unique_openers
FROM scope WHERE event = 'editor_opened';

-- 2. Unique downloaders
WITH scope AS (
  SELECT * FROM public.social_usage_events
  WHERE created_at >= '2026-11-01T00:00:00Z'::timestamptz
    AND created_at < '2026-12-01T00:00:00Z'::timestamptz
    AND NOT (user_id = ANY (ARRAY[]::uuid[]))
)
SELECT count(DISTINCT user_id) AS unique_downloaders
FROM scope WHERE event = 'downloaded';

-- 3. Completion rate: unique downloaders / unique openers
WITH scope AS (
  SELECT * FROM public.social_usage_events
  WHERE created_at >= '2026-11-01T00:00:00Z'::timestamptz
    AND created_at < '2026-12-01T00:00:00Z'::timestamptz
    AND NOT (user_id = ANY (ARRAY[]::uuid[]))
)
SELECT count(DISTINCT user_id) FILTER (WHERE event = 'downloaded')::numeric
  / NULLIF(count(DISTINCT user_id) FILTER (WHERE event = 'editor_opened'), 0)
  AS completion_rate
FROM scope;

-- 4. Graphics made
WITH scope AS (
  SELECT * FROM public.social_usage_events
  WHERE created_at >= '2026-11-01T00:00:00Z'::timestamptz
    AND created_at < '2026-12-01T00:00:00Z'::timestamptz
    AND NOT (user_id = ANY (ARRAY[]::uuid[]))
)
SELECT count(*) AS graphics_made
FROM scope WHERE event = 'downloaded' AND first_download;
```

## Verification

`npm run test:social` checks publication/definition guards, crop/text/redirect safety, version cap/duplicates, first_download, photo hash dedupe/reference collection, current-template restoration, JPEG/PNG choice and header dimension limits. Browser acceptance uses real IndexedDB in Chrome with fixture artwork, fake account IDs, locally mocked sign-in and blocked external requests. Real Google sign-in, Safari and iPhone share/Photos behavior still require Cameron's device checks before release. No published template is enabled by this session.
