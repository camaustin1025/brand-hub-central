/**
 * Which design the AI Resources directory renders.
 *
 * 'current' is the shipped grouped list. 'library' (Option A, Retool-like folders and table) and
 * 'table' (Option B, Airtable-like filter chips and tagged table) are review options from
 * 2026-11-13. In dev, `?layout=library` or `?layout=table` and the floating switcher preview them;
 * production only ever renders DIRECTORY_LAYOUT.
 *
 * To promote an option, change this one value. The option's code then ships as a lazy chunk.
 */
export type DirectoryLayout = 'current' | 'library' | 'table';
export const DIRECTORY_LAYOUTS: readonly DirectoryLayout[] = ['current', 'library', 'table'];
export const DIRECTORY_LAYOUT = 'current' as DirectoryLayout;
