/** The left nav designs under review. "rail" is the current Sidebar in HubShell. */
export const NAV_OPTIONS = [
  { id: "rail", label: "Current" },
  { id: "tree", label: "Tree" },
  { id: "sidebar", label: "Sidebar" },
  { id: "framer", label: "Framer" },
] as const;

export type NavOption = (typeof NAV_OPTIONS)[number]["id"];

/**
 * The nav that ships. Change this one value to promote an option ("tree", "sidebar" or "framer");
 * production then loads only that option. While it is "rail", no option code reaches the production bundle.
 */
export const PROMOTED_NAV: NavOption = "rail";

export function isNavOption(value: string | null | undefined): value is NavOption {
  return NAV_OPTIONS.some((option) => option.id === value);
}
