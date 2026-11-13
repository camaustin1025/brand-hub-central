/** The left nav designs under review. "rail" is the current Sidebar in HubShell. */
export const NAV_OPTIONS = [
  { id: "rail", label: "Current", themes: ["light"] },
  { id: "highlight", label: "Highlighter", themes: ["light"] },
  { id: "tree", label: "Tree", themes: ["light"] },
  { id: "sidebar", label: "Sidebar", themes: ["dark", "light"] },
] as const;

export type NavOption = (typeof NAV_OPTIONS)[number]["id"];
export type NavTheme = "light" | "dark";

/**
 * The nav that ships. Change this one value to promote an option ("highlight", "tree" or "sidebar");
 * production then loads only that option. ("framer" was dropped after the 2026-11-13 critique.) While it is "rail", no option code reaches the production bundle.
 */
export const PROMOTED_NAV: NavOption = "rail";
/** The promoted option's theme, for options that come in both ("sidebar"). Others ignore it. */
export const PROMOTED_NAV_THEME: NavTheme = "dark";

export function isNavOption(value: string | null | undefined): value is NavOption {
  return NAV_OPTIONS.some((option) => option.id === value);
}

/** "rail" and "highlight" are the same rail in HubShell; only the "you are here" marker differs. */
export function isRailFamily(option: NavOption): option is "rail" | "highlight" {
  return option === "rail" || option === "highlight";
}

export function isNavTheme(value: string | null | undefined): value is NavTheme {
  return value === "light" || value === "dark";
}

/** The themes an option comes in; the first is its default. */
export function navThemes(option: NavOption): readonly NavTheme[] {
  return NAV_OPTIONS.find((entry) => entry.id === option)?.themes ?? ["light"];
}

/** The theme an option actually renders in: the requested one when the option has it, else its default. */
export function resolveNavTheme(option: NavOption, requested: NavTheme | undefined): NavTheme {
  const themes = navThemes(option);
  return requested && themes.includes(requested) ? requested : themes[0];
}
