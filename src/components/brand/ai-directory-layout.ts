/**
 * Which design the AI Resources directory renders.
 *
 * 'current' is the shipped grouped list. 'library' (Option A, Retool-like folders and table),
 * 'table' (Option B, Airtable-like filter chips and tagged table) and 'categories' (Option C, the
 * current grouped list with A's category card, from the 9:05 critique) are review options from
 * 2026-11-13. In dev, `?layout=library|table|categories` and the floating switcher preview them;
 * production only ever renders DIRECTORY_LAYOUT.
 *
 * To promote an option, change this one value. The option's code then ships as a lazy chunk.
 */
export type DirectoryLayout = 'current' | 'library' | 'table' | 'categories';
export const DIRECTORY_LAYOUTS: readonly DirectoryLayout[] = ['current', 'library', 'table', 'categories'];
export const DIRECTORY_LAYOUT = 'current' as DirectoryLayout;
